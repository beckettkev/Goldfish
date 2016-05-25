## Synopsis

Goldfish is a React.JS inline People Search tool for SharePoint 2013 (SPO). This tool provides people search results in a format configurable by the individual, inline within a SharePoint site (without taking you away from what you are doing).

## Motivation

The aim of this project is to allow you to search and save people anywhere within a SharePoint site without stopping what you are doing (the results are displayed where you are). The results show only the information that **you** the individual choose to see.

## Important - Breaking Changes

With version 1.0.0, we have changed the way layouts and person components work and therefore if you have used Goldfish before you will need to clear down your Goldfish local storage keys before using the latest code. It's a one of thing and it's quick and easy to do using the JavaScript below in your browser developer console:

```javascript
  // The objects have changed, clear down any ones that may have been created previously
  Object.keys(localStorage).forEach(function(item) { if (item.indexOf('PeopleSearch-') > -1) { localStorage.removeItem(item); });
```

## Code Example
```javascript
  // include a script link to the Goldfish bundle and then add the following line to load Goldfish
  Goldfish.Create();
```

## Code Example - Advanced
```javascript
  /*
   We can override and apply settings by creating an options object which we will pass into the goldfish create function.
   you can include as many or few of these as you choose.
   */
  var options = {
        // override the default title 'Goldfish'
        title: 'People Finder',
        // change the menu look and feel to have a horizontal menu
        menu: 'alternate-tabs',
        // pull back some extra custom properties so we can extend the layouts (see the RegisterLayouts code below)
        properties: 'Interests,Colleagues,PastProjects,Responsibilities',
        // hookup custom termsets to the tag suggest search (you can add more than one)...
        termsets: [{
              // the heading of the grouping
              title: 'Groups',
              type: 'Termset',
              // the managed property
              property: 'owsPeopleGroup',
              // the termset id to get the terms back to populate the group
              id: 'ae53d31c-ef24-4cca-a040-5e065d15bb31'
        }],
        // hookup user information fields to the tag suggest tool
        userInformationFields: [
            'JobTitle',
            'Department'
        ]
  };

  // this function loads Goldfish with the options you have specified
  Goldfish.Create(options);

  // If you want to add some custom fields to the layout, you can do that straight after calling the create function
  Goldfish.RegisterLayouts(
    [
      {
        label: 'Interests',
        value: 'Interests',
        key: 9,
        template: {
          // Prefix the interests with a label (e.g. Interests: JavaScript, Development)
          value: 'Interests:{0}|Interests'
        }
      },
      {
        label: 'Colleagues',
        value: 'Colleagues',
        key: 10,
        template: {
          value: 'Colleagues'
        }
      }
    ]
  );

```

## Installation

Install webpack via npm (globally):
```node
npm install webpack -g
```
When you have done that, install **Goldfish** by npm:
```node
npm install goldfish-search --save
```
You will then need to install the dependencies:
```node
npm install
```
Then you can build for development:
```node
webpack --progress
```
Or for production:
```node
npm run build
```
Alternatively you can split the SPA into two chunks for cache busting:
```node
npm run chunk
```

## API Reference

The first thing to do is decide if you need to supply some **options**. Options allow you to override the default settings for **Goldfish** and you can do this by taking a look at the full example below.

```javascript
var options = {
      // override the default title 'Goldfish'
        title: 'People Finder',
        // change the menu look and feel
        menu: 'alternate-tabs',
        // pull back some extra custom properties so we can extend the layouts
        properties: 'Interests,Colleagues,PastProjects,Responsibilities',
        // hookup custom termsets to the tag suggest search
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
        // hookup user information fields to the tag suggest tool
        userInformationFields: [
            'JobTitle',
            'Department'
        ],
        // custom CSS classes
        css: {
          //If you want to override the primary color
          primary: "#00FF00"
        }
  };
```
Then you can safely load Goldfish applying your parameters.

```
Goldfish.Create(options);
```

Alternatively you can just run it with the default settings.
```
Goldfish.Create();
```

Within the project there are some bundled some helper scripts to help you find the option values for when you want to add termsets to the tag suggest search. Simply run the following file on the SharePoint site you which will be using Goldfish and then copy the output and fill in the blank spaces (use this in the options as demonstrated above):

> https://github.com/beckettkev/Goldfish/blob/master/helpers/GoldfishTaxonomyHelper.js

If you need Goldfish to work on IE as well, you will probably want the relevant pollyfills to be included. We have a script to show how this can be done easily as well:

> https://github.com/beckettkev/Goldfish/blob/master/helpers/GoldfishLoadSafelyForIe.js

Once you have sorted that out, you have a few options for using Goldfish...

### Custom Action

Then you can grab the SharePoint **Custom Action** project from Github and deploy the sandbox solution to the site collection you want to use Goldfish on.

> https://github.com/beckettkev/Goldfish.CustomAction

**Please note**: The Goldfish JavaScript will need to be added to the style library in order for this custom action to function properly.

### Direct Reference

As an alternative to the above, simply add the script link to the Goldfish bundle app and then invoke Goldfish from a click event.

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
