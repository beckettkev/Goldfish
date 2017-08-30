import { Dispatch as AppDispatcher } from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import { data as PeopleSearchConstants } from '../constants/data';
import { DefaultConstants } from '../constants/default';
import * as assign from 'object-assign';

let _terms: Array<any> = [];
let _userInfo: Array<any> = [];

function setPeopleSearchTaxonomy(terms: Array<any>): void {
  _terms = terms;
}

function setPeopleUserInfo(userInfo: Array<any>): void {
  _userInfo = userInfo;
}

const TaxonomyStore: any = assign({}, EventEmitter.prototype, {

  getCurrentTaxonomy(): Array<any> {
    return _terms;
  },

  getCurrentSuggestions(): Array<any> {
    return _terms.concat(_userInfo);
  },

  getCurrentUserInfo(): Array<any> {
    return _userInfo;
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
    case PeopleSearchConstants.GOT_TAXONOMY:
      setPeopleSearchTaxonomy(
        action.results
      );
      TaxonomyStore.emitChange();
      break;
    case PeopleSearchConstants.GOT_BUSINESSINFO:
      setPeopleUserInfo(
        action.results
      );
      TaxonomyStore.emitChange();
      break;
    default:
    // no op
  }
});

export default TaxonomyStore;
