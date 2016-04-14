import React from 'react';
import styles from './PeopleSearch.css';
import cssModules from 'react-css-modules';
import Menu from 'components/menu/Menu.jsx';
import Search from 'components/search/Search.jsx';
import Settings from 'components/settings/Settings.jsx';
import Layout from 'components/layout/Layout.jsx';
import Favourites from 'components/favourites/Favourites.jsx';
import Results from 'components/results/Results.jsx';
import Paging from 'components/paging/Paging.jsx';
import Title from 'components/title/Title.jsx';
import FavouriteStore from 'stores/FavouriteStore';
import LayoutStore from 'stores/LayoutStore';
import PeopleSearchActions from 'actions/PeopleSearchActions';
import Exporter from 'utils/exporter';
import SettingsManager from 'utils/settings';

function getFavouritesState () {
	PeopleSearchActions.getFavourites();

	return FavouriteStore.getCurrentFavourites();
}

function getLayoutState () {
	PeopleSearchActions.fetchLayout();

	return LayoutStore.getLayout();
}

const PeopleSearch = React.createClass({

	propTypes: {
		options: React.PropTypes.object
	},

	getInitialState () {
		//the very first thing we do in the app is apply any options present
		this.applyOptions();

		return {
			items: [],
			searching: false,
			refresh: false,
			settings: [],
			count: 0,
			pageNum: 0,
			term: '',
			text: '',
			favourites: getFavouritesState(),
			layout: getLayoutState()
		};

	},

	componentDidUpdate () {
		//ie workaround
		if (this.state === null) {
			this.setState(this.getInitialState());
		}
	},

	onRefreshFinish () {
		this.setState({
			refresh: false
		});
	},

	onSettingChange (collection) {
		this.setState({
			settings: collection
		});

		this.applyOptions();
	},

	onSearch (items) {
		this.setState(items);

		this.setState({
			searching: false,
			refresh: false
		});
	},

	onSearching () {
		this.setState({
			searching: true,
			items: [],
			count: 0,
			pageNum: 0,
			refresh: false
		});
	},

	onExport () {
		if (this.state.items.length > 0) {
			const csv = Exporter.convertArrayObjectsToCsv(this.state.items);

			if (csv.length > 0) {
				const csvFileName = this.state.term.replace(/ /g, '-');

				Exporter.exportCsvStringToFile(csv, csvFileName);
			}
		}
	},

	onPage (pages) {
		this.setState(pages);
	},

	onFavouritesChange (favourites) {
		this.setState({favourites: favourites});
	},

	onItemUpdate (index, favourite, type) {
		let items = this.state.items;

		if (type === 'person') {
		  items[index].Cells.Favourite = favourite;

		  this.setState({ items: items });
		} else {
		  //refresh the view now the favourites have changed
		  this.setState({ refresh: true });
		}
	},

	onLayoutChange (view) {
		this.setState(view);
	},

	applyOptions () {

		if (Object.keys(this.props.options).length > 0) {
			//suggest taxonomy applied from options

			if (typeof this.props.options.termsets !== 'undefined') {
				this.setState({ termsets: this.props.options.termsets });
			}

			if (typeof this.props.options.userInformationFields !== 'undefined') {
				this.setState({ userInformationFields: this.props.options.userInformationFields });
			}

			//css overrides applied from options
			if (typeof this.props.options.css !== 'undefined') {
				if (typeof this.props.options.css.overrides !== 'undefined') {
				   SettingsManager.settingRouting('cssOveride', this.props.options.css.overrides);
				}
			}
		} else {
			this.setState({ suggestions: [] });
		}

	},

	render () {

		if (this.state === null) {

			this.componentDidUpdate();

			return null;

		} else {

			return (
				<div id={'outer-space'} key='outer-space' className={'animated bounceInRight'}>

				  <Menu onExport={this.onExport} />

				  <div id={'component'} styleName={'component'}>
					  <div styleName='container'>

							<Title text={this.props.options.title} />

					  </div>
					  <div className={'content'}>
						<div className={'ui center aligned'} styleName='container'>

							<Search 
								onSearchChanged={this.onSearch.bind(this)}
								onSearching={this.onSearching.bind(this)}
								settings={this.state.settings}
								termsets={this.state.termsets}
								userInformationFields={this.state.userInformationFields} />

						</div>
					  </div>
					  <div className={'content'} id={'component-vision'} styleName={'everything-worth-while'}>

							<Paging 
								count={this.state.count}
								onSearching={this.onSearching.bind(this)}
								pageNum={this.state.pageNum}
								term={this.state.term}
								onPaging={this.onPage.bind(this)} />

							<Results
								items={this.state.items}
								term={this.state.term}
								refresh={this.state.refresh}
								onRefreshFinish={this.onRefreshFinish.bind(this)}
								searching={this.state.searching}
								favourites={this.state.favourites}
								layout={this.state.layout}
								onLayoutChange={this.onLayoutChange.bind(this)}
								onFavouritesChange={this.onFavouritesChange.bind(this)}
								onItemUpdate={this.onItemUpdate.bind(this)} />

							<Paging
								count={this.state.count}
								onSearching={this.onSearching.bind(this)}
								pageNum={this.state.pageNum}
								term={this.state.term}
								onPaging={this.onPage.bind(this)} />

					  </div>
				  </div>

				  <Favourites
							layout={this.state.layout}
							title={this.props.options.title}
							favourites={this.state.favourites}
							onFavouritesChange={this.onFavouritesChange.bind(this)}
							onItemUpdate={this.onItemUpdate.bind(this)} />

				  <Layout
							title={this.props.options.title}
							onLayoutChange={this.onLayoutChange.bind(this)} />

				  <Settings
							title={this.props.options.title}
							onSettingChange={this.onSettingChange.bind(this)} />

				</div>
			);

		}

	}
});

export default cssModules(PeopleSearch, styles);
