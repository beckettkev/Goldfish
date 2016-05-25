import React from 'react';
import styles from './search.css';
import cssModules from 'react-css-modules';
import Suggest from '../suggest/Suggest.jsx';
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
    text: '',
  };
}

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = { tags: [] };
  }

  componentWillMount() {
    SearchStore.removeChangeListener(this.onComponentChange);
  }

  componentDidMount() {
    SearchStore.addChangeListener(this.onComponentChange.bind(this));
  }

  componentDidUpdate() {
    if (this.state === null) {
      this.state = { tags: [] };
    }
  }

  onComponentChange() {
    this.props.onSearchChanged(getStoreSearchResultState());

    // check the container is tall enough to hold the results (else fix it)
    this.setResultAreaHeight();
  }

  onInputChange(name, value) {
    this.setState({ text: value });
  }

  onkeyDown(e) {
    const keyEvent = e || window.event;

    if (keyEvent.keyCode === 13) {
      keyEvent.preventDefault();

      this.searchForPeople();
    } else {
      this.setState({ text: keyEvent.target.value });

      return true;
    }
  }

  getSimpleSearchInput() {
    return (
      <input
        key="search-input-basic"
        className="animated flipInX"
        type="text"
        placeholder="Search for a colleague..."
        onKeyDown={this.onkeyDown.bind(this)} />
    );
  }

  getSuggestSearchInput() {
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

  searchForPeople() {
    const properties = typeof this.props.properties !== 'undefined' ? this.props.properties : '';

    const url = Utils.getFullSearchQueryUrl(this.state.text, properties);

    this.props.onSearching();

    PeopleSearchActions.fetchData(url, this.state.text, 0);
  }

  handleSubmit(e) {
    e.preventDefault();

    // invoke the search request
    this.searchForPeople();
  }

  handleChange(tags) {
    this.setState({tags});

    // a search has been commited so update with the new tag(s)
    if (this.state.text.indexOf(':') > -1 && tags.length > 0) {
      const properties = typeof this.props.properties !== 'undefined' ? this.props.properties : '';

      const searchTerm = tags.map(function(tag) { return tag.search; }).join(' ');

      this.onInputChange(this, searchTerm);

      this.props.onSearching();

      PeopleSearchActions.fetchData(Utils.getFullSearchQueryUrl(searchTerm, properties), searchTerm, 0);
    } else if (tags.length === 0) {
      PeopleSearchActions.showNoResults();
    }
  }

  setResultAreaHeight() {
    // if we fetch more results, ensure that we have increased the height of the container when necessary
    const resultsBottom = document.getElementById('component-results').getBoundingClientRect().bottom;
    const containerBottom = document.getElementById('component').getBoundingClientRect().bottom;

    const offset = resultsBottom - containerBottom;

    // height of the container minus the padding
    const containerHeight = document.getElementById('component').clientHeight - 200;

    // check to see if the results are bigger than the container (and adjust if necessary)
    if (offset > 0) {
      // add 100 pixels to the bottom to make sure the results have some room
      document.getElementById('component').style.height = ((containerHeight + offset) + 100) + 'px';
    }
  }

  searchInputSelector() {
    if (this.props.settings.length === 0) {
      // in the unlikely event of no settings being applied
      return (
        this.getSimpleSearchInput()
      );
    }

    // check to see if the super search is enabled
    const suggestEnabled = this.props.settings.some(function(el) {
      return Object.keys(el)[0] === 'enableSuperSearch' && el[Object.keys(el)[0]];
    });

    if (suggestEnabled) {
      return (this.getSuggestSearchInput());
    }

    return (this.getSimpleSearchInput());
  }

  render() {
    if (this.state !== null) {
      return (
        <form onSubmit={this.handleSubmit.bind(this)} key="form-soon-to-be-deleted">
          <div className="ui fluid search">
            <div className="ui icon input" styleName="search-container">
              {this.searchInputSelector()}
            </div>
          </div>
        </form>
      );
    }
  }
}

Search.propTypes = {
  termsets: React.PropTypes.array,
  userInformationFields: React.PropTypes.array,
  properties: React.PropTypes.object,
  settings: React.PropTypes.array,
  suggestions: React.PropTypes.array,
  onSearchChanged: React.PropTypes.func,
  onSearching: React.PropTypes.func,
};

export default cssModules(Search, styles, { allowMultiple: true });
