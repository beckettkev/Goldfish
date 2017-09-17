/* eslint new-cap: 0 */
import * as React from 'react';
import * as ReactDOM from "react-dom";
import Snappin from './snappin';

function toggleElementVisibility(id: string, show: boolean): void {
  let el: any = document.getElementById(id);

  el.style.display = !show ? 'none' : '';
}

export default {
  closePeopleSearch: function closePeopleSearch(): void {
    let component: any = document.getElementById('component-holder');
    let holder: any = document.getElementById('outer-space');

    holder.className = 'slideRightOut10';

    // If snappy is set, we need to turn it off when closing the app
    if (typeof window.Goldfish.options.snappy !== 'undefined') {
      if (window.Goldfish.options.snappy) {
        const snap: Snappin = new Snappin();
        snap.end();
      }
    }

    // Unmount and remove the React JS App
    window.setTimeout((): void => {
      ReactDOM.unmountComponentAtNode(component);

      document.body.removeChild(component);
    }, 1000);

    // if necessary re-enable drag and drop on document libraries
    window.ExecuteOrDelayUntilScriptLoaded((): void => {
      if (typeof window.DUCBindDragDrop !== 'undefined') {
        window.DUCBindDragDrop();
      }
    }, 'dragdrop.js');
  },
  closeLayoutView: function closeLayoutView(): void {
    toggleElementVisibility('component-layout', false);
    toggleElementVisibility('component', true);
  },
  closeFavouritesView: function closeFavouritesView(): void {
    toggleElementVisibility('component-favourites', false);
    toggleElementVisibility('component', true);
  },
  loadLayoutComponent: function loadLayoutComponent(): void {
    toggleElementVisibility('component', false);
    toggleElementVisibility('component-favourites', false);
    toggleElementVisibility('component-settings', false);
    toggleElementVisibility('component-layout', true);

    this.tabActiveState('component-tab-layouts');
  },
  loadFavouritesComponent: function loadFavouritesComponent(): void {
    toggleElementVisibility('component', false);
    toggleElementVisibility('component-layout', false);
    toggleElementVisibility('component-settings', false);
    toggleElementVisibility('component-favourites', true);

    this.tabActiveState('component-tab-favourites');
  },
  loadSearchComponent: function loadSearchComponent(): void {
    toggleElementVisibility('component', true);
    toggleElementVisibility('component-layout', false);
    toggleElementVisibility('component-favourites', false);
    toggleElementVisibility('component-settings', false);
    toggleElementVisibility('menu-items', true);

    this.tabActiveState('component-tab-search');
  },
  loadSettingsComponent: function loadSettingsComponent(): void {
    toggleElementVisibility('component', false);
    toggleElementVisibility('component-layout', false);
    toggleElementVisibility('component-favourites', false);
    toggleElementVisibility('component-settings', true);

    this.tabActiveState('component-tab-settings');
  },
  tabActiveState: function tabActiveState(tab: string): void {
    const tabs: Array<string> = [
      'component-tab-favourites',
      'component-tab-search',
      'component-tab-layouts',
      'component-tab-settings',
    ];

    let current: any = null;
    let t: number = 0;

    while (t < tabs.length) {
      current = document.getElementById(tabs[t]);

      if (tab === tabs[t]) {
        current.className = 'tab active';
        current.childNodes[0].className = 'material-icons animated tada';
      } else {
        current.className = 'tab';
        current.childNodes[0].className = 'material-icons';
      }

      if (t === (tabs.length - 1)) {
        current.className += ' last';
      }

      t += 1;
    }
  },
};
