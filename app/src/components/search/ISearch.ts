export interface ISearchProps {
  termsets?: Array<any>,
  userInformationFields?: Array<any>,
  properties?: any,
  settings?: Array<any>,
  suggestions?: Array<any>,
  onSearchChanged?: Function,
  onSearching?: Function,
}

export interface ISearchState {
  items?: Array<any>,
  searching?: boolean,
  count?: number,
  pageNum?: number,
  term?: string,
  text?: string,
  tags?: Array<any>
}