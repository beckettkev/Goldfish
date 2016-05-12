import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import PeopleSearchConstants from '../constants/data';
import DefaultConstants from '../constants/default';
import assign from 'object-assign';

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
  },

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
