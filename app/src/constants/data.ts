const keymirror = require('keymirror');

export let data = keymirror({
  PEOPLE_LOADED: null,
  PEOPLE_LOADED_APPEND: null,
  GOT_DATA: null,
  NO_RESULTS: null,
  GOT_LAYOUT: null,
  LAYOUT_CHANGED: null,
  GOT_SETTINGS: null,
  SETTINGS_CHANGED: null,
  GOT_FAVOURITES: null,
  FAVOURITES_CHANGED: null,
  GOT_TAXONOMY: null,
  GOT_BUSINESSINFO: null,
}) as any;
