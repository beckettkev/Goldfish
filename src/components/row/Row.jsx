import React from 'react';
import styles from './Row.css';
import cssModules from 'react-css-modules';
import Persona from '../persona/Persona.jsx';
import Utils from '../../utils/utilities';
import Button from 'react-toolbox/lib/button';
import FileSaver from '../../data/filesaver';
import Exporter from '../../utils/exporter';

class Row extends React.Component {

	constructor (props) {
		super(props);
	}
	
	normal (person, key, value, style, length) {
		if (person[value] === null) {
			return null;
		} else {
			return Utils.getTrimmedString(person[value], length);
		}
	}

	hyperlink (person, key, href, target, value, style, length) { 
		const prefix = href.toLowerCase().indexOf('email') > -1 ? 'mailto:' : '';

		if (person[href] === null) {
			return null;
		} else {
			return (
				<a key={`item-${href}-${key}`} href={`${prefix}${person[href]}`} target={target}>
					{Utils.getTrimmedString(person[value], length)}
				</a>
			);	
		}		
	}
	
	icon (icon, key) {
		return (
			<i 
				key={`item-${icon}-${key}`}
				className={'material-icons'} styleName={'icon'}>
					{icon}
			</i>
		);
	}

    /**
    * Function that takes the information about the item and layout and renders the row
    * @param {key} the index of the item
    * @param {layout} the row layout
    * @param {person} the person data
    */
	getRowFromLayout(key, layout, person) {
		let item = [];
		
		//regardless of if the row is a link or plain text, we need these values
		const { value } = layout;
		const length = typeof layout.max === 'undefined' ? 30 : layout.max;
		
		let style = '';
		let prefix = null;

		if (typeof layout.icon !== 'undefined' && layout.icon !== null) {
			const { icon } = layout;

			style = 'floatLeft';

			prefix = this.icon(icon, key);
		}

		if (typeof layout.href !== 'undefined' && layout.href !== null) {
			const { href, target } = layout;

			//render hyper link row
			item.push(this.hyperlink(person.items.Cells, key, href, target, value, style, length));
		} else {
			//render plain text row
			item.push(this.normal(person.items.Cells, key, value, style, length));
		}

		if (item[0] !== null && prefix !== null) {
			item.push(prefix);
			item.reverse();
		}

		return item;
	}
		
	render () {				
		const { id, element, person } = this.props;

		return (
			<div key={`item-row-${id}`}>
				{this.getRowFromLayout(id, element.template, person)}
			</div>
		);
	}
}

export default cssModules(Row, styles, { allowMultiple: true });
