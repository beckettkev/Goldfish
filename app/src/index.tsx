<<<<<<< HEAD:app/src/index.tsx
import "react-hot-loader/patch";
import * as React from "react";
import * as ReactDOM from "react-dom";
// AppContainer is a necessary wrapper component for HMR
import { AppContainer } from "react-hot-loader";
import { DefaultConstants } from './constants/default';
import PeopleSearch from './views/PeopleSearch/PeopleSearch';
import Snappin from './utils/snappin';

// Custom event polyfill for IE9 - IE10
function CustomEvent(event:any, params:any):any {
  const eventParams:any = params || { bubbles: false, cancelable: false, detail: undefined };

  const evt:any = document.createEvent('CustomEvent');
  evt.initCustomEvent(event, eventParams.bubbles, eventParams.cancelable, eventParams.detail);

  return evt;
}

CustomEvent.prototype = window.CustomEvent.prototype;
window.CustomEvent = CustomEvent;

const Goldfish:Goldfish = {
  options: {
    title: 'Goldfish',
    properties: '',
  },

  interval: null,

  LoadStyleSheet: function LoadStyleSheet(href:string):void {
    let sheet:any = document.createElement('link');

    sheet.setAttribute('href', href);
    sheet.setAttribute('rel', 'stylesheet');

    sheet.onreadystatechange = function readyStylesIE():void {
      if (this.readyState === 'complete') {
        Goldfish.Ready();
      }
    };

    // Handle better browsers
    sheet.onload = function readyStylesModern():void {
      Goldfish.Ready();
    };

    document.getElementsByTagName('head')[0].appendChild(sheet);
  },
  LoadScript: function LoadScript(href:string, callback: Function):void {
    let link:any = document.createElement('script');
    link.setAttribute('type', 'text/javascript');
    link.setAttribute('src', href);

    // Handle IE
    link.onreadystatechange = function readyScriptIE():void {
      if (this.readyState === 'complete') {
        callback();
      }
    };

    // Handle better browsers
    link.onload = function readyScriptModern():void {
      callback();
    };

    document.getElementsByTagName('head')[0].appendChild(link);
  },
  HouseKeeping: function HouseKeeping():void {
    // Minimal download strategy page click house keeping
    window.onhashchange = function():void {
      if (location.hash.charAt(1) === '/') {
        let child:any = document.getElementById('component-holder');
        //  After the MDS has finished loading the page, we need to clear down Goldfish if it's open
        if (child !== null) {
          document.body.removeChild(child);
        }
      }
    };

    if (typeof window.houseKeeping === 'undefined') {
      // We need to clear up if this is the first visit
      Object.keys(window.localStorage).forEach(
        function(item) {
          if (item.indexOf('PeopleSearch-Results') > -1) {
            window.localStorage.removeItem(item);
          }
        }
      );

      window.houseKeeping = true;
    }
  },
  KeyPressListener: function KeyPressListener():void {
    document.addEventListener('keydown', function launchByKey(e:any):void {
      window.keyWatcher = window.keyWatcher || null;

      if (window.keyWatcher === null && e.keyCode === 18) {
        window.keyWatcher = e.keyCode;
      } else if (window.keyWatcher === 18 && e.keyCode === 71) {
        let component:any = document.getElementById('component-holder');

        if (component === null) {
          Goldfish.Create();
        } else if (component !== null) {
          let holder:any = document.getElementById('outer-space');

          holder.className = 'animated bounceOutRight';

          window.setTimeout(():void => {
            // destroy
            ReactDOM.unmountComponentAtNode(component);

            document.body.removeChild(component);
          }, 1000);
        }

        window.keyWatcher = null;
      }
    });
  },
  DisableDragAndDrop: function DisableDragAndDrop():void {
    // If we are on a page with drag and drop controls we need to temporarily disable them
    window.ExecuteOrDelayUntilScriptLoaded(() => {
      if (typeof window.DUCBindDragDrop !== 'undefined') {
        window.removeListener(document.body, 'dragenter', window.dropElementDragEnter);
        window.removeListener(document.body, 'dragover', null);
        window.removeListener(document.body, 'dragleave', window.dropElementDragLeave);
        window.removeListener(document.body, 'drop', window.dropElementDrop);
      }
    }, 'dragdrop.js');
  },
  Ready: function Ready():void {
    if (typeof window.Sys !== 'undefined' && window.Sys && window.Sys.Application) {
      window.Sys.Application.notifyScriptLoaded();
    }

    if (typeof window.SP !== 'undefined') {
      if (typeof window.SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs === 'function') {
        // Inform the create functionthat Goldfish can now load safely
        window.SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('goldfish.min.js');
      }
    }

    Goldfish.KeyPressListener();
  },
  GetjQueryStatus: function GetjQueryStatus():boolean {
    return typeof window.jQuery !== 'undefined';
  },
  GetjQuery: function GetjQuery():void {
    Goldfish.LoadScript('https://code.jquery.com/jquery-1.11.3.min.js', Goldfish.Swim);
  },
  FakeExecuteOrDelay: function FakeExecuteOrDelay():void {
    if (typeof window.ExecuteOrDelayUntilScriptLoaded === 'undefined') {
      window.ExecuteOrDelayUntilScriptLoaded = (callback:Function, script:any):void => {
        callback();
      };
      window.IMNRC = function() {};
      window.fakeAjaxCalls = true;
    }
  },
  /*
    This functionchecks for necessary dependencies and it will then notify waiting code that the app can run
  */
  Swim: function Swim():boolean {
    if (!Goldfish.GetjQueryStatus()) {
      // Check that jQuery has fully loaded...
      Goldfish.GetjQuery();

      return false;
    }

    // Setup the google materials font and animate css for the UI
    Goldfish.LoadStyleSheet('https://fonts.googleapis.com/icon?family=Material+Icons');
    Goldfish.LoadStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css');
    
    return true;
  },
  Snappy: function Snappy():void {
    if (typeof Goldfish.options.snappy !== 'undefined') {
      if (Goldfish.options.snappy) {
        let clickers:Array<string> = ['dragSnapinGoldfish','dragSnapinGoldfishLayout','dragSnapinGoldfishSettings','dragSnapinGoldfishFavourites'];

        let snap:any = new Snappin();
        snap.start('outer-space', 'component-ghostpane', clickers);
      }
    }
  },
  ApplyAppSettings: function ApplyAppSettings():void {
    // callback function to apply any override theme CSS
    Goldfish.OverrideThemeColours();
    // callback function to add Snappin functionality when specified in options
    Goldfish.Snappy();
  },
  Create: function Create(options:any):void {
    // If options are provided do a cursory check and save them if they are valid
    if (typeof options !== 'undefined') {
      if (this.ObjectPayloadCheck(options)) {
        Goldfish.options = options;
      } else {
        console.log('Goldfish.Swim - options ignored (invalid format)');
      }
    }
    // fake the execute or delay functionality if we are showing this as a demo
    Goldfish.FakeExecuteOrDelay();
    // we need to clear up if this is the first visit
    Goldfish.HouseKeeping();
    // due to the global way drag and drop is invoked on document libraries, we need to disable this whilst our component is active
    Goldfish.DisableDragAndDrop();
    /*
      everything looks good...
      lets setup the container and component elements
    */
    let holder:HTMLElement = document.createElement('div');
    holder.id = 'component-holder';
    holder.style.width = '400px';

    let ghost:HTMLElement = document.createElement('div');
    ghost.id = 'component-ghostpane';
    ghost.style.display = 'none';

    document.getElementsByTagName('body')[0].appendChild(holder);
    document.getElementsByTagName('body')[0].appendChild(ghost);

    // When we close the People Search component, we trash it. Recreate if it is opened again
    window.ExecuteOrDelayUntilScriptLoaded(():void => {
      let reactContainer:any = document.getElementById('component-holder');

      ReactDOM.render(
        <AppContainer>
          <PeopleSearch 
            options={window.Goldfish.options} />
        </AppContainer>,
        reactContainer,
        Goldfish.ApplyAppSettings()
      );

      // Hot Module Replacement API
      if (module.hot) {
        module.hot.accept(() => {
          const NewPeopleSearch:any = require<{default: typeof PeopleSearch}>("./views/PeopleSearch/PeopleSearch").default;
          
          ReactDOM.render(
            <AppContainer>
              <NewPeopleSearch options={Goldfish.options} />
            </AppContainer>, 
            reactContainer,
            Goldfish.ApplyAppSettings()
          );
        });
      }
    }, 'goldfish.min.js');
  },
  GetPrimaryColour: function GetPrimaryColour():string {
    // if there has been a primary colour specified in the options - use this
    if (typeof Goldfish.options.css !== 'undefined' && 'primary' in Goldfish.options.css) {
      return Goldfish.options.css.primary;
    }

    if (typeof window.jQuery('#O365_NavHeader').css('backgroundColor') !== 'undefined') {
      return window.jQuery('#O365_NavHeader').css('backgroundColor');
    } else if (typeof window.jQuery('#suiteBarLeft').css('backgroundColor') !== 'undefined') {
      return window.jQuery('#suiteBarLeft').css('backgroundColor');
    }

    return DefaultConstants.DEFAULT_COLOUR;
  },
  OverrideThemeColours: function OverrideThemeColours():void {
    if (typeof window.jQuery !== 'undefined') {
      if (document.getElementById('component') !== null) {
        if (Goldfish.interval !== null) {
          window.clearInterval(Goldfish.interval);
        }

        let head:any = document.head || document.getElementsByTagName('head')[0];
        const colour:string = Goldfish.GetPrimaryColour();

        let overrides:any = document.createElement('style');
        overrides.type = 'text/css';

        const css:string = '#O365fpcontainerid { z-index:2010; } #outer-space { position: absolute; z-index: 2000; top: 85px; display: block; right: 0; height: 100%; min-height: 400px; width: 570px; overflow-y: scroll; } #outer-space::-webkit-scrollbar { background: #eeeeee } #outer-space::-webkit-scrollbar-thumb { background: #cccccc } #outer-space div.sortable-container div.sortable-item div:hover, #outer-space div.sortable-container div.sortable-item:hover { background-color: ' + colour + '; } #outer-space .highlight, #component-tabs .active { color:' + colour + ' !important; } #outer-space span.commandor input[type=button], #outer-space span.commandor button { background: #eeeeee !important; color: #666666; border-radius: 0%; box-shadow: none; } #outer-space input[type=text]:focus, #outer-space input[type=text]:hover { border-color: ' + colour + ' !important; } #outer-space button, #outer-space input[type=button] { background-color: ' + colour + ' !important; color:#ffffff; } #outer-space div.nocolour button, #outer-space div.nocolour input[type=button] { background-color: #f4f4f4 !important; } #outer-space div.remove button, #outer-space div.remove input[type=button] { background-color: #666666 !important; } div.switches-with-broomsticks label span[role=switch] { background-color: ' + colour + ' !important; } div.switches-with-broomsticks label span span[role=thumb] { background-color: ' + colour + ' !important; } #outer-space div.Select-option.is-focused { background-color: ' + colour + ' !important; color:#ffffff; }';

        if (overrides.styleSheet) {
          overrides.styleSheet.cssText = css;
        } else {
          overrides.appendChild(document.createTextNode(css));
        }

        head.appendChild(overrides);
      } else {
        // IE safe guard for late rendering
        Goldfish.interval = Goldfish.interval || window.setInterval(function() {
          Goldfish.OverrideThemeColours();
        }, 1000);
      }
    }
  },
  ObjectPayloadCheck: function ObjectPayloadCheck(options:any):boolean {
    const safe:Array<string> = [
      'title',
      'css',
      'layout',
      'snappy',
      'menu',
      'properties',
      'suggest',
      'settings',
    ];

    return Object.keys(options).some((item:string) => safe.indexOf(item) > -1);
  },
  RegisterLayouts: function RegisterLayouts(layouts:any):void {
    const newLayoutsAdded:any = new window.CustomEvent(
      'Goldfish.Layouts',
      {
        detail: {
          layouts: layouts,
          time: new Date(),
        },
        bubbles: true,
        cancelable: true,
      }
    );

    document.dispatchEvent(newLayoutsAdded);
  },
};

