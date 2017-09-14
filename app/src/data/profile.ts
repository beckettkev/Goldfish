<<<<<<< HEAD:app/src/data/profile.ts
import * as Compression from '../utils/lz-string';
require('es6-promise').polyfill();

const PROFILE_SETTINGS_KEY: string = 'GF-Settings';
const PROFILE_FAVOURITES_KEY: string = 'GF-Favourites';
const PROFILE_LAYOUT_KEY: string = 'GF-Layout';

let properties: any = null;

// This function saves to one of the three user profile properties, first compressing the payload
function update(property: string, value: any, account: string): void {
  const ctx: any = window.SP.ClientContext.get_current();

  window.SP.SOD.executeFunc('userprofile', 'SP.UserProfiles.PeopleManager', (): void => {
    const peopleManager: any = new window.SP.UserProfiles.PeopleManager(ctx);
    // save the value to the profile property as a compressed UTF16 string to keep within the 3600 character limit for user profile properties
    peopleManager.setSingleValueProfileProperty('i:0#.f|membership|' + account, property, Compression.compressToUTF16(JSON.stringify(value)));

    ctx.executeQueryAsync(
      (): void => { },
      (sender: any, args: any): void => console.log('Goldfish.Profile.Update Error while trying to save to the folowing profile property: ' + property + '. The error details are as follows: ' + args.get_message())
    );
  });
}

// From the massive user profile payload returned by the REST API, select the property we want
function findPropertyInResults(key: string, results: Array<any>): any {
  // sanitise the response to get just the property we want
  return results.filter((item: any) => item.Key === key)[0];
}

function decompressProfilePropertyValue(property: any): any {
  // profile properties are stored as compress data due to the 3600 character limit...
  if (typeof property !== 'undefined') {
    // if property is undefined(the profile property does not exist) this will throw an error which will be caught by the invoking code
    return JSON.parse(Compression.decompressFromUTF16(property.Value));
  }

  return null;
}

// This function constructs an object containing any favourites, settings and layouts found in the given person's user profile
function populateProperties(data: any): any {
  properties = {
    favourites: findPropertyInResults(PROFILE_FAVOURITES_KEY, data.d.UserProfileProperties.results),
    settings: findPropertyInResults(PROFILE_SETTINGS_KEY, data.d.UserProfileProperties.results),
    layout: findPropertyInResults(PROFILE_LAYOUT_KEY, data.d.UserProfileProperties.results),
  };

  // attempt to decompress the UTF16 encoding on the original string value to get the original value(this will through an error on purpose if the profile property does not exist)
  properties.favourites = decompressProfilePropertyValue(properties.favourites);
  properties.settings = decompressProfilePropertyValue(properties.settings);
  properties.layout = decompressProfilePropertyValue(properties.layout);

  return properties;
}

const getProfileProperties = (): Promise<any> => {
  // if we are here, it is because we do not have the payload cached
  return new Promise((resolve, reject) => {
    if (properties !== null) {
      resolve(properties);
    } else {
      // return no properties if we are not on SharePoint
      if (typeof window.fakeAjaxCalls !== 'undefined') {
        resolve('');
      }

      window.jQuery.ajax({
        dataType: 'json',
        contentType: 'application/json;odata=verbose',
        headers: { 'accept': 'application/json;odata=verbose' },
        url: '/_api/SP.UserProfiles.PeopleManager/GetMyProperties',
        type: 'GET',
        success: (response: any): void => {
          properties = populateProperties(response);

          if (properties.favourites !== '' || properties.settings !== '' || properties.layout !== '') {
            resolve(properties);
          } else {
            resolve('');
          }
        },
        fail: (error: any): void => {
          reject({ 'error': error });
        },
      });
    }
  });
};

const getProfileProperty = (key: string): any => {
  const property = typeof properties[key] !== 'undefined' ? properties[key] : '';

  return property !== '' && property !== null ? property.payload : '';
};

const updateProfileProperty = (property: string, value: any, account: string): void => {
  if (typeof properties.favourites !== 'undefined' || typeof properties.settings !== 'undefined' || typeof properties.layout !== 'undefined') {
    update(property, value, account);
  } else {
    console.log('Goldfish - please ensure you create the Goldfish profile properties to maintain state.');
  }
};

