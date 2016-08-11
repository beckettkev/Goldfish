function createCssStyles(css) {
  const overrides = document.createElement('style');
  overrides.type = 'text/css';

  if (overrides.styleSheet) {
    overrides.styleSheet.cssText = css;
  } else {
    overrides.appendChild(document.createTextNode(css));
  }

  return overrides;
}

function applyCssToHead(css) {
  const head = document.head || document.getElementsByTagName('head')[0];

  head.appendChild(createCssStyles(css));
}

function applyCssToBody(css, id) {
  const body = document.body || document.getElementsByTagName('body')[0];

  // remove it if it exists already
  if (document.getElementById(id) !== null) {
    const el = document.getElementById(id);
    el.parentNode.removeChild(el);
  }

  const div = document.createElement('div');
  div.id = id;

  div.appendChild(createCssStyles(css));

  body.appendChild(div);
}

module.exports = {
  applySettings: function applySettings(settings) {
    const that = this;
    const collection = [];
    let item = {};

    Object.keys(settings).forEach(function(key) {
      that.settingRouting(key, settings[key]);

      item[key] = settings[key];

      collection.push(item);

      item = {};
    });

    return collection;
  },
  settingRouting: function settingRouting(key, value) {
    switch (key) {
    case 'showFavourites':
      // do some stuff
      this.toggleFavourites(value);
      //this.toggleFavouriteButtons(value);
      break;
    case 'showOnRight':
      this.setPosition(value ? 'right' : 'left');
      break;
    case 'cssOveride':
      this.applyCssOverride(value);
      break;
    default:
      // no default action
      break;
    }
  },
  toggleFavourites: function toggleFavouritesTab(value) {
    const tab = document.getElementById('component-tab-favourites');
    const favourites = document.getElementById('component-favourites');

    if (tab !== null) {
      if (value) {
        tab.className = 'tab';
        tab.style.display = '';
      } else {
        tab.className = 'tab animated flipOutX';

        window.setTimeout(function() {
          tab.style.display = 'none';
          favourites.style.display = 'none';
        }, 1000);
      }
    }
  },
  toggleFavouriteButtons: function toggleFavouriteButtons(value) {
    const { inCss, outCss, removeClass, addClass } = { inCss: 'pulse', outCss: 'flipOutX', removeClass: 'remove', addClass: 'add' };
    const buttons = [].slice.call(document.getElementsByClassName('add')).concat([].slice.call(document.getElementsByClassName('remove')));

    buttons.forEach(function(item) {
      if (value) {
        item.className = item.className.indexOf(` animated ${outCss}`) > -1 ? item.className.replace(outCss, inCss) : `${item.className} animated ${inCss}`;
      } else {
        item.className = item.className.indexOf(` animated ${inCss}`) > -1 ? item.className.replace(inCss, outCss) : `${item.className} animated ${outCss}`;
      }
    });
  },
  applyCssOverride: function applyCssOverride(value) {
    if (typeof value === 'string') {
      applyCssToHead(value);
    } else {
      console.log('Goldfish.SettingsManager - CSS overrides must be plain text and not an object or array');
    }
  },
  setPosition: function setPosition(pos) {
    const css = '#outer-space { direction: ' + (pos === 'right' ? 'ltr' : 'rtl') + '; ' + pos + ': 0px }';

    applyCssToBody(css, 'component-direction-styles');
  },
};
