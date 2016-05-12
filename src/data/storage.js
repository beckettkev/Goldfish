/* eslint no-unused-vars: 1 */
/* global _spPageContextInfo */
import Cache from 'cache-funk';
import Utils from '../utils/utilities';
import Profile from '../data/profile';
import DefaultConstants from '../constants/default';

// TODO: App keys for localstorage cache - need to move these somewhere central
const LAYOUT_STORAGE_KEY = 'PeopleSearch-Layout';
const SETTINGS_STORAGE_KEY = 'PeopleSearch-Settings';
const FAVOURITES_STORAGE_KEY = 'PeopleSearch-Favourites';

// These are the User Profile properties we store our data in for future access
const PROFILE_SETTINGS_KEY = 'GF-Settings';
const PROFILE_FAVOURITES_KEY = 'GF-Favourites';
const PROFILE_LAYOUT_KEY = 'GF-Layout';

// Older browsers
require('es6-promise').polyfill();

let fetchProfileProperties;

function getProfileProperties() {
  // fetch the user profile properties once and serve to all subscribers
  if (typeof fetchProfileProperties === 'undefined') {
    fetchProfileProperties = Profile.getProfileProperties();
  }

  return fetchProfileProperties;
}

function cacheBuild(data, key) {
  const cached = Utils.buildStoragePayload(data);

  Cache.store(key, cached);

  return cached;
}

function getPropertyData(key) {
  let property = Profile.getProfileProperty(key);

  property = property === '' ? [] : property;

  // we have the data in the user profile, return these...
  return Utils.buildStoragePayload(property).payload;
}

function getDefaultSettings() {
  return DefaultConstants.DEFAULT_SETTINGS;
}

function getDefaultFavourites() {
  return DefaultConstants.DEFAULT_FAVOURITES;
}

function getDefaultLayout() {
  return {
    current: DefaultConstants.DEFAULT_CURRENT_LAYOUT,
    available: DefaultConstants.DEFAULT_AVAILABLE_LAYOUT,
  };
}

const getCurrentLayout = () => {
  return new Promise((resolve, reject) => {
    const cachedResults = Cache.fetch(LAYOUT_STORAGE_KEY);

    if (typeof cachedResults !== 'undefined') {
      resolve(cachedResults.payload);
    }

    // the profile properties may not exist
    getProfileProperties().then(function(properties) {
      // we have a layout in the user profile, return this...
      const layoutFromProperties = getPropertyData('layout');

      if (layoutFromProperties.length === 0) {
        // no profile properties setup, use the defaults...
        resolve(getDefaultLayout());
      } else if (typeof cachedResults === 'undefined') {
        resolve(layoutFromProperties);
      } else {
        // we have a value, update the cache silently
        Cache.store(LAYOUT_STORAGE_KEY, Utils.buildStoragePayload(layoutFromProperties));
      }
    }).catch(function(reason) {
      if (typeof cachedResults === 'undefined') {
        // first go with standard layout
        resolve(Utils.buildStoragePayload(getDefaultLayout()).payload);
      }
    });
  });
};

// someone has changed the order, remove an item or added an item to fields shown in the search results
const updateCurrentLayout = (layout) => {
  return new Promise((resolve, reject) => {
    resolve(layout);

    const cached = cacheBuild(layout, LAYOUT_STORAGE_KEY);

    Profile.updateProfileProperty(PROFILE_LAYOUT_KEY, cached, _spPageContextInfo.userLoginName);
  });
};

const getSettings = () => {
  return new Promise((resolve, reject) => {
    const settings = Cache.fetch(SETTINGS_STORAGE_KEY);

    if (typeof settings !== 'undefined') {
      resolve(settings.payload);
    }

    getProfileProperties().then(function(properties) {
      const settingsFromProperties = getPropertyData('settings');

      if (settingsFromProperties.length === 0) {
        // no profile properties setup, use the defaults...
        resolve(Utils.buildStoragePayload(getDefaultSettings()).payload);
      } else if (typeof settings === 'undefined') {
        // we have their settings in the user profile, return this...
        resolve(settingsFromProperties);
      } else {
        // we have a value, update the cache silently
        Cache.store(SETTINGS_STORAGE_KEY, Utils.buildStoragePayload(settingsFromProperties));
      }
    }).catch(function(reason) {
      if (typeof settings === 'undefined') {
        // first go with the standard settings
        resolve(Utils.buildStoragePayload(getDefaultSettings()).payload);
      }
    });
  });
};

const updateSettings = (settings) => {
  return new Promise((resolve, reject) => {
    resolve(settings);

    const cached = cacheBuild(settings, SETTINGS_STORAGE_KEY);

    Profile.updateProfileProperty(PROFILE_SETTINGS_KEY, cached, _spPageContextInfo.userLoginName);
  });
};

const getFavourites = () => {
  return new Promise((resolve, reject) => {
    const favourites = Cache.fetch(FAVOURITES_STORAGE_KEY);

    if (typeof favourites !== 'undefined') {
      resolve(favourites.payload);
    }

    getProfileProperties().then(function(properties) {
      const favouritesFromProperties = getPropertyData('favourites');

      if (favouritesFromProperties.length === 0) {
        // no profile properties setup, use the defaults...
        resolve(Utils.buildStoragePayload(getDefaultFavourites()).payload);
      } else if (typeof favourites === 'undefined') {
        // we have their favourites in the user profile, return this...
        resolve(favouritesFromProperties);
      } else {
        // we have a value, update the cache silently
        Cache.store(FAVOURITES_STORAGE_KEY, Utils.buildStoragePayload(favouritesFromProperties));
      }
    }).catch(function(reason) {
      if (typeof favourites === 'undefined') {
        // first go with no favourites
        resolve(Utils.buildStoragePayload(getDefaultFavourites()).payload);
      }
    });
  });
};

const updateFavourites = (favourites) => {
  return new Promise((resolve, reject) => {
    resolve(favourites);

    const cached = cacheBuild(favourites, FAVOURITES_STORAGE_KEY);

    Profile.updateProfileProperty(PROFILE_FAVOURITES_KEY, cached, _spPageContextInfo.userLoginName);
  });
};

module.exports = {
  getCurrentLayout: getCurrentLayout,
  updateCurrentLayout: updateCurrentLayout,
  getSettings: getSettings,
  updateSettings: updateSettings,
  getFavourites: getFavourites,
  updateFavourites: updateFavourites,
};
