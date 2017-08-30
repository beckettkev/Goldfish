export interface ISuggestProps {
  onChange: Function,
  addKeys: Array<Number>,
  addOnBlur: boolean,
  onTagsChange: Function,
  removeKeys: Array<Number>,
  onlyUnique: boolean,
  tags: Array<any>,
  maxTags: number,
  validationRegex: RegExp,
  termsets: Array<any>,
  fields: Array<any>,
}

export interface ISuggestState {
  tag?: any,
  value?: string,
  suggestions: Array<any>,
}
