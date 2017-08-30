/* eslint no-unused-vars: 1 */
/* eslint new-cap: 0 */
/* global SP */
import Cache from 'cache-funk';
import { Utils } from '../utils/utilities';
require('es6-promise').polyfill();

const TERMS_STORAGE_KEY: string = 'PeopleSearch-Terms';

/*
  This function checks to see if there is a valid and up to date terms cache from the local storage (otherwise fetch fresh data).
*/
function checkCacheForTermSets(termSets: Array<any>, cache: any): boolean {
  if (typeof cache !== 'undefined') {
    return cache.payload.some((termSet: any) => termSets.indexOf(termSet.id) === -1);
  }

  return false;
}

function getTermStructure(items: Array<any>, context: any, terms: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let term: any;
    let data: any;
    let item: any;
    let termsEnumerator: any;
    let collection: Array<any> = [];

    context.executeQueryAsync(
      () => {
        Object.keys(terms).forEach((key: string) => {
          termsEnumerator = terms[key].getEnumerator();

          // How do we get the correct item detail
          // find the correct index of the array
          //  Filter out the appropriate one
          item = items.filter((element: any) => element.id === key)[0];

          data = {};
          data.title = item.title;
          data.terms = [];

          while (termsEnumerator.moveNext()) {
            term = termsEnumerator.get_current();

            // remove inactive terms
            if (term.get_name().toLowerCase().indexOf('inactive') === -1) {
              // just like with JobTitles (userInformationList.js) - we need to save each term in the correct JSON structure
              data.terms.push(
                {
                  name: term.get_name(),
                  search: item.property + ':"' + term.get_name() + '"',
                }
              );
            }
          }

          collection.push(data);
        });

        // we now have the collection of Terms grouped by Termset in the structure the auto sugggest tool needs
        resolve(collection);
      },
      (sender: any, args: any) => {
        console.log(args.get_message());

        reject('Unable to access Managed Metadata Service.');
      }
    );
  });
}

/*
  This function is the entry point called by the Action. It retrieves a collection of terms, grouped by the termset name (and relevant managed property)
  As an input, it requires an array of termset objects containing:
    id: The GUID of the termset
    mapping: The managed property

  eg...
    [{id:'FGE4-8ADB1-BA001A-GA4342', mapping: 'owsBusinessRegion'}, ...]

  For further information about how you can obtain this information for your tenancy, use the TaxonomyHelper.js file
*/
const getTermsByTermSets = (termSets: Array<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cache: any = Cache.fetch(TERMS_STORAGE_KEY);

    if (checkCacheForTermSets(termSets, cache)) {
      resolve(cache.payload);
    } else {
      window.jQuery.getScript(Utils.getBaseUrl() + '/_layouts/15/sp.taxonomy.js', function () {
        const context: any = new window.SP.ClientContext.get_current();
        const session: any = window.SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
        const termStore: any = session.getDefaultSiteCollectionTermStore();
        const termSet: any = {};
        const terms: any = {};

        termSets.forEach((item: any): void => {
          if (typeof item.id !== 'undefined' && typeof item.property !== 'undefined') {
            if (item.id !== '' && item.property !== '') {
              termSet[item.id] = termStore.getTermSet(item.id);
              terms[item.id] = termSet[item.id].getAllTerms();

              context.load(terms[item.id]);
            }
          }
        });

        // now we have loaded all of the termsets we need to process, execute the Async Query (getTermStructure)
        getTermStructure(termSets, context, terms).then((collection: Array<any>): void => {
          resolve(collection);

          Cache.store(TERMS_STORAGE_KEY, Utils.buildStoragePayload(collection));
        });
      });
    }
  });
};

export {
  getTermsByTermSets,
};
