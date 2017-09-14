//https://github.com/reactjs/react-autocomplete/blob/master/LICENSE
const INPUT_FOCUSED: string = 'INPUT_FOCUSED';
const INPUT_BLURRED: string = 'INPUT_BLURRED';
const INPUT_CHANGED: string = 'INPUT_CHANGED';
const UPDATE_FOCUSED_SUGGESTION: string = 'UPDATE_FOCUSED_SUGGESTION';
const REVEAL_SUGGESTIONS: string = 'REVEAL_SUGGESTIONS';
const CLOSE_SUGGESTIONS: string = 'CLOSE_SUGGESTIONS';

export function inputFocused(shouldRenderSuggestions: boolean): any {
	return {
		type: INPUT_FOCUSED,
		shouldRenderSuggestions
	} as any;
}

export function inputBlurred(): any {
	return {
		type: INPUT_BLURRED
	};
}

export function inputChanged(shouldRenderSuggestions: boolean, lastAction: any): any {
	return {
		type: INPUT_CHANGED,
		shouldRenderSuggestions,
		lastAction
	} as any;
}

export function updateFocusedSuggestion(sectionIndex: number, suggestionIndex: number, value: any): any {
	return {
		type: UPDATE_FOCUSED_SUGGESTION,
		sectionIndex,
		suggestionIndex,
		value
	} as any;
}

export function revealSuggestions(): any {
	return {
		type: REVEAL_SUGGESTIONS
	} as any;
}

export function closeSuggestions(lastAction: any): any {
	return {
		type: CLOSE_SUGGESTIONS,
		lastAction
	} as any;
}

export default function reducer(state: any, action: any): any {
	switch (action.type) {
		case INPUT_FOCUSED:
			return {
				...state,
				isFocused: true,
				isCollapsed: !action.shouldRenderSuggestions
			};

		case INPUT_BLURRED:
			return {
				...state,
				isFocused: false,
				focusedSectionIndex: null,
				focusedSuggestionIndex: null,
				valueBeforeUpDown: null,
				isCollapsed: true
			};

		case INPUT_CHANGED:
			return {
				...state,
				focusedSectionIndex: null,
				focusedSuggestionIndex: null,
				valueBeforeUpDown: null,
				isCollapsed: !action.shouldRenderSuggestions,
				lastAction: action.lastAction
			};

		case UPDATE_FOCUSED_SUGGESTION: {
			const { value, sectionIndex, suggestionIndex } = action;
			const valueBeforeUpDown: any =
				state.valueBeforeUpDown === null && typeof value !== 'undefined'
					? value
					: state.valueBeforeUpDown;

			return {
				...state,
				focusedSectionIndex: sectionIndex,
				focusedSuggestionIndex: suggestionIndex,
				valueBeforeUpDown
			};
		}

		case REVEAL_SUGGESTIONS:
			return {
				...state,
				isCollapsed: false
			};

		case CLOSE_SUGGESTIONS:
			return {
				...state,
				focusedSectionIndex: null,
				focusedSuggestionIndex: null,
				valueBeforeUpDown: null,
				isCollapsed: true,
				lastAction: action.lastAction
			};

		default:
			return state;
	}
}