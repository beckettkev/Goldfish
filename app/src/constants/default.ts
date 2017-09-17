import { DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';

export let DefaultConstants: any = {
  MEMBERSHIP_CLAIMS: 'i:0#.f|membership|',
  DEFAULT_COLOUR: '#3E5875',
  // stores use this to emit a change
  CHANGE_EVENT: 'change',
  // default fields to include in the auto suggest drop down within the tag search
  DEFAULT_USERINFORMATION_FIELDS: ['JobTitle', 'Department'],
  // we need some default values for the active fields in the search results
  DEFAULT_CURRENT_LAYOUT: [
    {
      key: 'A',
      text: 'Name (with profile link)',
      data: { icon: 'People' },
      template: {
        value: 'PreferredName',
        href: 'Path',
        target: '_self',
      }
    },
    {
      key: 'B',
      text: 'Job Title',
      data: { icon: 'Work' },
      template: {
        value: 'JobTitle'
      }
    },
    {
      key: 'C',
      text: 'Department',
      data: { icon: 'LocationCircle' },
      template: {
        value: 'Department'
      }
    },
    {
      key: 'D',
      text: 'Telephone Number',
      data: { icon: 'AddPhone' },
      template: {
        value: 'WorkPhone'
      }
    }
    /*{
      label: 'Name (with profile link)',
      value: 'Name (with profile link)',
      key: 0,
      template: {
        value: 'PreferredName',
        href: 'Path',
        target: '_self',
      },
    },
    {
      label: 'Job Title',
      value: 'Job Title',
      key: 1,
      template: {
        value: 'JobTitle',
      },
    },
    {
      label: 'Department',
      value: 'Department',
      key: 2,
      template: {
        value: 'Department',
      },
    },
    {
      label: 'Telephone Number',
      value: 'Telephone Number',
      key: 3,
      template: {
        value: 'WorkPhone',
        icon: 'call',
      },
    },*/
  ],
  // we need some default values for the available but unused fields for the search results
  DEFAULT_AVAILABLE_LAYOUT: [
    { key: 'Header', text: 'People Fields', itemType: DropdownMenuItemType.Header },
    {
      key: 'E',
      text: 'Name (with email link)',
      data: { icon: 'OutlookLogo' },
      template: {
        value: 'PreferredName',
        href: 'WorkEmail',
        target: '_blank',
      }
    },
    {
      key: 'F',
      text: 'Name',
      data: { icon: 'PeopleAdd' },
      template: {
        value: 'PreferredName'
      }
    },
    {
      key: 'G',
      text: 'Office',
      data: { icon: 'Room' },
      template: {
        value: 'BaseOfficeLocation'
      }
    },
    {
      key: 'H',
      text: 'Mobile Number',
      data: { icon: 'CellPhone' },
      template: {
        value: 'MobileNumber'
      }
    },
    {
      key: 'I',
      text: 'Email',
      data: { icon: 'OutlookLogo' },
      template: {
        value: 'WorkEmail',
        href: 'WorkEmail',
        target: '_blank',
      }
    }
    /*{
      label: '',
      value: 'Name (with email link)',
      key: 4,
      template: {
        value: 'PreferredName',
        href: 'WorkEmail',
        target: '_blank',
      },
    },
    {
      label: 'Name',
      value: 'Name',
      key: 5,
      template: {
        value: 'PreferredName',
      },
    },
    {
      label: 'Office',
      value: 'Office',
      key: 6,
      template: {
        value: 'BaseOfficeLocation',
      },
    },
    {
      label: 'Mobile Number',
      value: 'Mobile Number',
      key: 7,
      template: {
        value: 'MobilePhone',
        icon: 'smartphone',
      },
    },
    {
      label: 'Email',
      value: 'Email',
      key: 8,
      template: {
        value: 'WorkEmail',
        href: 'WorkEmail',
        target: '_blank',
      },
    },*/
  ],
  // we need some default values for the app settings
  DEFAULT_SETTINGS: [
    { label: 'Show Favourites', internal: 'showFavourites', type: 'switch', value: true },
    { label: 'Suggest Search', internal: 'enableSuperSearch', type: 'switch', value: false },
    { label: 'Constant Results', internal: 'inifiniteScroll', type: 'switch', value: false },
  ],
  // no need for default favourites, but nice to have the option
  DEFAULT_FAVOURITES: [],
  // ignored search result fields
  IGNORED_VALUES: ['Rank', 'DocId', 'piSearchResultId', 'RenderTemplateId', 'ProfileQueriesFoundYou', 'ProfileViewsLastWeek', 'ProfileViewsLastMonth', 'EditProfileUrl', 'ResultTypeId', 'Culture', 'UrlZone', 'PartitionId', 'OriginalPath'],
} as any;
