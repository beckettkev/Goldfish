const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const PeopleSearchConstants = require('../constants/data');
const DefaultConstants = require('../constants/default');
const assign = require('object-assign');
const Utils = require('../utils/utilities');

let _favourites = DefaultConstants.DEFAULT_FAVOURITES;

function setPeopleSearchFavourites(favourites) {
  _favourites = favourites;
}

const FavouriteStore = assign({}, EventEmitter.prototype, {

  getCurrentFavourites() {
    return _favourites;
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
    case PeopleSearchConstants.GOT_FAVOURITES:
    case PeopleSearchConstants.FAVOURITES_CHANGED:
      setPeopleSearchFavourites(
          action.results
      );
      FavouriteStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = FavouriteStore;
