import React from 'react';
import ClassNames from 'classnames';
import style from './Button.styles.css';

export default class Button extends React.Component {
  static propTypes = {
    accent: React.PropTypes.bool,
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    flat: React.PropTypes.bool,
    floating: React.PropTypes.bool,
    icon: React.PropTypes.any,
    mini: React.PropTypes.bool,
    neutral: React.PropTypes.bool,
    type: React.PropTypes.string
  };

  static defaultProps = {
    accent: false,
    className: '',
    flat: false,
    floating: false,
    mini: false,
    neutral: true
  };

  render () {
    const { accent, children, className, flat, floating, icon,
            mini, neutral, ...others } = this.props;
    const element = 'button';
    const level = accent ? 'accent' : 'neutral';
    const shape = flat ? 'flat' : floating ? 'floating' : 'flat';

    const classes = ClassNames([style[shape]], {
      [style[level]]: neutral,
      [style.mini]: mini
    }, className);

    const props = {
      ...others,
      ref: 'button',
      className: classes,
      disabled: this.props.disabled,
      'data-gf': 'button'
    };

    return React.createElement(
      element,
      props,
      icon ? <span className="material-icons">{icon}</span> : null,
      children
    );
  }
}
