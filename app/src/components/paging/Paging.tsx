/// <reference path="./../../globals.d.ts"/>

/* eslint no-script-url: 0 */
import * as React  from 'react';
import * as styles from './Paging.css';
import { Utils } from '../../utils/utilities';
import SearchStore from '../../stores/SearchStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import { IPagingProps, IPagingState } from './IPaging';

function getStoreSearchResultPagingState():IPagingState {
  return {
    items: SearchStore.getResults(),
    searching: false,
    count: SearchStore.getResultCount(),
    term: SearchStore.getCurrentSearchTerm(),
    pageNum: SearchStore.getCurrentPage(),
    text: '',
  } as IPagingState;
}

class Paging extends React.Component<IPagingProps, IPagingState> {
  constructor(props:IPagingProps) {
    super(props);

    this.state = getStoreSearchResultPagingState();
  }

  componentWillMount():void {
    SearchStore.removeChangeListener(this.onComponentChange);
  }

  componentDidMount():void {
    SearchStore.addChangeListener(this.onComponentChange.bind(this));
  }

  onComponentChange():void {
    this.props.onPaging(getStoreSearchResultPagingState());
  }

  onPageClick(pageNum:number):void {
    this.getPageResults(pageNum);
  }

  onPreviousPageClick():void {
    // previous button click - go back to previous set of results
    const num:number = this.getCurrentPage();

    this.getPageResults(num - 1);
  }

  onNextPageClick():void {
    // next button click - go back to the next set of results
    const num:number = this.getCurrentPage();

    this.getPageResults(num + 1);
  }

  getPageResults(pageNum:number):void {
    const properties:any = typeof this.props.properties !== 'undefined' ? this.props.properties : '';
    const url:string = Utils.getFullSearchQueryUrl(this.props.term, properties);

    this.props.onSearching();

    PeopleSearchActions.fetchData(url, this.props.term, pageNum, false);
  }

  getPagingNodeCount():number {
    return Math.ceil(this.props.count / 10);
  }

  getCurrentPage():number {
    // we need to know which one to highlight in the pagination (set the default to one if we don't seem to be currently paging)
    if (typeof this.props.pageNum !== 'undefined') {
      return this.props.pageNum === 0 ? 1 : this.props.pageNum;
    }

    return 1;
  }

  getPagingLink(num:number, current:boolean):JSX.Element {
    const pagingCssClasses:string = current ? `${styles.pager} ${styles.self}` : `${styles.pager}`;

    // render a paging hyper link for each available pagination item
    return (
      <a
        href="javascript:void(0)"
        key={num}
        className={this.getPagingNodeCount() === 1 ? styles.hidden : pagingCssClasses}
        onClick={this.onPageClick.bind(this, num)}>
          {num}
      </a>
    );
  }

  getPreviousPageLink():JSX.Element {
    return (
      <div key="prev" className={this.prevPageAvailable() ? `${styles.prevPager} ms-font-s` : styles.hidden}>
        <IconButton
          onClick={this.onPreviousPageClick.bind(this)}
          iconProps={
            { 
              iconName: 'TriangleSolidLeft12' 
            } 
          }
          title="Previous page" />
      </div>
    );
  }

  getNextPageLink():JSX.Element {
    return (
      <div key="next" className={this.nextPageAvailable() ? `${styles.nextPager} ms-font-s` : styles.hidden}>
        <IconButton
          onClick={this.onNextPageClick.bind(this)}
          iconProps={
            { 
              iconName: 'TriangleSolidRight12' 
            } 
          }
          title="next page" />
      </div>
    );
  }

  // This function creates the pagination links
  getPagingNodes():Array<JSX.Element> {
    const current:number = this.getCurrentPage();
    const count:number = this.getPagingNodeCount();

    let node:number = 0;    
    let pages:Array<JSX.Element> = [];
    
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

  nextPageAvailable():boolean {
    const totalPageCount:number = this.getPagingNodeCount();

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

  prevPageAvailable():boolean {
    return typeof this.props.pageNum !== 'undefined' ? this.props.pageNum > 1 : false;
  }

  render():JSX.Element {
    return (
      <div id="component-paging" className={this.getPagingNodeCount() < 2 ? styles.pagingHidden : `${styles.paging} ms-font-s`}>
        <span>
          {this.getPreviousPageLink()}
          {this.getPagingNodes()}
          {this.getNextPageLink()}
        </span>
      </div>
    );
  }
}

export default Paging;
