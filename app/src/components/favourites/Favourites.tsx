/// <reference path="./../../globals.d.ts"/>

import * as React  from 'react';
import * as styles from './Favourites.css';
import Favourite from '../person/Person';
import Title from '../title/Title';
import {SortableItems, SortableItem} from 'react-sortable-component';
import FavouriteStore from '../../stores/FavouriteStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';

import { IFavouritesProps, IFavouritesState } from "./IFavourites";

function getStoreFavouriteState():any {
  return {
    favourites: FavouriteStore.getCurrentFavourites(),
  };
}

class Favourites extends React.Component<IFavouritesProps, IFavouritesState> {
  constructor(props:IFavouritesProps) {
    super(props);

    PeopleSearchActions.getFavourites();

    this.state = getStoreFavouriteState();
  }

  componentWillMount():void {
    FavouriteStore.removeChangeListener(this.onFavourite);
  }

  componentDidMount():void {
    FavouriteStore.addChangeListener(this.onFavourite.bind(this));
  }

  onFavourite():void {
    const pinned:any = getStoreFavouriteState();

    this.props.onFavouritesChange(pinned.favourites);
  }

  onItemUpdate(index:string, favourites:any, isFavourite:boolean):void {
    const element:number = Number(index.slice(1));

    this.props.onItemUpdate(element, isFavourite, 'favourite');
  }

  getCommandButtonsAvailable(current:Array<any>):boolean {
    return current.some((el:any) => el.label === 'Documents' || el.label === 'Everything' || el.label === 'Export to Outlook' || el.label === 'Yammer');
  }

  getFavouritesHolder():JSX.Element {
    if (this.props.favourites.length > 0) {
      return (
        <div key="sortable-favourite-container" className={`${styles.sortableFavouriteContainer} ms-Grid`}>
          <SortableItems
            name="sort-favourites"
            className="ms-Grid-row"
            items={this.props.favourites}
            onSort={this.handleFavouriteSort}>
                {this.props.favourites.map(this.createDraggablePinItem.bind(this))}
          </SortableItems>
        </div>
      );
    }
  }

  createEmptyResultsMessage(count:number):JSX.Element {
    if (count === 0) {
      return (
        <p key="no-favourites" style={{margin:'0px 20px'}}>
          Well this is embarrassing, you do not seem to have any friends. <br /><br />Favourite some people now before anyone notices.
        </p>
      );
    }
  }

  getPersonCardHeightFromLayoutCurrent():any {
    // Ensures that all of the person cards are the same height regardless of what data is available for the given person (necessary for horizontal view)
    const offset:number = this.props.layout.current.length > 3 ? ((this.props.layout.current.length - 3) * 21) : 0;

    return { height: (124 + offset) + 'px' };
  }

  createDraggablePinItem(item:any, i:number):JSX.Element {
  const itemStyles:any = this.getCommandButtonsAvailable(this.props.layout.current) ? { paddingBottom: '50px'/*, height: this.getPersonCardHeightFromLayoutCurrent().height*/ } : { paddingBottom: '0'/*, height: this.getPersonCardHeightFromLayoutCurrent().height*/ };

    return (
      <SortableItem key={item.name}>
        <div className={styles.sortableItemContent} style={itemStyles}>
          <Favourite
              data={item}
              layout={this.props.layout}
              favourites={this.props.favourites}
              onFavouritesChange={this.onFavourite.bind(this)}
              onItemUpdate={this.onItemUpdate.bind(this)}
              id={`f${i}`} />
        </div>
      </SortableItem>
    );
  }

  handleFavouriteSort(favourites:any):void {
    PeopleSearchActions.updateFavourites(favourites);
  }

  public render():JSX.Element {
    const favouritesComponentStyles:any = {
      display: 'none !important',
      paddingTop: this.props.paddingTop,
    };

    return (
      <div key="favourites-manager" id="component-favourites" className="gf-component ms-Grid" style={favouritesComponentStyles}>
        <div className={`${styles.container}`}>
          <Title
            text={this.props.title}
            suffix="Favourites" />
        </div>
        <div className="content ms-font-s">
            {this.getFavouritesHolder()}

            {this.createEmptyResultsMessage(this.props.favourites.length)}
        </div>
      </div>
    );
  }
}

export default Favourites;