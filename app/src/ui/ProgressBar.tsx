import * as React from 'react';
import ClassNames from 'classnames';
import * as style from './ProgressBar.styles.css';

import {IProgressBarProps} from './IProgressBar';

const WEBKIT:string = 'Webkit';
const MICROSOFT:string = 'Ms';

const properties:any = {
  transform: [WEBKIT, MICROSOFT]
};

function capitalize(string:string):string {
  return string.charAt(0).toUpperCase() + string.substr(1);
}

function getPrefixes(property:string, value:any):any {
  return properties[property].reduce((acc:any, item:any) => {
    acc[`${item}${capitalize(property)}`] = value;
    return acc;
  }, {});
}

function addPrefixesTo(style:any, property:any, value:any):any {
  const vendor:any = getPrefixes(property, value);
  let prefix:string = null;

  for (prefix in vendor) {
    style[prefix] = vendor[prefix];
  }

  return style;
}

function prefixer(style:any, defaultValue = {}):any {
  let _style:any = defaultValue;
  let property:string = null;

  for (property in style) {
    _style[property] = style[property];

    if (properties[property]) {
      addPrefixesTo(_style, property, style[property]);
    }
  }

  return _style;
}

export default class ProgressBar extends React.Component<IProgressBarProps, {}> {
  static defaultProps: IProgressBarProps = {
    buffer: 0,
    className: '',
    max: 100,
    min: 0,
    mode: 'indeterminate',
    multicolor: false,
    type: 'linear',
    value: 0
  };

  private calculateRatio (value:number): number {
    if (value < this.props.min) return 0;
    if (value > this.props.max) return 1;
    return (value - this.props.min) / (this.props.max - this.props.min);
  }

  private circularStyle (): any {
    if (this.props.mode !== 'indeterminate') {
      return {
        strokeDasharray: `${2 * Math.PI * 25 * this.calculateRatio(this.props.value)}, 400`
      };
    }

    return {};
  }

  private linearStyle (): any {
    if (this.props.mode !== 'indeterminate') {
      return {
        buffer: prefixer({transform: `scaleX(${this.calculateRatio(this.props.buffer)})`}),
        value: prefixer({transform: `scaleX(${this.calculateRatio(this.props.value)})`})
      };
    }

    return {};
  }

  private renderCircular (): JSX.Element {
    return (
      <svg className={style.circle}>
        <circle className={style.path} style={this.circularStyle()} cx='30' cy='30' r='25' />
      </svg>
    );
  }

  private renderLinear (): JSX.Element {
    const {buffer, value} = this.linearStyle();

    return (
      <div>
        <span ref='buffer' data-ref='buffer' className={style.buffer} style={buffer}></span>
        <span ref='value' data-ref='value' className={style.value} style={value}></span>
      </div>
    );
  }

  public render () {
    const styles: any = style;
    const className: string = ClassNames(styles[this.props.type], {
      [styles[this.props.mode]]: this.props.mode,
      [styles.multicolor]: this.props.multicolor
    }, this.props.className);

    return (
      <div
        data-gf='progress-bar'
        aria-valuenow={this.props.value}
        aria-valuemin={this.props.min}
        aria-valuemax={this.props.max}
        className={className}>
        {this.props.type === 'circular' ? this.renderCircular() : this.renderLinear()}
      </div>
    );
  }
}
