import React from 'react';
import ReactSelect from 'react-select';
import cssModules from 'react-css-modules';
import styles from './Available.css';

class Available extends React.Component {

	constructor (props) {
		super(props);
	}

	change (option) {
		if (option.label !== 'Add a field...') {
			this.props.onChange(option);
		}
	}

	render () {
		if (this.props !== null) {
			if (typeof this.props.options !== 'undefined') {
				const transition = this.props.options.length > 0 ? 'flipInY' : 'flipOutY';

				return (
					<div key='available-selector'>
						<ReactSelect
							name='available-fields'
						    className={'selector animated ' + transition}
							placeholder='Add a field...'
							options={this.props.options}
							onChange={this.change.bind(this)} />
					</div>
				);
			}
		}
	}

}

export default cssModules(Available, styles, { allowMultiple: true });
