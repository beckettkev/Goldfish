/* eslint new-cap: 0 */
import React from 'react';
import Snappin from './snappin.js';

function toggleElementVisibility(id, show) {
  const el = document.getElementById(id);

  el.style.display = !show ? 'none' : '';
}

module.exports = {
  closePeopleSearch: function closePeopleSearch() {
    const component = document.getElementById('component-holder');
    const holder = document.getElementById('outer-space');

    holder.className = 'animated bounceOutRight';

    // If snappy is set, we need to turn it off when closing the app
    if (typeof Goldfish.options.snappy !== 'undefined') {
      if (Goldfish.options.snappy) {
         const snap = new Snappin();
         snap.end();
      }
    }

    // Unmount and remove the React JS App
    window.setTimeout(function() {
      React.unmountComponentAtNode(component);

      document.body.removeChild(component);
    }, 1000);

    // if necessary re-enable drag and drop on document libraries
    window.ExecuteOrDelayUntilScriptLoaded(function() {
      if (typeof window.DUCBindDragDrop !== 'undefined') {
        window.DUCBindDragDrop();
      }
    }, 'dragdrop.js');
  },
  closeLayoutView: function closeLayoutView() {
    toggleElementVisibility('component-layout', false);
    toggleElementVisibility('component', true);
  },
  closeFavouritesView: function closeFavouritesView() {
    toggleElementVisibility('component-favourites', false);
    toggleElementVisibility('component', true);
  },
  loadLayoutComponent: function loadLayoutComponent() {
    toggleElementVisibility('component', false);
    toggleElementVisibility('component-favourites', false);
    toggleElementVisibility('component-settings', false);
    toggleElementVisibility('component-layout', true);

    this.tabActiveState('component-tab-layouts');
  },
  loadFavouritesComponent: function loadFavouritesComponent() {
    toggleElementVisibility('component', false);
    toggleElementVisibility('component-layout', false);
    toggleElementVisibility('component-settings', false);
    toggleElementVisibility('component-favourites', true);

    this.tabActiveState('component-tab-favourites');
  },
  loadSearchComponent: function loadSearchComponent() {
    toggleElementVisibility('component', true);
    toggleElementVisibility('component-layout', false);
    toggleElementVisibility('component-favourites', false);
    toggleElementVisibility('component-settings', false);
    toggleElementVisibility('menu-items', true);

    this.tabActiveState('component-tab-search');
  },
  loadSettingsComponent: function loadSettingsComponent() {
    toggleElementVisibility('component', false);
    toggleElementVisibility('component-layout', false);
    toggleElementVisibility('component-favourites', false);
    toggleElementVisibility('component-settings', true);

    this.tabActiveState('component-tab-settings');
  },
  tabActiveState: function tabActiveState(tab) {
    const tabs = [
      'component-tab-favourites',
      'component-tab-search',
      'component-tab-layouts',
      'component-tab-settings',
    ];

    let current;
    let t = 0;

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
