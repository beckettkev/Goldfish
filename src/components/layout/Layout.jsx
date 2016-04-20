import React from 'react';
import styles from './Layout.css';
import cssModules from 'react-css-modules';
import Title from '../title/Title.jsx';
import Available from '../available/Available.jsx';
import Button from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import {SortableItems, SortableItem} from 'react-sortable-component';
import LayoutStore from '../../stores/LayoutStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';

function getLayoutState () {
	return {
		layout: LayoutStore.getLayout()
	};
}

const TooltipButton = Tooltip(Button);

class Layout extends React.Component {

		static propTypes: {
			onLayoutChange: React.PropTypes.func
		};

		constructor (props) {
			super(props);

			PeopleSearchActions.fetchLayout();

			this.state = getLayoutState();
		}

		componentDidUpdate () {
			if (this.state === null) {
				this.state = getLayoutState();
			}
		}

		handleLayoutSort (fields) {
			//we have moved the current fields around. Update the state and storage cache
			this.state.layout.current = fields;

			PeopleSearchActions.updateLayout(this.state.layout);
		}

		onFieldRemoveClick (index) {
			this.state.layout.available.push(this.state.layout.current[index]);

			delete this.state.layout.current[index];

			this.state.layout.current = this.state.layout.current.filter(function (n){ return n !== undefined; });

			PeopleSearchActions.updateLayout(this.state.layout);
		}

		onFieldAddClick (option) {
			this.state.layout.current.push(option);

			this.state.layout.available = this.state.layout.available.filter(function (n){ return n !== option; });

			PeopleSearchActions.updateLayout(this.state.layout);
		}

		componentDidMount () {
			LayoutStore.addChangeListener(this.onLayoutChange.bind(this));
		}

		componentWillMount () {
			LayoutStore.removeChangeListener(this.onLayoutChange);
		}

		onLayoutChange () {
			this.props.onLayoutChange(getLayoutState());

			this.setState(getLayoutState());
		}

		createLayoutItems (type, field, i) {
			return (
				<SortableItem key={'layout-' + i} className={'animated flipInY'}>
					<div styleName='current-item'>
						<div key={i}>
							{field.label}
						</div>
						<div styleName={'removal-button'} className={'animated flipInY'}>
							<TooltipButton 
								icon='remove' 
								key={i} 
								onClick={this.onFieldRemoveClick.bind(this, i)} 
								floating accent mini 
								tooltip='Remove field' />
						</div>
					</div>
				</SortableItem>
			);
		}

		getAvailableLayoutFieldsHolder () {
			if (this.state.layout.available.length > 0) {
				return (
					<div key="available">
						<p styleName='info'><strong>Add</strong> additional items to the layout.</p>
							<Available 
								options={this.state.layout.available}
								onChange={this.onFieldAddClick.bind(this)} />
					</div>
				);
			}
		}

		getCurrentLayoutFieldsHolder () {
			if (this.state.layout.current.length > 0) {
				return(
					<div className={'content'}>
						<p styleName='info'><strong>Re-order</strong> and <strong>remove</strong> items from the layout.</p>

						<div key='current-layout-fields' styleName={'sortable-container'}>
							<SortableItems 
								name='sort-current' 
								items={this.state.layout.current} 
								onSort={this.handleLayoutSort.bind(this)}>
								{this.state.layout.current.map(this.createLayoutItems.bind(this, 'current'))}
							</SortableItems>
						</div>
					</div>
				);
			}
		}

		render () {
			if (this.state !== null) {
				const layoutComponentStyles = {
					display: 'none !important'
				};

				return (
					<div id={'component-layout'} styleName={'component'} style={layoutComponentStyles}>
						<div styleName='container'>
							<Title 
								text={this.props.title} 
								suffix='Layout' />
						</div>
					
						{this.getAvailableLayoutFieldsHolder()}
							
						{this.getCurrentLayoutFieldsHolder()}
					</div>
				);
			}
		}
}

export default cssModules(Layout, styles, { allowMultiple: true });
