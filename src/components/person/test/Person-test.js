import React from 'react';
import {mount, render} from 'enzyme';
import {expect} from 'chai';
import {spy} from 'sinon';
import Person from '../person.jsx';
import Constants from '../../../constants/default';
import Mock from '../../../../mock/Mock';

describe('<Person />', () => {

	it('calls render', () =>{
		spy(Person.prototype, 'render');

		const layout = { 
							current: Constants.DEFAULT_CURRENT_LAYOUT, 
							available: Constants.DEFAULT_AVAILABLE_LAYOUT 
						};

		const dude = mount(
			<Person
				id={1}
				data={Mock[0]}
				favourites={[]}
				layout={layout}
				refresh={false}
				onItemUpdate={() => {}}
				onFavouritesChange={() => {}} />
			);

		expect(Person.prototype.render.calledOnce).to.equal(true);
	});

	/*
	it('simulate change', () =>{
		const changes = spy();
		const component = mount(
							<Available 
								options={Constants.DEFAULT_AVAILABLE_LAYOUT} 
								onChange={changes.bind(this)} />
							);

		const select = component.find('.Select-control');
		select.simulate('keydown', { 'which': 'm' });
		select.simulate('keydown', { 'which': 13 });

		console.log(changes.calledOnce);

		expect(changes.calledOnce).to.equal(true);
	});
	*/
});