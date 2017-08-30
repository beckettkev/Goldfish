export interface IFavouritesProps {
  options?: Array<any>,
  favourites?: Array<any>,
  layout?: any,
  title?: string,
  paddingTop?: number,
  onChange?: Function,
  onFavouritesChange?: Function,
  onItemUpdate?: Function,
}

export interface IFavouritesState {
  favourites?: Array<any>,
}