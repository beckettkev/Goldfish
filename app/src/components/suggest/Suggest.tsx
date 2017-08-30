import * as React from 'react';
import Autosuggest from './autosuggest/AutosuggestContainer';
import AutosuggestHighlight from 'autosuggest-highlight';
import Tag from '../tag/Tag';
import Button from '../../ui/Button';
import * as styles from './Suggest.css';
import TaxonomyStore from '../../stores/TaxonomyStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import { DefaultConstants } from '../../constants/default';

import { ISuggestProps, ISuggestState } from './ISuggest';

function renderLayout(tagComponents:Array<JSX.Element>):JSX.Element {
  return (
    <span>
      {tagComponents}
    </span>
  );
}

function getSearchFromTags(tags:Array<any>):string {
  // get all the search terms from the tags and return them in a new array
  return tags.map((tag:any) => tag.search).join(' ');
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(s:string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value:string):Array<any> {
  const escapedValue:string = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex:RegExp = new RegExp('^' + escapedValue, 'i');

  return TaxonomyStore.default.getCurrentSuggestions()
          .map((section:any):any => ({
              title: section.title,
              terms: section.terms.filter((term:any) => regex.test(term.name)),
            })
          )
          .filter((section:any):any => section.terms.length > 0);
}

function renderSuggestion(suggestion:any, { value:string, valueBeforeUpDown:any }):JSX.Element {
  const query:string = (valueBeforeUpDown || value).trim();
  const matches:any = AutosuggestHighlight.match(suggestion.name, query);
  const parts:any = AutosuggestHighlight.parse(suggestion.name, matches);

  return (
    <span className="animated">
      {
        parts.map((part:any, index:number):JSX.Element => 
            <span className={part.highlight ? 'highlight' : null} key={index}>
              {part.text}
            </span>
        )
      }
    </span>
  );
}

function renderSectionTitle(section:any):JSX.Element {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionSuggestions(section:any):Array<string> {
  return section.terms;
}


class Suggest extends React.Component<ISuggestProps, ISuggestState> {

  constructor(props:ISuggestProps) {
    super(props);

    this.state = {
      tag: '',
      value: '',
      suggestions: getSuggestions(''),
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.setTaxonomySearchResults = this.setTaxonomySearchResults.bind(this);
  }

  setTaxonomySearchResults():void {
    this.setState({ suggestions: TaxonomyStore.getCurrentSuggestions() });
  }

  onComponentChange():void {
    if (this.state === null) {
      this.setTaxonomySearchResults();
    }
  }

  getSuggestionValue(suggestion:any, event:any):string {
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

  componentWillMount():void {
    TaxonomyStore.removeChangeListener(this.onComponentChange);
  }

  componentDidMount():void {
    TaxonomyStore.addChangeListener(this.onComponentChange.bind(this));
  }

  onSearch(event:any):void {
    // take the array values and join them for the search (invoke search in parent)
    this.props.onChange(getSearchFromTags(this.props.tags));
  }

  componentWillReceiveProps(newProps:any):void {
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

  componentDidUpdate():void {
    if (this.state === null) {
      this.setState({
        tag: {},
        value: '',
        suggestions: getSuggestions(''),
      });
    }
  }

  removeTag(index:number):void {
    let tags:Array<any> = this.props.tags.concat([]);

    if (index > -1 && index < tags.length) {
      tags.splice(index, 1);

      this.props.onTagsChange(tags);
    }
  }

  _clearInput():void {
    this.setState({ tag: {} });
  }

  renderSearchButton():JSX.Element {
    if (typeof this.props.tags !== 'undefined') {
      if (this.props.tags.length > 0) {
        return (
          <div className={styles.tagHolder}>
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

  _addTag(tag:any):void {
    const {onlyUnique} = this.props;
    const isUnique:boolean = (this.props.tags.filter((item:any) => item.name !== tag.name)).length === 0;
    const limit:boolean = this._maxTags(this.props.tags.length);

    if (typeof tag.name !== 'undefined' && limit && (isUnique || !onlyUnique)) {
      const tags:Array<any> = this.props.tags.concat([tag]);

      this.props.onTagsChange(tags);

      this._clearInput();
    }
  }

  onKeyDown(event:any):void {
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
        let seperator:string = '';

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

  onChange(event:any, { newValue }):void {
    this.setState({ value: newValue });

    this.props.onChange(newValue);
  }

  onSuggestionsUpdateRequested({ value }):void {
    this.setState({ suggestions: getSuggestions(value) });
  }

  _maxTags(tags:number):boolean {
    return this.props.maxTags !== -1 ? tags < this.props.maxTags : true;
  }

  public render():JSX.Element {
    if (this.state !== null) {
      const { tags, onTagsChange, addKeys, removeKeys, ...other} = this.props;
      const { value, suggestions } = this.state;
      const inputProps:any = {
        placeholder: 'Add tags and then search...',
        value,
        onChange: this.onChange.bind(this),
        onKeyDown: this.onKeyDown.bind(this),
      };

      const tagComponents:any = tags.length > 0 ?
        renderLayout(
          tags.map((element:any, index:number):JSX.Element => 
            <Tag
              key={index}
              item={index}
              tag={element}
              onRemove={this.removeTag.bind(this)}
              className="react-tagsinput-tag"
              removeClassName="react-tagsinput-remove" />
          )
        ) : '';

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

Suggest.defaultProps = {
  className: 'react-tagsinput',
  addKeys: [9, 13],
  removeKeys: [8],
  onlyUnique: false,
  maxTags: -1,
  validationRegex: /.*/,
};

export default Suggest;
