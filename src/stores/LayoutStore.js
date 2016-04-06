const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const PeopleSearchConstants = require('../constants/data');
const DefaultConstants = require('../constants/default');
const assign = require('object-assign');
const Utils = require('../utils/utilities');

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
        current: _current
    }
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
  }

});

AppDispatcher.register( action => {
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
