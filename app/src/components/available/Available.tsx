import * as React from 'react';
import Suggest from '../suggest/Suggest';
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

    //need to repupose the auto suggest control here.

    return (
      <div key="available-selector">
        
      </div>
    );
  }
}

export default Available;
