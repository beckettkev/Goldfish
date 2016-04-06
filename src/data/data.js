import AppDispatcher from '../dispatcher/AppDispatcher';
import PeopleSearchConstants from '../constants/data';
import Cache from '../utils/cache';
import Utils from '../utils/utilities';
import FavouriteStore from '../stores/FavouriteStore';
require('es6-promise').polyfill();

const PEOPLE_STORAGE_KEY_PREFIX = 'PeopleSearch-Results-';
const MAX_CACHE_KEY_SIZE = 10;

function buildCachePayload(payload, count, term, sets) {
    return {
        birthday : Utils.getDateAsIsoStandard(0),
        payload: payload,
        sets: sets.length > 0 ? sets : [1],
        count: count,
        term: term
    };
}

//key value pairs make the world go round and simplify the returned data from SP Search REST query (avoiding array lookups)
function washDataClean(data) {
    var people = [];
    var pairs = { };
    var favourites = FavouriteStore.getCurrentFavourites();
    var banned = ['Rank','DocId','piSearchResultId','RenderTemplateId','ProfileQueriesFoundYou','ProfileViewsLastWeek','ProfileViewsLastMonth','EditProfileUrl','ResultTypeId','Culture','UrlZone','PartitionId','OriginalPath']

    data.forEach(function(row, index) {
        pairs = { };

        row.Cells.forEach(function(item, i) {
           //build a new object and store the key and value as an associated pair
           if (banned.indexOf(item['Key']) === -1) {
               pairs[item['Key']] = item['Value'];
           }
        });

        //check to see if this person is a favourite
        pairs.Favourite = favourites.some(function(item) {
            return item.name === pairs.PreferredName
        });

        people.push({ 
            "Cells": pairs 
        });
    });

    //we need to check if any of these people are favourites and update accordingly
    return people;
}

function isPayloadStillValid(payloadDate) {
    var now = Utils.getDateAsIsoStandard(0);

    //check if the payload was saved today
    return Utils.getDaysBetweenDates(now, payloadDate) > -1;
}

function initAppDispatcher(items) {
    AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.PEOPLE_LOADED,
        data: items
    });
}

function getResultSetIndexEnd(count, start) {
    return ((count - start) < 10) ? count - start : 10;
}

function getResultSetIndexStart(pageNum, sets) {
    /*
        We know that the page being viewed is in the cache, but we need to make sure they have
        not skipped a page using the paging
    */
    return pageNum === 1 ? 0 : sets.indexOf(pageNum) * 10;
}

function getPagedQueryUrl(queryUrl, pageNum) {
    let startRow = 10 * ((pageNum - 1) > 0 ? (pageNum - 1) : 1);
    //starting row for the results to come back
    return queryUrl + '&startrow=' + startRow;
}

function getResultPage(results, pageNum, sets, count) {
    var start = getResultSetIndexStart(pageNum, sets);
    var end = getResultSetIndexEnd(count, start);
    var favourites = FavouriteStore.getCurrentFavourites();
    var favs = [];
    var cachedResults = results.slice(start, start + end);

    /*  
        Find any favourites in the cached payload and then
        update the result set with the cached property
        once this is done, return the payload
    */
    favourites.forEach(function(favourite) {
        favs.push(favourite.name);
    });

    cachedResults.forEach(function (item, i) {
        if (favs.indexOf(item.Cells.PreferredName) > -1) {
            cachedResults[i].Cells.Favourite = true;
        }
    });

    return cachedResults; 
}

function cacheKeySizeExceedsLimit() {
    let keys = Object.keys(localStorage).filter(
                    function(item, i) { 
                        return item.indexOf(PEOPLE_STORAGE_KEY_PREFIX) > -1; 
                    }
                );

    return keys.length >= MAX_CACHE_KEY_SIZE;
}

module.exports = {
    getPeopleResults: function(queryUrl, term, pageNum) {
        return new Promise((resolve, reject) => {

            let key =  PEOPLE_STORAGE_KEY_PREFIX + Utils.createStorageKey(term).toLowerCase();
            let operations = {
                fetch: true,
                insert: false
            };
            let sets = [];

            const cachedResults = Cache.fetch(key);

            queryUrl = pageNum > 0 ? getPagedQueryUrl(queryUrl, pageNum) : queryUrl;

            if (typeof cachedResults !== 'undefined') {
                /*
                    Check to see if we have a valid cache object (date check)
                    Check to see if the cache object contains the current page
                */
                if (isPayloadStillValid(cachedResults.birthday)) {

                    pageNum = pageNum === 0 ? 1 : pageNum;

                    if (cachedResults.sets.indexOf(pageNum) > -1) {
                        //everything looks good - load from cache with the paged results and resist calling the API
                        cachedResults.payload = getResultPage(
                                                    cachedResults.payload,
                                                    pageNum,
                                                    cachedResults.sets,
                                                    cachedResults.count
                                                );
                        cachedResults.pageNum = pageNum;

                        resolve(cachedResults);

                        operations.fetch = false;

                        initAppDispatcher(cachedResults);
                    } else {
                        //we have a valid payload, but we need to insert a new page
                        operations.insert = true;

                        sets = cachedResults.sets;
                        sets.push(pageNum);
                    }
                } else {
                    //delete the cache object as it is stale
                    Cache.remove(key);
                }
            }

            if (operations.fetch) {

                let items = [];

                jQuery.ajax({
                    url: queryUrl,
                    dataType: 'json',
                    type: 'GET',
                    headers: Utils.getHeaders(),
                    success: function(data) {
                        if (data.PrimaryQueryResult.RelevantResults.RowCount > 0) {
                            /*
                                TO DO:

                                    Only store X amount of queries in the local storage,
                                    clear out any older keys if none are available.
                            */
                            //clean the data coming back into a manageble object and store in the cache
                            items = buildCachePayload(washDataClean(data.PrimaryQueryResult.RelevantResults.Table.Rows), data.PrimaryQueryResult.RelevantResults.TotalRows, term, sets);

                            if (!operations.insert) {
                                //we only allow ten result caches at a time.
                                if (!cacheKeySizeExceedsLimit()) {
                                    Cache.store(key, items);
                                }
                            } else {
                                /*
                                    Already a valid cache for this search but we don't have this page. We need to update with the page results
                                        - first of all get the start row (pageNum - 1 * 10) and then make it work with array indexes ( -1 )
                                */
                                let position = ((pageNum - 1) * 10) - 1;

                                Cache.insert(key, items, position);

                                items.pageNum = pageNum;
                            }

                            resolve(items);
                        } else {
                            //we got nothing kid
                            items = {
                              pageNum: 0,
                              payload: [],
                              sets: [1],
                              count: 0,
                              term: term
                            };

                            resolve(buildCachePayload(items, 0, term, sets));
                        }

                        initAppDispatcher(items);
                    },
                    fail: function(xhr, status, err) {
                        reject(this.props.url + ', ' + status + ', ' + err.toString());
                    }
                });
            }
        });
    }
};