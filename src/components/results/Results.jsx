import React from 'react';
import styles from './Results.css';
import cssModules from 'react-css-modules';
import Person from '../person/Person.jsx';
import ProgressBar from 'react-toolbox/lib/progress_bar';

const Results = React.createClass({

	propTypes: {
			term: React.PropTypes.string,
			items: React.PropTypes.array,
			layout: React.PropTypes.object,
			favourites: React.PropTypes.array,
			searching: React.PropTypes.bool,
			onItemUpdate: React.PropTypes.func,
			onFavouritesChange: React.PropTypes.func
	},

	onFavourite (items) {
			//This function is called a favourite action is made from the favourite component to push it through to the person results (add or remove), user profile and local cache
			this.props.onFavouritesChange(items);
	},

	onItemUpdate (index, favourites, isFavourite) {
			//This function is called when a favourite action is made from within the person result item to push it through to the favourites, user profile and local cache (add or remove)
			this.props.onItemUpdate(index, isFavourite, 'person');
	},

	createEmptyResultsMessage () {
			if (this.props.items.length === 0 && !this.props.searching && this.props.term !== '') {
				return (
					<p key={'no-results-message'}>Incorrect item in the bagging area. Try searching with the name of someone who exists in your organisation.</p>
				);
			}
	},

	createItem (item, i) {
			//This function gets called for every search result and renders a person component
			return (
					<div styleName={'item-container'} key={'result-item-' + i}>
							<div className={'item ms-bgc-w ms-bcl-nl o365cs-notifications-message'} style={this.itemStyles} styleName='results-items'>
									<Person
										data={item}
										layout={this.props.layout}
										favourites={this.props.favourites}
										refresh={this.props.refresh}
										onFavouritesChange={this.onFavourite.bind(this)}
										onItemUpdate={this.onItemUpdate.bind(this)}
										id={i} />
							</div>
					</div>
			);
	},

	progressSpinner () {
			//fetching results - please wait.... please wait....
			if (this.props.searching) {
					return(
							<div styleName='progress-spinner' key={'progress-spinner'}>
									<ProgressBar
										type='circular'
										mode='indeterminate'
										multicolor />
							</div>
					);
			}
	},

	getCommandButtonsAvailable (current) {
			//This function is used to see if the result layout being used to render the data contains any command buttons
			return current.some(function (el) {
				return el.label === 'Documents' || el.label === 'Everything' || el.label === 'Export to Outlook' || el.label === 'Yammer';
			});
	},

	render () {
			this.itemStyles = this.getCommandButtonsAvailable(this.props.layout.current) ? { paddingBottom: '50px' } : { paddingBottom: '0' };

			return (
				<div id={'component-results'} className={'o365-NFP-section'} styleName='results-container'>
						<div className={'o365cs-notifications-notificationsContent'} styleName='results'>
								{this.props.items.map(this.createItem.bind(this))}
						</div>
						{this.progressSpinner()}
						{this.createEmptyResultsMessage()}
				</div>
			);
	}
});

export default cssModules(Results, styles, { allowMultiple: true });
