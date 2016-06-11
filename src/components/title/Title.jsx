import React from 'react';
import styles from './Title.css';
import cssModules from 'react-css-modules';

class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let title = typeof this.props.text !== 'undefined' ? this.props.text : 'Goldfish';

    title = title + (typeof this.props.suffix !== 'undefined' ? ' ' + this.props.suffix : '');

    return (
      <div styleName="title-container" id={`dragSnapin${title.replace(/ /g, '')}`}>
        <span className="o365-NFP-title o365cs-lightFont" styleName="title-font">
          {title}
        </span>
      </div>
    );
  }
}

Title.propTypes = {
  suffix: React.PropTypes.string,
  text: React.PropTypes.string,
};

export default cssModules(Title, styles, { allowMultiple: true });
