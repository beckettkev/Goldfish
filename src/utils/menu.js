import React from 'react';

function toggleElementVisibility (id, show) {
    const el = document.getElementById(id);

    el.style.display = !show ? 'none' : '';
}

module.exports = {
    closePeopleSearch: function () {
        const component = document.getElementById('component-holder');

        React.unmountComponentAtNode(component);

        document.body.removeChild(component);

        //if necessary re-enable drag and drop on document libraries
        window.ExecuteOrDelayUntilScriptLoaded(function () {
            if (typeof window.DUCBindDragDrop !== 'undefined') {
                window.DUCBindDragDrop();
            }
        }, 'dragdrop.js');
    },
    closeLayoutView: function () {
        toggleElementVisibility('component-layout', false);
        toggleElementVisibility('component', true);
    },
    closeFavouritesView: function () {
        toggleElementVisibility('component-favourites', false);
        toggleElementVisibility('component', true);
    },
    loadLayoutComponent: function () {
        toggleElementVisibility('component', false);
        toggleElementVisibility('component-favourites', false);
        toggleElementVisibility('component-settings', false);
        toggleElementVisibility('component-layout', true);

        this.tabActiveState('component-tab-layouts');
    },
    loadFavouritesComponent: function () {
        toggleElementVisibility('component', false);
        toggleElementVisibility('component-layout', false);
        toggleElementVisibility('component-settings', false);
        toggleElementVisibility('component-favourites', true);

        this.tabActiveState('component-tab-favourites');
    },
    loadSearchComponent: function () {
        toggleElementVisibility('component', true);
        toggleElementVisibility('component-layout', false);
        toggleElementVisibility('component-favourites', false);
        toggleElementVisibility('component-settings', false);
        toggleElementVisibility('menu-items', true);

        this.tabActiveState('component-tab-search');
    },
    loadSettingsComponent: function () {
        toggleElementVisibility('component', false);
        toggleElementVisibility('component-layout', false);
        toggleElementVisibility('component-favourites', false);
        toggleElementVisibility('component-settings', true);

        this.tabActiveState('component-tab-settings');
    },
    tabActiveState: function (tab) {
        const tabs = [
            'component-tab-favourites',
            'component-tab-search',
            'component-tab-layouts',
            'component-tab-settings'
        ];

        let current;
        let t = 0;

        while (t < tabs.length) {
            current = document.getElementById(tabs[t]);
            current.className = tab === tabs[t] ? 'tab active animated tada' : 'tab';

            if (t === (tabs.length - 1)) {
                current.className += ' last';
            }

            t += 1;
        }
    }
};
