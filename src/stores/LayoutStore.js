import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import PeopleSearchConstants from '../constants/data';
import DefaultConstants from '../constants/default';
import assign from 'object-assign';

let _current = DefaultConstants.DEFAULT_CURRENT_LAYOUT;
let _available = DefaultConstants.DEFAULT_AVAILABLE_LAYOUT;

function setPeopleSearchLayout(layout) {
  _current = layout.current;
  _available = layout.available;
}

const LayoutStore = assign({}, EventEmitter.prototype, {
  getLayout() {
    return {
      available: _available,
      current: _current,
    };
  },

  getAvailableFields() {
    return _available;
  },

  getCurrentFields() {
    return _current;
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
  case PeopleSearchConstants.GOT_LAYOUT:
  case PeopleSearchConstants.LAYOUT_CHANGED:
    setPeopleSearchLayout(
          action.results
      );
    LayoutStore.emitChange();
    break;
  default:
      // no op
  }
});

module.exports = LayoutStore;
