/// <reference path="./../../globals.d.ts"/>

import * as React from 'react';
import * as styles from './search.css';
import Suggest from '../suggest/Suggest';
import SearchStore from '../../stores/SearchStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import { Utils } from '../../utils/utilities';

import { ISearchProps, ISearchState } from './ISearch';

function getStoreSearchResultState():ISearchState {
  return {
    items: SearchStore.getResults(),
    searching: false,
    count: SearchStore.getResultCount(),
    pageNum: SearchStore.getCurrentPage(),
    term: SearchStore.getCurrentSearchTerm(),
    text: '',
  } as ISearchState;
}

class Search extends React.Component<ISearchProps, ISearchState> {
  constructor(props:ISearchProps) {
    super(props);

    this.state = { tags: [] };
  }

  componentWillMount():void {
    SearchStore.removeChangeListener(this.onComponentChange);
  }

  componentDidMount():void {
    SearchStore.addChangeListener(this.onComponentChange.bind(this));
  }

  componentDidUpdate():void {
    if (this.state === null) {
      this.state = { tags: [] };
    }
  }

  onComponentChange():void {
    this.props.onSearchChanged(getStoreSearchResultState());

    // check the container is tall enough to hold the results (else fix it)
    this.setResultAreaHeight();
  }

  onInputChange(name:string, value:string):void {
    this.setState({ text: value });
  }

  onkeyDown(e:any):void {
    const keyEvent:any = e || window.event;

    if (keyEvent.keyCode === 13) {
      keyEvent.preventDefault();

      this.searchForPeople();
    } else {
      this.setState({ text: keyEvent.target.value });

      //return true; ???
    }
  }

  getSimpleSearchInput():JSX.Element {
    return (
      <input
        key="search-input-basic"
        className="slideDownIn10"
        type="text"
        placeholder="Search for a colleague..."
        onKeyDown={this.onkeyDown.bind(this)} />
    );
  }

  getSuggestSearchInput():JSX.Element {
    return (
      <Suggest
        key="search-input-super"
        value={this.state.text}
        floating={false}
        tags={this.state.tags}
        maxTags={10}
        termsets={this.props.termsets}
        userInformationFields={this.props.userInformationFields}
        onTagsChange={this.handleChange.bind(this)}
        onChange={this.onInputChange.bind(this, 'search')} />
    );
  }

  searchForPeople():void {
    const properties:Array<any> = typeof this.props.properties !== 'undefined' ? this.props.properties : '';

    const url:string = Utils.getFullSearchQueryUrl(this.state.text, properties);

    this.props.onSearching();

    PeopleSearchActions.fetchData(url, this.state.text, 0, false);
  }

  handleSubmit(e:any):void {
    e.preventDefault();

    // invoke the search request
    this.searchForPeople();
  }

  handleChange(tags:Array<any>):void {
    this.setState({tags});

    // a search has been commited so update with the new tag(s)
    if (this.state.text.indexOf(':') > -1 && tags.length > 0) {
      const properties:Array<any> = typeof this.props.properties !== 'undefined' ? this.props.properties : '';

      const searchTerm:string = tags.map((tag:string) => tag.search).join(' ');

      this.onInputChange('', searchTerm);

      this.props.onSearching();

      PeopleSearchActions.fetchData(Utils.getFullSearchQueryUrl(searchTerm, properties), searchTerm, 0, false);
    } else if (tags.length === 0) {
      PeopleSearchActions.showNoResults();
    }
  }

  setResultAreaHeight():void {
    // if we fetch more results, ensure that we have increased the height of the container when necessary
    const resultsBottom:number = document.getElementById('component-results').getBoundingClientRect().bottom;
    const containerBottom:number = document.getElementById('component').getBoundingClientRect().bottom;

    const offset:number = resultsBottom - containerBottom;

    // height of the container minus the padding
    const containerHeight:number = document.getElementById('component').clientHeight - 200;

    // check to see if the results are bigger than the container (and adjust if necessary)
    if (offset > 0) {
      // add 100 pixels to the bottom to make sure the results have some room
      document.getElementById('component').style.height = ((containerHeight + offset) + 100) + 'px';
    }
  }

  searchInputSelector():JSX.Element {
    if (this.props.settings.length === 0) {
      // in the unlikely event of no settings being applied
      return this.getSimpleSearchInput();
    }

    // check to see if the super search is enabled
    const suggestEnabled:boolean = this.props.settings.some((el) => Object.keys(el)[0] === 'enableSuperSearch' && el[Object.keys(el)[0]]);

    if (suggestEnabled) {
      return this.getSuggestSearchInput();
    }

    return this.getSimpleSearchInput();
  }

  public render():JSX.Element {
    if (this.state !== null) {
      return (
        <form onSubmit={this.handleSubmit.bind(this)} key="form-soon-to-be-deleted">
          <div className="ui fluid search">
            <div className={styles.searchContainer + ' ui icon input'}>
              {this.searchInputSelector()}
            </div>
          </div>
        </form>
      );
    }
  }
}

export default Search;
