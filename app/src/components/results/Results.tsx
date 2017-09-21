/// <reference path="./../../globals.d.ts"/>

import * as React from 'react';
import * as styles from './Results.css';
import Person from '../person/Person';
import Button from '../../ui/Button';
import ProgressBar from '../../ui/ProgressBar';

import { IResultsProps, IResultsState } from './IResults';

class Results extends React.Component<IResultsProps, IResultsState> {
  constructor(props:IResultsProps) {
    super(props);
  }

  onFavourite(items:Array<any>):void {
    // This function is called a favourite action is made from the favourite component to push it through to the person results (add or remove), user profile and local cache
    this.props.onFavouritesChange(items);
  }

  onItemUpdate(index:number, favourites:Array<any>, isFavourite:boolean):void {
    // This function is called when a favourite action is made from within the person result item to push it through to the favourites, user profile and local cache (add or remove)
    this.props.onItemUpdate(index, isFavourite, 'person');
  }

  createEmptyResultsMessage():JSX.Element {
    if (this.props.items.length === 0 && !this.props.searching && this.props.term !== '') {
      return (
        <p key={'no-results-message'}>
          Incorrect item in the bagging area. Try searching with the name of someone who exists in your organisation.
        </p>
      );
    }
  }

  getPersonCardHeightFromLayoutCurrent():any {
    // Ensures that all of the person cards are the same height regardless of what data is available for the given person (necessary for horizontal view)
    const offset:number = this.props.layout.current.length > 3 ? ((this.props.layout.current.length - 3) * 21) : 0;

    return { height: (124 + offset) + 'px' };
  }

  createItem(item:any, i:number):JSX.Element {
    // This function gets called for every search result and renders a person component
    return (
      <div className={`${styles.itemContainer} ms-slideDownIn10 person-card ms-Grid-row`} key={'result-item-' + i}>
        <div className={`${styles.resultsItems} item ms-bgc-w ms-bcl-nl o365cs-notifications-message`}>
          <Person
            data={item}
            layout={this.props.layout}
            favourites={this.props.favourites}
            refresh={this.props.refresh}
            onFavouritesChange={this.onFavourite.bind(this)}
            onItemUpdate={this.onItemUpdate.bind(this)}
            id={`${i}`} />
        </div>
      </div>
    );
  }

  progressSpinner():JSX.Element {
    // fetching results - please wait.... please wait....
    if (this.props.searching) {
      return (
        <div className={styles.progressSpinner} key="progress-spinner">
          <ProgressBar
            type="circular"
            mode="indeterminate"
            multicolor />
        </div>
      );
    }
  }

  public render():JSX.Element {
    return (
      <div id="component-results" className={`${styles.resultsContainer} o365-NFP-section`}>
        <div className={styles.results + ' ms-Grid person-card-holder'}>
          {this.props.items.map(this.createItem.bind(this))}
        </div>
        {this.progressSpinner()}
        {this.createEmptyResultsMessage()}
      </div>
    );
  }
}

export default Results;
