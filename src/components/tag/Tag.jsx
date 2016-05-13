/* eslint no-unused-vars: 0 */
import React from 'react';
import styles from './Tag.css';
import cssModules from 'react-css-modules';

class Tag extends React.Component {
  constructor(props) {
    super(props);
  }

  handleRemove(item) {
    this.props.onRemove(item);
  }

  render() {
    const searchTermStyles = {
      display: 'none !important',
    };

    const {tag, item, key, className, classNameRemove} = this.props;

    return (
      <span key={key} className={className}>
        <span style={searchTermStyles} className="search-term">
          {tag.search}
        </span>
        {tag.name}
        <a
          className={classNameRemove}
          onClick={(e) => this.handleRemove(item)} />
      </span>
    );
  }
}

Tag.propTypes = {
  key: React.PropTypes.number,
  item: React.PropTypes.number,
  tag: React.PropTypes.string,
  onRemove: React.PropTypes.func,
  className: React.PropTypes.string,
  classNameRemove: React.PropTypes.string,
};

export default cssModules(Tag, styles, { allowMultiple: true });
