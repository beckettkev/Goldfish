import { Dispatch as AppDispatcher } from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import { data as PeopleSearchConstants } from '../constants/data';
import { DefaultConstants } from '../constants/default';
import * as assign from 'object-assign';

let _current: Array<any> = DefaultConstants.DEFAULT_CURRENT_LAYOUT;
let _available: Array<any> = DefaultConstants.DEFAULT_AVAILABLE_LAYOUT;

function setPeopleSearchLayout(layout: any) {
  _current = layout.current;
  _available = layout.available;
}

const LayoutStore: any = assign({}, EventEmitter.prototype, {
  getLayout(): any {
    return {
      available: _available,
      current: _current,
    } as any;
  },

  getAvailableFields(): Array<any> {
    return _available;
  },

  getCurrentFields(): Array<any> {
    return _current;
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
    case PeopleSearchConstants.GOT_LAYOUT:
    case PeopleSearchConstants.LAYOUT_CHANGED:
      setPeopleSearchLayout(action.results);
      LayoutStore.emitChange();
      break;
    default:
    // no op
  }
});

export default LayoutStore;
