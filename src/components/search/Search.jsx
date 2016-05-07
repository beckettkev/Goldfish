import React from 'react';
import styles from './search.css';
import cssModules from 'react-css-modules';
import Suggest from '../suggest/Suggest.jsx';
import SearchStore from '../../stores/SearchStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import Utils from '../../utils/utilities';

function getStoreSearchResultState () {
	return {
		items: SearchStore.getResults(),
		searching: false,
		count: SearchStore.getResultCount(),
		pageNum: SearchStore.getCurrentPage(),
		term: SearchStore.getCurrentSearchTerm(),
		text: ''
	};
}

class Search extends React.Component {

	static propTypes: {
		settings: React.PropTypes.array,
		suggestions: React.PropTypes.array,
		onSearchChanged: React.PropTypes.func,
		onSearching: React.PropTypes.func
	};

	constructor (props) {
		super(props);

		this.state = { tags: [] };
	}

	componentDidUpdate () {
		if (this.state === null) {
			this.state = { tags: [] };
		}
	}

	componentDidMount () {
		SearchStore.addChangeListener(this.onComponentChange.bind(this));
	}

	componentWillMount () {
		SearchStore.removeChangeListener(this.onComponentChange);
	}

	onComponentChange () {
		this.props.onSearchChanged(getStoreSearchResultState());
	}

	onInputChange (name, value) {
		this.setState({ text: value });
	}

	handleChange (tags) {
		this.setState({tags});

		//a search has been commited so update with the new tag(s)
		//TODO: move this common function to somewhere central
		if (this.state.text.indexOf(':') > -1 && tags.length > 0) {
			const properties = typeof this.props.properties !== 'undefined' ? this.props.properties : '';

			const searchTerm = tags.map(function (tag) { return tag.search; }).join(' ');
			
			this.onInputChange(this, searchTerm);

			this.props.onSearching();

			PeopleSearchActions.fetchData(Utils.getFullSearchQueryUrl(searchTerm, properties), searchTerm, 0);
		} else if (tags.length === 0) {
			PeopleSearchActions.showNoResults();
		}
	}

	handleSubmit (e) {
		e.preventDefault();

		//invoke the search request
		this.searchForPeople();
	}

	onkeyDown (e) {
		const keyEvent = e || window.event;

		if (keyEvent.keyCode === 13) {
			keyEvent.preventDefault();

			this.searchForPeople();
		} else {
			this.setState({ text: keyEvent.target.value });

			return true;
		}
	}

	searchForPeople () {
		const properties = typeof this.props.properties !== 'undefined' ? this.props.properties : '';

		const url = Utils.getFullSearchQueryUrl(this.state.text, properties);

		this.props.onSearching();

		PeopleSearchActions.fetchData(url, this.state.text, 0);
	}

	getSimpleSearchInput () {
		return (
			<input
				key='search-input-basic'
				className={'animated flipInX'}
				type='text'
				placeholder='Search for a colleague...'
				onKeyDown={this.onkeyDown.bind(this)} />
		);
	}

	getSuggestSearchInput () {
		return (
			<Suggest
				key='search-input-super'
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

	searchInputSelector () {
		if (this.props.settings.length === 0) {
			//in the unlikely event of no settings being applied
			return(
				this.getSimpleSearchInput()
			);
		} else {
			//check to see if the super search is enabled
			const suggestEnabled = this.props.settings.some(function (el) {
						return Object.keys(el)[0] === 'enableSuperSearch' && el[Object.keys(el)[0]];
					});

			if (suggestEnabled) {
				return(this.getSuggestSearchInput());
			} else {
				return(this.getSimpleSearchInput());
			}
		}
	}

	render () {
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
}

export default cssModules(Search, styles, { allowMultiple: true });
