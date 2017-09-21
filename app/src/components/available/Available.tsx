/// <reference path="./../../globals.d.ts"/>

import * as React from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/icon';
import Suggest from '../suggest/Suggest';
import * as styles from './Available.css';
import { IAvailableProps } from "./IAvailable";

class Available extends React.Component<IAvailableProps, {}> {
  constructor(props:IAvailableProps) {
    super(props);
  
    this._change = this._change.bind(this);
  }

  _change(option: IDropdownOption, index?: number):void {
    if (option.text !== 'Add a field...') {
      this.props.onChange(option);
    }
  }

  public render():JSX.Element {
    return (
      <div key="available-selector" className="ms-Grid-row ms-font-s" style={{margin: '0 20px'}}>
        <Dropdown
          placeHolder='Add additional items to the layout.'
          id='available-properties'
          ariaLabel='Available properties'
          style={{boxShadow: '-1px 4px 8px 0px #f9f9f9'}}
          onChanged={this._change}
          onRenderPlaceHolder={ this._onRenderPlaceHolder }
          onRenderTitle={ this._onRenderOption }
          onRenderOption={ this._onRenderOption }
          options={this.props.options}
        />
      </div>
    );
  }

  private _onRenderOption = (option: IDropdownOption): JSX.Element => {
    return (
      <div className='available-property-option'>
        { option.data && option.data.icon &&
          <Icon
            style={ { marginRight: '8px' } }
            iconName={ option.data.icon }
            aria-hidden='true'
            title={ option.data.icon }
          />
        }
        <span>{ option.text }</span>
      </div>
    );
  }

  private _onRenderPlaceHolder = (props: IDropdownProps): JSX.Element => {
    return (
      <div className='dropdownExample-placeholder'>
        <Icon
          style={ { marginRight: '8px' } }
          iconName={ 'MessageFill' }
          aria-hidden='true'
        />
        <span>{ props.placeHolder }</span>
      </div>
    );
  }
}

export default Available;
