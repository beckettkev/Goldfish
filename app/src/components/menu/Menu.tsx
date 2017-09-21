/// <reference path="./../../globals.d.ts"/>

import * as React  from 'react';
import * as styles from './Menu.css';
//import MenuManager from '../../utils/menu';
import { DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu, ContextualMenuItemType, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import { getRTL } from 'office-ui-fabric-react/lib/Utilities';

import { IMenuProps, IMenuState } from './IMenu';

class Menu extends React.Component<IMenuProps, IMenuState> {

  constructor(props:IMenuProps) {
    super(props);

    this._onClick = this._onClick.bind(this);

    this.state = {
      isContextMenuVisible: false
    };
  }

  // All menu actions are routed through here.
  itemAction(value:string, field:any):void {
    this.setState({isContextMenuVisible: false});    

    const hash:string = typeof field === 'string' ? field : value;

    this.props.onNavigationRoute(hash);

    /*switch (typeof field === 'string' ? field : value) {
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
    }*/
  }

  _onClick(event: React.MouseEvent<any>) {
    this.setState({ target: event.target, isContextMenuVisible: true });
  }

  public render():JSX.Element {
    return (
      <div key="menu-items" className={styles.menu} id="menu-items">
          <IconButton 
            id='move-dragging'
            className={styles.mover}
            iconProps={
              { 
                iconName: 'Move' 
              } 
            }
            onClick={()=>{}} /> 
        { this.state.isContextMenuVisible ? (
          <ContextualMenu
            shouldFocusOnMount={ true }
            target={ this.state.target }
            onDismiss={ () => this.setState({isContextMenuVisible: false}) }
            directionalHint={ getRTL() ? DirectionalHint.bottomRightEdge : DirectionalHint.bottomLeftEdge }
            items={
              [
                {
                  name: 'Search',
                  onClick: this.itemAction.bind(this, 'Search'),
                  iconProps: {
                    iconName: 'Search',
                    style: {
                      color: window.Goldfish.GetPrimaryColour()
                    }
                  },
                  key: 'key1'
                },
                {
                  name: 'Favourites',
                  onClick: this.itemAction.bind(this, 'Favourites'),
                  iconProps: {
                    iconName: 'FavoriteList',
                    style: {
                      color: window.Goldfish.GetPrimaryColour()
                    }
                  },
                  key: 'key2'
                },
                {
                  name: 'Layout',
                  onClick: this.itemAction.bind(this, 'Layout'),
                  iconProps: {
                    iconName: 'GroupedList',
                    style: {
                      color: window.Goldfish.GetPrimaryColour()
                    }
                  },
                  key: 'key3'
                },
                {
                  name: 'Settings',
                  onClick: this.itemAction.bind(this, 'Settings'),
                  iconProps: {
                    iconName: 'Settings',
                    style: {
                      color: window.Goldfish.GetPrimaryColour()
                    }
                  },
                  key: 'key4'
                },
                {
                  key: 'divider_1',
                  itemType: ContextualMenuItemType.Divider
                },
                {
                  name: 'Close',
                  onClick: this.itemAction.bind(this, 'Close'),
                  iconProps: {
                    iconName: 'ChromeClose',
                    style: {
                      color: window.Goldfish.GetPrimaryColour()
                    }
                  },
                  key: 'key5'
                }
              ]
            }
          />) : 
          null
        }
        <DefaultButton 
            id='menu' 
            onClick={this._onClick} 
            text='...' /> 
      </div>
    );
  }
}

export default Menu;