export {
  getProfileProperties,
  getProfileProperty,
  updateProfileProperty,
};
=======
import Compression from '../utils/lz-string';
import ProfileConstants from '../constants/profile';

// REPLACE with core-js - older browsers (ie...)
require('es6-promise').polyfill();

let properties = null;

// This function saves to one of the three user profile properties, first compressing the payload
const update = (property, value, account) => {
  const ctx = SP.ClientContext.get_current();

  SP.SOD.executeFunc('userprofile', 'SP.UserProfiles.PeopleManager', () => {
    const peopleManager = new SP.UserProfiles.PeopleManager(ctx);
    // save the value to the profile property as a compressed UTF16 string to keep within the 3600 character limit for user profile properties
    peopleManager.setSingleValueProfileProperty(ProfileConstants.ACCOUNT_PREFIX + account, property, Compression.compressToUTF16(JSON.stringify(value)));

    ctx.executeQueryAsync(
        () => {},
        (sender, args) => {
          console.log('Goldfish.Profile.Update Error while trying to save to the folowing profile property: ' + property + '. The error details are as follows: ' + args.get_message());
        }
    );
  });
};

// From the massive user profile payload returned by the REST API, select the property we want
const findPropertyInResults = (key, results) => {
  // sanitise the response to get just the property we want
  return results.filter(function(item) {
    return item.Key === key;
  })[0];
};

const decompressProfilePropertyValue = property => {
  // profile properties are stored as compress data due to the 3600 character limit...
  if (typeof property !== 'undefined') {
    // if property is undefined(the profile property does not exist) this will throw an error which will be caught by the invoking code
    return JSON.parse(Compression.decompressFromUTF16(property.Value));
  }

  return null;
}

// This function constructs an object containing any favourites, settings and layouts found in the given person's user profile
const populateProperties = data => {
  properties = {
    favourites: findPropertyInResults(ProfileConstants.PROFILE_FAVOURITES_KEY, data.d.UserProfileProperties.results),
    settings: findPropertyInResults(ProfileConstants.PROFILE_SETTINGS_KEY, data.d.UserProfileProperties.results),
    layout: findPropertyInResults(ProfileConstants.PROFILE_LAYOUT_KEY, data.d.UserProfileProperties.results),
  };

  // attempt to decompress the UTF16 encoding on the original string value to get the original value(this will through an error on purpose if the profile property does not exist)
  properties.favourites = decompressProfilePropertyValue(properties.favourites);
  properties.settings = decompressProfilePropertyValue(properties.settings);
  properties.layout = decompressProfilePropertyValue(properties.layout);

  return properties;
};

const getProfileProperties = () => {
  // if we are here, it is because we do not have the payload cached
  return new Promise((resolve, reject) => {
    if (properties !== null) {
      resolve(properties);
    } else {
      // return no properties if we are not on SharePoint
      if (typeof window.fakeAjaxCalls !== 'undefined') {
        resolve('');

        return;
      }

      // REPLACE - axios if possible...
      jQuery.ajax({
        dataType: 'json',
        contentType: 'application/json;odata=verbose',
        headers: { 'accept': 'application/json;odata=verbose' },
        url: ProfileConstants.MY_PROPERTIES_ENDPOINT,
        type: 'GET',
        success: response => {
          properties = populateProperties(response);

          if (properties.favourites !== '' || properties.settings !== '' || properties.layout !== '') {
            resolve(properties);
          } else {
            resolve('');
          }
        },
        fail: error => {
          reject({'error': error});
        },
      });
    }
  });
};

const getProfileProperty = (key) => {
  const property = typeof properties[key] !== 'undefined' ? properties[key] : '';

  return property !== '' && property !== null ? property.payload : '';
};

const updateProfileProperty = (property, value, account) => {
  if (typeof properties.favourites !== 'undefined' || typeof properties.settings !== 'undefined' || typeof properties.layout !== 'undefined') {
    update(property, value, account);
  } else {
    console.log('Goldfish - please ensure you create the Goldfish profile properties to maintain state.');
  }
};

module.exports = {
  getProfileProperties: getProfileProperties,
  getProfileProperty: getProfileProperty,
  updateProfileProperty: updateProfileProperty,
};
>>>>>>> 9461183eed53bd47bae5f4282481402b13e43062:src/data/profile.js
