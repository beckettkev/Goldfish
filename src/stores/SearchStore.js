import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import PeopleSearchConstants from '../constants/data';
import DefaultConstants from '../constants/default';
import assign from 'object-assign';

// we store the search details in this object and push to the consumers...
let search = {
  people: [],
  count: 0,
  pageNum: 0,
  term: ''
};

const setPeopleSearchData = (people, count, pageNum, term) => {
  search.people = people;
  search.count = count;
  search.pageNum = pageNum;
  search.term = term;
}

const appendPeopleSearchData = (people, count, pageNum, term) => {
  if (Math.ceil(search.people.length / 10) !== pageNum) {
    search.people = search.people.concat(people);
    search.count = count;
    search.pageNum = pageNum;
    search.term = term; 
  }
};

const SearchStore = assign({}, EventEmitter.prototype, {

  getResult(id) {
    return search.people[id];
  },

  getResults() {
    return search.people;
  },

  getResultCount() {
    return search.count;
  },

  getCurrentPage() {
    return search.pageNum;
  },

  setNextPage() {
    search.pageNum += 1;
  },

  setPrevPage() {
    search.pageNum -= 1;
  },

  getCurrentSearchTerm() {
    return search.term;
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
