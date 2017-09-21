export interface IMenuProps {
  view?: string,
  onExport?: Function,
  onNavigationRoute?: Function,
  alternate?: string,
}

export interface IMenuState {
  target?: any,
  isContextMenuVisible?: boolean
}