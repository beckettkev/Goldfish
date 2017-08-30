export interface IPeopleSearchProps {
    buffer: number,
    className: string,
    max: number,
    min: number,
    mode: string,
    multicolor: boolean,
    type: any,
    value: number
}

export interface IPeopleSearchState {
    items: Array<any>,
    searching: boolean,
    refresh: boolean,
    settings: Array<any>,
    count: number,
    pageNum: number,
    term: string,
    text: string,
    favourites: Array<any>,
    layout: Array<any>
}