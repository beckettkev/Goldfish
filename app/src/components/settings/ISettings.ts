export interface ISettingsProps {
  title: string,
  paddingTop: string,
  onSettingChange: Function,
}

export interface ISettingsState {
  showFavourites?: boolean,
  enableSuperSearch?: boolean,
  inifiniteScroll?: boolean,
  [key: string]: boolean
}
