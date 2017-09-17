//https://github.com/moroshko/react-autosuggest/blob/master/LICENSE
/// <reference path="./../../../globals.d.ts"/>

import * as React from 'react';
import { inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
				 revealSuggestions, closeSuggestions } from './reducerAndActions';
import { IAutoSuggestProps } from './IAutoSuggest';
import connectedComponentHelper from './ReduxConnect';
import Autowhatever from 'react-autowhatever';

function mapStateToProps(state:any):IAutoSuggestProps {
	return {
		isFocused: state.isFocused,
		isCollapsed: state.isCollapsed,
		focusedSectionIndex: state.focusedSectionIndex,
		focusedSuggestionIndex: state.focusedSuggestionIndex,
		valueBeforeUpDown: state.valueBeforeUpDown,
		lastAction: state.lastAction
	};
}

function mapDispatchToProps(dispatch:any):any {
	return {
		inputFocused: (shouldRenderSuggestions:boolean):void => {
			dispatch(inputFocused(shouldRenderSuggestions));
		},
		inputBlurred: ():void => {
			dispatch(inputBlurred());
		},
		inputChanged: (shouldRenderSuggestions:boolean, lastAction:any):void => {
			dispatch(inputChanged(shouldRenderSuggestions, lastAction));
		},
		updateFocusedSuggestion: (sectionIndex:number, suggestionIndex:number, value:any):void => {
			dispatch(updateFocusedSuggestion(sectionIndex, suggestionIndex, value));
		},
		revealSuggestions: ():void => {
			dispatch(revealSuggestions());
		},
		closeSuggestions: (lastAction:any):void => {
			dispatch(closeSuggestions(lastAction));
		}
	};
}

const { propsGeneric, connect } = connectedComponentHelper<IAutoSuggestProps>()(mapStateToProps, mapDispatchToProps);
type ComponentProps = typeof propsGeneric;

class AutoSuggest extends React.Component<ComponentProps, any> {
	input: any;

	justClickedOnSuggestion: boolean;

	onBlurEvent: Function;

	constructor(props:IAutoSuggestProps) {
		super(props);

		this.saveInput = this.saveInput.bind(this);
	}

	componentWillReceiveProps(nextProps:IAutoSuggestProps) {
		if (nextProps.suggestions !== this.props.suggestions) {
			const { suggestions, inputProps, shouldRenderSuggestions,
							isCollapsed, revealSuggestions, lastAction } = nextProps;
			const { value } = inputProps;

			if (isCollapsed && lastAction !== 'click' && lastAction !== 'enter' &&
					suggestions.length > 0 && shouldRenderSuggestions(value)) {
						revealSuggestions();
			}
		}
	}

	getSuggestion(sectionIndex:number, suggestionIndex:number):any {
		const { suggestions, multiSection, getSectionSuggestions } = this.props;

		if (multiSection) {
			return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
		}

		return suggestions[suggestionIndex];
	}

	getFocusedSuggestion():any {
		const { focusedSectionIndex, focusedSuggestionIndex } = this.props;

		if (focusedSuggestionIndex === null) {
			return null;
		}

		return this.getSuggestion(focusedSectionIndex, focusedSuggestionIndex);
	}

	getSuggestionValueByIndex(sectionIndex:number, suggestionIndex:number, event:any):any {
		const { getSuggestionValue } = this.props;

		return getSuggestionValue(this.getSuggestion(sectionIndex, suggestionIndex), event);
	}

	getSuggestionIndices(suggestionElement:any):any {
		const sectionIndex:string = suggestionElement.getAttribute('data-section-index');
		const suggestionIndex:string = suggestionElement.getAttribute('data-suggestion-index');

		return {
			sectionIndex: (typeof sectionIndex === 'string' ? parseInt(sectionIndex, 10) : null),
			suggestionIndex: parseInt(suggestionIndex, 10)
		};
	}

	findSuggestionElement(startNode:any) {
		let node:any = startNode;

		do {
			if (node.getAttribute('data-suggestion-index') !== null) {
				return node;
			}

			node = node.parentNode;
		} while (node !== null);

		console.error('Clicked element:', startNode); // eslint-disable-line no-console
		throw new Error('Couldn\'t find suggestion element');
	}

	maybeEmitOnChange(event:any, newValue:any, method:any):void {
		const { value, onChange } = this.props.inputProps;

		if (newValue !== value) {
			onChange && onChange(event, { newValue, method });
		}
	}

	willRenderSuggestions():boolean {
		const { suggestions, inputProps, shouldRenderSuggestions } = this.props;
		const { value } = inputProps;

		return suggestions.length > 0 && shouldRenderSuggestions(value);
	}

	saveInput(autowhatever:any):void {
		if (autowhatever !== null) {
			const input = autowhatever.refs.input;

			this.input = input;
			this.props.inputRef(input);
		}
	}

