import React from 'react';
import styles from './Row.css';
import cssModules from 'react-css-modules';
import Utils from '../../utils/utilities';

function getPersonValuesFromArray(person, key) {
  return key.map(function(item) {
    return person[item];
  }).filter(function(n) { return n !== undefined; });
}

function getConstructedFormatedString(format, values) {
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof values[number] !== 'undefined'
      ? values[number]
      : match;
  });
}

function getFormatStringOrValue(key, person) {
  if (key.indexOf('{0}') > -1) {
    /*
    At this stage key is a string which needs to be converted into an array of strings.
    e.g. 'Skills: {0}, Past Projects {1}|SPS-Skills|PastProjects'
    */
    const format = key.split('|')[0];
    const values = getPersonValuesFromArray(person, key.split('|').splice(1));

    if (values.join('').length > 0) {
      return getConstructedFormatedString(format, values);
    }

    return '';
  }

  //e.g. SPS-Skills
  return person[key];
}

class Row extends React.Component {

  constructor(props) {
    super(props);
  }

  normal(person, key, value, style, length) {
    if (person[value] === null) {
      return null;
    } else {
      return Utils.getTrimmedString(getFormatStringOrValue(value, person), length);
    }
  }

  hyperlink(person, key, href, target, value, style, length) {
    const prefix = href.toLowerCase().indexOf('email') > -1 ? 'mailto:' : '';

    if (person[href] === null) {
      return null;
    } else {
      return (
        <a key={`item-${href}-${key}`} href={`${prefix}${person[href]}`} target={target}>
          {Utils.getTrimmedString(getFormatStringOrValue(value, person), length)}
        </a>
      );
    }
  }

  icon(icon, key) {
    return (
      <i
        key={`item-${icon}-${key}`}
        className={'material-icons'} styleName={'icon'}>
          {icon}
      </i>
    );
  }

  /**
  * Function that takes the information about the item and layout and renders the row
  * @param {key} the index of the item
  * @param {layout} the row layout
  * @param {person} the person data
  */
  getRowFromLayout(key, layout, person) {
    let item = [];

    //regardless of if the row is a link or plain text, we need these values
    const { value } = layout;
    const length = typeof layout.max === 'undefined' ? 28 : layout.max;

    let style = '';
    let prefix = null;

    if (typeof layout.icon !== 'undefined' && layout.icon !== null) {
      const { icon } = layout;

      style = 'floatLeft';

      prefix = this.icon(icon, key);
    }

    if (typeof layout.href !== 'undefined' && layout.href !== null) {
      const { href, target } = layout;

      //render hyper link row
      item.push(this.hyperlink(person.items.Cells, key, href, target, value, style, length));
    } else {
      //render plain text row
      item.push(this.normal(person.items.Cells, key, value, style, length));
    }

    if (item[0] !== null && prefix !== null) {
      item.push(prefix);
      item.reverse();
    }

    return item;
  }

  render() {
    const { id, element, person } = this.props;

    return (
      <div key={`item-row-${id}`}>
        {this.getRowFromLayout(id, element.template, person)}
      </div>
    );
  }
}

export default cssModules(Row, styles, { allowMultiple: true });
