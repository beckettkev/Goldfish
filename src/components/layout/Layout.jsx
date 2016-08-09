import React from 'react';
import styles from './Layout.css';
import cssModules from 'react-css-modules';
import Title from '../title/Title.jsx';
import Available from '../available/Available.jsx';
import Button from '../../ui/Button.jsx';
import {SortableItems, SortableItem} from 'react-sortable-component';
import LayoutStore from '../../stores/LayoutStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';

function getLayoutState() {
  return {
    layout: LayoutStore.getLayout(),
  };
}

// ensure that any additional layout items are not already in the mix
function filterFromCurrentLayout(newLayouts, current, available) {
  const joined = current.concat(available);

  return newLayouts.filter(function(item) {
    return joined.every(function(existing) { return existing.label !== item.label; });
  });
}

function joinAndSortLayoutArray(source, target) {
  return source.concat(target).sort(function(a, b) {
    if (b.label < a.label) {
      return 1;
    } else if (b.label > a.label) {
      return -1;
    }

    return 0;
  });
}

class Layout extends React.Component {
  constructor(props) {
    super(props);

    PeopleSearchActions.fetchLayout();

    this.registerLayoutListener();

    this.state = getLayoutState();
  }

  componentWillMount() {
    LayoutStore.removeChangeListener(this.onLayoutChange);
  }

  componentDidMount() {
    LayoutStore.addChangeListener(this.onLayoutChange.bind(this));
  }

  componentDidUpdate() {
    if (this.state === null) {
      PeopleSearchActions.fetchLayout();

      this.state = getLayoutState();
    }
  }

  onFieldAddClick(option) {
    const field = this.state.layout.available.filter(function(el) { return el.label === option; })[0];

    this.state.layout.current.push(field);

    this.state.layout.available = this.state.layout.available.filter(function(n) { return n !== field; });

    PeopleSearchActions.updateLayout(this.state.layout);
  }

  onLayoutChange() {
    this.props.onLayoutChange(getLayoutState());

    this.state = getLayoutState();
  }

  onFieldRemoveClick(index) {
    this.state.layout.available.push(this.state.layout.current[index]);

    delete this.state.layout.current[index];

    this.state.layout.current = this.state.layout.current.filter(function(n) { return n !== undefined; });

    PeopleSearchActions.updateLayout(this.state.layout);
  }

  getAvailableLayoutFieldsHolder(available) {
    if (typeof available !== 'undefined') {
      if (available.length > 0) {
        return (
          <div key="available">
            <p styleName="info"><strong>Add</strong> additional items to the layout.</p>
            <Available
              options={available}
              onChange={this.onFieldAddClick.bind(this)} />
          </div>
        );
      }
    }
  }

  getCurrentLayoutFieldsHolder(current) {
    if (typeof current !== 'undefined') {
      if (current.length > 0) {
        return (
              <div className="content">
                <p styleName="info"><strong>Re-order</strong> and <strong>remove</strong> items from the layout.</p>

                <div key="current-layout-fields" styleName="sortable-container">
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

  createLayoutItems(type, field, i) {
    return (
      <SortableItem key={'layout-' + i} className="animated flipInX">
        <div styleName="current-item">
          <div key={i}>
            {field.label}
          </div>
          <div styleName="removal-button">
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

  registerLayoutListener() {
    if (typeof window.goldfishLayoutEventRegistered === 'undefined') {
      document.addEventListener('Goldfish.Layouts', this.addNewLayoutItems.bind(this), false);

      window.goldfishLayoutEventRegistered = true;
    }
  }

  // Only add new items when the state is ready
  addNewLayoutItems(e) {
    if (typeof e.detail.layouts !== 'undefined') {
      if (typeof this.state === 'undefined') {
        setTimeout(function() { this.addNewLayoutItems(e); }, 800);
      } else {
        const newLayouts = filterFromCurrentLayout(e.detail.layouts, this.state.layout.current, this.state.layout.available);
        const layout = this.state.layout;

        layout.available = joinAndSortLayoutArray(layout.available, newLayouts);

        PeopleSearchActions.updateLayout(layout);
      }
    }
  }

  handleLayoutSort(fields) {
    // we have moved the current fields around. Update the state and storage cache
    this.state.layout.current = fields;

    PeopleSearchActions.updateLayout(this.state.layout);
  }

  render() {
    if (this.state !== null) {
      const layoutComponentStyles = {
        display: 'none !important',
        paddingTop: this.props.paddingTop,
      };

      return (
        <div id="component-layout" styleName="component" style={layoutComponentStyles}>
          <div styleName="container">
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

Layout.propTypes = {
  title: React.PropTypes.string,
  paddingTop: React.PropTypes.string,
  onLayoutChange: React.PropTypes.func,
};

export default cssModules(Layout, styles, { allowMultiple: true });
