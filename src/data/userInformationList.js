/* eslint no-unused-vars: 1 */
import Cache from 'cache-funk';
import Utils from '../utils/utilities';
import StorageConstants from '../constants/storage';

// REPLACE with core-js - older browsers (ie...)
require('es6-promise').polyfill();

let userData = {};
let id;

// So many duplicates, let's clean this up...
const removeDuplicates = (collection, results, key) => {
  // the last item processed
  id = -1;

  // for each item in the results we want to process, remove duplicates and sort
  const payload = results.value.map((item, i) => {
    if (i === (results.value.length - 1)) {
      // next time the recursive function calls, it will load from this point (after the last item in this batch)
      id = item.ID;
    }

    // each JobTitle needs to be saved as JSON object, including the search term (search alias - contains - job title)
    return {
      name: item[key],
      search: key + ':"' + item[key] + '"',
    };
  }).concat(collection).sort((a, b) => {
    // sort the array of Job Titles ready for duplicate removal
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name ) {
      return 1;
    }

    return 0;
  // remove all duplicates from payload
  }).filter((item, pos, ary) => !pos || item.name !== ary[pos - 1].name);

  return typeof payload !== 'undefined' ? payload : [];
};

const fetchUserInfo = (url, key) => {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      url: url,
      userDataType: 'json',
      type: 'GET',
      headers: Utils.getHeaders(),
      success: results => {
        // concatenate results after a de-duplication run (with any previously retrieved items)
        if (results.value.length > 0) {
          userData[key].terms = removeDuplicates(userData[key].terms, results, key);
          // more to fetch recursively fetch job titles and purge until we have them all
          resolve();
        } else {
          // we have all of the job titles, return this for the suggest tool
          resolve(userData[key]);
        }
      },
      fail: (xhr, status, err) => {
        reject(err.toString());
      },
    });
  });
};

const getBusinessKey = (key) => {
  return {
    title: key.split(/(?=[A-Z])/).join(' '),
    terms: [],
    complete: false,
  };
};

const getBusinessInformation = (keys, startId) => {
  return new Promise((resolve, reject) => {
    const cache = Cache.fetch(StorageConstants.USERINFO_STORAGE_KEY);

    if (typeof cache !== 'undefined') {
      // we already have them - easy
      resolve(cache.payload);
    } else {
      let collection = [];
      let skip = '';

      if (typeof startId === 'undefined') {
        // reset terms if fetching fresh userData
        keys.forEach(function(key) {
          userData[key] = userData[key] || getBusinessKey(key);
        });
      } else {
        skip = '&p_ID=' + startId;
      }

      const key = !userData[keys[0]].complete ? keys[0] : keys[1];
      // we need to process the list 5000 items at a time (we can do that because it's a list).
      const token = encodeURIComponent('Paged=TRUE&p_SortBehavior=0' + skip + '&$top=5000');
      // using the paging token, construct the URL for the REST endpoint
      const url = Utils.getBaseUrl() + '/_api/web/SiteUserInfoList/items?$select=' + key + ',ID&$filter=' + key + '%20ne%20null&$top=5000&$skiptoken=' + token;

      fetchUserInfo(url, key).then(results => {
            if (typeof results === 'undefined') {
              getBusinessInformation(keys, id);
            } else {
              userData[key].complete = true;
            }

            if (Object.keys(userData).every(info => userData[info].complete)) {
              collection = Object.keys(userData).map(function(item) {
                return userData[item];
              });

              resolve(collection);

              // save this in the local storage so we don't need to fetch this next time
              Cache.store(StorageConstants.USERINFO_STORAGE_KEY, Utils.buildStoragePayload(collection));
            } else if (userData[key].complete) {
              // move onto the next one
              getBusinessInformation(keys);
            }
          }
      );
    }
  });
};

module.exports = {
  getBusinessInformation: getBusinessInformation,
};
