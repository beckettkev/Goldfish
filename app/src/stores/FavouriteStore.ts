import { Dispatch as AppDispatcher } from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import { data as PeopleSearchConstants } from '../constants/data';
import { DefaultConstants } from '../constants/default';
import * as assign from 'object-assign';

let _favourites: Array<any> = DefaultConstants.DEFAULT_FAVOURITES;

function setPeopleSearchFavourites(favourites: Array<any>) {
  _favourites = favourites;
}

const FavouriteStore: any = assign({}, EventEmitter.prototype, {

  getCurrentFavourites(): Array<any> {
    return _favourites;
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
    case PeopleSearchConstants.GOT_FAVOURITES:
    case PeopleSearchConstants.FAVOURITES_CHANGED:
      setPeopleSearchFavourites(action.results);
      FavouriteStore.emitChange();
      break;
    default:
    // no op
  }
});

export default FavouriteStore;
