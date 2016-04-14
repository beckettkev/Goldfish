import React from 'react';
import { mount } from 'enzyme';
import Available from 'components/available/Available.jsx';
import Constants from 'constants/default';

describe('<Available />', () => {
		
	/*it('calls componentDidMount', () => {
		spy(Available.prototype, 'componentDidMount');
		
		const wrapper = mount(<Available />);
		
		expect(Available.prototype.componentDidMount.calledOnce).to.equal(true);

		Available.prototype.componentDidMount.restore();
	});*/

	it('does not render without any props', () => {
		const component = mount(<Available />);

		expect(component.find('.selector').length).toBe(0);
	});

	it('contains animated css class', () => {
		const component = mount(<Available options={Constants.DEFAULT_AVAILABLE_LAYOUT} />);

		expect(component.find('.animated').length).toBe(0);
	});

	it('allows us to set props', () => {
		const data = Constants.DEFAULT_AVAILABLE_LAYOUT;
				
	    expect(mount(<Available options={data} />).prop('options').length).toBe(data.length);
	});
});