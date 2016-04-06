import React from 'react';
import styles from './Paging.css';
import cssModules from 'react-css-modules';
import Utils from '../../utils/utilities';
import SearchStore from '../../stores/SearchStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import IconButton from 'react-toolbox/lib/button';

function getStoreSearchResultPagingState() {
    return {
        items: SearchStore.getResults(),
        searching: false,
        count: SearchStore.getResultCount(),
        term: SearchStore.getCurrentSearchTerm(),
        pageNum: SearchStore.getCurrentPage(),
        text: ''
    }
}

const Paging = React.createClass({

	propTypes: {
      count: React.PropTypes.number,
      pageNum: React.PropTypes.number,
      term: React.PropTypes.string,
			onSearching: React.PropTypes.func,
			onPaging: React.PropTypes.func,
	},

  getInitialState() {
    return getStoreSearchResultPagingState();
  },

  getPageResults(pageNum) {
    let url = Utils.getFullSearchQueryUrl(this.props.term);

    this.props.onSearching();

    PeopleSearchActions.fetchData(url, this.props.term, pageNum);
  },

  componentDidMount() {
    SearchStore.addChangeListener(this.onComponentChange.bind(this));
  },

  componentWillMount() {
    SearchStore.removeChangeListener(this.onComponentChange);
  },

  onComponentChange() {
    this.props.onPaging(getStoreSearchResultPagingState());
  },

  getPagingNodeCount() {
    return Math.ceil(this.props.count / 10);
  },

  getCurrentPage() {
    //we need to know which one to highlight in the pagination (set the default to one if we don't seem to have a page set)
    let num = typeof this.props.pageNum !== 'undefined' ?
                (
                  this.props.pageNum === 0 ?
                    1 :
                    this.props.pageNum
                ) : 1;

    return num;
  },

  onPageClick(pageNum, e) {
    this.getPageResults(pageNum);
  },

  onPreviousPageClick() {
    //previous button click - go back to previous result set
    let num = this.getCurrentPage();

    this.getPageResults(num - 1);
  },

  onNextPageClick() {
    //next button click - go back to the next result set
    let num = this.getCurrentPage();

    this.getPageResults(num + 1);
  },

  prevPageAvailable() {
      return typeof this.props.pageNum !== 'undefined' ? this.props.pageNum > 1 : false;
  },

  nextPageAvailable() {
      let totalPageCount = this.getPagingNodeCount();

      return typeof this.props.pageNum !== 'undefined' ? this.props.pageNum < totalPageCount : totalPageCount > 1 ? true : false;
  },

  getPagingLink(num, current) {
    let pagingCssClasses = current ? 'pager self' : 'pager';

    //render a paging hyper link for each available pagination item
    return (
        <a href={'javascript:void(0)'} key={num} styleName={this.getPagingNodeCount() === 1 ? 'hidden' : pagingCssClasses} onClick={this.onPageClick.bind(this, num)}>{num}</a>
    );
  },

  getPreviousPageLink() {
    return (
        <div key={'prev'} styleName={this.prevPageAvailable() ? 'prev-pager' : 'hidden'}>
            <IconButton icon='chevron_left' id='prev-page' onClick={this.onPreviousPageClick.bind(this)} accent raised mini />
        </div>
    );
  },

  getNextPageLink() {
    return (
        <div key={'next'} styleName={this.nextPageAvailable() ? 'next-pager' : 'hidden'}>
            <IconButton icon='chevron_right' id='next-page' onClick={this.onNextPageClick.bind(this)} accent raised mini />
        </div>
    );
  },

  //This function creates the pagination links
  getPagingNodes() {
    let node = 0;
    let current = this.getCurrentPage();
    let count = this.getPagingNodeCount();
    let pages = [];

    /*
        TODO:
            Only write out ten page links relative to where we are
    */
    //create a paging link for each result subset and set the current paging styles
    while (node < count) {
        if ((node + 1) === current) {
            pages.push(this.getPagingLink(node + 1, true));
        } else {
            pages.push(this.getPagingLink(node + 1, false));
        }

        node += 1;
    }

    return pages;
  },

  render() {
      return (
        <div id={'component-paging'} styleName={this.getPagingNodeCount() < 2 ? 'paging-hidden' : 'paging'}>
          <span>
            {this.getPreviousPageLink()}
            {this.getPagingNodes()}
            {this.getNextPageLink()}
          </span>
        </div>
      );      
  }
});

module.exports = cssModules(Paging, styles, { allowMultiple: true });
