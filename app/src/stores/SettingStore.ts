import { Dispatch as AppDispatcher } from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import { data as PeopleSearchConstants } from '../constants/data';
import { DefaultConstants } from '../constants/default';
import * as assign from 'object-assign';

let _settings: string = DefaultConstants.DEFAULT_SETTINGS;

function setPeopleSearchSettings(settings: any): void {
  _settings = settings;
}

const SettingStore: any = assign({}, EventEmitter.prototype, {
  getSettings(): any {
    return _settings;
  },

  emitChange(): void {
    this.emit(DefaultConstants.CHANGE_EVENT);
  },

  addChangeListener(callback: Function): void {
    this.on(DefaultConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener(callback: Function): void {
    this.removeListener(DefaultConstants.CHANGE_EVENT, callback);
  },
});

AppDispatcher.register((action: any) => {
  switch (action.actionType) {
    case PeopleSearchConstants.GOT_SETTINGS:
    case PeopleSearchConstants.SETTINGS_CHANGED:
      setPeopleSearchSettings(action.results);

      SettingStore.emitChange();
      break;
    default:
    // no op
  }
});

export default SettingStore;
