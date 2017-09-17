export interface IMenuProps {
  view?: string,
  onExport?: Function,
  alternate?: string,
}

export interface IMenuState {
  target?: any,
  isContextMenuVisible?: boolean
}