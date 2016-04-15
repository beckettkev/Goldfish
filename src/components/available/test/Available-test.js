import React from 'react';
import {mount, render} from 'enzyme';
import {expect} from 'chai';
import {spy} from 'sinon';
import Available from '../Available.jsx';
import Constants from '../../../constants/default';

describe('<Available />', () => {

	it('does not render without any props', () => {
		const component = mount(<Available />);

		expect(component.find('.selector').length).to.equal(0);
	});

	it('contains animated css class', () => {
		const component = mount(
					<Available 
						options={Constants.DEFAULT_AVAILABLE_LAYOUT} />
				);

		expect(component.find('.animated').length).to.equal(1);
	});

	it('allows us to set props', () => {
		const data = Constants.DEFAULT_AVAILABLE_LAYOUT;

		expect(mount(<Available options={data} />).prop('options').length).to.equal(data.length);
	});

	/*
	it('Calls componentDidMount', () =>{
		spy(Available.prototype, 'componentDidMount');
		
		const wrapper = mount(<Available />);
		
		expect(Available.prototype.componentDidMount.calledOnce).to.equal(true);
	});
	*/
	/*
	it('Simulate change', () =>{
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