window.Goldfish = window.Goldfish || Goldfish;

// fetches and prepares everything
window.Goldfish.Swim();

/*
  You can load Goldfish with or without options (options are shown in the readme.md file)
  var options = {
    css: {
      primary: "#00FF00"
    },
    snappy: true
  }
  Goldfish.Create();
  Goldfish.Create(options);
*/
=======
/* eslint new-cap: 0 */
import React from 'react';
import DefaultConstants from './constants/default';
import PeopleSearch from './views/PeopleSearch/PeopleSearch.jsx';
import Snappin from './utils/snappin';

// Custom event polyfill for IE9 - IE10
const CustomEvent = (event, params) => {
  const eventParams = params || { bubbles: false, cancelable: false, detail: undefined };

  let evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(event, eventParams.bubbles, eventParams.cancelable, eventParams.detail);

  return evt;
};

CustomEvent.prototype = window.CustomEvent.prototype;
window.CustomEvent = CustomEvent;


const Goldfish = {
  options: {
    title: 'Goldfish',
    properties: '',
  },

  interval: null,

  LoadStyleSheet: function LoadStyleSheet(href) {
    let sheet = document.createElement('link');

    sheet.setAttribute('href', href);
    sheet.setAttribute('rel', 'stylesheet');

    sheet.onreadystatechange = function readyStylesIE() {
      if (this.readyState === 'complete') {
        Goldfish.Ready();
      }
    };

    // Handle better browsers
    sheet.onload = function readyStylesModern() {
      Goldfish.Ready();
    };

    document.getElementsByTagName('head')[0].appendChild(sheet);
  },

  LoadScript: function LoadScript(href, callback) {
    let link = document.createElement('script');

    link.setAttribute('type', 'text/javascript');
    link.setAttribute('src', href);

    // Handle IE
    link.onreadystatechange = function readyScriptIE() {
      if (this.readyState === 'complete') {
        callback();
      }
    };

    // Handle better browsers
    link.onload = function readyScriptModern() {
      callback();
    };

    document.getElementsByTagName('head')[0].appendChild(link);
  },

  HouseKeeping: function HouseKeeping() {
    // Minimal download strategy page click house keeping
    window.onhashchange = function() {
      if (location.hash.charAt(1) === '/') {
        const child = document.getElementById('component-holder');
        //  After the MDS has finished loading the page, we need to clear down Goldfish if it's open
        if (child !== null) {
          document.body.removeChild(child);
        }
      }
    };

    if (typeof window.houseKeeping === 'undefined') {
      // We need to clear up if this is the first visit
      Object.keys(localStorage).forEach(item => {
          if (item.indexOf('PeopleSearch-Results') > -1) {
            localStorage.removeItem(item);
          }
        }
      );

      window.houseKeeping = true;
    }
  },

  KeyPressListener: function KeyPressListener() {
    document.addEventListener('keydown', function launchByKey(e) {
      window.keyWatcher = window.keyWatcher || null;

      if (window.keyWatcher === null && e.keyCode === 18) {
        window.keyWatcher = e.keyCode;
      } else if (window.keyWatcher === 18 && e.keyCode === 71) {
        const component = document.getElementById('component-holder');

        if (component === null) {
          Goldfish.Create();
        } else if (component !== null) {
          let holder = document.getElementById('outer-space');

          holder.className = 'animated bounceOutRight';

          window.setTimeout(() => {
            // destroy
            React.unmountComponentAtNode(component);

            document.body.removeChild(component);
          }, 1000);
        }

        window.keyWatcher = null;
      }
    });
  },

  DisableDragAndDrop: function DisableDragAndDrop() {
    // If we are on a page with drag and drop controls we need to temporarily disable them
    window.ExecuteOrDelayUntilScriptLoaded(() => {
      if (typeof window.DUCBindDragDrop !== 'undefined') {
        window.removeListener(document.body, 'dragenter', window.dropElementDragEnter);
        window.removeListener(document.body, 'dragover', null);
        window.removeListener(document.body, 'dragleave', window.dropElementDragLeave);
        window.removeListener(document.body, 'drop', window.dropElementDrop);
      }
    }, 'dragdrop.js');
  },

  Ready: function Ready() {
    if (typeof Sys !== 'undefined' && Sys && Sys.Application) {
      Sys.Application.notifyScriptLoaded();
    }

    if (typeof SP !== 'undefined') {
      if (typeof SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs === 'function') {
        // Inform the create functionthat Goldfish can now load safely
        SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('goldfish.min.js');
      }
    }

    Goldfish.KeyPressListener();
  },

  GetjQueryStatus: function GetjQueryStatus() {
    return typeof jQuery !== 'undefined';
  },

  GetjQuery: function GetjQuery() {
    Goldfish.LoadScript('https://code.jquery.com/jquery-1.11.3.min.js', Goldfish.Swim);
  },

  FakeExecuteOrDelay: function FakeExecuteOrDelay() {
    if (typeof window.ExecuteOrDelayUntilScriptLoaded === 'undefined') {
      window.ExecuteOrDelayUntilScriptLoaded = function(callback, script) {
        callback();
      };

      window.IMNRC = function() {};
      window.fakeAjaxCalls = true;
    }
  },

  /*
    This functionchecks for necessary dependencies and it will then notify waiting code that the app can run
  */
  Swim: function Swim() {
    if (!Goldfish.GetjQueryStatus()) {
      // Check that jQuery has fully loaded...
      Goldfish.GetjQuery();

      return false;
    }

    // Setup the google materials font and animate css for the UI
    Goldfish.LoadStyleSheet('https://fonts.googleapis.com/icon?family=Material+Icons');
    Goldfish.LoadStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css');
  },

  Snappy: function Snappy() {
    if (typeof Goldfish.options.snappy !== 'undefined') {
      if (Goldfish.options.snappy) {
        var clickers = ['dragSnapinGoldfish','dragSnapinGoldfishLayout','dragSnapinGoldfishSettings','dragSnapinGoldfishFavourites'];

        const snap = new Snappin();
        snap.start('outer-space', 'component-ghostpane', clickers);
      }
    }
  },

  Create: function Create(options) {
    // If options are provided do a cursory check and save them if they are valid
    if (typeof options !== 'undefined') {
      if (this.ObjectPayloadCheck(options)) {
        Goldfish.options = options;
      } else {
        console.log('Goldfish.Swim - options ignored (invalid format)');
      }
    }

    // fake the execute or delay functionality if we are showing this as a demo
    Goldfish.FakeExecuteOrDelay();
    // we need to clear up if this is the first visit
    Goldfish.HouseKeeping();
    // due to the global way drag and drop is invoked on document libraries, we need to disable this whilst our component is active
    Goldfish.DisableDragAndDrop();
    /*
      everything looks good...
      lets setup the container and component elements
    */
    let holder = document.createElement('div');

    holder.id = 'component-holder';
    holder.style.width = '400px';

    let ghost = document.createElement('div');
    ghost.id = 'component-ghostpane';
    ghost.style.display = 'none';

    document.getElementsByTagName('body')[0].appendChild(holder);
    document.getElementsByTagName('body')[0].appendChild(ghost);

    // When we close the People Search component, we trash it. Recreate if it is opened again
    window.ExecuteOrDelayUntilScriptLoaded(() => {
      React.render(
         <PeopleSearch
          options={Goldfish.options} />,
         document.getElementById('component-holder'),
         () => {
           // callback function to apply any override theme CSS
           Goldfish.OverrideThemeColours();
           // callback function to add Snappin functionality when specified in options
           Goldfish.Snappy();
         }
      );
    }, 'goldfish.min.js');
  },
  GetPrimaryColour: function GetPrimaryColour() {
    // if there has been a primary colour specified in the options - use this
    if (typeof Goldfish.options.css !== 'undefined' && 'primary' in Goldfish.options.css) {
      return Goldfish.options.css.primary;
    }

    if (typeof jQuery('#O365_NavHeader').css('backgroundColor') !== 'undefined') {
      return jQuery('#O365_NavHeader').css('backgroundColor');
    } else if (typeof jQuery('#suiteBarLeft').css('backgroundColor') !== 'undefined') {
      return jQuery('#suiteBarLeft').css('backgroundColor');
    }

    return DefaultConstants.DEFAULT_COLOUR;
  },

  OverrideThemeColours: function OverrideThemeColours() {
    if (typeof jQuery !== 'undefined') {
      if (document.getElementById('component') !== null) {
        if (Goldfish.interval !== null) {
          window.clearInterval(Goldfish.interval);
        }

        const head = document.head || document.getElementsByTagName('head')[0];
        const colour = Goldfish.GetPrimaryColour();

        let overrides = document.createElement('style');
        overrides.type = 'text/css';

        let css = '#O365fpcontainerid { z-index:2010; } #outer-space { position: absolute; z-index: 2000; top: 85px; display: block; right: 0; height: 100%; min-height: 400px; width: 570px; overflow-y: scroll; } #outer-space::-webkit-scrollbar { background: #eeeeee } #outer-space::-webkit-scrollbar-thumb { background: #cccccc } #outer-space div.sortable-container div.sortable-item div:hover, #outer-space div.sortable-container div.sortable-item:hover { background-color: ' + colour + '; } #outer-space .highlight, #component-tabs .active { color:' + colour + ' !important; } #outer-space span.commandor input[type=button], #outer-space span.commandor button { background: #eeeeee !important; color: #666666; border-radius: 0%; box-shadow: none; } #outer-space input[type=text]:focus, #outer-space input[type=text]:hover { border-color: ' + colour + ' !important; } #outer-space button, #outer-space input[type=button] { background-color: ' + colour + ' !important; color:#ffffff; } #outer-space div.nocolour button, #outer-space div.nocolour input[type=button] { background-color: #f4f4f4 !important; } #outer-space div.remove button, #outer-space div.remove input[type=button] { background-color: #666666 !important; } div.switches-with-broomsticks label span[role=switch] { background-color: ' + colour + ' !important; } div.switches-with-broomsticks label span span[role=thumb] { background-color: ' + colour + ' !important; } #outer-space div.Select-option.is-focused { background-color: ' + colour + ' !important; color:#ffffff; }';

        if (overrides.styleSheet) {
          overrides.styleSheet.cssText = css;
        } else {
          overrides.appendChild(document.createTextNode(css));
        }

        head.appendChild(overrides);
      } else {
        // IE safe guard for late rendering
        Goldfish.interval = Goldfish.interval || window.setInterval(() => {
          Goldfish.OverrideThemeColours();
        }, 1000);
      }
    }
  },

  ObjectPayloadCheck: function ObjectPayloadCheck(options) {
    const safe = [
      'title',
      'css',
      'layout',
      'snappy',
      'menu',
      'properties',
      'suggest',
      'settings',
    ];

    return Object.keys(options).some(item => safe.indexOf(item) > -1);
  },

  RegisterLayouts: function RegisterLayouts(layouts) {
    const newLayoutsAdded = new CustomEvent(
      'Goldfish.Layouts',
      {
        detail: {
          layouts: layouts,
          time: new Date(),
        },
        bubbles: true,
        cancelable: true,
      }
    );

    document.dispatchEvent(newLayoutsAdded);
  },
};

// fetches and prepares everything
Goldfish.Swim();

// exposes Goldfish to the window object
window.Goldfish = window.Goldfish || Goldfish;

/*
  You can load Goldfish with or without options (options are shown in the readme.md file)
  var options = {
    css: {
      primary: "#00FF00"
    },
    snappy: true
  }
  Goldfish.Create();
  Goldfish.Create(options);
*/
>>>>>>> 9461183eed53bd47bae5f4282481402b13e43062:src/index.js
