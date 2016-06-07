/*
  Demo helper for launching goldfish on a non-sharepoint site (for demo purposes).
*/

var heightOfDemo = document.body.getBoundingClientRect().bottom;

Goldfish.Create({
	css: {
		primary: '#188efb',
		overrides: '#outer-space { top:0; height:' + heightOfDemo + 'px !important; } #component .input input[type="text"] { background-color: #ffffff; }'
	}
});