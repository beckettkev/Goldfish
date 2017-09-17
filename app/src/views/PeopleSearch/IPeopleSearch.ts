export interface IPeopleSearchProps {
    buffer?: number,
    className?: string,
    options?: any,
    max?: number,
    min?: number,
    mode?: string,
    multicolor?: boolean,
    type?: any,
    value?: number
}

export interface IPeopleSearchState {
    items?: Array<any>,
    searching?: boolean,
    refresh?: boolean,
    settings?: Array<any>,
    count?: number,
    pageNum?: number,
    term?: string,
    text?: string,
    favourites?: Array<any>,
    suggestions?: Array<any>,
    layout?: Array<any>,
    termsets?: Array<any>,
    userInformationFields?: Array<any>,
    showPanel?: boolean
}