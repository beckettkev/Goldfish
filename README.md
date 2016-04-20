## Synopsis

Goldfish is a React.JS inline People Search tool for SharePoint 2013 (SPO). This tool provides people search results in a format configurable by the individual, inline within a SharePoint site (without taking you away from what you are doing).

## Code Example
```javascript
	var options = {
		    title: 'People',
		    termsets: [
		        {
		        	//the heading of the grouping
		        	title: 'Groups',
					type: 'Termset',
		        	//the managed property
		        	property: 'owsPeopleGroup',
		        	//the termset id to get the terms back to populate the group
		        	id: 'ae53d31c-ef24-4cca-a040-5e065d15bb31'
		        },
		        {
		        	title: 'Regions',
		        	property: 'owsPeopleRegion',
		        	type: 'Termset',
		        	id: 'fdf1d1d0-769c-4b4d-b911-0ff8352a5d15'
		        }
		    ],
		    userInformationFields: [
		        'JobTitle',
		        'Department'
		    ]
	};

	Goldfish.Create(options);
```
## Motivation

The aim of this project is to allow you to search and save people anywhere within a SharePoint site without stopping what you are doing (the results are displayed where you are). The results show only the information that **you** the individual choose to see.

## Installation

You will need to install NPM (as a dependency) if you haven't already done so:
```node
npm install
```
Install webpack via npm (globally):
```node
npm install webpack -g
```
When you have done that, install **Goldfish** by npm:
```node
npm install goldfish-search --save
```
Then you can build for development:
```node
webpack
```
Or for production:
```node
npm run build
```

## API Reference

So the first thing to do is decide if you need to supply some **options**. Options allow you to override the default settings for **Goldfish** and you can do this by taking a look at the Code Example above. Once you have sorted that out, you have a few options for using Goldfish...

### Custom Action

Then you can grab the SharePoint **Custom Action** project from Github and deploy the sandbox solution to the site collection you want to use Goldfish on.

> https://github.com/beckettkev/Goldfish.CustomAction

**Please note**: The Goldfish JavaScript will need to be added to the style library in order for this custom action to function properly.

### Direct Reference

Or as an alternative to the above, simply add the script link to the Goldfish bundle app and then invoke Goldfish from a click event.

## Tests

To run lint against the JavaScript code in **Goldfish**

```
npm run lint
```

To run spec tests against **Goldfish**
```
npm run test
```

## Contributors

> @beckettkev

## License

The MIT License (MIT)

Copyright (c) 2016 beckettkev
