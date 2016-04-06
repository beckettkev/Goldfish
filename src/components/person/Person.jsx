import React from 'react';
import styles from './Person.css';
import cssModules from 'react-css-modules';
import Utils from '../../utils/utilities';
import Persona from '../persona/Persona.jsx';
import FavouriteStore from '../../stores/FavouriteStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import Button from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import FileSaver from '../../data/filesaver';
import Exporter from '../../utils/exporter';

const TooltipButton = Tooltip(Button);

/*
	TODO: Refactor this class it is horrible.
*/
const Person = React.createClass({

	propTypes: {
		id: React.PropTypes.string,
		data: React.PropTypes.object,
      	favourites: React.PropTypes.array,
		layout: React.PropTypes.object,
		refresh: React.PropTypes.bool,
		onItemUpdate: React.PropTypes.func,
		onFavouritesChange: React.PropTypes.func
	},

	onFavouriteClick(person, action, index) {
	    let favourites = this.props.favourites;

		if (action === 'add') {
	    	person.Cells.Favourite = true;

		    favourites.push({
		       	name: person.Cells.PreferredName,
		       	data: person
		    });
	    } else if (action === 'remove') {
	        //remove the favourite
		    favourites = favourites.filter(function(n) {
	        			   	return n.name !== person.Cells.PreferredName
	        			 });
	    }

	    //this updates the UI with the changes made to favourites either from search or the favourites screen.
	    //if the index value is set to -1, this forces a fresh load from the cache.
	    PeopleSearchActions.updateFavourites(favourites);

	    this.props.onItemUpdate(index, favourites, action !== 'remove');
	},

	onOutlookExportCard(person) {
		let card = Exporter.getContactForExport(person);

		let blob = new Blob([card.data], {type: "text/x-vcard;charset=iso-8859-1"});

		FileSaver.saveAs(blob, card.name + '.vcf');
	},

	onFavouritesChange() {
		this.props.onFavouritesChange({
			favourites: FavouriteStore.getCurrentFavourites()
		});
	},

	//TODO: Centralise this
	onSearchByManagedProperty(name, mp) {
		window.location.href = window.location.protocol + '//' + window.location.host + '/search/Pages/results.aspx?k=' + mp + name;
	},

	//TODO: Centralise this
	onYammerSearch(name) {
		window.location.href = 'https://www.yammer.com/#/Threads/Search?search=' + name;
	},

	/*onLyncPrescence(event) {
		IMNImageOnClick(event);
		return false;
	}, */

	isFavouriteButtonActive(person) {
	    let pinned = false;

	    if (this.props.refresh) {
	      //favourites have been changed on the favourite page - update the relevant button states
	      let favourites = this.props.favourites;

	      //checked to see if they have been pinned this as a favourite already
	      pinned = favourites.length > 0 ? favourites.some(function(item, i, array) {
	                                            return item.name === person.items.Cells.PreferredName;
	                                       }) : false;
	    } else {
	      pinned = person.items.Cells.Favourite;
	    }

	    //active - check to see if button is for adding a favourite and the threshold has breached
	    return {
	    	pinned: pinned,
	    	disabled: !pinned && (this.props.favourites.length > 10) ? true : false
	    };
	},

	getFavouriteButton(person, index) {
		let current = this.isFavouriteButtonActive(person);
		let icon =  current.pinned ? 'remove' : 'add';
		let bindClick = this.onFavouriteClick.bind(this, person.items, icon, index);

		//otherwise show the favourite pin button
		return (
			<div key={'item-favourite-button'} styleName={icon} className={icon}>
				<TooltipButton icon={icon} onClick={bindClick} floating accent mini tooltip={icon.charAt(0).toUpperCase() + icon.slice(1) + ' favourite'} disabled={current.disabled} />
			</div>
		);
	},

	/*
		TODO: Replace with the excellent Alopes lync prescene functionality
	
	getImage(person, key) {
		let src = person.items.Cells.PictureURL !== null ? person.baseImageUrl + person.items.Cells.WorkEmail :  person.baseImageUrl + 'null';
		let sip = 'imn_' + key + ',type=sip';
		let bindClick = this.onLyncPrescence;

		return (
			<div key={'item-image-' + key} styleName='img-container'>

					<div className={'ms-tableCell'}>
						<span className={'ms-imnSpan'}>
							<a href='#' onClick={bindClick} className={'ms-imnlink ms-spimn-presenceLink'}>
								<span className={'ms-spimn-presenceWrapper ms-spimn-imgSize-8x72'}>
									<img name='imnmark' title='' ShowOfflinePawn=  '1' className={'ms-spimn-img ms-spimn-presence-disconnected-8x72x32'} src='/_layouts/15/images/spimn.png?rev=23' alt='User Presence' sip={person.items.Cells.WorkEmail} id={sip} />
								</span>
							</a>
						</span>
					</div>

					<div className={'ms-tableCell ms-verticalAlignTop'}>
						<div className={'ms-peopleux-userImgDiv'}>
							<span className={'ms-imnSpan'}>
								<a href='#' onClick={bindClick} className={'ms-imnlink'} tabIndex='-1'>
									<img name='imnmark' title='' ShowOfflinePawn='1' className={' ms-hide'} src='/_layouts/15/images/spimn.png?rev=23' alt='User Presence' sip={person.items.Cells.WorkEmail} id={sip} />
								</a>
								<span className={'ms-peopleux-imgUserLink'}>
										<span className={'ms-peopleux-userImgWrapper'}>
											<img styleName='img' src={Utils.removeEncodedAmpersand(src)} alt={person.items.Cells.PreferredName} />
										</span>
								</span>
							</span>
						</div>
					</div>

			</div>
		);
	},*/

	getPersonaImage(person, key) {

		let member = {
          name: person.items.Cells.PreferredName,
          loginName: 'i:0#.f|membership|' + person.items.Cells.WorkEmail,
          email: person.items.Cells.WorkEmail,
        };

		return (
	        <div key={key}>
				<Persona member={member} />
	        </div>
		);

	},

	getProfile(person, key) {

		//Renders a hyperlink to the user's profile page (using preferred name as the text)
		return (
			<span key={'item-profile-' + key}>
				<a href={person.items.Cells.Path} target={'_blank'}>
					{Utils.getTrimmedString(person.items.Cells.PreferredName, 30)}
				</a>
			</span>
		);
	},

	//TODO refactor these common templates into a single method
	getJob(person, key) {
    	let job = person.items.Cells.JobTitle !== null ?  person.items.Cells.JobTitle : 'Sales Executive';

	    return(
	    	<span key={'item-job-' + key}>
			    {Utils.getTrimmedString(job, 30)}
	    	</span>
	    );
	},

	//TODO refactor these common templates into a single method
	getDepartment(person, key) {
    	let department = person.items.Cells.Department !== null ? person.items.Cells.Department : 'Sales';

		return (
			<span key={'item-department-' + key}>
				{Utils.getTrimmedString(department, 30)}
			</span>
		);
	},

	//TODO refactor these common templates into a single method
	getWorkEmail(person, key) {
		let email = person.items.Cells.WorkEmail !== null ? person.items.Cells.WorkEmail : 'noemai@contentandcode.com';

		return (
			<span key={'item-email-' + key}>
				<a href={'mailto:' + email} target={'_blank'}>
					{Utils.getTrimmedString(email, 30)}
				</a>
			</span>
		);
	},

	//TODO refactor these common templates into a single method
	getDocuments(person, key) {
		let name = person.items.Cells.PreferredName;
		let bindClick = this.onSearchByManagedProperty.bind(this, person.items.Cells.PreferredName, 'IsDocument:1 Author:');
		
		return (
			<span key={'command-documents-' + key} styleName='command' className='commandor'>
				<TooltipButton icon={'insert_drive_file'} floating accent mini tooltip={'Documents by ' + person.items.Cells.PreferredName} onClick={bindClick} />
			</span>
		);
	},

	//TODO refactor these common templates into a single method
	getEverything(person, key) {
		let name = person.items.Cells.PreferredName;
		let bindClick = this.onSearchByManagedProperty.bind(this, person.items.Cells.PreferredName, 'Author:');

		return (
			<span key={'command-everything-' + key} styleName='command' className='commandor'>
				<TooltipButton icon={'share'} floating accent mini tooltip={'Everything by ' + person.items.Cells.PreferredName} onClick={bindClick} />
			</span>
		);
	},

	getYammer(person, key) {
		let bindClick = this.onYammerSearch.bind(this, person.items.Cells.PreferredName);

		return (
			<span key={'command-yammer-' + key} styleName='command' className='commandor'>
				<TooltipButton icon={'comment'} floating accent mini tooltip={'Conversations by ' + person.items.Cells.PreferredName} onClick={bindClick} />
			</span>
		);
	},

	getExportOutlookCard(person, key) {
		let bindClick = this.onOutlookExportCard.bind(this, person.items.Cells);

		return (
			<span key={'command-outlook-' + key} styleName='command' className='commandor'>
				<TooltipButton icon={'contact_mail'} floating accent mini tooltip={'Export for Outlook'} onClick={bindClick} />
			</span>
		);
	},

	getTelelphoneNumber(num, type, key) {
		if (typeof num !== 'undefined' && num !== '' && num !== null) {
			let icon = type === 'work' ? 'call' : 'smartphone';

			return (
				<span key={'item-tel-' + type + '-' + key}>
					<i className={'material-icons'} styleName={'phone'}>{icon}</i>
					{num}
				</span>
			);
		}
	},

	getTextField(value, key) {
		return (
			<span key={'item-text-' + key}>
				{value}
			</span>
		);
	},

	//TODO: Change layout items to invoke the associate function in the JSON object key instead of using this dated switch
	getPersonCard(person, layout, index) {
		let combined = [];
		let that = this;

		//only output the fields chosen in the layout
		layout.forEach(function(item, i) {
			switch(item.label) {
				case 'Name (with profile link)':
					combined.push(that.getProfile(person, index));
					break;
				case 'Name':
					combined.push(that.getTextField(Utils.getTrimmedString(person.items.Cells.PreferredName, 30), 'name-' + index));
					break;
				case 'Job Title':
				 	combined.push(that.getJob(person, index));
					break;
				case 'Department':
					combined.push(that.getDepartment(person, index));
					break;
				case 'Office':
					combined.push(that.getTextField(Utils.getTrimmedString(person.items.Cells.BaseOfficeLocation, 30), 'office-' + index));
					break;
				case 'Email':
					combined.push(that.getWorkEmail(person, index));
					break;
				case 'Telephone Number':
					combined.push(that.getTelelphoneNumber(person.items.Cells.WorkPhone, 'work', index));
					break;
				case 'Mobile Number':
					combined.push(that.getTelelphoneNumber(person.items.Cells.MobilePhone, 'mobile', index));
					break;
				case 'Documents':
					combined.push(that.getDocuments(person, index));
					break;
				case 'Everything':
					combined.push(that.getEverything(person, index));
					break;
				case 'Yammer':
					combined.push(that.getYammer(person, index));
					break;
				case 'Export to Outlook':
					combined.push(that.getExportOutlookCard(person, index));
					break;
				default:
					//no default action
					break;
			}
		});

		return combined;
	},

	getPerson(person, i) {
		let layout = this.props.layout.current;
		let card = [];

		if (layout.length > 0) {
			card = this.getPersonCard(person, layout, i);
		} else {
			card.push(this.getProfile(person, i));
			card.push(this.getJob(person, i));
			card.push(this.getDepartment(person, i));
			card.push(this.getTelelphoneNumber(person.items.Cells.WorkPhone, 'work', i));
		}

		return (
			<div key={'item-details-' + i}>
				{this.getPersonaImage(person, i)}
				{card}
			</div>
		);
	},

	render() {
				let person = {
		    		items : typeof this.props.data.data !== 'undefined' ? this.props.data.data : this.props.data,
		    		baseImageUrl: '/_layouts/15/userphoto.aspx?size=S&amp;accountname='
		    	};

		        return (
		        	<span key={'person-' + this.props.id}>
		        		{this.getFavouriteButton(person, this.props.id)}
		            	<div styleName='item'>
			        	   {this.getPerson(person, this.props.id)}
			        	</div>
		        	</span>
		        );
	}
});

module.exports = cssModules(Person, styles, { allowMultiple: true });
