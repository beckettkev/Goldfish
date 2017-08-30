import * as React  from 'react';
import * as styles from './Menu.css';
import MenuManager from '../../utils/menu';

import { IMenuProps, IMenuState } from './IMenu';

class Menu extends React.Component<IMenuProps, IMenuState> {

  constructor(props:IMenuProps) {
    super(props);
  }

  // All menu actions are routed through here.
  itemAction(value:string, field:any):void {
    switch (typeof field === 'string' ? field : value) {
    case 'Layout':
      MenuManager.loadLayoutComponent();
      break;
    case 'Favourites':
      MenuManager.loadFavouritesComponent();
      break;
    case 'Search':
      MenuManager.loadSearchComponent();
      break;
    case 'Settings':
      MenuManager.loadSettingsComponent();
      break;
    case 'Export':
      this.props.onExport();
      break;
    case 'Close':
      MenuManager.closePeopleSearch();
      break;
    default:
      // no default action
      break;
    }
  }

  public render():JSX.Element {
    return (
      <div key="menu-items" id="menu-items">
        <div key="component-tabs" id="component-tabs" className={`${styles.componentTabs} ${this.props.alternate}`}>
          <div id="component-tab-search" className="tab active">
            <i className="material-icons" onClick={this.itemAction.bind(this, 'Search')} title="Goldfish Search">search</i>
          </div>
          <div id="component-tab-favourites" className="tab">
            <i className="material-icons" onClick={this.itemAction.bind(this, 'Favourites')} title="Goldfish Favourites">star</i>
          </div>
          <div id="component-tab-layouts" className="tab">
            <i className="material-icons" onClick={this.itemAction.bind(this, 'Layout')} title="Goldfish Layout">view_list</i>
          </div>
          <div id="component-tab-settings" className="tab last">
            <i className="material-icons" onClick={this.itemAction.bind(this, 'Settings')} title="Goldfish Settings">settings</i>
          </div>
        </div>
        <div key="close-control" id="close-control" className="tab closer">
          <i className="material-icons" onClick={this.itemAction.bind(this, 'Close')} title="Close">cancel</i>
        </div>
      </div>
    );
  }
}

export default Menu;
