import React from 'react';
import styles from './Menu.css';
import cssModules from 'react-css-modules';
import MenuManager from '../../utils/menu';

class Menu extends React.Component {

  constructor(props) {
    super(props);
  }

  // All menu actions are routed through here.
  itemAction(value, field) {
    switch (typeof field === 'string' ? field : value) {
    case 'Layout':
      MenuManager.loadLayoutComponent(false);
      break;
    case 'Favourites':
      MenuManager.loadFavouritesComponent(false);
      break;
    case 'Search':
      MenuManager.loadSearchComponent(false);
      break;
    case 'Settings':
      MenuManager.loadSettingsComponent(false);
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

  render() {
    return (
      <div key="menu-items" id="menu-items">
        <div key="component-tabs" id="component-tabs" styleName={'component-tabs ' + this.props.alternate}>
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

Menu.propTypes = {
  view: React.PropTypes.string,
  onExport: React.PropTypes.func,
  alternate: React.PropTypes.string,
};

export default cssModules(Menu, styles, { allowMultiple: true });
