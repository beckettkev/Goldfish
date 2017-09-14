import * as React from 'react';
import * as styles from './PeopleSearch.css';
import { Utils } from '../../utils/utilities';
import Waypoint from 'react-waypoint';
import Menu from '../../components/menu/Menu';
import Search from '../../components/search/Search';
import Settings from '../../components/settings/Settings';
import Layout from '../../components/layout/Layout';
import Favourites from '../../components/favourites/Favourites';
import Results from '../../components/results/Results';
import Paging from '../../components/paging/Paging';
import Title from '../../components/title/Title';
import FavouriteStore from '../../stores/FavouriteStore';
import LayoutStore from '../../stores/LayoutStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import SettingsManager from '../../utils/settings';
import Exporter from '../../utils/exporter';

import { IPeopleSearchProps, IPeopleSearchState } from "./IPeopleSearch";

function getFavouritesState():Array<any> {
  PeopleSearchActions.getFavourites();

  return FavouriteStore.getCurrentFavourites();
}

function getLayoutState():Array<any> {
  PeopleSearchActions.fetchLayout();

  return LayoutStore.getLayout();
}

function getMenuClass(menu:string):string {
  const safe:Array<string> = ['alternate-tabs'];
  const menuClass:string = typeof menu === 'string' ? menu : 'NO_CLASS';

  return safe.indexOf(menuClass) > -1 ? menuClass : '';
}

class PeopleSearch extends React.Component<IPeopleSearchProps, IPeopleSearchState> {

  constructor(props: IPeopleSearchProps) {
    super(props);

    // the very first thing we do in the app is apply any options present
    this.setInitialState();

    this.applyOptions = this.applyOptions.bind(this);

    // if the app position is moved reset to default state
    document.addEventListener('Goldfish.Snappin', this.resetWayPointAfterPositioning, false);
  }

  componentDidUpdate():void {
    // ie workaround
    if (this.state === null) {
      this.setInitialState();

      this.applyOptions();
    }
  }

  componentDidMount():void {
    if (typeof window.Sys !== 'undefined' && window.Sys && window.Sys.Application) {
      window.Sys.Application.notifyScriptLoaded();
    }

    if (typeof window.SP !== 'undefined') {
      if (typeof window.SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs === 'function') {
        // Inform the create functionthat Goldfish can now load safely
        window.SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('goldfish.ready.min.js');
      }
    }
  }

  resetWayPointAfterPositioning = ():void => {
    if (this.state.items.length > 0) {
      // before we whipe the state, we need a record of it
      const previous:IPeopleSearchState = this.state;

      // reset the clocks so our waypoint works nicely
      this.setInitialState();

      // reset the state to what it was before
      this.state = previous;
    }
  }

  onSearch(items:IPeopleSearchState):void {
    items.searching = false;
    items.refresh = false;

    this.setState(items);
  }

  onSearching():void {
    this.setState({
      searching: true,
      items: [],
      count: 0,
      pageNum: 0,
      refresh: false,
    } as IPeopleSearchState);
  }

  onExport():void {
    if (this.state.items.length > 0) {
      const csv:any = Exporter.convertArrayObjectsToCsv(this.state.items);

      if (csv.length > 0) {
        const csvFileName:string = this.state.term.replace(/ /g, '-');

        Exporter.exportCsvStringToFile(csv, csvFileName);
      }
    }
  }

  onPage(pages:IPeopleSearchState):void {
    this.setState(pages);
  }

  onSettingChange(collection:Array<any>):void {
    // flush any current searches
    //this.setInitialState();
    this.state = {
      items: [],
      searching: false,
      refresh: false,
      settings: collection,
      count: 0,
      pageNum: 0,
      term: '',
      text: '',
      favourites: getFavouritesState(),
      layout: getLayoutState(),
    } as IPeopleSearchState;

    this.applyOptions();
  }

  onRefreshFinish():void {
    this.setState({
      refresh: false,
    });
  }

  onItemUpdate(index: number, favourite:any, type:string):void {
    let items:Array<any> = this.state.items;

    if (type === 'person') {
      items[index].Cells.Favourite = favourite;

      this.setState({ items: items });
    } else {
      // refresh the view now the favourites have changed
      this.setState({ refresh: true });
    }
  }

  onLayoutChange(view:any):void {
    this.setState(view);
  }

  onFavouritesChange(favourites:any):void {
    this.setState({favourites: favourites});
  }

  applyOptions():void {
    if (Object.keys(this.props.options).length > 0) {
      // suggest taxonomy applied from options
      if (typeof this.props.options.termsets !== 'undefined') {
        this.setState({ termsets: this.props.options.termsets });
      }

      if (typeof this.props.options.userInformationFields !== 'undefined') {
        this.setState({ userInformationFields: this.props.options.userInformationFields });
      }

      // css overrides applied from options
      if (typeof this.props.options.css !== 'undefined') {
        if (typeof this.props.options.css.overrides !== 'undefined') {
          SettingsManager.settingRouting('cssOveride', this.props.options.css.overrides);
        }
      }
    } else {
      this.setState({ suggestions: [] });
    }
  }

