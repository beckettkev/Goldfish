import React from 'react';
import styles from './Results.css';
import cssModules from 'react-css-modules';
import Person from '../person/Person.jsx';
import Button from '../../ui/Button.jsx';
import ProgressBar from '../../ui/ProgressBar.jsx';

class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  onFavourite(items) {
    // This function is called a favourite action is made from the favourite component to push it through to the person results (add or remove), user profile and local cache
    this.props.onFavouritesChange(items);
  }

  onItemUpdate(index, favourites, isFavourite) {
    // This function is called when a favourite action is made from within the person result item to push it through to the favourites, user profile and local cache (add or remove)
    this.props.onItemUpdate(index, isFavourite, 'person');
  }

  createEmptyResultsMessage() {
    if (this.props.items.length === 0 && !this.props.searching && this.props.term !== '') {
      return (
        <p key={'no-results-message'}>
          Incorrect item in the bagging area. Try searching with the name of someone who exists in your organisation.
        </p>
      );
    }
  }

  getPersonCardHeightFromLayoutCurrent() {
    // Ensures that all of the person cards are the same height regardless of what data is available for the given person (necessary for horizontal view)
    const offset = this.props.layout.current.length > 3 ? ((this.props.layout.current.length - 3) * 21) : 0;

    return { height: (124 + offset) + 'px' };
  }

  createItem(item, i) {
    // This function gets called for every search result and renders a person component
    return (
      <div styleName="item-container" className="animated flipInX person-card" key={'result-item-' + i} style={this.getPersonCardHeightFromLayoutCurrent()}>
        <div className="item ms-bgc-w ms-bcl-nl o365cs-notifications-message" styleName="results-items">
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
  }

  progressSpinner() {
    // fetching results - please wait.... please wait....
    if (this.props.searching) {
      return (
        <div styleName="progress-spinner" key="progress-spinner">
          <ProgressBar
            type="circular"
            mode="indeterminate"
            multicolor />
        </div>
      );
    }
  }

  render() {
    return (
      <div id="component-results" className="o365-NFP-section" styleName="results-container">
        <div className="o365cs-notifications-notificationsContent person-card-holder" styleName="results">
          {this.props.items.map(this.createItem.bind(this))}
        </div>
        {this.progressSpinner()}
        {this.createEmptyResultsMessage()}
      </div>
    );
  }
}

Results.propTypes = {
  refresh: React.PropTypes.bool,
  term: React.PropTypes.string,
  items: React.PropTypes.array,
  layout: React.PropTypes.object,
  favourites: React.PropTypes.array,
  searching: React.PropTypes.bool,
  onItemUpdate: React.PropTypes.func,
  onFavouritesChange: React.PropTypes.func,
};

export default cssModules(Results, styles, { allowMultiple: true });
