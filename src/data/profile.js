import Compression from '../utils/lz-string';
require('es6-promise').polyfill();

const PROFILE_SETTINGS_KEY = 'GF-Settings';
const PROFILE_FAVOURITES_KEY = 'GF-Favourites';
const PROFILE_LAYOUT_KEY = 'GF-Layout';

let properties = null;

// This function saves to one of the three user profile properties, first compressing the payload
function update(property, value, account) {
  const ctx = SP.ClientContext.get_current();

  SP.SOD.executeFunc('userprofile', 'SP.UserProfiles.PeopleManager', function() {
    const peopleManager = new SP.UserProfiles.PeopleManager(ctx);
    // save the value to the profile property as a compressed UTF16 string to keep within the 3600 character limit for user profile properties
    peopleManager.setSingleValueProfileProperty('i:0#.f|membership|' + account, property, Compression.compressToUTF16(JSON.stringify(value)));

    ctx.executeQueryAsync(
      function() {},
        function(sender, args) {
          console.log('Goldfish.Profile.Update Error while trying to save to the folowing profile property: ' + property + '. The error details are as follows: ' + args.get_message());
        }
    );
  });
}

// From the massive user profile payload returned by the REST API, select the property we want
function findPropertyInResults(key, results) {
  // sanitise the response to get just the property we want
  return results.filter(function(item) {
    return item.Key === key;
  })[0];
}

function decompressProfilePropertyValue(property) {
  // profile properties are stored as compress data due to the 3600 character limit...
  if (typeof property !== 'undefined') {
    // if property is undefined(the profile property does not exist) this will throw an error which will be caught by the invoking code
    return JSON.parse(Compression.decompressFromUTF16(property.Value));
  }

  return null;
}

// This function constructs an object containing any favourites, settings and layouts found in the given person's user profile
function populateProperties(data) {
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

const getProfileProperties = () => {
  // if we are here, it is because we do not have the payload cached
  return new Promise((resolve, reject) => {
    if (properties !== null) {
      resolve(properties);
    } else {
      // return no properties if we are not on SharePoint
      if (typeof window.fakeAjaxCalls !== 'undefined') {
        resolve('');
      }

      jQuery.ajax({
        dataType: 'json',
        contentType: 'application/json;odata=verbose',
        headers: { 'accept': 'application/json;odata=verbose' },
        url: '/_api/SP.UserProfiles.PeopleManager/GetMyProperties',
        type: 'GET',
        success: function(response) {
          properties = populateProperties(response);

          if (properties.favourites !== '' || properties.settings !== '' || properties.layout !== '') {
            resolve(properties);
          } else {
            resolve('');
          }
        },
        fail: function(error) {
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
