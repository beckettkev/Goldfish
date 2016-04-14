import React from 'react';
import {
  describeWithDOM,
  mount,
  shallow,
  spyLifecycle
} from 'enzyme';
//import sinon from 'sinon';
import Search from 'components/search/Search.jsx';
import Constants from 'constants/default';

describe('<Suggest />', () => {
	
	it('allows us to set props', () => {
		const wrapper = mount(
			<Suggest onSearchChanged={function(e) {}}
					onSearching={function(e) {}}
					settings={[]}
					termsets={[]}
					userInformationFields={[]} />
			);

		expect(wrapper.props().settings).to.equal([]);
	});

});