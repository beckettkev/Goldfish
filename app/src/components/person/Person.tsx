/// <reference path="./../../globals.d.ts"/>

import * as React  from 'react';
import * as styles from './Person.css';
import Persona from '../persona/Persona';
import Row from '../row/Row';
import FavouriteStore from '../../stores/FavouriteStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import * as FileSaver from '../../data/filesaver';
import Exporter from '../../utils/exporter';
import { DefaultConstants as Defaults } from '../../constants/default';

import { IPersonProps, IPersonState } from './IPerson';

class Person extends React.Component<IPersonProps, IPersonState> {
  constructor(props:IPersonProps) {
    super(props);
  }

  onOutlookExportCard(person:any):void {
    const card:any = Exporter.getContactForExport(person);
    const blob:Blob = new Blob([card.data], {type: 'text/x-vcard;charset=iso-8859-1'});

    FileSaver.saveAs(blob, card.name + '.vcf');
  }

  onFavouritesChange():void {
    this.props.onFavouritesChange({
      favourites: FavouriteStore.getCurrentFavourites(),
    });
  }

  onSearchByManagedProperty(name:string, mp:string):void {
    window.location.href = window.location.protocol + '//' + window.location.host + '/search/Pages/results.aspx?k=' + mp + name;
  }

  onYammerSearch(name:string):void {
    window.location.href = 'https://www.yammer.com/#/Threads/Search?search=' + name;
  }

  onFavouriteClick(person:any, action:string, index:string):void {
    let favourites:Array<any> = this.props.favourites;

    if (action === 'add') {
      person.Cells.Favourite = true;

      favourites.push({
        name: person.Cells.PreferredName,
        data: person,
      });
    } else if (action === 'remove') {
      // remove the favourite
      favourites = favourites.filter((n:any) => n.name !== person.Cells.PreferredName);
    }

    // this updates the UI with the changes made to favourites either from search or the favourites screen.
    // if the index value is set to -1, this forces a fresh load from the cache.
    PeopleSearchActions.updateFavourites(favourites);

    this.props.onItemUpdate(index, favourites, action !== 'remove');
  }

  getFavouriteButton(person:any, index:string):JSX.Element {
    const current:any = this.isFavouriteButtonActive(person);
    const icon:string = current.pinned ? styles.remove : styles.add;
    const bindClick:any = this.onFavouriteClick.bind(this, person.items, icon, index);

    // otherwise show the favourite pin button
    return (
      <div key={'item-favourite-button'} className={icon}>
        <IconButton
            onClick={bindClick}
            iconProps={
              { 
                iconName: current.pinned ? 'Remove' : 'Add' 
              } 
            }
            title={current.pinned ? 'Remove' : 'Add'}
            disabled={current.disabled} />
      </div>
    );
  }

  getButton(key:string, icon:string, callback: any):JSX.Element {
    return (
      <span key={'command-' + key} className={styles.command + ' commandor'}>
        <IconButton
          onClick={callback}
          iconProps={
            { 
              iconName: icon 
            } 
          }
          style={{
            backgroundColor: '#ffffff !important',
            border: 0
          }} />
      </span>
    );
  }

  getPerson(person:any, index:string):JSX.Element {
    // if we have layouts use that, otherwise use the defaults
    const layout:Array<any> = this.props.layout.current.length > 0 ? this.props.layout.current : Defaults.DEFAULT_CURRENT_LAYOUT;
    const card:any = this.information(person, layout);

    return (
      <div className="ms-PersonaCard ms-PersonaCard--busy" style={{float:'left'}}>
        <div className="ms-PersonaCard-persona">
          <div className="ms-Persona">
              {this.personaImage(person, index)}
          </div>
          <div className="ms-Persona-details">
            {card}
          </div>
        </div>
        <ul className={`ms-PersonaCard-actions ${styles.personaAction}`}>
          <li id="search-everything" className="ms-PersonaCard-action" style={{padding:0}}>
            {this.everything(person, index)}
          </li>
          <li id="search-documents" className="ms-PersonaCard-action" style={{padding:0}}>
            {this.documents(person, index)}
          </li>
          <li id="search-yammer" className="ms-PersonaCard-action" style={{padding:0}}>
            {this.yammer(person, index)}
          </li>
          <li id="export-contact" className="ms-PersonaCard-action" style={{padding:0}}>
            {this.exportOutlookCard(person, index)}
          </li>
        </ul>
       </div>
      );
  }

  information(person:any, layout:Array<any>):Array<JSX.Element> {
    // only output the fields chosen in the layout
    return [].concat(
              layout.map((element:any, index:number):JSX.Element =>
                <Row
                  key={'person-item-' + index}
                  id={index}
                  person={person}
                  element={element} />              
           )
    );
  }

  // TODO refactor these common templates into a single method
  documents(person:any, key:string):JSX.Element {
    const click:Function = this.onSearchByManagedProperty.bind(this, person.items.Cells.PreferredName, 'IsDocument:1 Author:');

    return this.getButton(`documents-${key}`, 'DocumentSearch', click);
  }

  // TODO refactor these common templates into a single method
  everything(person:any, key:string):JSX.Element {
    const click:Function = this.onSearchByManagedProperty.bind(this, person.items.Cells.PreferredName, 'Author:');

    return this.getButton(`everything-${key}`, 'Search', click);
  }

  yammer(person:any, key:string):JSX.Element {
    const click:Function = this.onYammerSearch.bind(this, person.items.Cells.PreferredName);

    return this.getButton(`yammer-${key}`, 'YammerLogo', click);
  }

  exportOutlookCard(person:any, key:string):JSX.Element {
    const click:Function = this.onOutlookExportCard.bind(this, person.items.Cells);

    return this.getButton(`outlook-${key}`, 'OutlookLogo', click);
  }

  personaImage(person:any, key:string):JSX.Element {
    const member:any = {
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

  isFavouriteButtonActive(person:any):any {
    let pinned:boolean = false;

    if (this.props.refresh) {
      // favourites have been changed on the favourite page - update the relevant button states
      const favourites:Array<any> = this.props.favourites;

      // checked to see if they have been pinned this as a favourite already
      pinned = favourites.length > 0 ? favourites.some((item) =>
        item.name === person.items.Cells.PreferredName
      ) : false;
    } else {
      pinned = person.items.Cells.Favourite;
    }

    // active - check to see if button is for adding a favourite and the threshold has breached
    return {
      pinned: pinned,
      disabled: !pinned && (this.props.favourites.length > 10) ? true : false,
    };
  }

  public render():JSX.Element {
    const person:any = {
      items: typeof this.props.data.data !== 'undefined' ? this.props.data.data : this.props.data,
      baseImageUrl: '/_layouts/15/userphoto.aspx?size=S&amp;accountname=',
    };

    return (
      <span key={'person-' + this.props.id} ref="person">
        <div className={styles.item}>
          {this.getPerson(person, `${this.props.id}`)}
        </div>
      </span>
    );
  }
}

export default Person;
