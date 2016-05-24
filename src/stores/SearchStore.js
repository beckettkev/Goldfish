import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import PeopleSearchConstants from '../constants/data';
import DefaultConstants from '../constants/default';
import assign from 'object-assign';

let _people = [];
let _count = 0;
let _pageNum = 0;
let _term = '';

function setPeopleSearchData(people, count, pageNum, term) {
  _people = people;
  _count = count;
  _pageNum = pageNum;
  _term = term;
}

function appendPeopleSearchData(people, count, pageNum, term) {
  if (Math.ceil(_people.length / 10) !== pageNum) {
    _people = _people.concat(people);
    _count = count;
    _pageNum = pageNum;
    _term = term; 
  }
}

const SearchStore = assign({}, EventEmitter.prototype, {

  getResult(id) {
    return _people[id];
  },

  getResults() {
    return _people;
  },

  getResultCount() {
    return _count;
  },

  getCurrentPage() {
    return _pageNum;
  },

  setNextPage() {
    _pageNum += 1;
  },

  setPrevPage() {
    _pageNum -= 1;
  },

  getCurrentSearchTerm() {
    return _term;
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
  case PeopleSearchConstants.PEOPLE_LOADED:
    setPeopleSearchData(
      action.data.payload,
      action.data.count,
      action.data.pageNum,
      action.data.term
    );
    SearchStore.emitChange();
    break;
  case PeopleSearchConstants.PEOPLE_LOADED_APPEND:
    appendPeopleSearchData(
      action.data.payload,
      action.data.count,
      action.data.pageNum,
      action.data.term
    );
    SearchStore.emitChange();
    break;
  case PeopleSearchConstants.NO_RESULTS:
    setPeopleSearchData(
      action.results,
      0,
      0,
      typeof action.data !== 'undefined' ? action.data.term : ''
    );
    SearchStore.emitChange();
    break;
  default:
    // no op
  }
});

module.exports = SearchStore;
