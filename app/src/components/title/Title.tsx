/// <reference path="./../../globals.d.ts"/>

import * as React from 'react';
import * as styles from './Title.css';

import { ITitleProps, ITitleState } from './ITitle';

class Title extends React.Component<ITitleProps, ITitleState> {
  constructor(props:ITitleProps) {
    super(props);
  }

  public render():JSX.Element {
    let title:string = typeof this.props.text !== 'undefined' ? this.props.text : 'Goldfish';

    title = title + (typeof this.props.suffix !== 'undefined' ? ' ' + this.props.suffix : '');

    return (
      <div className={`${styles.titleContainer}`} id={`dragSnapin${title.replace(/ /g, '')}`}>
        <span className={`ms-font-xxl ${styles.titleFont}`}>
          {title}
        </span>
      </div>
    );
  }
}

export default Title;
