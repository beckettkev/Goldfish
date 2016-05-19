/*
	This helper script will allow you to invoke Goldfish safely in IE.

	Simply copy the built bundled JS file and paste it into your browser's console window (developer toolbar).
	Once this has finished, copy the script below and paste it using the same approach.
*/
function addHeadResource(src, type, callback) {
	var link = document.createElement(type === 'js' ? 'script' : 'link');

	link.setAttribute(type === 'js' ? 'src' : 'href', src);
	link.setAttribute(type === 'js' ? 'type' : 'rel', type === 'js' ? 'text/javascript' : 'stylesheet');

	if (typeof callback !== 'undefined') {
		link.onreadystatechange = function ( ) {
			if (this.readyState == 'complete') {
				callback();
			}
		};

		link.onload = function ( ) {
			callback();
		};
	}

	document.getElementsByTagName('head')[0].appendChild(link);
}

(function() {
	var ua = window.navigator.userAgent;

	if (ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1 || ua.indexOf('Edge/') > -1) {
		//IE Pollyfill
		addHeadResource('https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js', 'js', Goldfish.Create);
	} else {
		//not in ie
		Goldfish.Create();
	}
})();