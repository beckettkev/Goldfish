import { Dispatch as AppDispatcher } from '../dispatcher/AppDispatcher';
import { data as PeopleSearchConstants } from '../constants/data';
import { DefaultConstants as PeopleSearchDefaults } from '../constants/default';
import Cache from 'cache-funk';
import { Utils } from '../utils/utilities';
import FavouriteStore from '../stores/FavouriteStore';
import { Mock } from '../mock/Mock';
require('es6-promise').polyfill();

const PEOPLE_STORAGE_KEY_PREFIX: string = 'PeopleSearch-Results-';
const MAX_CACHE_KEY_SIZE: number = 10;

function buildCachePayload(payload: Array<any>, count: number, term: string, sets: Array<number>): any {
  return {
    birthday: Utils.getDateAsIsoStandard(0),
    payload: payload,
    sets: sets.length > 0 ? sets : [1],
    count: count,
    term: term,
  };
};

// key value pairs make the world go round and simplify the returned data from SP Search REST query(avoiding array lookups)
function washDataClean(data: Array<any>): Array<any> {
  const people: Array<any> = [];
  let pairs: any = {};

  const favourites: Array<any> = FavouriteStore.getCurrentFavourites();
  const banned: Array<string> = PeopleSearchDefaults.IGNORED_VALUES;

  data.forEach((row: any) => {
    pairs = {};

    row.Cells.forEach((item: any) => {
      // build a new object and store the key and value as an associated pair
      if (banned.indexOf(item.Key) === -1) {
        pairs[item.Key] = item.Value;
      }
    });

    // check to see if this person is a favourite
    pairs.Favourite = favourites.some((item: any) => item.name === pairs.PreferredName);

    people.push({
      'Cells': pairs,
    });
  });

  // we need to check if any of these people are favourites and update accordingly
  return people;
}

function isPayloadStillValid(payloadDate: string): boolean {
  const now: string = Utils.getDateAsIsoStandard(0);

  // check if the payload was saved today
  return Utils.getDaysBetweenDates(now, payloadDate) > -1;
}

function initAppDispatcher(items: Array<any>, append: boolean) {
  AppDispatcher.dispatch({
    actionType: append ? PeopleSearchConstants.PEOPLE_LOADED_APPEND : PeopleSearchConstants.PEOPLE_LOADED,
    data: items,
  });
}

function getResultSetIndexEnd(count: number, start: number): number {
  return ((count - start) < 10) ? count - start : 10;
}

function getResultSetIndexStart(pageNum: number, sets: Array<number>): number {
  /*
    We know that the page being viewed is in the cache, but we need to make sure they have
    not skipped a page using the paging
  */
  return pageNum === 1 ? 0 : sets.indexOf(pageNum) * 10;
}

function getPagedQueryUrl(queryUrl: string, pageNum: number) {
  const startRow: number = 10 * ((pageNum - 1) > 0 ? (pageNum - 1) : 1);

  // starting row for the results to come back
  return queryUrl + '&startrow=' + startRow;
}

function updateResultsWithFavourites(results: Array<any>) {
  const favourites: Array<any> = FavouriteStore.getCurrentFavourites();
  const favs: Array<any> = [];

  /* Find any favourites in the cached payload and then
  update the result set with the cached property
  once this is done, return the payload */
  favourites.forEach((favourite: any) => {
    favs.push(favourite.name);
  });

  results.forEach((item: any, i: number) => {
    if (favs.indexOf(item.Cells.PreferredName) > -1) {
      results[i].Cells.Favourite = true;
    }
  });

  return results;
}

function getResultPage(results: Array<any>, pageNum: number, sets: Array<number>, count: number) {
  const start: number = getResultSetIndexStart(pageNum, sets);
  const end: number = getResultSetIndexEnd(count, start);

  const cachedResults: Array<any> = results.slice(start, start + end);

  return updateResultsWithFavourites(cachedResults);
}

