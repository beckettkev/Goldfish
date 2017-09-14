export interface IAutosuggestContainerProps {
    multiSection?: boolean,
    shouldRenderSuggestions?: Function,
    suggestions?: Array<any>,
    onSuggestionsUpdateRequested?: Function,
    getSuggestionValue?: Function,
    renderSuggestion?: Function,
    inputProps?: any,
    renderSectionTitle?: Function,
    getSectionSuggestions?: Function,
    onSuggestionSelected?: Function,
    focusInputOnSuggestionClick?: boolean,
    theme?: any,
    id?: string,
    className?: string
}

export interface IAutosuggestContainerState {
    isFocused?: boolean,
    isCollapsed?: boolean,
    focusedSectionIndex?: number,
    focusedSuggestionIndex?: number,
    valueBeforeUpDown?: any,
    lastAction?: any
}
