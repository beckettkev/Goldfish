import React from 'react';
import Autosuggest from './autosuggest/AutosuggestContainer';
import AutosuggestHighlight from 'autosuggest-highlight';
import {Button} from 'react-toolbox/lib/button';
import styles from './Suggest.css';
import cssModules from 'react-css-modules';
import TaxonomyStore from 'stores/TaxonomyStore';
import PeopleSearchActions from 'actions/PeopleSearchActions';
import DefaultConstants from 'constants/default.js';

function renderTag (props) {
	let {tag, key, onRemove, className, classNameRemove} = props;
	
	const searchTermStyles = {
		display: 'none !important'
	};

	return (
		<span key={key} className={className}>
			<span style={searchTermStyles} className='search-term'>{tag.search}</span>
			{tag.name}
			<a className={classNameRemove} onClick={(e) => onRemove(key)} />
		</span>
	);
}

renderTag.propTypes = {
	key: React.PropTypes.number,
	tag: React.PropTypes.string,
	onRemove: React.PropTypes.function,
	classNameRemove: React.PropTypes.string
};

function renderLayout (tagComponents) {
	return (
		<span>
			{tagComponents}
		</span>
	);
}

function getSearchFromTags (tags) {
	//get all the search terms from the tags and return them in a new array
	return tags.map(function (tag) {
			return tag.search;
		}).join(' ');
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters (str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions (value) {
	const escapedValue = escapeRegexCharacters(value.trim());

	if (escapedValue === '') {
		return [];
	}

	const regex = new RegExp('^' + escapedValue, 'i');

	return TaxonomyStore.getCurrentSuggestions()
					.map(section => {
						return {
							title: section.title,
							terms: section.terms.filter(term => regex.test(term.name))
						};
					})
					.filter(section => section.terms.length > 0);
}

function renderSuggestion (suggestion, { value, valueBeforeUpDown }) {
	const query = (valueBeforeUpDown || value).trim();
	const matches = AutosuggestHighlight.match(suggestion.name, query);
	const parts = AutosuggestHighlight.parse(suggestion.name, matches);

	return (
		<span>
			{
				parts.map((part, index) => {
					const className = part.highlight ? 'highlight' : null;

					return (
						<span className={className} key={index}>{part.text}</span>
					);
				})
			}
		</span>
	);
}

function renderSectionTitle (section) {
	return (
		<strong>{section.title}</strong>
	);
}

function getSectionSuggestions (section) {
	return section.terms;
}

function setTaxonomySearchResults () {
	this.setState({ suggestions: TaxonomyStore.getCurrentSuggestions() });
}

class Suggest extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
				tag: '',
				value: '',
				suggestions: getSuggestions('')
		};

		this.onChange = this.onChange.bind(this);
		this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
	}

	componentDidUpdate () {
		if (this.state === null) {
			this.state = {
				tag: '',
				value: '',
				suggestions: []
			};
		}
	}

	static propTypes = {
		addKeys: React.PropTypes.array,
		addOnBlur: React.PropTypes.bool,
		onTagsChange: React.PropTypes.func.isRequired,
		removeKeys: React.PropTypes.array,
		onlyUnique: React.PropTypes.bool,
		tags: React.PropTypes.array.isRequired,
		maxTags: React.PropTypes.number,
		validationRegex: React.PropTypes.instanceOf(RegExp),
		termsets: React.PropTypes.array,
		fields: React.PropTypes.array
	};

	static defaultProps = {
		className: 'react-tagsinput',
		addKeys: [9, 13],
		removeKeys: [8],
		onlyUnique: false,
		maxTags: -1,
		validationRegex: /.*/
	};

	_removeTag (index) {
		const tags = this.props.tags.concat([]);

		if (index > -1 && index < tags.length) {
			tags.splice(index, 1);

			this.props.onTagsChange(tags);
		}
	}

	_clearInput () {
		this.setState({ tag: {} });
	}

	_maxTags (tags) {
		return this.props.maxTags !== -1 ? tags < this.props.maxTags : true;
	}

	_addTag (tag) {
		const {onlyUnique} = this.props;

		const isUnique = (this.props.tags.filter(function (item) {
				return item.name !== tag.name;
		})).length === 0;

		const limit = this._maxTags(this.props.tags.length);

		if (typeof tag.name !== 'undefined' && limit && (isUnique || !onlyUnique)) {
			const tags = this.props.tags.concat([tag]);

			this.props.onTagsChange(tags);
			this._clearInput();
		}
	}

	getSuggestionValue (suggestion, event) {
		//do not load the selected term in the input field
		if (event.type === 'click') {
			//enter or click event
			let {tags, removeKeys, addKeys, validationRegex} = this.props;

			if (validationRegex.test(suggestion.name)) {
				this._addTag(suggestion);
			}

			return '';
		} else {
			this.setState({ tag: suggestion });
		}

		return suggestion.name;
	}

	handleClick (e) {
		if (e.target === this.refs.div) {
			this.focus();
		}
	}

	handleRemove (tag) {
		this._removeTag(tag);
	}

	componentDidUpdate () {
		if (this.state === null) {
			this.setState({
				tag: {},
				value: '',
				suggestions: getSuggestions('')
			});
		}
	}

	componentDidMount () {
		TaxonomyStore.addChangeListener(this.onComponentChange.bind(this));
	}

	componentWillMount () {
		TaxonomyStore.removeChangeListener(this.onComponentChange);
	}

	onComponentChange () {
		if (this.state === null) {
			setTaxonomySearchResults();
		}
	}

	onSearch (event) {
		//take the array values and join them for the search (invoke search in parent)
		this.props.onChange(getSearchFromTags(this.props.tags));
	}

	componentWillReceiveProps (newProps) {
		if (typeof newProps !== 'undefined') {
			if (typeof newProps.termsets !== 'undefined') {
				if (newProps.termsets.length > 0) {
					//fetch the data for Taxonomy and Job Titles for the Auto Suggest tool
					PeopleSearchActions.getTaxonomy(newProps.termsets);
				}
			}
			if (typeof newProps.userInformationFields !== 'undefined') {
				if (newProps.userInformationFields.length > 0) {
					PeopleSearchActions.getBusinessInformation(newProps.userInformationFields);
				}
			} else {
				//Defaults are set for auto suggest if none are supplied in the options
				PeopleSearchActions.getBusinessInformation(DefaultConstants.DEFAULT_USERINFORMATION_FIELDS);
			}
		}
	}

	renderSearchButton () {
		if (typeof this.props.tags !== 'undefined') {
			if (this.props.tags.length > 0) {
				return(
					<div styleName='tag-holder'>
						<Button
							icon='search'
							label='Search'
							raised primary
							onClick={this.onSearch.bind(this)} />
					</div>
				);
			}
		}
	}

	onKeyDown (event) {
		//tab or enter key down event
		if (event.keyCode === 9 || event.keyCode === 13) {
			event.preventDefault();

			if (Object.keys(this.state.tag).length > 0) {
				this._addTag(this.state.tag);

				this.setState({
					tag: {},
					value: ''
				});
			} else if (this.state.value !== '') {
				//vanilla search term
				//if a contains search is being done, display only the right handside value in the tag (but keep the full search term in the search property)
				const seperator = this.state.value.indexOf(':') > -1 ? ':' : (this.state.value.indexOf('=') > -1 ? '=' : '');

				this._addTag({
					name: (seperator === '' ? this.state.value : this.state.value.split(seperator)[1]).replace(/"/g, ''),
					search: this.state.value
				});

				this.setState({ value: '' });
			}
		}
	}

	onChange (event, { newValue, method }) {   
		this.setState({ value: newValue });

		this.props.onChange(newValue);
	}

	onSuggestionsUpdateRequested ({ value }) {
		this.setState({ suggestions: getSuggestions(value) });
	}

	render () {
		if (this.state !== null) {
			let { tags, onTagsChange, addKeys, removeKeys, ...other} = this.props;

			const { value, suggestions, tag } = this.state;
			const inputProps = {
				placeholder: 'Add tags and then search...',
				value,
				onChange: this.onChange.bind(this),
				onKeyDown: this.onKeyDown.bind(this)
			};

			let tagComponents = tags.length > 0 ?
				renderLayout(tags.map((tag, index) => {
					return renderTag({key: index, tag, onRemove: this.handleRemove.bind(this), className: 'react-tagsinput-tag', removeClassName: 'react-tagsinput-remove'});
				})) : '';

			return (
					<div key='autosuggest-region'className={'animated flipInX'}>

									<Autosuggest
										key='goldfish-autosuggest'
										multiSection={true}
										suggestions={suggestions}
										onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested.bind(this)}
										getSuggestionValue={this.getSuggestionValue.bind(this)}
										renderSuggestion={renderSuggestion.bind(this)}
										renderSectionTitle={renderSectionTitle.bind(this)}
										getSectionSuggestions={getSectionSuggestions.bind(this)}
										inputProps={inputProps} />
									<div ref='div' onClick={this.handleClick.bind(this)} {...other}>
											{tagComponents}
									</div>
									{this.renderSearchButton()}

					</div>
			);
		} else {
			this.componentDidUpdate();
		}
	}
}

export default cssModules(Suggest, styles, { allowMultiple: true });
