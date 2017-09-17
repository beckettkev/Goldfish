//https://github.com/reactjs/react-autocomplete/blob/master/LICENSE
/// <reference path="./../../../globals.d.ts"/>

import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducerAndActions';
import AutoSuggest from './AutoSuggest';

import { IAutosuggestContainerProps, IAutosuggestContainerState} from './IAutosuggestContainer';

function noop() {}

const defaultTheme:any = {
	container: 'react-autosuggest__container',
	containerOpen: 'react-autosuggest__container--open',
	input: 'react-autosuggest__input',
	suggestionsContainer: 'react-autosuggest__suggestions-container',
	suggestion: 'react-autosuggest__suggestion',
	suggestionFocused: 'react-autosuggest__suggestion--focused',
	sectionContainer: 'react-autosuggest__section-container',
	sectionTitle: 'react-autosuggest__section-title',
	sectionSuggestionsContainer: 'react-autosuggest__section-suggestions-container'
};

function mapToAutowhateverTheme(theme:any):any {
	let result:any = {};

	for (const key in theme) {
		switch (key) {
			case 'suggestionsContainer':
				result['itemsContainer'] = theme[key];
				break;

			case 'suggestion':
				result['item'] = theme[key];
				break;

			case 'suggestionFocused':
				result['itemFocused'] = theme[key];
				break;

			case 'sectionSuggestionsContainer':
				result['sectionItemsContainer'] = theme[key];
				break;

			default:
				result[key] = theme[key];
		}
	}

	return result;
}

export default class AutosuggestContainer extends React.Component<IAutosuggestContainerProps, IAutosuggestContainerState> {
	store: any;

	input: any;
	
	static defaultProps = {
		onSuggestionsUpdateRequested: noop,
		shouldRenderSuggestions: (value:string) => value.trim().length > 0,
		onSuggestionSelected: noop,
		multiSection: false,
		renderSectionTitle() {
			throw new Error('`renderSectionTitle` must be provided');
		},
		getSectionSuggestions() {
			throw new Error('`getSectionSuggestions` must be provided');
		},
		focusInputOnSuggestionClick: true,
		theme: defaultTheme,
		id: '1'
	};

	constructor() {
		super();

		this.store = createStore(reducer, {
			isFocused: false,
			isCollapsed: true,
			focusedSectionIndex: null,
			focusedSuggestionIndex: null,
			valueBeforeUpDown: null,
			lastAction: null
		});

		this.saveInput = this.saveInput.bind(this);
	}

	saveInput(input:any) {
		this.input = input;
	}

	render() {
		const {
			multiSection, suggestions,
			onSuggestionsUpdateRequested, getSuggestionValue, renderSuggestion,
			renderSectionTitle, getSectionSuggestions, inputProps,
			onSuggestionSelected, focusInputOnSuggestionClick, theme, id
		} = this.props;

		return (
			<Provider store={this.store}>
				<AutoSuggest
					theme={mapToAutowhateverTheme(theme)}
					id={id}
					focusInputOnSuggestionClick={focusInputOnSuggestionClick}
					onSuggestionSelected={onSuggestionSelected}
					inputProps={inputProps}
					getSectionSuggestions={getSectionSuggestions}
					renderSectionTitle={renderSectionTitle}
					renderSuggestion={renderSuggestion}
					getSuggestionValue={getSuggestionValue}
					onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
					suggestions={suggestions}
					multiSection={multiSection}
					inputRef={this.saveInput} />
			</Provider>
		);
	}
}