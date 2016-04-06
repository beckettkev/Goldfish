## Synopsis

Goldfish is a React.JS inline People Search tool for SharePoint 2013 (SPO). This tool provides people search results in a format configurable by the individual, inline within a SharePoint site (without taking you away from what you are doing). 

## Code Example

	var options = {
		title: 'People',
	    termsets: [
	        {
	        	//the heading of the grouping
	        	title: 'Groups',
	        	
	        	//type declares if it is a Termset or a Field in the User Information List
	        	type: 'Termset',
	        	
	        	//the managed property
	        	property: 'owsPeopleGroup',
	        
	        	//the termset id to get the terms back to populate the group
	        	id: 'be53d31c-ef24-4cca-a040-5e065d14bb34'
	        },
	        {
	        	title: 'Regions',
	        	property: 'owsPeopleRegion',
	        	type: 'Termset',
	        	id: 'edc4d2d0-869c-4b4d-b911-0ff8352a5d15'
	        }
	    ],
	    userInformationFields: [
	        'JobTitle',
	        'Department'
	    ]
	};

	Goldfish.Load(options);

## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## Installation

Provide code examples and explanations of how to get the project.

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)



TODO - 24.03.2016 @ 18:19

The final 2 points to finish off Goldfish for release (in priority order):

	1) CSS flow on cards for command buttons (different options)

	2) Jasmine / Jest specs integration

Bugs

	- Z-index of auto suggest in IE once a search has been done (paging is higher)
	- Drag and drop does not work on landing page of team sites
	- Remove existing tags if switched to normal search
	- Commence search on tag removal
	- CSS for Goldfish removal

Ideas

	- Option in settings for finding all names on a page (highlighting) alowing users to select them so they search in Goldfish

Steps

	If loading into IE, make sure you follow the polly fill steps below.

	After getting the code from TFS run the following commands:

		- npm install --save-dev babel-preset-stage-0

		- npm install

		- webpack

IE POLLY FILL LOAD

	//IE Pollyfill
	var cracker = document.createElement("script");

	cracker.setAttribute("type","text/javascript");
	cracker.setAttribute("src","https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js");

	//Handle IE
	cracker.onreadystatechange = function ( ) {
	    if (this.readyState == "complete") {
	          console.log('sanitised');
	    }
	};

	document.getElementsByTagName("head")[0].appendChild(cracker);

Animate CSS Load

    //setup the google materials fonts for the UI
    var sheet = document.createElement('link');

    sheet.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css');
    sheet.setAttribute('rel','stylesheet');

    //Handle better browsers
    sheet.onload = function () {
       console.log('Animate CSS Loaded');
    };

    document.getElementsByTagName("head")[0].appendChild(sheet);

Ideas

	- Provide a route to check the url and load a page with a pre-defined search query in Goldfish

Other News
	
	Finding all storage items in IE

		Object.keys(localStorage).forEach(function(item, i) { console.log(item); }); 

	Removing Storage Items in IE

		Object.keys(localStorage).forEach(function(item, i) { if (item.indexOf('PeopleSearch') > -1) { localStorage.removeItem(item); } });

	Custom Action to Add Menu Item

		http://sharepoint.stackexchange.com/questions/111086/trigger-javascript-on-custom-action-ribbon-menu-item

	Drag and drop does not work on Document Library pages!!!!

		window.ExecuteOrDelayUntilScriptLoaded(function() {
			if (typeof window.DUCBindDragDrop !== 'undefined') {
				
				removeListener(document.body, 'dragenter', dropElementDragEnter);				
				removeListener(document.body, 'dragover', null);
				removeListener(document.body, 'dragleave', dropElementDragLeave);
				removeListener(document.body, 'drop', dropElementDrop);

				console.log('Drag and Drop has been dropped!');
			}
		},'dragdrop.js');

	To load it again for document libraries.

		window.ExecuteOrDelayUntilScriptLoaded(function() {
			if (typeof window.DUCBindDragDrop !== 'undefined') {
				//to re-invoke
				window.DUCBindDragDrop();

				console.log('Drag and Drop has been renewed!');
			}
		},'dragdrop.js');
	


		let dragAndDropUploadType;

		ExecuteOrDelayUntilScriptLoaded(function() {
				console.log('Disabling the Drag and Drop [OOB]');

				dragAndDropUploadType = g_uploadType;

				//Disable the control whilst the App is shown
				g_uploadType = DragDropMode.NOTSUPPORTED;
				SPDragDropManager.DragDropMode = DragDropMode.NOTSUPPORTED;
				//Hide the drag and drop prompt.
				jQuery('.ms-dragDropAttract-subtle').toggle();
		}, "DragDrop.js");

		...event that causes the app to close..

		funtion enableDragAndDrop() {
			if (typeof dragAndDropUploadType !== 'undefined') {
				g_uploadType = dragAndDropUploadType;
				SPDragDropManager.DragDropMode = dragAndDropUploadType;
				//Hide the drag and drop prompt.
				jQuery('.ms-dragDropAttract-subtle').toggle();
			}		
		}

