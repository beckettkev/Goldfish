import React from 'react';
import Autosuggest from './autosuggest/AutosuggestContainer';
import AutosuggestHighlight from 'autosuggest-highlight';
import Tag from '../tag/Tag';
import Button from '../../ui/Button.jsx';
import styles from './Suggest.css';
import cssModules from 'react-css-modules';
import TaxonomyStore from '../../stores/TaxonomyStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import DefaultConstants from '../../constants/default.js';

function renderLayout(tagComponents) {
  return (
    <span>
      {tagComponents}
    </span>
  );
}

function getSearchFromTags(tags) {
  // get all the search terms from the tags and return them in a new array
  return tags.map(function(tag) {
    return tag.search;
  }).join(' ');
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return TaxonomyStore.getCurrentSuggestions()
          .map(section => {
            return {
              title: section.title,
              terms: section.terms.filter(term => regex.test(term.name)),
            };
          })
          .filter(section => section.terms.length > 0);
}

function renderSuggestion(suggestion, { value, valueBeforeUpDown }) {
  const query = (valueBeforeUpDown || value).trim();
  const matches = AutosuggestHighlight.match(suggestion.name, query);
  const parts = AutosuggestHighlight.parse(suggestion.name, matches);

  return (
    <span className="animated">
      {
        parts.map((part, index) => {
          const className = part.highlight ? 'highlight' : null;

          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })
      }
    </span>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionSuggestions(section) {
  return section.terms;
}

function setTaxonomySearchResults() {
  this.setState({ suggestions: TaxonomyStore.getCurrentSuggestions() });
}

class Suggest extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tag: '',
      value: '',
      suggestions: getSuggestions(''),
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  onComponentChange() {
    if (this.state === null) {
      setTaxonomySearchResults();
    }
  }

  getSuggestionValue(suggestion, event) {
    // do not load the selected term in the input field
    if (event.type === 'click') {
      // enter or click event
      const {validationRegex} = this.props;

      if (validationRegex.test(suggestion.name)) {
        this._addTag(suggestion);
      }

      return '';
    }

    this.setState({ tag: suggestion });

    return suggestion.name;
  }

  componentWillMount() {
    TaxonomyStore.removeChangeListener(this.onComponentChange);
  }

  componentDidMount() {
    TaxonomyStore.addChangeListener(this.onComponentChange.bind(this));
  }

  onSearch(event) {
    // take the array values and join them for the search (invoke search in parent)
    this.props.onChange(getSearchFromTags(this.props.tags));
  }

  componentWillReceiveProps(newProps) {
    if (typeof newProps !== 'undefined') {
      if (typeof newProps.termsets !== 'undefined') {
        if (newProps.termsets.length > 0) {
          // fetch the data for Taxonomy and Job Titles for the Auto Suggest tool
          PeopleSearchActions.getTaxonomy(newProps.termsets);
        }
      }
      if (typeof newProps.userInformationFields !== 'undefined') {
        if (newProps.userInformationFields.length > 0) {
          PeopleSearchActions.getBusinessInformation(newProps.userInformationFields);
        }
      } else {
        // Defaults are set for auto suggest if none are supplied in the options
        PeopleSearchActions.getBusinessInformation(DefaultConstants.DEFAULT_USERINFORMATION_FIELDS);
      }
    }
  }

  componentDidUpdate() {
    if (this.state === null) {
      this.setState({
        tag: {},
        value: '',
        suggestions: getSuggestions(''),
      });
    }
  }

  removeTag(index) {
    const tags = this.props.tags.concat([]);

    if (index > -1 && index < tags.length) {
      tags.splice(index, 1);

      this.props.onTagsChange(tags);
    }
  }

  _clearInput() {
    this.setState({ tag: {} });
  }

  renderSearchButton() {
    if (typeof this.props.tags !== 'undefined') {
      if (this.props.tags.length > 0) {
        return (
          <div styleName="tag-holder">
            <Button
              icon="search"
              label="Search"
              raised primary
              onClick={this.onSearch.bind(this)} />
          </div>
        );
      }
    }
  }

  _addTag(tag) {
    const {onlyUnique} = this.props;

    const isUnique = (this.props.tags.filter(function(item) {
      return item.name !== tag.name;
    })).length === 0;

    const limit = this._maxTags(this.props.tags.length);

    if (typeof tag.name !== 'undefined' && limit && (isUnique || !onlyUnique)) {
      const tags = this.props.tags.concat([tag]);

      this.props.onTagsChange(tags);
      this._clearInput();
    }
  }

  onKeyDown(event) {
    // tab or enter key down event
    if (event.keyCode === 9 || event.keyCode === 13) {
      event.preventDefault();

      if (Object.keys(this.state.tag).length > 0) {
        this._addTag(this.state.tag);

        this.setState({
          tag: {},
          value: '',
        });
      } else if (this.state.value !== '') {
        // vanilla search term
        // if a contains search is being done, display only the right handside value in the tag (but keep the full search term in the search property)
        let seperator = '';

        if (this.state.value.indexOf(':') > -1) {
          seperator = ':';
        } else if (this.state.value.indexOf('=') > -1) {
          seperator = '=';
        }

        this._addTag({
          name: (seperator === '' ? this.state.value : this.state.value.split(seperator)[1]).replace(/"/g, ''),
          search: this.state.value,
        });

        this.setState({ value: '' });
      }
    }
  }

  onChange(event, { newValue }) {
    this.setState({ value: newValue });

    this.props.onChange(newValue);
  }

  onSuggestionsUpdateRequested({ value }) {
    this.setState({ suggestions: getSuggestions(value) });
  }

  _maxTags(tags) {
    return this.props.maxTags !== -1 ? tags < this.props.maxTags : true;
  }

  render() {
    if (this.state !== null) {
      const { tags, onTagsChange, addKeys, removeKeys, ...other} = this.props;
      const { value, suggestions } = this.state;
      const inputProps = {
        placeholder: 'Add tags and then search...',
        value,
        onChange: this.onChange.bind(this),
        onKeyDown: this.onKeyDown.bind(this),
      };

      const tagComponents = tags.length > 0 ?
        renderLayout(tags.map((element, index) => {
          return (
            <Tag
              key={index}
              item={index}
              tag={element}
              onRemove={this.removeTag.bind(this)}
              className="react-tagsinput-tag"
              removeClassName="react-tagsinput-remove" />
          );
        })) : '';

      return (
        <div key="autosuggest-region">
          <Autosuggest
            key="goldfish-autosuggest"
            className="animated flipInX"
            multiSection={true}
            suggestions={suggestions}
            onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested.bind(this)}
            getSuggestionValue={this.getSuggestionValue.bind(this)}
            renderSuggestion={renderSuggestion.bind(this)}
            renderSectionTitle={renderSectionTitle.bind(this)}
            getSectionSuggestions={getSectionSuggestions.bind(this)}
            inputProps={inputProps} />
            <div ref="div" {...other}>
              {tagComponents}
            </div>
            {this.renderSearchButton()}
        </div>
      );
    }

    this.componentDidUpdate();
  }
}

Suggest.propTypes = {
  onChange: React.PropTypes.func,
  addKeys: React.PropTypes.array,
  addOnBlur: React.PropTypes.bool,
  onTagsChange: React.PropTypes.func.isRequired,
  removeKeys: React.PropTypes.array,
  onlyUnique: React.PropTypes.bool,
  tags: React.PropTypes.array.isRequired,
  maxTags: React.PropTypes.number,
  validationRegex: React.PropTypes.instanceOf(RegExp),
  termsets: React.PropTypes.array,
  fields: React.PropTypes.array,
};

Suggest.defaultProps = {
  className: 'react-tagsinput',
  addKeys: [9, 13],
  removeKeys: [8],
  onlyUnique: false,
  maxTags: -1,
  validationRegex: /.*/,
};

export default cssModules(Suggest, styles, { allowMultiple: true });
