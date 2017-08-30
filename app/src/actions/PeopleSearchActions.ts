import { Dispatch as AppDispatcher } from '../dispatcher/AppDispatcher';
import { data as PeopleSearchConstants } from '../constants/data';
import { Data } from '../data/data';
import * as Storage from '../data/storage';
import * as Taxonomy from '../data/taxonomy';
import * as UserInformationList from '../data/userInformationList';

function dispatch(type: any, data: any): void {
  AppDispatcher.dispatch({
    actionType: type,
    results: data,
  });
}

const PeopleSearchActions = {
  fetchData(url: string, term: string, pageNum: number, append: boolean) {
    const appendResults: boolean = typeof append === 'undefined' ? false : append;
    // we will handle the dispatcher within the logic

    if (typeof window.fakeAjaxCalls === 'undefined') {
      Data.getPeopleResults(url, term, pageNum, appendResults).then(data => { });
    } else {
      // load mock data
      Data.getMockPeopleResults(term, pageNum, appendResults);
    }
  },

  showNoResults(): void {
    dispatch(PeopleSearchConstants.NO_RESULTS, []);
  },

  fetchLayout(): void {
    Storage.getCurrentLayout().then((data: any): void => {
      dispatch(PeopleSearchConstants.GOT_LAYOUT, data);
    });
  },

  updateLayout(layout: any): void {
    Storage.updateCurrentLayout(layout).then((data: any): void => {
      dispatch(PeopleSearchConstants.LAYOUT_CHANGED, data);
    });
  },

  fetchSettings(): void {
    Storage.getSettings().then((data: any): void => {
      dispatch(PeopleSearchConstants.GOT_SETTINGS, data);
    });
  },

  updateSettings(settings: any): void {
    Storage.updateSettings(settings).then((data: any): void => {
      dispatch(PeopleSearchConstants.SETTINGS_CHANGED, data);
    });
  },

  getFavourites(): void {
    Storage.getFavourites().then((data: any): void => {
      dispatch(PeopleSearchConstants.GOT_FAVOURITES, data);
    });
  },

  updateFavourites(favourites: any): void {
    Storage.updateFavourites(favourites).then((data: any): void => {
      dispatch(PeopleSearchConstants.FAVOURITES_CHANGED, data);
    });
  },

  getTaxonomy(termSets: any): void {
    Taxonomy.getTermsByTermSets(termSets).then((data: any): void => {
      dispatch(PeopleSearchConstants.GOT_TAXONOMY, data);
    });
  },

  getBusinessInformation(keys: any): void {
    UserInformationList.getBusinessInformation(keys, undefined).then((data: any): void => {
      dispatch(PeopleSearchConstants.GOT_BUSINESSINFO, data);
    });
  },
};

export default PeopleSearchActions;
