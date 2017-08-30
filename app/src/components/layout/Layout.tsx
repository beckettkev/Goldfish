import * as React  from 'react';
import * as styles from './Layout.css';
import Title from '../title/Title';
import Available from '../available/Available';
import Button from '../../ui/Button';
import {SortableItems, SortableItem} from 'react-sortable-component';
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

  return newLayouts.filter((item:any) => joined.every((existing:any) => existing.label !== item.label ));
}

function joinAndSortLayoutArray(source:Array<any>, target:Array<any>):Array<any> {
  return source.concat(target).sort((a:any, b:any) => {
    if (b.label < a.label) {
      return 1;
    } else if (b.label > a.label) {
      return -1;
    }

    return 0;
  });
}

class Layout extends React.Component<ILayoutProps, ILayoutState> {
  constructor(props:ILayoutProps) {
    super(props);

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

  onFieldAddClick(option:string):void {
    const field:any = this.state.layout.available.filter((el:any) => el.label === option)[0];

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
          <div key="available">
            <p className={styles.info}>
              <strong>Add</strong> additional items to the layout.
            </p>
            <Available
              options={available}
              onChange={this.onFieldAddClick.bind(this)} />
          </div>
        );
      }
    }
  }

  getCurrentLayoutFieldsHolder(current:Array<any>):any {
    if (typeof current !== 'undefined') {
      if (current.length > 0) {
        return (
              <div className="content">
                <p className={styles.info}><strong>Re-order</strong> and <strong>remove</strong> items from the layout.</p>

                <div key="current-layout-fields" className={styles.sortableContainer}>
                  <SortableItems
                    name="sort-current"
                    items={current}
                    onSort={this.handleLayoutSort.bind(this)}>
                    {current.map(this.createLayoutItems.bind(this, 'current'))}
                  </SortableItems>
                </div>
              </div>
        );
      }
    }
  }

  createLayoutItems(type:string, field:any, i:number):JSX.Element {
    return (
      <SortableItem key={'layout-' + i} className="animated flipInX">
        <div className={styles.currentItem}>
          <div key={i}>
            {field.label}
          </div>
          <div className={styles.removalButton}>
            <Button
              icon="remove"
              key={i}
              onClick={this.onFieldRemoveClick.bind(this, i)}
              floating accent mini />
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
        <div id="component-layout" className={styles.component} style={layoutComponentStyles}>
          <div className={styles.container}>
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