Options example for Goldfish (Arup)

	var options = {
		title: 'People',
	    css: {
	        //The is the override for the primary colour
	        primary: '#333ed3',
	        //overrides are CSS rules applied for the client
	        overrides: '#component-tabs { left: 5px !important; }'
	    },
	    termsets: [
	        {
	        	//the heading of the grouping
	        	title: 'Groups',
	        	
	        	//type declares if it is a Termset or a Field in the User Information List
	        	type: 'Termset',
	        	
	        	//the managed property
	        	property: 'ArupPeopleGroup',
	        
	        	//the termset id to get the terms back to populate the group
	        	id: 'be53d31c-ef24-4cca-a040-5e065d14bb34'
	        },
	        {
	        	title: 'Regions',
	        	property: 'ArupPeopleRegion',
	        	type: 'Termset',
	        	id: 'edc4d2d0-869c-4b4d-b911-0ff8352a5d15'
	        },
	        {
	        	title: 'Office',
	        	property: 'ArupPeopleOfficeLocation',
	        	type: 'Termset',
	        	id: '5fa37a14-0abf-4d92-a57e-78253ae81628'
	        }
	    ],
	    userInformationFields: [
	        'JobTitle',
	        'Department'
	    ]
	};

//Options example for Content and Code
var options = {
		title: 'People',
	    css: {
	        //The is the override for the primary colour
	        primary: '#333ed3',
	        //overrides are CSS rules applied for the client
	        overrides: '.cheese { position: absolute; }'
	    },
	    userInformationFields: [
	        'JobTitle',
	        'Department'
	    ]
};


Loader Logic 

<script type="text/javascript">
	
	function addHeadLink(src, type, callback) {
		var link = document.createElement(type === 'js' ? 'script' : 'link');

		link.setAttribute(type === 'js' ? 'src' : 'href', src);
		link.setAttribute(type === 'js' ? 'type' : 'rel', type === 'js' ? 'text/javascript' : 'stylesheet');

		if (typeof callback !== 'undefined') {
			link.onreadystatechange = function ( ) {
			    if (this.readyState == "complete") {
			        callback(true);
			    }
			};
		}

		document.getElementsByTagName("head")[0].appendChild(link);
	}

	(function() {
		var ua = window.navigator.userAgent;

	    if (ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1 || ua.indexOf('Edge/') > -1) {
			//IE Pollyfill
			addHeadLink('https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js', 'js', getGoldfish);
	    } else {
	    	//not in ie
			getGoldfish(true);
	    }
	})();

    function getAnimateCss() {
        addHeadLink('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css', 'css');
    }

    function getGoldfish(animate) {
    	if (typeof animate !== 'undefined') {
    		if (animate) {
	    		getAnimateCss();
    		}
    	}

		addHeadLink('https://candc365.sharepoint.com/sites/KevBTestSite/Style%20Library/goldfish.min.js', 'js');
    }
</script>