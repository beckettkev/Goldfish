import { Dispatch as AppDispatcher } from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import { data as PeopleSearchConstants } from '../constants/data';
import { DefaultConstants } from '../constants/default';
import * as assign from 'object-assign';

let _people: Array<any> = [];
let _count: number = 0;
let _pageNum: number = 0;
let _term: string = '';

function setPeopleSearchData(people: Array<any>, count: number, pageNum: number, term: string): void {
  _people = people;
  _count = count;
  _pageNum = pageNum;
  _term = term;
}

function appendPeopleSearchData(people: Array<any>, count: number, pageNum: number, term: string): void {
  if (Math.ceil(_people.length / 10) !== pageNum) {
    _people = _people.concat(people);
    _count = count;
    _pageNum = pageNum;
    _term = term;
  }
}

const SearchStore: any = assign({}, EventEmitter.prototype, {

  getResult(id: number): any {
    return _people[id];
  },

  getResults(): Array<any> {
    return _people;
  },

  getResultCount(): number {
    return _count;
  },

  getCurrentPage(): number {
    return _pageNum;
  },

  setNextPage(): void {
    _pageNum += 1;
  },

  setPrevPage(): void {
    _pageNum -= 1;
  },

  getCurrentSearchTerm(): string {
    return _term;
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

export default SearchStore;
