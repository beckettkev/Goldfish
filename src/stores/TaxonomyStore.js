const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const PeopleSearchConstants = require('../constants/data');
const DefaultConstants = require('../constants/default');
const assign = require('object-assign');
const Utils = require('../utils/utilities');

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
  }

});

AppDispatcher.register( action => {
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
