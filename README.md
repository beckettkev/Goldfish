## Synopsis

Goldfish is a React.JS inline People Search tool for SharePoint 2013 (SPO). This tool provides people search results in a format configurable by the individual, inline within a SharePoint site (without taking you away from what you are doing).

## Motivation

The aim of this project is to allow you to search and save people anywhere within a SharePoint site without stopping what you are doing (the results are displayed where you are). The results show only the information that **you** the individual choose to see.

![Goldfish Overview](http://sharepointcookies.com/wp-content/uploads/2016/07/gf_demo_080716_a1M9Or.gif)

## Installation

To get started you first need to follow the steps below, to configure your environment and install Goldfish ready for use (we will go into detail on how you can use it a little later).

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

## Using Goldfish

Now that you have bundled the Goldfish app, you will need to upload and add a JavaScript reference to the file in the normal manner. After you have done this, you can take a look at the code examples in the following section to see how you can implement Goldfish...

## Code Example - Easy
```javascript
  // include a script link to the Goldfish bundle and then add the following line to load Goldfish
  Goldfish.Create();
```

## Code Example - Simple
```javascript
  // include a script link to the Goldfish bundle and then add the following lines to load Goldfish
  Goldfish.Create({
    // a different menu
    menu: 'alternate-tabs',
    css: {
      // override the default theme colour
      primary: '#188efb'
    }
  });
```

## Code Example - More advanced
```javascript
  // include a script link to the Goldfish bundle and then add the following lines to load Goldfish
  var heightOfDemo = document.body.getBoundingClientRect().bottom;

  // some override styles to help goldfish work with repositioning
  var styles = '#outer-space { height:' + heightOfDemo + 'px; padding-left:15px; width:410px; -webkit-perspective: none; top:85px; } div.goldfishSnapTop #component-results, div.goldfishSnapBottom #component-results { position: relative; } div.goldfishSnapTop #component-favourites div.sortable-item, div.goldfishSnapBottom #component-favourites div.sortable-item { float: left; width: 400px; } div.goldfishSnapTop #component-favourites div.sortable-item:first-child,  div.goldfishSnapBottom #component-favourites div.sortable-item:first-child { border-width: 0px; } div.goldfishSnapTop #component-results div.person-card-holder, div.goldfishSnapBottom #component-results div.person-card-holder { width:100% !important; } div.goldfishSnapTop #component-results div.person-card, div.goldfishSnapBottom #component-results div.person-card { margin: 0 0 10px 10px; width: 400px; float:left; } #component-paging { float: none; clear: both; } div.goldfishSnapTop { -webkit-box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75); -moz-box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75); box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75); position:fixed !important; } div.goldfishSnapBottom { -webkit-box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); position:fixed !important; } div.goldfishSnapLeft { -webkit-box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); } div.goldfishSnapRight { -webkit-box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); } #component-ghostpane { background-color: ' + Goldfish.GetPrimaryColour() + ' } #component-holder { width:100%; } #component, #component-favourites, #component-layout, #component-settings { width: inherit !important; } #component-tabs { right:inherit; } #component .input input[type="text"] { background-color: #ffffff; }';

  // Loading Goldfish with the ability to reposition (drag and drop via the title) and applying the override styles
  Goldfish.Create({
    menu: 'alternate-tabs',
    snappy: true,
    css: {
      primary: '#188efb',
      overrides: styles
    }
  });
```

## Code Example - Super Advanced
```javascript
  /*
   We can override and apply lots of different settings by creating an options object which we will pass into the goldfish create function.
   you can include as many or few of these as you choose (as shown in the previous examples).

   In this example we will look at how we can extend the search, add additional fields in the results and change the default title.
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

  /*
   Now when we can add the additional fields. You just need to make sure the fields you add are included in the properties attribute of your options. If you want to add some custom fields to the layout, you can do that straight after calling the create function
  */
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


## API Reference

The first thing to do is decide if you need to supply some **options**. Options allow you to override the default settings for **Goldfish** (see examples above for more information). Then you can safely load Goldfish applying your parameters.

```
Goldfish.Create(options);
```

Within the project there are some bundled some helper scripts to help you find the option values for when you want to add termsets to the tag suggest search. Simply run the following file on the SharePoint site you which will be using Goldfish and then copy the output and fill in the blank spaces (use this in the options as demonstrated above):

> https://github.com/beckettkev/Goldfish/blob/master/helpers/GoldfishTaxonomyHelper.js

Along with this we have some quick starters to get you up and running:

> https://github.com/beckettkev/Goldfish/blob/master/helpers/GoldfishDemoHelper.js
> https://github.com/beckettkev/Goldfish/blob/master/helpers/GoldfishSideBySide.js

If you need Goldfish to work on IE as well (which you propably do), you will probably want the relevant pollyfills to be included. We have a script to show how this can be done easily as well:

> https://github.com/beckettkev/Goldfish/blob/master/helpers/GoldfishLoadSafelyForIe.js

Just remember to add your options logic into the mix. Once you have sorted that out, you have a few options for using Goldfish...

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
