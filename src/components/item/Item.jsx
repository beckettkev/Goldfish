import React from 'react';
import styles from './Item.css';
import cssModules from 'react-css-modules';
import Persona from '../persona/Persona.jsx';
import Utils from '../../utils/utilities';
import Button from 'react-toolbox/lib/button';
import FileSaver from '../../data/filesaver';
import Exporter from '../../utils/exporter';

const PREFIX_CLAIMS: 'i:0#.f|membership|';

class Item extends React.Component {

	static propTypes: {
		key: React.propTypes.string,
		person: React.propTypes.array
	}

	constructor (props) {
		super(props);
	}
	
	value (key, value) {
		return (
			<span key={'item-' + key}>
				{value}
			</span>
		);
	}

	link (href, target, key, value) {
		return (
			<span key={key}>
				<a href={href} target={target}>
					{value}
				</a>
			</span>
		);
	}
	
	persona (person, key) {
		const member = {
				name: person.items.Cells.PreferredName,
				loginName: PREFIX_CLAIMS + person.items.Cells.WorkEmail,
				email: person.items.Cells.WorkEmail
			};

		return (
			<div key={key}>
				<Persona 
					member={member} />
			</div>
		);
	}
	
	icon (icon, style) {
		return (
			<i className={'material-icons'} styleName={style}>{icon}</i>
		);
	}
	
	button (key, icon, callback) {
		return (
			<span key={'command-' + key} styleName='command' className='commandor'>
				<Button
					icon={icon}
					floating accent mini
					onClick={callback} />
			</span>
		);
	}

	/* 
		Callback functions for when a user clicks on a command button

	search (name, mp) {
		window.location.href = window.location.protocol + '//' + window.location.host + '/search/Pages/results.aspx?k=' + mp + name;
	},
		
	yammer (name) {
		window.location.href = 'https://www.yammer.com/#/Threads/Search?search=' + name;
	},
		
	outlookExport (person) {
		const card = Exporter.getContactForExport(person);
		const blob = new Blob([card.data], {type: 'text/x-vcard;charset=iso-8859-1'});

		FileSaver.saveAs(blob, card.name + '.vcf');
	}	
	*/
	
	getItem ({href, target, value, icon, callback}) {
		return (	
	
		);
	}

	render () {
		return (
			{this.props.map(this.getItem.bind(this))}
		);
	}
}

export default cssModules(Item, styles, { allowMultiple: true });
