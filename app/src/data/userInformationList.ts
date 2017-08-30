/* eslint no-unused-vars: 1 */
import Cache from 'cache-funk';
import { Utils } from '../utils/utilities';
require('es6-promise').polyfill();

const USERINFO_STORAGE_KEY: string = 'PeopleSearch-UserInfo';

let data: any = {};
let id: number;

// So many duplicates
function removeDuplicates(collection: Array<any>, results: any, key: string): Array<any> {
  // the last item processed
  id = -1;

  const payload = results.value.map((item: any, i: number) => {
    if (i === (results.value.length - 1)) {
      // next time the recursive function calls, it will load from this point (after the last item in this batch)
      id = item.ID;
    }

    // each JobTitle needs to be saved as JSON object, including the search term (search alias - contains - job title)
    return {
      name: item[key],
      search: key + ':"' + item[key] + '"',
    };
    // sort the array of Job Titles ready for duplicate removal
  }).concat(collection).sort((a: any, b: any): number => {
    if (a.name < b.name) {
      return -1;
    }

    return a.name > b.name ? 1 : 0;
  }).filter((item: any, pos: number, ary: Array<any>) => {
    // remove all duplicates from payload
    return !pos || item.name !== ary[pos - 1].name;
  });

  return typeof payload !== 'undefined' ? payload : [];
}

function fetchUserInfo(url: string, key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    window.jQuery.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      headers: Utils.getHeaders(),
      success: (results: any) => {
        // concatenate results after a de-duplication run (with any previously retrieved items)
        if (results.value.length > 0) {
          data[key].terms = removeDuplicates(data[key].terms, results, key);
          // more to fetch recursively fetch job titles and purge until we have them all
          resolve();
        } else {
          // we have all of the job titles, return this for the suggest tool
          resolve(data[key]);
        }
      },
      fail: (xhr: any, status: string, err: any): void => reject(err.toString()),
    });
  });
}

const getBusinessInformation = (keys: Array<string>, startId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cache: any = Cache.fetch(USERINFO_STORAGE_KEY);

    if (typeof cache !== 'undefined') {
      // we already have them - easy
      resolve(cache.payload);
    } else {
      let collection: Array<any> = [];
      let skip: string = '';

      if (typeof startId === 'undefined') {
        // reset terms if fetching fresh data
        keys.forEach((key: string): void => {
          data[key] = data[key] || {
            title: key.split(/(?=[A-Z])/).join(' '),
            terms: [],
            complete: false,
          };
        });
      } else {
        skip = '&p_ID=' + startId;
      }

      const key: string = !data[keys[0]].complete ? keys[0] : keys[1];
      // we need to process the list 5000 items at a time (we can do that because it's a list).
      const token: string = encodeURIComponent('Paged=TRUE&p_SortBehavior=0' + skip + '&$top=5000');
      // using the paging token, construct the URL for the REST endpoint
      const url: string = Utils.getBaseUrl() + '/_api/web/SiteUserInfoList/items?$select=' + key + ',ID&$filter=' + key + '%20ne%20null&$top=5000&$skiptoken=' + token;

      fetchUserInfo(url, key).then((results: any) => {
        if (typeof results === 'undefined') {
          getBusinessInformation(keys, id);
        } else {
          data[key].complete = true;
        }

        if (Object.keys(data).every((info: string) => data[info].complete)) {
          collection = Object.keys(data).map((item: string) => data[item]);

          resolve(collection);

          // save this in the local storage so we don't need to fetch this next time
          Cache.store(USERINFO_STORAGE_KEY, Utils.buildStoragePayload(collection));
        } else if (data[key].complete) {
          // move onto the next one
          getBusinessInformation(keys, undefined);
        }
      }
      );
    }
  });
};

export {
  getBusinessInformation,
};
