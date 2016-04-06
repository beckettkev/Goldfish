function applyCssToHead(css) {
      var head = document.head || document.getElementsByTagName('head')[0];

      head.appendChild(createCssStyles(css));
}

function applyCssToBody(css, id) {
      var body = document.body || document.getElementsByTagName('body')[0];

      //remove it if it exists already
      if (document.getElementById(id) !== null) {
        var el = document.getElementById(id);
        el.parentNode.removeChild(el);
      }

      var div = document.createElement('div');
      div.id = id;

      div.appendChild(createCssStyles(css));

      body.appendChild(div);
}

function createCssStyles(css) {
      var overrides = document.createElement('style');
      overrides.type = 'text/css';

      if (overrides.styleSheet) {
        overrides.styleSheet.cssText = css;
      } else {
        overrides.appendChild(document.createTextNode(css));
      }

      return overrides;
}

module.exports = {
  applySettings: function(settings) {
    	var that = this;
      var collection = [];
      var item = {};
      
      Object.keys(settings).forEach(function(key, index) {
     	   that.settingRouting(key, settings[key]);
         
         item[key] = settings[key];

         collection.push(item);

         item = {};
      });

      return collection;
  },
  settingRouting: function(key, value) {
  		switch(key) {
    			case 'showFavourites':
    				//do some stuff
    				break;
    			case 'showInfiniteScroll':
    				//do some stuff
    				break;
    			case 'showLaunchButton':
    				//do some stuff
    				break;
    			case 'showOnRight':
    				this.setPosition(value ? 'right' : 'left');
    				break;
          case 'cssOveride':
            this.applyCssOverride(value);
            break;
    			default:
    				//no default action
    				break;
  		}
  },
  applyCssOverride: function(value) {
      if (typeof value === 'string') {
          applyCssToHead(value);
      } else {
          console.log('Goldfish.SettingsManager - CSS overrides must be plain text and not an object or array');
      }
  },
  toggleFunctionality: function(show) {

  },
  setPosition: function(pos) {
      var css = '#outer-space { direction: ' + (pos === 'right' ? 'ltr' : 'rtl') + '; ' + pos + ': 0px }';

      applyCssToBody(css, 'component-direction-styles');
  }
};