// after goldfish has run...
var head = document.head || document.getElementsByTagName('head')[0];
var overrides = document.createElement('style');

overrides.type = 'text/css';

var css = '#menu-items { display:none; } #outer-space { width: 100%; } #component, #component-favourites, #component-layout, #component-settings { display:block;	box-shadow: 0 0 2px #d9d9d9; }#component {right: 1200px;}#component-favourites {right: 800px;}#component-layout {right: 400px; }';

if (overrides.styleSheet) {
	overrides.styleSheet.cssText = css;
} else {
	overrides.appendChild(document.createTextNode(css));
}

//position all panels within the app side by side
head.appendChild(overrides);

//reveal the hidden pnaels (divs)
['component','component-favourites','component-layout','component-settings'].forEach(function(el) {
	document.getElementById(el).style.display = 'block';
});