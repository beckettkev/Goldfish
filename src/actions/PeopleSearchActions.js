import AppDispatcher from '../dispatcher/AppDispatcher';
import PeopleSearchConstants from '../constants/data';
import Data from '../data/data';
import Storage from '../data/storage';
import Taxonomy from '../data/taxonomy';
import UserInformationList from '../data/userInformationList';

const PeopleSearchActions = {

  fetchData(url, term, pageNum, append) {
    const appendResults = typeof append === 'undefined' ? false : append;
    // we will handle the dispatcher within the logic

    if (typeof window.fakeAjaxCalls === 'undefined') {
      Data.getPeopleResults(url, term, pageNum, appendResults).then(data => {});
    } else {
      // load mock data
      Data.getMockPeopleResults(term, pageNum, appendResults);
    }
  },

  showNoResults() {
    AppDispatcher.dispatch({
      actionType: PeopleSearchConstants.NO_RESULTS,
      results: [],
    });
  },

  fetchLayout() {
    Storage.getCurrentLayout().then(data => {
      AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.GOT_LAYOUT,
        results: data,
      });
    });
  },

  updateLayout(layout) {
    Storage.updateCurrentLayout(layout).then(data => {
      AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.LAYOUT_CHANGED,
        results: data,
      });
    });
  },

  fetchSettings() {
    Storage.getSettings().then(data => {
      AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.GOT_SETTINGS,
        results: data,
      });
    });
  },

  updateSettings(settings) {
    Storage.updateSettings(settings).then(data => {
      AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.SETTINGS_CHANGED,
        results: data,
      });
    });
  },

  getFavourites() {
    Storage.getFavourites().then(data => {
      AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.GOT_FAVOURITES,
        results: data,
      });
    });
  },

  updateFavourites(favourites) {
    Storage.updateFavourites(favourites).then(data => {
      AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.FAVOURITES_CHANGED,
        results: data,
      });
    });
  },

  getTaxonomy(termSets) {
    Taxonomy.getTermsByTermSets(termSets).then(data => {
      AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.GOT_TAXONOMY,
        results: data,
      });
    });
  },

  getBusinessInformation(keys) {
    UserInformationList.getBusinessInformation(keys).then(data => {
      AppDispatcher.dispatch({
        actionType: PeopleSearchConstants.GOT_BUSINESSINFO,
        results: data,
      });
    });
  },
};

module.exports = PeopleSearchActions;
