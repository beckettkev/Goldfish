export interface ISuggestProps {
  onChange?: any,
  addKeys?: Array<Number>,
  addOnBlur?: boolean,
  onTagsChange?: any,
  removeKeys?: Array<Number>,
  userInformationFields?: Array<any>,
  onlyUnique?: boolean,
  tags?: Array<any>,
  maxTags?: number,
  validationRegex?: RegExp,
  termsets?: Array<any>,
  fields?: Array<any>,
  value?: any,
  floating?: boolean,
  className?: string
}

export interface ISuggestState {
  tag?: any,
  value?: string,
  suggestions: Array<any>,
}
