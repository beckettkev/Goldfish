import React from 'react';
import ClassNames from 'classnames';
import style from './Switch.styles.css';

const Thumb = ({children, onMouseDown}) => (
  <span role='thumb' className={style.thumb} onMouseDown={onMouseDown}>{children}</span>
);

export default class Switch extends React.Component {
  static propTypes = {
    checked: React.PropTypes.bool,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    label: React.PropTypes.string,
    name: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onFocus: React.PropTypes.func
  };

  static defaultProps = {
    checked: false,
    className: '',
    disabled: false
  };

  handleToggle = (event) => {
    if (event.pageX !== 0 && event.pageY !== 0) this.blur();
    if (!this.props.disabled && this.props.onChange) {
      this.props.onChange(!this.props.checked, event);
    }
  };

  blur () {
    this.refs.input.blur();
  }

  focus () {
    this.refs.input.focus();
  }

  render () {
    let className = style[this.props.disabled ? 'disabled' : 'field'];
    const switchClassName = style[this.props.checked ? 'on' : 'off'];
    const { onChange, ...others } = this.props;
    if (this.props.className) className += ` ${this.props.className}`;

    return (
      <label data-gf='switch' className={className}>
        <input
          {...others}
          checked={this.props.checked}
          className={style.input}
          onClick={this.handleToggle}
          readOnly
          ref='input'
          type='checkbox'
        />
        <span className={switchClassName}>
          <Thumb disabled={this.props.disabled} />
        </span>
        {this.props.label ? <span className={style.text}>{this.props.label}</span> : null}
      </label>
    );
  }
}
