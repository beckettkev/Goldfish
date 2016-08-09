import React from 'react';
import styles from './Person.css';
import cssModules from 'react-css-modules';
import Persona from '../persona/Persona.jsx';
import Row from '../row/Row.jsx';
import FavouriteStore from '../../stores/FavouriteStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import Button from '../../ui/Button.jsx';
import FileSaver from '../../data/filesaver';
import Exporter from '../../utils/exporter';
import Defaults from '../../constants/default';

class Person extends React.Component {
  constructor(props) {
    super(props);
  }

  onOutlookExportCard(person) {
    const card = Exporter.getContactForExport(person);
    const blob = new Blob([card.data], {type: 'text/x-vcard;charset=iso-8859-1'});

    FileSaver.saveAs(blob, card.name + '.vcf');
  }

  onFavouritesChange() {
    this.props.onFavouritesChange({
      favourites: FavouriteStore.getCurrentFavourites(),
    });
  }

  onSearchByManagedProperty(name, mp) {
    window.location.href = window.location.protocol + '//' + window.location.host + '/search/Pages/results.aspx?k=' + mp + name;
  }

  onYammerSearch(name) {
    window.location.href = 'https://www.yammer.com/#/Threads/Search?search=' + name;
  }

  onFavouriteClick(person, action, index) {
    let favourites = this.props.favourites;

    if (action === 'add') {
      person.Cells.Favourite = true;

      favourites.push({
        name: person.Cells.PreferredName,
        data: person,
      });
    } else if (action === 'remove') {
      // remove the favourite
      favourites = favourites.filter(function(n) {
        return n.name !== person.Cells.PreferredName;
      });
    }

    // this updates the UI with the changes made to favourites either from search or the favourites screen.
    // if the index value is set to -1, this forces a fresh load from the cache.
    PeopleSearchActions.updateFavourites(favourites);

    this.props.onItemUpdate(index, favourites, action !== 'remove');
  }

  getFavouriteButton(person, index) {
    const current = this.isFavouriteButtonActive(person);
    const icon = current.pinned ? 'remove' : 'add';
    const bindClick = this.onFavouriteClick.bind(this, person.items, icon, index);

    // otherwise show the favourite pin button
    return (
      <div key={'item-favourite-button'} styleName={icon} className={icon}>
        <Button
          icon={icon}
          onClick={bindClick}
          floating accent mini
          disabled={current.disabled} />
      </div>
    );
  }

  getButton(key, icon, callback) {
    return (
      <span key={'command-' + key} styleName="command" className="commandor">
        <Button
          icon={icon}
          floating accent mini
          onClick={callback} />
      </span>
    );
  }

  getPerson(person, index) {
    // if we have layouts use that, otherwise use the defaults
    const layout = this.props.layout.current.length > 0 ? this.props.layout.current : Defaults.DEFAULT_CURRENT_LAYOUT;
    const card = this.information(person, layout);

    return (
      <div key={'item-details-' + index}>
        {this.personaImage(person, index)}
        {card}
        <div styleName="buttons">
          {this.everything(person, index)}
          {this.documents(person, index)}
          {this.yammer(person, index)}
          {this.exportOutlookCard(person, index)}
        </div>
      </div>
    );
  }

  information(person, layout) {
    // only output the fields chosen in the layout
    return [].concat(layout.map(function(element, index) {
      return (
        <Row
          key={'person-item-' + index}
          id={index}
          person={person}
          element={element} />
      );
    }));
  }

  // TODO refactor these common templates into a single method
  documents(person, key) {
    const click = this.onSearchByManagedProperty.bind(this, person.items.Cells.PreferredName, 'IsDocument:1 Author:');

    return this.getButton(`documents-${key}`, 'insert_drive_file', click);
  }

  // TODO refactor these common templates into a single method
  everything(person, key) {
    const click = this.onSearchByManagedProperty.bind(this, person.items.Cells.PreferredName, 'Author:');

    return this.getButton(`everything-${key}`, 'share', click);
  }

  yammer(person, key) {
    const click = this.onYammerSearch.bind(this, person.items.Cells.PreferredName);

    return this.getButton(`yammer-${key}`, 'comment', click);
  }

  exportOutlookCard(person, key) {
    const click = this.onOutlookExportCard.bind(this, person.items.Cells);

    return this.getButton(`outlook-${key}`, 'contact_mail', click);
  }

  personaImage(person, key) {
    const member = {
      name: person.items.Cells.PreferredName,
      loginName: `${Defaults.MEMBERSHIP_CLAIMS}${person.items.Cells.WorkEmail}`,
      email: person.items.Cells.WorkEmail,
    };

    return (
      <div key={key}>
        <Persona member={member} />
      </div>
    );
  }

  isFavouriteButtonActive(person) {
    let pinned = false;

    if (this.props.refresh) {
      // favourites have been changed on the favourite page - update the relevant button states
      const favourites = this.props.favourites;

      // checked to see if they have been pinned this as a favourite already
      pinned = favourites.length > 0 ? favourites.some(function(item) {
        return item.name === person.items.Cells.PreferredName;
      }) : false;
    } else {
      pinned = person.items.Cells.Favourite;
    }

    // active - check to see if button is for adding a favourite and the threshold has breached
    return {
      pinned: pinned,
      disabled: !pinned && (this.props.favourites.length > 10) ? true : false,
    };
  }

  render() {
    const person = {
      items: typeof this.props.data.data !== 'undefined' ? this.props.data.data : this.props.data,
      baseImageUrl: '/_layouts/15/userphoto.aspx?size=S&amp;accountname=',
    };

    return (
      <span key={'person-' + this.props.id} ref="person">
        {this.getFavouriteButton(person, this.props.id)}
        <div styleName="item">
          {this.getPerson(person, this.props.id)}
        </div>
      </span>
    );
  }
}

Person.propTypes = {
  id: React.PropTypes.string,
  data: React.PropTypes.object,
  favourites: React.PropTypes.array,
  layout: React.PropTypes.object,
  refresh: React.PropTypes.bool,
  onItemUpdate: React.PropTypes.func,
  onFavouritesChange: React.PropTypes.func,
};

export default cssModules(Person, styles, { allowMultiple: true });
