import React from 'react';
import styles from './search.css';
import cssModules from 'react-css-modules';
import Suggest from '../suggest/Suggest';
import SearchStore from '../../stores/SearchStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import Utils from '../../utils/utilities';

function getStoreSearchResultState() {
    return {
      items: SearchStore.getResults(),
      searching: false,
      count: SearchStore.getResultCount(),
      pageNum: SearchStore.getCurrentPage(),
      term: SearchStore.getCurrentSearchTerm(),
      text: ''
    }
}

const Search = React.createClass({

	propTypes: {
      settings: React.PropTypes.array,
      suggestions: React.PropTypes.array,
			onSearchChanged: React.PropTypes.func,
      onSearching: React.PropTypes.func,
	},

  getInitialState() {
    
    return {tags: []};

  },

  componentDidUpdate() {

    if (this.state === null) {
        this.setState(this.getInitialState());
    }

  },

  componentDidMount() {

    SearchStore.addChangeListener(this.onComponentChange.bind(this));

  },

  componentWillMount() {

    SearchStore.removeChangeListener(this.onComponentChange);

  },

  onComponentChange() {

    this.props.onSearchChanged(getStoreSearchResultState());

  },

  onInputChange(name, value) {

    this.setState({ text: value });

  },

  handleChange(tags) {

    this.setState({tags});

  },

  handleSubmit(e) {

    e.preventDefault();

    //invoke the search request
    this.searchForPeople();

  },

  onkeyDown(e) {

      e = e || window.event;

      if (e.keyCode === 13) {
        e.preventDefault();

        this.searchForPeople();
      } else {
        this.setState({ text: e.target.value });

        return true;
      }

  },

  searchForPeople() {

    let url = Utils.getFullSearchQueryUrl(this.state.text);

    this.props.onSearching();

    PeopleSearchActions.fetchData(url, this.state.text, 0);

  },

  getSimpleSearchInput() {

        return (
            <input key='search-input-basic' 
                  className={'animated flipInX'}
                  type='text' 
                  placeholder='Search for a colleague...' 
                  onKeyDown={this.onkeyDown.bind(this)} />
        );

  },

  getSuggestSearchInput() {

        return (
            <Suggest key='search-input-super'
                value={this.state.text}
                floating={false}
                tags={this.state.tags}
                maxTags={10}
                termsets={this.props.termsets}
                userInformationFields={this.props.userInformationFields}
                onTagsChange={this.handleChange.bind(this)}
                onChange={this.onInputChange.bind(this, 'search')} />
        );

  },

  searchInputSelector() {

        if (this.props.settings.length === 0) {
            //in the unlikely event of no settings being applied
            return(
                this.getSimpleSearchInput()
            );
        } else {
            //check to see if the super search is enabled
            let suggestEnabled = this.props.settings.some(function(el, i) {
                return Object.keys(el)[0] === 'enableSuperSearch' && el[Object.keys(el)[0]];
            });

            if (suggestEnabled) {
                return(this.getSuggestSearchInput());
            } else {
                return(this.getSimpleSearchInput());
            }
        }

  },

  render() {

        if (this.state !== null) {

            return (
              <form onSubmit={this.handleSubmit.bind(this)} key='form-soon-to-be-deleted'>
                  <div className={'ui fluid category search'}>
                      <div className={'ui icon input'} styleName='search-container'>
                          {this.searchInputSelector()}
                      </div>
                  </div>                  
              </form>
            );

        }

  }
});

module.exports = cssModules(Search, styles, { allowMultiple: true });
