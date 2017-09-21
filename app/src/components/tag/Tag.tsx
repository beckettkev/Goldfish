/// <reference path="./../../globals.d.ts"/>

/* eslint no-unused-vars: 0 */
import * as React from 'react';
import * as styles from './Tag.css';

import { ITagProps, ITagState } from './ITag';

class Tag extends React.Component<ITagProps, ITagState> {
  constructor(props:ITagProps) {
    super(props);
  }

  handleRemove(item:any):void {
    this.props.onRemove(item);
  }

  public render():JSX.Element {
    const {tag, item, key} = this.props;

    return (
      <span key={key} className={`${styles.reactTagsinputTag} ms-font-s`}>
        <span className={styles.searchTerm}>
          {tag.search}
        </span>
        {tag.name}
        <sup>
          <a
            className={`${styles.reactTagsinputRemove}`}
            style={{fontWeight:'bold'}}
            onClick={(e) => this.handleRemove(item)} />
        </sup>
      </span>
    );
  }
}

export default Tag;
