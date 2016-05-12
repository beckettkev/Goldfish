import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import PeopleSearchConstants from '../constants/data';
import DefaultConstants from '../constants/default';
import assign from 'object-assign';

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
  },
});

AppDispatcher.register(action => {
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
