/// <reference path="./../globals.d.ts"/>

import * as React from 'react';
import ClassNames from 'classnames';
import * as style from './Switch.styles.css';

import { ISwitchProps } from './ISwitch';

const Thumb = (disabled:any):any => (
  <span role='thumb' className={style.thumb}></span>
);

export default class Switch extends React.Component<ISwitchProps, {}> {
  static defaultProps: ISwitchProps = {
    checked: false,
    className: '',
    disabled: false
  };

  private handleToggle = (event: any):void => {
    if (event.pageX !== 0 && event.pageY !== 0) this.blur();
    if (!this.props.disabled && this.props.onChange) {
      this.props.onChange(!this.props.checked, event);
    }
  };

  private blur ():void {
    (this.refs.input as HTMLInputElement).blur();
  }

  private focus ():void {
    (this.refs.input as HTMLInputElement).focus();
  }

  public render () {
    let className:string = style[this.props.disabled ? 'disabled' : 'field'];
    const switchClassName:string = style[this.props.checked ? 'on' : 'off'];
    const { onChange, ...others } = this.props;

    if (this.props.className) className += ` ${this.props.className}`;

    return (
      <label data-gf='switch' className={className}>
        <input
          {...others}
          checked={this.props.checked}
          className={style.input}
          onClick={(e:any) => this.handleToggle(e)}
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
