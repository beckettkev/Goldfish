function createCssStyles(css: string): Element {
  let overrides: any = document.createElement('style');
  overrides.type = 'text/css';

  if (overrides.styleSheet) {
    overrides.styleSheet.cssText = css;
  } else {
    overrides.appendChild(document.createTextNode(css));
  }

  return overrides;
}

function applyCssToHead(css: string): void {
  let head: any = document.head || document.getElementsByTagName('head')[0];

  head.appendChild(createCssStyles(css));
}

function applyCssToBody(css: string, id: string): void {
  let body: any = document.body || document.getElementsByTagName('body')[0];

  // remove it if it exists already
  if (document.getElementById(id) !== null) {
    let el: HTMLElement = document.getElementById(id);
    el.parentNode.removeChild(el);
  }

  let div: HTMLElement = document.createElement('div');
  div.id = id;

  div.appendChild(createCssStyles(css));

  body.appendChild(div);
}

export default {
  applySettings: function applySettings(settings: any): Array<any> {
    let collection: Array<any> = [];
    let item: any = {};

    Object.keys(settings).forEach((key: string) => {
      this.settingRouting(key, settings[key]);

      item[key] = settings[key];

      collection.push(item);

      item = {};
    });

    return collection;
  },
  settingRouting: function settingRouting(key: string, value: any): void {
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
  toggleFavourites: function toggleFavouritesTab(value: any): void {
    let tab: HTMLElement = document.getElementById('component-tab-favourites');
    let favourites: HTMLElement = document.getElementById('component-favourites');

    if (tab !== null) {
      if (value) {
        tab.className = 'tab';
        tab.style.display = '';
      } else {
        tab.className = 'tab animated flipOutX';

        window.setTimeout(function () {
          tab.style.display = 'none';
          favourites.style.display = 'none';
        }, 1000);
      }
    }
  },
  toggleFavouriteButtons: function toggleFavouriteButtons(value: any): void {
    const { inCss, outCss, removeClass, addClass } = { inCss: 'pulse', outCss: 'flipOutX', removeClass: 'remove', addClass: 'add' };
    const buttons: Array<any> = [].slice.call(document.getElementsByClassName('add')).concat([].slice.call(document.getElementsByClassName('remove')));

    buttons.forEach((item: any) => {
      if (value) {
        item.className = item.className.indexOf(` animated ${outCss}`) > -1 ? item.className.replace(outCss, inCss) : `${item.className} animated ${inCss}`;
      } else {
        item.className = item.className.indexOf(` animated ${inCss}`) > -1 ? item.className.replace(inCss, outCss) : `${item.className} animated ${outCss}`;
      }
    });
  },
  applyCssOverride: function applyCssOverride(value: string): void {
    if (typeof value === 'string') {
      applyCssToHead(value);
    } else {
      console.log('Goldfish.SettingsManager - CSS overrides must be plain text and not an object or array');
    }
  },
  setPosition: function setPosition(pos: string): void {
    const css: string = '#outer-space { direction: ' + (pos === 'right' ? 'ltr' : 'rtl') + '; ' + pos + ': 0px }';

    applyCssToBody(css, 'component-direction-styles');
  },
};
