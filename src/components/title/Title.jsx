import React from 'react';
import styles from './Title.css';
import cssModules from 'react-css-modules';

const Title = React.createClass({
		render() {

	        let title = typeof this.props.text !== 'undefined' ? this.props.text : 'Goldfish';

	        title = title + (typeof this.props.suffix !== 'undefined' ? ' ' + this.props.suffix  : '');

	        return (
                 <div styleName='title-container'>
                    <span className={'o365-NFP-title o365cs-lightFont'} styleName='title-font'>
				        {title}
				    </span>
                 </div>
	        );
        }
});

module.exports = cssModules(Title, styles, { allowMultiple: true });
