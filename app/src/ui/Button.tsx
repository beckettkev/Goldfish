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
    const styles: any = style;
    const { accent, children, className, flat, floating, icon,
            mini, neutral, ...others } = this.props;
    //const element:type = 'button';
    const level:string = accent ? 'accent' : 'neutral';
    const shape:string = flat ? 'flat' : floating ? 'floating' : 'flat';

    const classes:string = ClassNames(styles[shape], {
      [styles[level]]: neutral,
      [styles.mini]: mini
    }, className);

    const props:any = {
      ...others,
      name: 'button',
      ref: 'button',
      className: classes,
      disabled: this.props.disabled,
    };

    return (
      <button {...props}>
        { icon ? <span className="material-icons">{icon}</span> : null }
        { children }
      </button>
    );
  }
}
