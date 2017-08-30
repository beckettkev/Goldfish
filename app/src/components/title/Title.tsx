import * as React from 'react';
import * as styles from './Title.css';
import cssModules from 'react-css-modules';

import { ITitleProps, ITitleState } from './ITitle';

class Title extends React.Component<ITitleProps, ITitleState> {
  constructor(props:ITitleProps) {
    super(props);
  }

  public render():JSX.Element {
    let title:string = typeof this.props.text !== 'undefined' ? this.props.text : 'Goldfish';

    title = title + (typeof this.props.suffix !== 'undefined' ? ' ' + this.props.suffix : '');

    return (
      <div styleName="title-container" id={`dragSnapin${title.replace(/ /g, '')}`}>
        <span className="o365-NFP-title o365cs-lightFont" styleName="title-font">
          {title}
        </span>
      </div>
    );
  }
}

export default cssModules(Title, styles, { allowMultiple: true });
