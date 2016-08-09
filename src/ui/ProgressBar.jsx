import React from 'react';
import ClassNames from 'classnames';
import style from './ProgressBar.styles.css';

const WEBKIT = 'Webkit';
const MICROSOFT = 'Ms';

const properties = {
  transform: [WEBKIT, MICROSOFT]
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.substr(1);
}

function getPrefixes(property, value) {
  return properties[property].reduce(function (acc, item) {
    acc[`${item}${capitalize(property)}`] = value;
    return acc;
  }, {});
}

function addPrefixesTo(style, property, value) {
  const vendor = getPrefixes(property, value);
  for (const prefix in vendor) {
    style[prefix] = vendor[prefix];
  }

  return style;
}

function prefixer(style, defaultValue = {}) {
  const _style = defaultValue;
  for (const property in style) {
    _style[property] = style[property];
    if (properties[property]) {
      addPrefixesTo(_style, property, style[property]);
    }
  }

  return _style;
}

export default class ProgressBar extends React.Component {
  static propTypes = {
    buffer: React.PropTypes.number,
    className: React.PropTypes.string,
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    mode: React.PropTypes.string,
    multicolor: React.PropTypes.bool,
    type: React.PropTypes.oneOf(['linear', 'circular']),
    value: React.PropTypes.number
  };

  static defaultProps = {
    buffer: 0,
    className: '',
    max: 100,
    min: 0,
    mode: 'indeterminate',
    multicolor: false,
    type: 'linear',
    value: 0
  };

  calculateRatio (value) {
    if (value < this.props.min) return 0;
    if (value > this.props.max) return 1;
    return (value - this.props.min) / (this.props.max - this.props.min);
  }

  circularStyle () {
    if (this.props.mode !== 'indeterminate') {
      return {strokeDasharray: `${2 * Math.PI * 25 * this.calculateRatio(this.props.value)}, 400`};
    }
  }

  linearStyle () {
    if (this.props.mode !== 'indeterminate') {
      return {
        buffer: prefixer({transform: `scaleX(${this.calculateRatio(this.props.buffer)})`}),
        value: prefixer({transform: `scaleX(${this.calculateRatio(this.props.value)})`})
      };
    } else {
      return {};
    }
  }

  renderCircular () {
    return (
      <svg className={style.circle}>
        <circle className={style.path} style={this.circularStyle()} cx='30' cy='30' r='25' />
      </svg>
    );
  }

  renderLinear () {
    const {buffer, value} = this.linearStyle();
    return (
      <div>
        <span ref='buffer' data-ref='buffer' className={style.buffer} style={buffer}></span>
        <span ref='value' data-ref='value' className={style.value} style={value}></span>
      </div>
    );
  }

  render () {
    const className = ClassNames(style[this.props.type], {
      [style[this.props.mode]]: this.props.mode,
      [style.multicolor]: this.props.multicolor
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
