import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import PeopleSearchConstants from '../constants/data';
import DefaultConstants from '../constants/default';
import assign from 'object-assign';

let _terms = [];
let _userInfo = [];

function setPeopleSearchTaxonomy(terms) {
  _terms = terms;
}

function setPeopleUserInfo(userInfo) {
  _userInfo = userInfo;
}

const TaxonomyStore = assign({}, EventEmitter.prototype, {

  getCurrentTaxonomy() {
    return _terms;
  },

  getCurrentSuggestions() {
    return _terms.concat(_userInfo);
  },

  getCurrentUserInfo() {
    return _userInfo;
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

module.exports = TaxonomyStore;
