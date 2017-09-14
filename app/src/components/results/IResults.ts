export interface IResultsProps {
  refresh?: boolean,
  term?: string,
  items?: Array<any>,
  layout?: any,
  favourites?: Array<any>,
  searching?: boolean,
  onItemUpdate?: Function,
  onFavouritesChange?: Function,
  onLayoutChange?: Function,
  onRefreshFinish?: Function
}

export interface IResultsState {

}