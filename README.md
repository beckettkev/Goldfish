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

The aim of this project is to allow you to search and save people anywhere within a SharePoint site without stopping what you are doing (the results are displayed where you are). The results show only the information that **you** the individual choose to see. 

## Installation

You probably want to start by installing **Goldfish** by npm:

npm install Goldfish --save


## API Reference

So the first thing to do is decide if you need to supply some options. Options allow you to override the default settings for Goldfish and you can do this by taking a look at the Code Example above. Once you have sorted that out, you have a few options for using Goldfish...

### Custom Action

Then you can grab the SharePoint **Custom Action** project from Github and deploy the sandbox solution to the site collection you want to use Goldfish on.

### Direct Reference

Or as an alternative to the above, simply add the script link to the Goldfish bundle app and then invoke Goldfish from a click event.

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)

