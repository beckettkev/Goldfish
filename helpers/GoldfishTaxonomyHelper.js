/*
    This helper script will display possible termset options for Goldfish by querying
    the termstore for the given SPO environment you run the script against.

    You can copy the relevant outputs from the developer toolbar (console window) to your Goldfish options file.
    Remember to amend the values to insert your managed propert(ies).
*/
jQuery.getScript(getBaseUrl() + '/_layouts/15/sp.taxonomy.js', function() {
    var context = new SP.ClientContext.get_current();
    var session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
    var termStore = session.getDefaultSiteCollectionTermStore();
    var groups = termStore.get_groups();
    var termSets = [];

    context.load(groups);

    context.executeQueryAsync(function () {
        var groupsEnum = groups.getEnumerator();

        console.log('Suggest Options');
        console.log('===============')

        while (groupsEnum.moveNext()) {
            var currentGroup = groupsEnum.get_current();

            var group = {
              name: currentGroup.get_name(),
              id: currentGroup.get_id()
            };

            getTermSets(context, currentGroup.get_termSets(), group.name);
        }
    });
});

function getTermSets(context, termSets, name) {
    context.load(termSets);

    context.executeQueryAsync(
                function(){
                    var termSetEnum = termSets.getEnumerator();

                    while(termSetEnum.moveNext()) {
                        var termSet = termSetEnum.get_current();
                        var termSetName = termSet.get_name();
                        var termSetId = termSet.get_id();

                        console.log('{ title:"' + termSet.get_name() + '", property:"<MANAGED PROPERTY NAME>", id:"' + termSet.get_id() + '" }');
                    }
                }
    );
}

function getBaseUrl() {
      if (!window.location.origin) {
          window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
      }

      var path = window.location.pathname.split('/');

      if (typeof path[2] === "undefined") {
          return `${window.location.origin}`;
      } else {
          return `${window.location.origin}/${path[1]}/${path[2]}`;
      }
}