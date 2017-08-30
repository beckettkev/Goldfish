//https://github.com/export-mike/react-redux-boilerplate/blob/master/src/components/Button/test/index-test.js
import * as React from 'react';
import {mount, render} from 'enzyme';
import {expect} from 'chai';
import {spy} from 'sinon';
import Person from '../person.tsx';
import Constants from '../../../constants/default';
import { Mock } from '../../../../mock/Mock';

function markAsFavourite(person) {
	const fav = person;
	fav.Favourite = true;

	return fav;
}

function getPersonFromMock(index, isFavourite, onItemUpdate, onFavouriteChanged) {
	const layout = { 
		current: Constants.DEFAULT_CURRENT_LAYOUT, 
		available: Constants.DEFAULT_AVAILABLE_LAYOUT 
	};

	let data = Mock[index > -1 ? index : 0];

	if (isFavourite) {
		data = markAsFavourite(data);
	}

	return (
		<Person
			id={1}
			data={data}
			favourites={isFavourite ? [data] : []}
			layout={layout}
			refresh={false}
			onItemUpdate={typeof onItemUpdate !== 'undefined' ? onItemUpdate : () => {}}
			onFavouritesChange={typeof onFavouriteChanged !== 'undefined' ? onFavouriteChanged : () => {}} />
	);
}

describe('<Person />', () => {

	it('calls render once per person', () =>{
		spy(Person.prototype, 'render');

		const dude = mount(getPersonFromMock(0, false));

		expect(Person.prototype.render.calledOnce).to.equal(true);
	});

	/*
	
	MOCK Examples and tests using Enzyme...

	https://gist.github.com/srph/0ae7f2342f1caf8f0f8d
	*/
	it('simulate favourite action', () =>{
		const ping = spy();
		const dude = mount(getPersonFromMock(0, true, ping));
		const button = dude.find('button');

		button.simulate('click', {preventDefault: () => {}});

		expect(ping.calledOnce).to.equal(true);
	});
});