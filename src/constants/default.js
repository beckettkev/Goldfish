module.exports = {
      //stores use this to emit a change
      CHANGE_EVENT: 'change',
      //default fields to include in the auto suggest drop down within the tag search
      DEFAULT_USERINFORMATION_FIELDS: ['JobTitle', 'Department'],
      //we need some default values for the active fields in the search results
      DEFAULT_CURRENT_LAYOUT: [
            { label: 'Name (with profile link)', key: 0 },
            { label: 'Job Title', key: 1 },
            { label: 'Department', key: 2 },
            { label: 'Telephone Number', key: 3 }
      ],
      //we need some default values for the available but unused fields for the search results
      DEFAULT_AVAILABLE_LAYOUT: [
            { label: 'Name (with email link)', key: 4 },
            { label: 'Name', key: 5 },
            { label: 'Office', key: 6 },
            { label: 'Mobile Number', key: 7 },
            { label: 'Email', key: 8 },
            { label: 'Documents', key: 9 },
            { label: 'Everything', key: 10 },
            { label: 'Yammer', key: 11 },
            { label: 'Export to Outlook', key: 12 }
      ],
      //we need some default values for the app settings
      DEFAULT_SETTINGS: [
            { label: 'Show Favourites', internal: 'showFavourites', type: 'switch', value: true },
            { label: 'Show on Right', internal: 'showOnRight', type: 'switch', value: true },
            { label: 'Enable Tag Search', internal: 'enableSuperSearch', type: 'switch', value: false }
      ],
      //no need for default favourites, but nice to have the option
      DEFAULT_FAVOURITES: [],
      //ignored search result fields
      IGNORED_VALUES: ['Rank','DocId','piSearchResultId','RenderTemplateId','ProfileQueriesFoundYou','ProfileViewsLastWeek','ProfileViewsLastMonth','EditProfileUrl','ResultTypeId','Culture','UrlZone','PartitionId','OriginalPath']
};
