import * as React  from 'react';
import * as styles from './Row.css';
import { Utils } from '../../utils/utilities';

import { IRowProps, IRowState } from './IRow';

function getPersonValuesFromArray(person:any, key:Array<string>):Array<any> {
  return key.map((item:string):any => person[item]).filter((n:any):any => n !== undefined);
}

function getConstructedFormatedString(format:string, values:any):string {
  return format.replace(/{(\d+)}/g, (match:any, number:any) =>
    typeof values[number] !== 'undefined' ? values[number] : match
  );
}

function getFormatStringOrValue(key:string, person:any):string {
  if (key.indexOf('{0}') > -1) {
    /*
    At this stage key is a string which needs to be converted into an array of strings.
    e.g. 'Skills: {0}, Past Projects {1}|SPS-Skills|PastProjects'
    */
    const format:string = key.split('|')[0];
    const values:any = getPersonValuesFromArray(person, key.split('|').splice(1));

    if (values.join('').length > 0) {
      return getConstructedFormatedString(format, values);
    }

    return '';
  }

  //e.g. SPS-Skills
  return person[key];
}

class Row extends React.Component<IRowProps, IRowState> {

  constructor(props:IRowProps) {
    super(props);
  }

  normal(person:any, key:string, value:any, style:any, length:number):string {
    return person[value] === null ? null : Utils.getTrimmedString(getFormatStringOrValue(value, person), length);
  }

  hyperlink(person:any, key:string, href:string, target:string, value:any, style:any, length:number):JSX.Element {
    const prefix:string = href.toLowerCase().indexOf('email') > -1 ? 'mailto:' : '';

    return person[href] === null ? null : <a key={`item-${href}-${key}`} href={`${prefix}${person[href]}`} target={target}>
                                            {Utils.getTrimmedString(getFormatStringOrValue(value, person), length)}
                                          </a>;
  }

  icon(icon:any, key:string):JSX.Element {
    return (
      <i
        key={`item-${icon}-${key}`}
        className={styles.icon + ' material-icons'}>
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
  getRowFromLayout(key:string, layout:any, person:any):Array<JSX.Element> {
    let item:Array<any> = [];

    //regardless of if the row is a link or plain text, we need these values
    const { value } = layout;
    const length:number = typeof layout.max === 'undefined' ? 28 : layout.max;

    let style:string = '';
    let prefix:JSX.Element = null;

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

  public render():JSX.Element {
    const { id, element, person } = this.props;

    return (
      <div key={`item-row-${id}`}>
        {this.getRowFromLayout(id, element.template, person)}
      </div>
    );
  }
}

export default Row;
