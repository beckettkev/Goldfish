import * as React from 'react';
import ClassNames from 'classnames';
import {IButtonProps} from './IButton';
import * as style from './Button.styles.css';

export default class Button extends React.Component<IButtonProps, {}> {
  static defaultProps:IButtonProps = {
    accent: false,
    className: '',
    flat: false,
    floating: false,
    mini: false,
    neutral: true
  };

  public render ():JSX.Element {
    const { accent, children, className, flat, floating, icon,
            mini, neutral, ...others } = this.props;
    //const element:type = 'button';
    const level:string = accent ? 'accent' : 'neutral';
    const shape:string = flat ? 'flat' : floating ? 'floating' : 'flat';

    const classes:string = ClassNames(style[shape], {
      [style[level]]: neutral,
      [style.mini]: mini
    }, className);

    const props:IButtonProps = {
      ...others,
      ref: 'button',
      className: classes,
      disabled: this.props.disabled,
    };

    return React.createElement(
      Button,
      props,
      icon ? <span className="material-icons">{icon}</span> : null,
      children
    );
  }
}