function cacheKeySizeExceedsLimit(): boolean {
  const keys: Array<string> = Object.keys(localStorage).filter((item: string) => item.indexOf(PEOPLE_STORAGE_KEY_PREFIX) > -1);

  return keys.length >= MAX_CACHE_KEY_SIZE;
}

export let Data = {
  getMockPeopleResults: function getMockPeopleResults(term: string, pageNum: number, append: boolean): Promise<Array<any>> {
    return new Promise((resolve) => {
      const mockPayload: any = buildCachePayload(Mock, Mock.length, term, [1, 2]);
      mockPayload.pageNum = pageNum;

      const start: number = pageNum < 2 ? 0 : (pageNum - 1) * 10;
      const end: number = pageNum < 2 ? 10 : pageNum * 10;

      // only return the page we need
      mockPayload.payload = updateResultsWithFavourites(mockPayload.payload.slice(start, end));

      resolve(mockPayload);

      initAppDispatcher(mockPayload, append);
    });
  },
  getPeopleResults: function getPeopleResults(queryUrl: string, term: string, pageNum: number, append: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const key: string = PEOPLE_STORAGE_KEY_PREFIX + Utils.createStorageKey(term).toLowerCase();

      const operations: any = {
        fetch: true,
        insert: false,
      };
      let sets: Array<number> = [];

      const cachedResults: any = Cache.fetch(key);
      const resolvedQueryUrl: string = pageNum > 0 ? getPagedQueryUrl(queryUrl, pageNum) : queryUrl;

      let resolvedPageNum: number = pageNum;

      if (typeof cachedResults !== 'undefined') {
        /*
          Check to see if we have a valid cache object(date check)
          Check to see if the cache object contains the current page
        */
        if (isPayloadStillValid(cachedResults.birthday)) {
          resolvedPageNum = pageNum === 0 ? 1 : pageNum;

          if (cachedResults.sets.indexOf(resolvedPageNum) > -1) {
            // everything looks good - load from cache with the paged results and resist calling the API
            cachedResults.payload = getResultPage(
              cachedResults.payload,
              resolvedPageNum,
              cachedResults.sets,
              cachedResults.count
            );
            cachedResults.pageNum = resolvedPageNum;

            resolve(cachedResults);

            operations.fetch = false;

            initAppDispatcher(cachedResults, append);

            return;
          } else {
            // we have a valid payload, but we need to insert a new page
            operations.insert = true;

            sets = cachedResults.sets;
            sets.push(resolvedPageNum);
          }
        } else {
          // delete the cache object as it is stale
          Cache.remove(key);
        }
      }

      if (operations.fetch) {
        let items: any = [];

        window.jQuery.ajax({
          url: resolvedQueryUrl,
          dataType: 'json',
          type: 'GET',
          headers: Utils.getHeaders(),
          success: (data: any) => {
            if (data.PrimaryQueryResult.RelevantResults.RowCount > 0) {
              // clean the data coming back into a manageble object and store in the cache
              items = buildCachePayload(washDataClean(data.PrimaryQueryResult.RelevantResults.Table.Rows), data.PrimaryQueryResult.RelevantResults.TotalRows, term, sets);

              if (!operations.insert) {
                // we only allow ten result caches at a time.
                if (!cacheKeySizeExceedsLimit()) {
                  Cache.store(key, items);
                }
              } else {
                /*
                  Already a valid cache for this search but we don't have this page. We need to update with the page results
                    - first of all get the start row(resolvedPageNum - 1 * 10) and then make it work with array indexes( -1 )
                */
                const position: number = ((resolvedPageNum - 1) * 10) - 1;

                Cache.insert(key, items, position);

                items.pageNum = resolvedPageNum;
              }

              resolve(items);
            } else {
              // we got nothing kid
              items = {
                pageNum: 0,
                payload: [],
                sets: [1],
                count: 0,
                term: term,
              };

              resolve(buildCachePayload(items, 0, term, sets));
            }

            initAppDispatcher(items, append);
          },
          fail: (xhr: any, status: string, err: any) => reject(status + ', ' + err.toString()),
        });
      }
    });
  },
};
