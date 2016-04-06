# Goldfish

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
