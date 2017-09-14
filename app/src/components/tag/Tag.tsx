/* eslint no-unused-vars: 0 */
import * as React from 'react';

import { ITagProps, ITagState } from './ITag';

class Tag extends React.Component<ITagProps, ITagState> {
  constructor(props:ITagProps) {
    super(props);
  }

  handleRemove(item:any):void {
    this.props.onRemove(item);
  }

  public render():JSX.Element {
    const searchTermStyles:any = {
      display: 'none !important',
    };

    const {tag, item, key, className, classNameRemove} = this.props;

    return (
      <span key={key} className={className}>
        <span style={searchTermStyles} className="search-term">
          {tag.search}
        </span>
        {tag.name}
        <a
          className={classNameRemove}
          onClick={(e) => this.handleRemove(item)} />
      </span>
    );
  }
}

export default Tag;
