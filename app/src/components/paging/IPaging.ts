export interface IPagingProps {
  properties: any,
  count: number,
  pageNum: number,
  term: string,
  onSearching: Function,
  onPaging: Function,
}

export interface IPagingState {
  items?: Array<any>,
  searching?: boolean,
  count?: number,
  term?: string,
  pageNum?: number,
  text?: string,
}