  isInfiniteScrollActive():boolean {
    // check to see if the super search is enabled
    return this.state.settings.some((el:any) => Object.keys(el)[0] === 'inifiniteScroll' && el[Object.keys(el)[0]]);
  }

  renderPaging(): JSX.Element {
    if (!this.isInfiniteScrollActive()) {
      return (
        <Paging
          count={this.state.count}
          onSearching={this.onSearching.bind(this)}
          properties={this.props.options.properties}
          pageNum={this.state.pageNum}
          term={this.state.term}
          onPaging={this.onPage.bind(this)} />
      );
    }
  }

  infiniteScroll(): JSX.Element {
    // check the settings to see if we have asked for results to be fetch on scroll
    if (this.isInfiniteScrollActive()) {
        let self:any = this;

        // only add a scroll waypoint if we do not have all the results already
        if (this.state.count > this.state.items.length) {
          // we wrap the waypoint to ensure that it never floats along side a result (and sits at the bottom)
          return (
            <div className={styles.wpHolder}>
              <Waypoint
                onEnter={(item:any) => {
                  let { previousPosition, currentPosition, event } = item;

                  // only fetch new results if we are not currently doing so...
                  if (!self.state.searching) {
                    // if we have some results enable constant result fetching (infinite scroll)
                    if (self.state.items.length > 0) {
                      // get the page number for the search
                      const next: number = (typeof self.state.pageNum === 'undefined' || self.state.pageNum === 0) ? 2 : (self.state.pageNum + 1);

                      // ensure we haven't already fetched these results
                      if (Math.ceil(self.state.items.length / 10) < next) {
                        self.setState({
                          searching: true,
                        });

                        const url:string = Utils.getFullSearchQueryUrl(self.state.term, self.props.options.properties);

                        // load x more search results
                        PeopleSearchActions.fetchData(url, self.state.term, next, true);
                      }
                    }
                  }
              }} />
            </div>
          );
        }

    }
  }

  setInitialState():void {
    this.state = {
      items: [],
      searching: false,
      refresh: false,
      settings: [],
      count: 0,
      pageNum: 0,
      term: '',
      text: '',
      favourites: getFavouritesState(),
      layout: getLayoutState(),
    } as IPeopleSearchState;
  }

  public render():JSX.Element {
    if (this.state === null) {
      this.componentDidUpdate();

      return null;
    }

    const alternateMenu:string = getMenuClass(this.props.options.menu);
    const inlineStyles:any = alternateMenu !== '' ? { paddingTop: '45px' } : { paddingTop: '0' };

    return (
        <div id="outer-space" key="outer-space" className="goldfishSnapRight animated bounceInRight">

          <Menu
            onExport={this.onExport}
            alternate={alternateMenu} />

          <div id="component" className={styles.component} style={inlineStyles}>
            <div className={styles.container}>

              <Title
                text={this.props.options.title} />

            </div>
            <div className="content">
              <div className={`ui center aligned ${styles.container}`}>

                <Search
                  onSearchChanged={this.onSearch.bind(this)}
                  onSearching={this.onSearching.bind(this)}
                  properties={this.props.options.properties}
                  settings={this.state.settings}
                  termsets={this.state.termsets}
                  userInformationFields={this.state.userInformationFields} />

              </div>
            </div>
            <div className={`content ${styles.everythingWorthWhile}`} id="component-vision">

              {this.renderPaging()}

              <Results
                items={this.state.items}
                term={this.state.term}
                refresh={this.state.refresh}
                onRefreshFinish={this.onRefreshFinish.bind(this)}
                searching={this.state.searching}
                favourites={this.state.favourites}
                layout={this.state.layout}
                onLayoutChange={this.onLayoutChange.bind(this)}
                onFavouritesChange={this.onFavouritesChange.bind(this)}
                onItemUpdate={this.onItemUpdate.bind(this)} />

              {this.infiniteScroll()}

              {this.renderPaging()}

            </div>
          </div>

          <Favourites
            layout={this.state.layout}
            title={this.props.options.title}
            paddingTop={inlineStyles.paddingTop}
            favourites={this.state.favourites}
            onFavouritesChange={this.onFavouritesChange.bind(this)}
            onItemUpdate={this.onItemUpdate.bind(this)} />

          <Layout
            title={this.props.options.title}
            paddingTop={inlineStyles.paddingTop}
            onLayoutChange={this.onLayoutChange.bind(this)} />

          <Settings
            title={this.props.options.title}
            paddingTop={inlineStyles.paddingTop}
            onSettingChange={this.onSettingChange.bind(this)} />
        </div>
    );
  }
}

export default PeopleSearch;