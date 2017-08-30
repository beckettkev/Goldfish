// This definition is used before typings-for-css-modules-loader generates .d.ts files.
// As soon as typings are found tsc will prefer them.
declare module "*.css" {
	interface IClassNames {
		[className: string]: string;
	}

	const classNames: IClassNames;
	export = classNames;
}

interface IProperty {
	key: string,
	label: string,
	value: string
}

interface IPropertyGroup {
	label: string,
	properties: Array<IProperty>,
	propertyKeys: any
}

interface ITermCustomProperty {
	[id: string]: string;
}

interface ITerm {
	label: string,
	value: string,
	path: string,
	name: string,
	guid: string,
	customProperties: Array<ITermCustomProperty>
}

interface IListItemsData {
	baseDivId: string,
	listTitle: string,
	fields: string,
	headings: string,
	filter: string,
	formatAsCurrency: string,
	itemsToShow: number,
	appClientId: string,
	baseAppUrl: string
}

interface Goldfish {
	options: any,
	interval: any,
	ApplyAppSettings: Function,
	Create: Function,
	DisableDragAndDrop: Function,
	FakeExecuteOrDelay: Function,
	GetjQueryStatus: Function,
	GetjQuery: Function,
	GetPrimaryColour: Function,
	HouseKeeping: Function,
	KeyPressListener: Function,
	LoadStyleSheet: Function,
	LoadScript: Function,
	ObjectPayloadCheck: Function,
	OverrideThemeColours: Function,
	Ready: Function,
	RegisterLayouts: Function,
	Snappy: Function,
	Swim: Function
}

interface Window {
	dropElementDragEnter: any,
	dropElementDragLeave: any,
	dropElementDrop: any,
	DUCBindDragDrop: any,
	escapeProperly: any,
	encodeURIComponent: any,
	ExecuteOrDelayUntilScriptLoaded: Function,
	CustomEvent: any,
	fakeAjaxCalls: boolean,
	Goldfish: Goldfish,
	goldfishLayoutEventRegistered: boolean,
	houseKeeping?: boolean,
	IMNRC: any,
	jQuery: any,
	keyWatcher?: any,
	ListViewWpRenderData: IListItemsData,
	removeListener: Function,
	SP: any,
	SPStatusNotificationData: any,
	SPNotification: any,
	Sys: any,
	_spPageContextInfo: any
}

declare module 'react-sortable-component' {
	var SortableItems: any, SortableItem: any;

	export {
		SortableItems,
		SortableItem
	};
}

declare module 'AutosuggestContainer' {
	var Autosuggest: any;

	export default Autosuggest;
}

declare module 'autosuggest-highlight' {
	var AutosuggestHighlight: any;

	export default AutosuggestHighlight;
}

declare module 'classnames' {
	var ClassNames: any;

	export default ClassNames;
}