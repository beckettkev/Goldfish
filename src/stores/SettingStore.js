const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const PeopleSearchConstants = require('../constants/data');
const DefaultConstants = require('../constants/default');
const assign = require('object-assign');
const Utils = require('../utils/utilities');

let _settings = DefaultConstants.DEFAULT_SETTINGS;

function setPeopleSearchSettings(settings) {
  _settings = settings;
}

const SettingStore = assign({}, EventEmitter.prototype, {

  getSettings() {
    return _settings;
  },

  emitChange() {
    this.emit(DefaultConstants.CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(DefaultConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(DefaultConstants.CHANGE_EVENT, callback);
  }

});

AppDispatcher.register( action => {
  switch (action.actionType) {
    case PeopleSearchConstants.GOT_SETTINGS:
    case PeopleSearchConstants.SETTINGS_CHANGED:
      setPeopleSearchSettings(
          action.results
      );
      SettingStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = SettingStore;
