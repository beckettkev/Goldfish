/* eslint no-unused-vars: 1 */
/* eslint new-cap: 0 */
/* global SP */
import Cache from 'cache-funk';
import Utils from '../utils/utilities';
import StorageConstants from '../constants/storage';

// REPLACE with Core-js if possible...
require('es6-promise').polyfill();

// this function checks to see if there is a valid and up to date terms cache from the local storage (otherwise fetch fresh data).
const checkCacheForTermSets = (termSets, cache) => typeof cache !== 'undefined' ? cache.payload.some(termSet => termSets.indexOf(termSet.id) === -1) : false;

const getTerm = (term) => {
  return {
    name: term.get_name(),
    search: item.property + ':"' + term.get_name() + '"',
  };
};

const getTermStructure = (items, context, terms) => {
  return new Promise((resolve, reject) => {
    let term;
    let data;
    let item;
    let termsEnumerator;
    let collection = [];

    context.executeQueryAsync(() => {
        Object.keys(terms).forEach(function(key) {
          termsEnumerator = terms[key].getEnumerator();

          // How do we get the correct item detail
          // find the correct index of the array
          item = items.filter(element => element.id === key)[0];

          data = {
            title: item.title,
            terms: []
          };

          while (termsEnumerator.moveNext()) {
            term = termsEnumerator.get_current();

            // remove inactive terms
            if (term.get_name().toLowerCase().indexOf('inactive') === -1) {
              // just like with JobTitles (userInformationList.js) - we need to save each term in the correct JSON structure
              data.terms.push(getTerm(term));
            }
          }

          collection.push(data);
        });

        // we now have the collection of Terms grouped by Termset in the structure the auto sugggest tool needs
        resolve(collection);
      },
      (sender, args) => {
        console.log(args.get_message());

        reject('Unable to access Managed Metadata Service.');
      }
    );
  });
};

const isValidTermset = (termset) => {
  if (typeof item.id !== 'undefined' && typeof item.property !== 'undefined') {
    return item.id !== '' && item.property !== '';
  }

  return false;
};

/*
  This function is the entry point called by the Action. It retrieves a collection of terms, grouped by the termset name (and relevant managed property)
  As an input, it requires an array of termset objects containing:
    id: The GUID of the termset
    mapping: The managed property

  eg...
    [{id:'FGE4-8ADB1-BA001A-GA4342', mapping: 'owsBusinessRegion'}, ...]

  For further information about how you can obtain this information for your tenancy, use the TaxonomyHelper.js file
*/
const getTermsByTermSets = termSets => {
  return new Promise((resolve, reject) => {
    const cache = Cache.fetch(StorageConstants.TERMS_STORAGE_KEY);

    if (checkCacheForTermSets(termSets, cache)) {
      resolve(cache.payload);
    } else {
      jQuery.getScript(Utils.getBaseUrl() + '/_layouts/15/sp.taxonomy.js', function() {
        const context = new SP.ClientContext.get_current();
        const session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
        const termStore = session.getDefaultSiteCollectionTermStore();

        let termSet = {};
        let terms = {};

        termSets.forEach(function(item) {
          if (isValidTermset(item)) {
              termSet[item.id] = termStore.getTermSet(item.id);
              terms[item.id] = termSet[item.id].getAllTerms();

              context.load(terms[item.id]);
          }
        });

        // now we have loaded all of the termsets we need to process, execute the Async Query (getTermStructure)
        getTermStructure(termSets, context, terms).then(collection => {
          resolve(collection);

          Cache.store(StorageConstants.TERMS_STORAGE_KEY, Utils.buildStoragePayload(collection));
        });
      });
    }
  });
};

module.exports = {
  getTermsByTermSets: getTermsByTermSets,
};
