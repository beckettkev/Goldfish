/*
  Demo helper for launching goldfish on a non-sharepoint site.
*/
var minHeight = document.body.getBoundingClientRect().bottom;

var styles = '#outer-space { height: auto; min-height: ' + minHeight + 'px; padding-left:15px; width:410px; -webkit-perspective: none; top:85px; } #outer-space #component { min-height:' + minHeight + 'px; } div.goldfishSnapTop #component-results, div.goldfishSnapBottom #component-results { position: relative; } div.goldfishSnapTop #component-favourites div.sortable-item, div.goldfishSnapBottom #component-favourites div.sortable-item { float: left; width: 400px; } div.goldfishSnapTop #component-favourites div.sortable-item:first-child, div.goldfishSnapBottom #component-favourites div.sortable-item:first-child { border-width: 0px; } div.goldfishSnapTop #component-results div.person-card-holder, div.goldfishSnapBottom #component-results div.person-card-holder { width:auto !important; } div.goldfishSnapTop #component-results div.person-card, div.goldfishSnapBottom #component-results div.person-card { margin: 0 10px 10px 0px; width: 400px; float:left; } #component-paging { float: none; clear: both; } div.goldfishSnapTop { -webkit-box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75); -moz-box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75); box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75); position:fixed !important; min-height:400px !important; height:400px; } div.goldfishSnapBottom { -webkit-box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); position:fixed !important; min-height:400px; height:400px; } div.goldfishSnapLeft { -webkit-box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); } div.goldfishSnapRight { -webkit-box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); } #component-ghostpane { background-color: ' + Goldfish.GetPrimaryColour() + ' } #component-holder { width:100%; } #component, #component-favourites, #component-layout, #component-settings { width: inherit !important; } #component-tabs { right:inherit; } #component .input input[type="text"] { background-color: #ffffff; }';

Goldfish.Create({
  menu: 'alternate-tabs',
  snappy: true,
  css: {
    //primary: '#188efb',
    overrides: styles
  }
});
