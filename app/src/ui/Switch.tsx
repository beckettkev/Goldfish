import * as React from 'react';
import ClassNames from 'classnames';
import * as style from './Switch.styles.css';

<<<<<<< HEAD:app/src/ui/Switch.tsx
import { ISwitchProps } from './ISwitch';

/*const Thumb = (children:any, onMouseDown:any) => (
  <span role='thumb' className={style.thumb} onMouseDown={onMouseDown}>{children}</span>
);*/
=======
const Thumb = ({key, children, onMouseDown}) => (
  <span 
    key={key}
    role='thumb' 
    className={style.thumb} 
    onMouseDown={onMouseDown}>{children}</span>
);
>>>>>>> 9461183eed53bd47bae5f4282481402b13e43062:src/ui/Switch.jsx

const Thumb = (disabled:any) => (
  <span role='thumb' className={style.thumb} disabled={disabled}></span>
);

export default class Switch extends React.Component<ISwitchProps, {}> {
  static defaultProps: ISwitchProps = {
    checked: false,
    className: '',
    disabled: false
  };

<<<<<<< HEAD:app/src/ui/Switch.tsx
  private handleToggle = (event: any):void => {
    if (event.pageX !== 0 && event.pageY !== 0) this.blur();
=======
  handleToggle = (event) => {
    if (event.pageX !== 0 && event.pageY !== 0) {
      this.blur();
    }

>>>>>>> 9461183eed53bd47bae5f4282481402b13e43062:src/ui/Switch.jsx
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

<<<<<<< HEAD:app/src/ui/Switch.tsx
  public render () {
    let className:string = style[this.props.disabled ? 'disabled' : 'field'];
    const switchClassName:string = style[this.props.checked ? 'on' : 'off'];
    const { onChange, ...others } = this.props;

    if (this.props.className) className += ` ${this.props.className}`;
=======
  render () {
    let className = style[this.props.disabled ? 'disabled' : 'field'];

    const switchClassName = style[this.props.checked ? 'on' : 'off'];
    const { onChange, ...others } = this.props;
    const key = this.props.label.replace(' ','');

    if (this.props.className) {
      className += ` ${this.props.className}`;
    }
>>>>>>> 9461183eed53bd47bae5f4282481402b13e43062:src/ui/Switch.jsx

    return (
      <label key={`label-${key}`} data-gf='switch' className={className}>
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
          <Thumb 
            key={`thumb-${key}`} 
            disabled={this.props.disabled} />
        </span>
        {
          this.props.label ? 
            <span className={style.text}>
              {this.props.label}
            </span> : null
        }
      </label>
    );
  }
}
