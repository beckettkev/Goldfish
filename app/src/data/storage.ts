/* eslint no-unused-vars: 1 */
/* global _spPageContextInfo */
import Cache from 'cache-funk';
import { Utils } from '../utils/utilities';
import * as Profile from './profile';
import { DefaultConstants } from '../constants/default';

// TODO: App keys for localstorage cache - need to move these somewhere central
const LAYOUT_STORAGE_KEY: string = 'PeopleSearch-Layout';
const SETTINGS_STORAGE_KEY: string = 'PeopleSearch-Settings';
const FAVOURITES_STORAGE_KEY: string = 'PeopleSearch-Favourites';

// These are the User Profile properties we store our data in for future access
const PROFILE_SETTINGS_KEY: string = 'GF-Settings';
const PROFILE_FAVOURITES_KEY: string = 'GF-Favourites';
const PROFILE_LAYOUT_KEY: string = 'GF-Layout';

// Older browsers
require('es6-promise').polyfill();

let fetchProfileProperties: any;

function getProfileProperties(): any {
  // fetch the user profile properties once and serve to all subscribers
  if (typeof fetchProfileProperties === 'undefined') {
    fetchProfileProperties = Profile.getProfileProperties();
  }

  return fetchProfileProperties;
}

function cacheBuild(data: Array<any>, key: string): any {
  const cached: any = Utils.buildStoragePayload(data);

  Cache.store(key, cached);

  return cached;
}

function getPropertyData(key: string): any {
  let property: any = Profile.getProfileProperty(key);

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

const getCurrentLayout = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cachedResults: any = Cache.fetch(LAYOUT_STORAGE_KEY);

    if (typeof cachedResults !== 'undefined') {
      resolve(cachedResults.payload);
    }

    // the profile properties may not exist
    getProfileProperties().then((properties: Array<any>) => {
      // we have a layout in the user profile, return this...
      const layoutFromProperties: Array<any> = getPropertyData('layout');

      if (layoutFromProperties.length === 0) {
        // no profile properties setup, use the defaults...
        resolve(getDefaultLayout());
      } else if (typeof cachedResults === 'undefined') {
        resolve(layoutFromProperties);
      } else {
        // we have a value, update the cache silently
        Cache.store(LAYOUT_STORAGE_KEY, Utils.buildStoragePayload(layoutFromProperties));
      }
    }).catch((reason: any) => {
      if (typeof cachedResults === 'undefined') {
        // first go with standard layout
        resolve(Utils.buildStoragePayload(getDefaultLayout()).payload);
      }
    });
  });
};

// someone has changed the order, remove an item or added an item to fields shown in the search results
const updateCurrentLayout = (layout: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    resolve(layout);

    const cached: any = cacheBuild(layout, LAYOUT_STORAGE_KEY);

    Profile.updateProfileProperty(PROFILE_LAYOUT_KEY, cached, window._spPageContextInfo.userLoginName);
  });
};

const getSettings = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const settings: any = Cache.fetch(SETTINGS_STORAGE_KEY);

    if (typeof settings !== 'undefined') {
      resolve(settings.payload);
    }

    getProfileProperties().then((properties: any) => {
      const settingsFromProperties: Array<any> = getPropertyData('settings');

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
    }).catch((reason: any) => {
      if (typeof settings === 'undefined') {
        // first go with the standard settings
        resolve(Utils.buildStoragePayload(getDefaultSettings()).payload);
      }
    });
  });
};

const updateSettings = (settings: Array<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    resolve(settings);

    const cached: any = cacheBuild(settings, SETTINGS_STORAGE_KEY);

    Profile.updateProfileProperty(PROFILE_SETTINGS_KEY, cached, window._spPageContextInfo.userLoginName);
  });
};

const getFavourites = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const favourites: any = Cache.fetch(FAVOURITES_STORAGE_KEY);

    if (typeof favourites !== 'undefined') {
      resolve(favourites.payload);
    }

    getProfileProperties().then((properties: any) => {
      const favouritesFromProperties: Array<any> = getPropertyData('favourites');

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
    }).catch((reason: any) => {
      if (typeof favourites === 'undefined') {
        // first go with no favourites
        resolve(Utils.buildStoragePayload(getDefaultFavourites()).payload);
      }
    });
  });
};

const updateFavourites = (favourites: Array<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    resolve(favourites);

    const cached: any = cacheBuild(favourites, FAVOURITES_STORAGE_KEY);

    Profile.updateProfileProperty(PROFILE_FAVOURITES_KEY, cached, window._spPageContextInfo.userLoginName);
  });
};

export {
  getCurrentLayout,
  updateCurrentLayout,
  getSettings,
  updateSettings,
  getFavourites,
  updateFavourites,
};
