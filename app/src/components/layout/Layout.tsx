/// <reference path="./../../globals.d.ts"/>

import * as React  from 'react';
import * as styles from './Layout.css';
import Title from '../title/Title';
import Available from '../available/Available';
import { SortableItems, SortableItem } from 'react-sortable-component';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/icon';
import LayoutStore from '../../stores/LayoutStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';

import { ILayoutProps, ILayoutState } from "./ILayout";

function getLayoutState():any {
  return {
    layout: LayoutStore.getLayout(),
  };
}

// ensure that any additional layout items are not already in the mix
function filterFromCurrentLayout(newLayouts:Array<any>, current:Array<any>, available:Array<any>):Array<any> {
  const joined:Array<any> = current.concat(available);

  return newLayouts.filter((item:any) => joined.every((existing:any) => existing.text !== item.text ));
}

function joinAndSortLayoutArray(source:Array<any>, target:Array<any>):Array<any> {
  return source.concat(target).sort((a:any, b:any) => {
    if (b.text < a.text) {
      return 1;
    } else if (b.text > a.text) {
      return -1;
    }

    return 0;
  });
}

class Layout extends React.Component<ILayoutProps, ILayoutState> {
  constructor(props:ILayoutProps) {
    super(props);

    this.onFieldAddClick = this.onFieldAddClick.bind(this);

    PeopleSearchActions.fetchLayout();

    this.registerLayoutListener();

    this.state = getLayoutState();
  }

  componentWillMount():void {
    LayoutStore.removeChangeListener(this.onLayoutChange);
  }

  componentDidMount():void {
    LayoutStore.addChangeListener(this.onLayoutChange.bind(this));
  }

  componentDidUpdate():void {
    if (this.state === null) {
      PeopleSearchActions.fetchLayout();

      this.state = getLayoutState();
    }
  }

  onFieldAddClick(option:IDropdownOption):void {
    const field:IDropdownOption = this.state.layout.available.filter((f:any) => f === option)[0];

    this.state.layout.current.push(field);

    this.state.layout.available = this.state.layout.available.filter((n:any) => n !== field);

    PeopleSearchActions.updateLayout(this.state.layout);
  }

  onLayoutChange():void {
    this.props.onLayoutChange(getLayoutState());

    this.state = getLayoutState();
  }

  onFieldRemoveClick(index:any):void {
    this.state.layout.available.push(this.state.layout.current[index]);

    delete this.state.layout.current[index];

    this.state.layout.current = this.state.layout.current.filter((n:any) => n !== undefined);

    PeopleSearchActions.updateLayout(this.state.layout);
  }

  getAvailableLayoutFieldsHolder(available:Array<any>):any {
    if (typeof available !== 'undefined') {
      if (available.length > 0) {
        return (
          <div key="available" className="ms-Grid">
            <Available
              options={available}
              onChange={this.onFieldAddClick} />
          </div>
        );
      }
    }
  }

  getCurrentLayoutFieldsHolder(current:Array<any>):any {
    if (typeof current !== 'undefined') {
      if (current.length > 0) {
        return (
          <div className="content ms-font-s">
            <p className={styles.info}><strong>Re-order</strong> and <strong>remove</strong> items from the layout.</p>

            <div key="current-layout-fields" className={`${styles.sortableContainer} ms-Grid`}>
              <SortableItems
                name="sort-current"
                items={current}
                className={styles.sortableItem}
                onSort={this.handleLayoutSort.bind(this)}>
                {current.map(this.createLayoutItems.bind(this, 'current'))}
              </SortableItems>
            </div>
          </div>
        );
      }
    }
  }

  createLayoutItems(type:string, field:IDropdownOption, i:number):JSX.Element {
    return (
      <SortableItem key={'layout-' + i} className="ms-slideDownIn10">
        <div className={styles.currentItem}>
          <Icon
            style={ { marginRight: '8px' } }
            iconName={ field.data.icon }
            className={`ms-font-xl ${styles.layoutIcon}`}
            aria-hidden='true'
            title={ field.data.icon }
          />
          <div className={`${styles.layoutItem} ms-font-s`}>
            {field.text}
          </div>
          <div className={`${styles.removalButton}`}>
            <IconButton
              key={`layout-item-${i}`}
              onClick={this.onFieldRemoveClick.bind(this, i)}
              iconProps={
                { 
                  iconName: 'Remove' 
                } 
              }
              title="Remove item" />
          </div>
        </div>
      </SortableItem>
    );
  }

  registerLayoutListener():void {
    if (typeof window.goldfishLayoutEventRegistered === 'undefined') {
      document.addEventListener('Goldfish.Layouts', this.addNewLayoutItems.bind(this), false);

      window.goldfishLayoutEventRegistered = true;
    }
  }

  // Only add new items when the state is ready
  addNewLayoutItems(e:any):void {
    if (typeof e.detail.layouts !== 'undefined') {
      if (typeof this.state === 'undefined') {
        window.setTimeout(() => this.addNewLayoutItems(e), 800);
      } else {
        const newLayouts:Array<any> = filterFromCurrentLayout(e.detail.layouts, this.state.layout.current, this.state.layout.available);
        let layout:any = this.state.layout;

        layout.available = joinAndSortLayoutArray(layout.available, newLayouts);

        PeopleSearchActions.updateLayout(layout);
      }
    }
  }

  handleLayoutSort(fields:Array<any>):void {
    // we have moved the current fields around. Update the state and storage cache
    this.state.layout.current = fields;

    PeopleSearchActions.updateLayout(this.state.layout);
  }

  public render() {
    if (this.state !== null) {
      const layoutComponentStyles:any = {
        display: 'none !important',
        paddingTop: this.props.paddingTop,
      };

      return (
        <div id="component-layout" className="gf-component ms-Grid" style={layoutComponentStyles}>
          <div className={`${styles.container}`}>
            <Title
              text={this.props.title}
              suffix="Layout" />
          </div>

          {this.getAvailableLayoutFieldsHolder(this.state.layout.available)}

          {this.getCurrentLayoutFieldsHolder(this.state.layout.current)}
        </div>
      );
    }
  }
}

export default Layout;
