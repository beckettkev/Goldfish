import * as React from 'react';
import * as ReactSelect from 'react-select';
import * as styles from './Available.css';

import { IAvailableProps } from "./IAvailable";

class Available extends React.Component<IAvailableProps, {}> {
  constructor(props:IAvailableProps) {
    super(props);
  }

  change(option:any):void {
    if (option.label !== 'Add a field...') {
      this.props.onChange(option);
    }
  }

  public render():JSX.Element {
    const transition:string = 'flipInX';

    return (
      <div key="available-selector">
        {this.props !== null && typeof this.props.options !== 'undefined' ? 
            <ReactSelect
              name="available-fields"
              className={'selector animated ' + transition}
              placeholder="Add a field..."
              options={this.props.options}
              onChange={this.change.bind(this)} /> : null }
      </div>
    );
  }
}

export default Available;