	render() {
				const {
					suggestions, onSuggestionsUpdateRequested, renderSuggestion, inputProps,
					shouldRenderSuggestions, onSuggestionSelected, multiSection,
					renderSectionTitle, id, getSectionSuggestions, focusInputOnSuggestionClick,
					theme, isFocused, isCollapsed, focusedSectionIndex, focusedSuggestionIndex,
					valueBeforeUpDown, inputFocused, inputBlurred, inputChanged,
					updateFocusedSuggestion, revealSuggestions, closeSuggestions
				} = this.props;
				const { value, onBlur, onFocus, onKeyDown } = inputProps;
				const isOpen:boolean = isFocused && !isCollapsed && this.willRenderSuggestions();
				const items:any = (isOpen ? suggestions : []);
				const autowhateverInputProps:any = {
					...inputProps,
					onFocus: (event:any) => {
						if (!this.justClickedOnSuggestion) {
							inputFocused(shouldRenderSuggestions(value));
							onFocus && onFocus(event);
						}
					},
					onBlur: (event:any) => {
						this.onBlurEvent = event;

						if (!this.justClickedOnSuggestion) {
							inputBlurred();
							onBlur && onBlur(event);

							if (valueBeforeUpDown !== null && value !== valueBeforeUpDown) {
								onSuggestionsUpdateRequested({ value, reason: 'blur' });
							}
						}
					},
					onChange: (event:any) => {
						const { value } = event.target;
						const { shouldRenderSuggestions, onSuggestionsUpdateRequested } = this.props;

						this.maybeEmitOnChange(event, value, 'type');
						inputChanged(shouldRenderSuggestions(value), 'type');
						onSuggestionsUpdateRequested({ value, reason: 'type' });
					},
					onKeyDown: (event:any, data:any) => {
						switch (event.key) {
							case 'ArrowDown':
							case 'ArrowUp':
								if (isCollapsed) {
									if (this.willRenderSuggestions()) {
										revealSuggestions();
									}
								} else if (suggestions.length > 0) {
									const { newFocusedSectionIndex, newFocusedItemIndex } = data;
									const newValue = newFocusedItemIndex === null ?
										valueBeforeUpDown :
										this.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex, event);

									updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, value);
									this.maybeEmitOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
								}
								event.preventDefault();
								break;

							case 'Enter': {
								const focusedSuggestion = this.getFocusedSuggestion();

								if (focusedSuggestion !== null) {
									closeSuggestions('enter');
									onSuggestionSelected(event, {
										suggestion: focusedSuggestion,
										suggestionValue: value,
										method: 'enter'
									});
									onSuggestionsUpdateRequested({ value, reason: 'enter' });
								}
								break;
							}

							case 'Escape':
								if (isOpen) {
									// If input.type === 'search', the browser clears the input
									// when Escape is pressed. We want to disable this default
									// behaviour so that, when suggestions are shown, we just hide
									// them, without clearing the input.
									event.preventDefault();
								}

								if (valueBeforeUpDown === null) { // Didn't interact with Up/Down
									if (!isOpen) {
										this.maybeEmitOnChange(event, '', 'escape');
										onSuggestionsUpdateRequested({ value: '', reason: 'escape' });
									}
								} else { // Interacted with Up/Down
									this.maybeEmitOnChange(event, valueBeforeUpDown, 'escape');
								}

								closeSuggestions('escape');
								break;
						}

						onKeyDown && onKeyDown(event);
					}
				};
				const onMouseEnter = (event:any, item:any):void => {
					updateFocusedSuggestion(item.sectionIndex, item.itemIndex);
				};
				const onMouseLeave = ():void => {
					updateFocusedSuggestion(null, null);
				};
				const onMouseDown = ():void => {
					this.justClickedOnSuggestion = true;
				};
				const onClick = (event:any):void => {
					const { sectionIndex, suggestionIndex } =
						this.getSuggestionIndices(this.findSuggestionElement(event.target));
					const clickedSuggestion:any = this.getSuggestion(sectionIndex, suggestionIndex);
					const clickedSuggestionValue:any = this.props.getSuggestionValue(clickedSuggestion, event);

					this.maybeEmitOnChange(event, clickedSuggestionValue, 'click');

					onSuggestionSelected(event, {
						suggestion: clickedSuggestion,
						suggestionValue: clickedSuggestionValue,
						method: 'click'
					});
					closeSuggestions('click');

					if (focusInputOnSuggestionClick === true) {
						this.input.focus();
					} else {
						inputBlurred();
						onBlur && onBlur(this.onBlurEvent);
					}

					onSuggestionsUpdateRequested({ value: clickedSuggestionValue, reason: 'click' });

					this.justClickedOnSuggestion = false;
				};
				const itemProps = (item:any):any => {
					return {
						'data-section-index': item.sectionIndex,
						'data-suggestion-index': item.itemIndex,
						onMouseEnter,
						onMouseLeave,
						onMouseDown,
						onTouchStart: onMouseDown, // Because on iOS `onMouseDown` is not triggered
						onClick
					};
				};
				const renderItem = (item:any) => renderSuggestion(item, { value, valueBeforeUpDown });

				return (
					<Autowhatever 
						multiSection={multiSection}
						items={items}
						renderItem={renderItem}
						renderSectionTitle={renderSectionTitle}
						getSectionItems={getSectionSuggestions}
						focusedSectionIndex={focusedSectionIndex}
						focusedItemIndex={focusedSuggestionIndex}
						inputProps={autowhateverInputProps}
						itemProps={itemProps}
						theme={theme}
						id={id}
						ref={this.saveInput} />
				);
	}
}

//export default connect(mapStateToProps, mapDispatchToProps)(AutoSuggest);
export default connect(AutoSuggest);