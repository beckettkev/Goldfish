import React from 'react';
import styles from './Layout.css';
import cssModules from 'react-css-modules';
import Title from '../title/Title.jsx';
import Button from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import {SortableItems, SortableItem} from 'react-sortable-component';
import SortableStyle from 'react-sortable-component/lib/sortable.css';
import LayoutStore from '../../stores/LayoutStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import Utils from '../../utils/utilities';

function getLayoutState() {
	return {
			layout: LayoutStore.getLayout()
	}
}

const TooltipButton = Tooltip(Button);

const Layout = React.createClass({

    propTypes: {
      onLayoutChange: React.PropTypes.func
    },

    getInitialState() {
      PeopleSearchActions.fetchLayout();

      return getLayoutState();
    },

    componentDidUpdate() {
        if (this.state === null) {
          this.setState(this.getInitialState());
        }
    },

    handleLayoutSort(fields) {
      //we have moved the current fields around. Update the state and storage cache
			this.state.layout.current = fields;

			PeopleSearchActions.updateLayout(this.state.layout);
    },

		onFieldRemoveClick(index, e) {
      this.state.layout.available.push(this.state.layout.current[index]);

      delete this.state.layout.current[index];

      this.state.layout.current = this.state.layout.current.filter(function(n){ return n != undefined });

      PeopleSearchActions.updateLayout(this.state.layout);
    },

    onFieldAddClick(index, e) {
      this.state.layout.current.push(this.state.layout.available[index]);

      delete this.state.layout.available[index];

      this.state.layout.available = this.state.layout.available.filter(function(n){ return n != undefined });

    	PeopleSearchActions.updateLayout(this.state.layout);
    },

  	componentDidMount() {
  	    LayoutStore.addChangeListener(this.onLayoutChange.bind(this));
  	},

  	componentWillMount() {
  	    LayoutStore.removeChangeListener(this.onLayoutChange);
  	},

    onLayoutChange() {
		  this.props.onLayoutChange(getLayoutState());

			this.setState(getLayoutState());
    },

    createLayoutItems ( type, field, i ) {
        let boundClick;
        let that = this;

        if (type === 'current') {
                boundClick = that.onFieldRemoveClick.bind(that, i);
            
                return (
                    <SortableItem key={'layout-' + i} className={'animated flipInY'}>
                      <div styleName='current-item'>
                        <div key={i}>
                            {field.label}
                        </div>
                        <div styleName={'removal-button'}>
                            <TooltipButton icon='remove' key={i} onClick={boundClick} floating accent mini tooltip='Remove field' />
                        </div>
                      </div>
                    </SortableItem>
                );
        } else if (type === 'available') {
                boundClick = that.onFieldAddClick.bind(that, i);

                return ( 
                    <div key={'field-add-' + i} styleName={'left'} className={'animated flipInY'}>
                      <div>
                          <TooltipButton icon='add' key={i} onClick={boundClick} floating accent mini tooltip='Add field' />
                      </div>
                      <div>
                          {field.label}
                      </div>
                    </div>
                );
        }                         
    },   
    
    getAvailableLayoutFieldsHolder() {
        if (this.state.layout.available.length > 0) {
            return(
                    <div key={'available-container'} styleName={'available-container'}>
                        {this.state.layout.available.map(this.createLayoutItems.bind(this, 'available'))}
                    </div>
            );
        }          
    },

    getCurrentLayoutFieldsHolder() {         
          if (this.state.layout.current.length > 0) {
              return(
                    <div key='current-layout-fields' styleName={'sortable-container'}>
                         <SortableItems name='sort-current' items={this.state.layout.current} onSort={this.handleLayoutSort.bind(this)}>
                              {this.state.layout.current.map(this.createLayoutItems.bind(this, 'current'))}
                         </SortableItems>
                    </div>
              );          
          }
    },

  	render() {

      if (this.state !== null) {
            let layoutComponentStyles = {
                display:'none !important'
            };

            return (
                <div id={'component-layout'} styleName={'component'} style={layoutComponentStyles}>
                    <div styleName='container'>

                      <Title text={this.props.title} suffix='Layout' />
                  
                    </div>
                    <br /><br />

                    <h2 styleName={'layout-heading'}>Current Layout</h2>

                    <p styleName='info'>This is where you can <strong>re-order</strong> and <strong>remove</strong> items from the results layout.</p>
                   
                   <div className={'content'}>
                        {this.getCurrentLayoutFieldsHolder()}
                    </div>

                    <h2 styleName={'layout-heading'}>Available Fields</h2>
                    
                    <p styleName='info'>This is where you can <strong>add</strong> additional fields to results layout.</p>
                    
                    <div className={'content'}>
                        {this.getAvailableLayoutFieldsHolder()}
                    </div>
                </div>
          );        
      }

	}
});

module.exports = cssModules(Layout, styles, { allowMultiple: true });
