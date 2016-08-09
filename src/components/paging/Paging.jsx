/* eslint no-script-url: 0 */
import React from 'react';
import styles from './Paging.css';
import cssModules from 'react-css-modules';
import Utils from '../../utils/utilities';
import SearchStore from '../../stores/SearchStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import Button from '../../ui/Button.jsx';

function getStoreSearchResultPagingState() {
  return {
    items: SearchStore.getResults(),
    searching: false,
    count: SearchStore.getResultCount(),
    term: SearchStore.getCurrentSearchTerm(),
    pageNum: SearchStore.getCurrentPage(),
    text: '',
  };
}

class Paging extends React.Component {
  constructor(props) {
    super(props);

    this.state = getStoreSearchResultPagingState();
  }

  componentWillMount() {
    SearchStore.removeChangeListener(this.onComponentChange);
  }

  componentDidMount() {
    SearchStore.addChangeListener(this.onComponentChange.bind(this));
  }

  onComponentChange() {
    this.props.onPaging(getStoreSearchResultPagingState());
  }

  onPageClick(pageNum) {
    this.getPageResults(pageNum);
  }

  onPreviousPageClick() {
    // previous button click - go back to previous set of results
    const num = this.getCurrentPage();

    this.getPageResults(num - 1);
  }

  onNextPageClick() {
    // next button click - go back to the next set of results
    const num = this.getCurrentPage();

    this.getPageResults(num + 1);
  }

  getPageResults(pageNum) {
    const properties = typeof this.props.properties !== 'undefined' ? this.props.properties : '';
    const url = Utils.getFullSearchQueryUrl(this.props.term, properties);

    this.props.onSearching();

    PeopleSearchActions.fetchData(url, this.props.term, pageNum);
  }

  getPagingNodeCount() {
    return Math.ceil(this.props.count / 10);
  }

  getCurrentPage() {
    // we need to know which one to highlight in the pagination (set the default to one if we don't seem to be currently paging)
    if (typeof this.props.pageNum !== 'undefined') {
      if (this.props.pageNum === 0) {
        return 1;
      }

      return this.props.pageNum;
    }

    return 1;
  }

  getPagingLink(num, current) {
    const pagingCssClasses = current ? 'pager self' : 'pager';

    // render a paging hyper link for each available pagination item
    return (
      <a
        href="javascript:void(0)"
        key={num}
        styleName={this.getPagingNodeCount() === 1 ? 'hidden' : pagingCssClasses}
        onClick={this.onPageClick.bind(this, num)}>
          {num}
      </a>
    );
  }

  getPreviousPageLink() {
    return (
      <div key="prev" styleName={this.prevPageAvailable() ? 'prev-pager' : 'hidden'}>
        <Button
          icon="chevron_left"
          id="prev-page"
          onClick={this.onPreviousPageClick.bind(this)}
          accent raised mini />
      </div>
    );
  }

  getNextPageLink() {
    return (
      <div key="next" styleName={this.nextPageAvailable() ? 'next-pager' : 'hidden'}>
        <Button
          icon="chevron_right"
          id="next-page"
          onClick={this.onNextPageClick.bind(this)}
          accent raised mini />
      </div>
    );
  }

  // This function creates the pagination links
  getPagingNodes() {
    let node = 0;

    const pages = [];
    const current = this.getCurrentPage();
    const count = this.getPagingNodeCount();

    /*
        TODO:
            Only write out ten page links relative to where we are

    	 create a paging link for each result subset and set the current paging styles
    */
    while (node < count) {
      if ((node + 1) === current) {
        pages.push(this.getPagingLink(node + 1, true));
      } else {
        pages.push(this.getPagingLink(node + 1, false));
      }

      node += 1;
    }

    return pages;
  }

  nextPageAvailable() {
    const totalPageCount = this.getPagingNodeCount();

    if (typeof this.props.pageNum !== 'undefined') {
      if (this.props.pageNum < totalPageCount) {
        if (totalPageCount > 1) {
          return true;
        }
      }
    } else if (typeof this.props.pageNum === 'undefined' && totalPageCount > 1) {
      //no paging has been made but there are more than one pages
      return true;
    }

    return false;
  }

  prevPageAvailable() {
    return typeof this.props.pageNum !== 'undefined' ? this.props.pageNum > 1 : false;
  }

  render() {
    return (
      <div id="component-paging" styleName={this.getPagingNodeCount() < 2 ? 'paging-hidden' : 'paging'}>
        <span>
          {this.getPreviousPageLink()}
          {this.getPagingNodes()}
          {this.getNextPageLink()}
        </span>
      </div>
    );
  }
}

Paging.propTypes = {
  properties: React.PropTypes.object,
  count: React.PropTypes.number,
  pageNum: React.PropTypes.number,
  term: React.PropTypes.string,
  onSearching: React.PropTypes.func,
  onPaging: React.PropTypes.func,
};

export default cssModules(Paging, styles, { allowMultiple: true });
