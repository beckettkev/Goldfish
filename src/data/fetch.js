/* eslint no-unused-vars: 1 */
/* global _spPageContextInfo */
import Cache from 'cache-funk';
import Utils from '../utils/utilities';
import Profile from '../data/profile';
import DefaultConstants from '../constants/default';
import StorageConstants from '../constants/storage';

// REPLACE with core-js - older browsers (ie...)
require('es6-promise').polyfill();

let profileProperties;

const getProfileProperties = () => {
  // fetch the user profile properties once and serve to all subscribers
  if (typeof profileProperties === 'undefined') {
    profileProperties = Profile.getProfileProperties();
  }

  return profileProperties;
};

const cacheBuild = (data, key) => {
  const cached = Utils.buildStoragePayload(data);

  Cache.store(key, cached);

  return cached;
};

const getPropertyData = (key) => {
  let property = Profile.getProfileProperty(key);

  property = property === '' ? [] : property;

  // we have the data in the user profile, return these...
  return Utils.buildStoragePayload(property).payload;
};

const getDefaultSettings = () => DefaultConstants.DEFAULT_SETTINGS;

const getDefaultFavourites = () => DefaultConstants.DEFAULT_FAVOURITES;

const getDefaultLayout = () => {
  return {
    current: DefaultConstants.DEFAULT_CURRENT_LAYOUT,
    available: DefaultConstants.DEFAULT_AVAILABLE_LAYOUT,
  };
};

const getCurrentLayout = () => {
  return new Promise((resolve, reject) => {
    const cachedResults = Cache.fetch(StorageConstants.LAYOUT_STORAGE_KEY);

    if (typeof cachedResults !== 'undefined') {
      resolve(cachedResults.payload);
    }

    // the profile properties may not exist, but if they do - check for persistant data...
    getProfileProperties().then(properties => {
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
    }).catch(reason => {
      if (typeof cachedResults === 'undefined') {
        // first go with standard layout
        resolve(Utils.buildStoragePayload(getDefaultLayout()).payload);
      }
    });
  });
};

// someone has changed the order, remove an item or added an item to fields shown in the search results
const updateCurrentLayout = (layout) => {
  // does this need to be a promise?!
  return new Promise((resolve, reject) => {
    resolve(layout);

    const cached = cacheBuild(layout, StorageConstants.LAYOUT_STORAGE_KEY);

    Profile.updateProfileProperty(StorageConstants.PROFILE_LAYOUT_KEY, cached, _spPageContextInfo.userLoginName);
  });
};

const getSettings = () => {
  return new Promise((resolve, reject) => {
    const settings = Cache.fetch(StorageConstants.SETTINGS_STORAGE_KEY);

    if (typeof settings !== 'undefined') {
      resolve(settings.payload);
    }

    getProfileProperties().then(properties => {
      const settingsFromProperties = getPropertyData('settings');

      if (settingsFromProperties.length === 0) {
        // no profile properties setup, use the defaults...
        resolve(Utils.buildStoragePayload(getDefaultSettings()).payload);
      } else if (typeof settings === 'undefined') {
        // we have their settings in the user profile, return this...
        resolve(settingsFromProperties);
      } else {
        // we have a value, update the cache silently
        Cache.store(StorageConstants.SETTINGS_STORAGE_KEY, Utils.buildStoragePayload(settingsFromProperties));
      }
    }).catch(reason => {
      // this is not always a bad thing. It could be that they do not have the profile property(s)...
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

    const cached = cacheBuild(settings, StorageConstants.SETTINGS_STORAGE_KEY);

    Profile.updateProfileProperty(StorageConstants.PROFILE_SETTINGS_KEY, cached, _spPageContextInfo.userLoginName);
  });
};

const getFavourites = () => {
  return new Promise((resolve, reject) => {
    const favourites = Cache.fetch(StorageConstants.FAVOURITES_STORAGE_KEY);

    if (typeof favourites !== 'undefined') {
      // we have the favourites already in local storage, use this and then fetch them behind the scenes...
      resolve(favourites.payload);
    }

    getProfileProperties().then(properties => {
      const favouritesFromProperties = getPropertyData('favourites');

      if (favouritesFromProperties.length === 0) {
        // no profile properties setup, use the defaults...
        resolve(Utils.buildStoragePayload(getDefaultFavourites()).payload);
      } else if (typeof favourites === 'undefined') {
        // we have their favourites in the user profile, return this...
        resolve(favouritesFromProperties);
      } else {
        // we have a value, update the cache silently
        Cache.store(StorageConstants.FAVOURITES_STORAGE_KEY, Utils.buildStoragePayload(favouritesFromProperties));
      }
    }).catch(reason => {
      if (typeof favourites === 'undefined') {
        // first go with no favourites
        resolve(Utils.buildStoragePayload(getDefaultFavourites()).payload);
      }
    });
  });
};

const updateFavourites = (favourites) => {
  // does this need to be a promise?!
  return new Promise((resolve, reject) => {
    resolve(favourites);

    const cached = cacheBuild(favourites, StorageConstants.FAVOURITES_STORAGE_KEY);

    Profile.updateProfileProperty(StorageConstants.PROFILE_FAVOURITES_KEY, cached, _spPageContextInfo.userLoginName);
  });
};

// fetch is the entry point to getting most data in the SPA, the following are the public methods...
module.exports = {
  getCurrentLayout: getCurrentLayout,
  updateCurrentLayout: updateCurrentLayout,
  getSettings: getSettings,
  updateSettings: updateSettings,
  getFavourites: getFavourites,
  updateFavourites: updateFavourites,
};
