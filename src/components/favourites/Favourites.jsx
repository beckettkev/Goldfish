import React from 'react';
import styles from './Favourites.css';
import cssModules from 'react-css-modules';
import Favourite from '../person/Person.jsx';
import Title from '../title/Title.jsx';
import {SortableItems, SortableItem} from 'react-sortable-component';
import FavouriteStore from '../../stores/FavouriteStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';

function getStoreFavouriteState () {
	return {
		favourites: FavouriteStore.getCurrentFavourites()
	};
}

class Favourites extends React.Component {

	static propTypes: {
		onFavouritesChange: React.PropTypes.func,
		onItemUpdate: React.PropTypes.func,
		layout: React.PropTypes.object,
		favourites: React.PropTypes.array
	};

	constructor (props) {
		super(props);

		PeopleSearchActions.getFavourites();

		this.state = getStoreFavouriteState();
	}

	componentDidMount () {
		FavouriteStore.addChangeListener(this.onFavourite.bind(this));
	}

	componentWillMount () {
		FavouriteStore.removeChangeListener(this.onFavourite);
	}

	handleFavouriteSort (favourites) {
		PeopleSearchActions.updateFavourites(
			favourites
		);
	}

	onFavourite () {
		const pinned = getStoreFavouriteState();

		this.props.onFavouritesChange(pinned.favourites);
	}

	onItemUpdate (index, favourites, isFavourite) {
		index = parseInt(index.slice(1));

		this.props.onItemUpdate(index, isFavourite, 'favourite');
	}

	createDraggablePinItem (item, i) {
		return (
			<SortableItem key={item.name}>
				<div styleName={'sortable-item-content'} style={this.itemStyles}>
					<Favourite
							data={item}
							layout={this.props.layout}
							favourites={this.props.favourites}
							onFavouritesChange={this.onFavourite.bind(this)}
							onItemUpdate={this.onItemUpdate.bind(this)}
							id={'f' + i} />
				</div>
			</SortableItem>
		);
	}

	createEmptyResultsMessage (count) {
		if (count === 0) {
			return (
				<p key={'no-favourites'}>
					Well this is embarrassing, you do not seem to have any friends. <br /><br />Favourite some people now before anyone notices.
				</p>
			);
		}
	}

	getCommandButtonsAvailable (current) {
		return current.some(function (el) {
			return el.label === 'Documents' || el.label === 'Everything' || el.label === 'Export to Outlook' || el.label === 'Yammer';
		});
	}

	getFavouritesHolder () {
		if (this.props.favourites.length > 0) {
			return (
				<div key={'sortable-favourite-container'} styleName={'sortable-favourite-container'}>
					<SortableItems
						name='sort-favourites'
						items={this.props.favourites}
						onSort={this.handleFavouriteSort}>

								{this.props.favourites.map(this.createDraggablePinItem.bind(this))}

					</SortableItems>
				</div>
			);
		}
	}

	render () {
		const favouritesComponentStyles = {
				display: 'none !important'
		};

		this.itemStyles = this.getCommandButtonsAvailable(this.props.layout.current) ? { paddingBottom: '50px' } : { paddingBottom: '0' };

		return (
			<div key={'favourites-manager'} id={'component-favourites'} styleName={'component'} style={favouritesComponentStyles}>
				<div styleName='container'>
					<Title 
						text={this.props.title} 
						suffix='Favourites' />
				</div>
				<div className={'content'}>
						{this.getFavouritesHolder()}

						{this.createEmptyResultsMessage(this.props.favourites.length)}

				</div>
			</div>
		);
	}

}

export default cssModules(Favourites, styles, { allowMultiple: true });
