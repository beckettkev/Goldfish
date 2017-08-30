import * as React from 'react';
import * as styles from './Settings.css';
import Title from '../title/Title';
import Switch from '../../ui/Switch';
import SettingStore from '../../stores/SettingStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import SettingsManager from '../../utils/settings';

import { ISettingsProps, ISettingsState } from './ISettings';

function getStoreSettingState():ISettingsState {
  const settings:Array<any> = SettingStore.getSettings();
  const current:any = {};

  settings.forEach((item:any) => {
    current[item.internal] = item.value;
  });

  return current;
}

function getSettingsAndApply():ISettingsState {
  PeopleSearchActions.fetchSettings();

  const settings:ISettingsState = getStoreSettingState();

  SettingsManager.applySettings(getStoreSettingState());

  return settings;
}

class Settings extends React.Component<ISettingsProps, ISettingsState> {
  constructor(props:ISettingsProps) {
    super(props);

    this.state = getSettingsAndApply();
  }

  componentWillMount():void {
    SettingStore.removeChangeListener(this.onSettingChange);
  }

  componentDidMount():void {
    SettingStore.addChangeListener(this.onSettingChange.bind(this));
  }

  componentDidUpdate():void {
    if (this.state === null) {
      this.state = getSettingsAndApply();
    }
  }

  onSettingChange():void {
    const settings:ISettingsState = getStoreSettingState();
    const collection:Array<any> = SettingsManager.applySettings(getStoreSettingState());

    this.props.onSettingChange(collection);

    this.setState(settings);
  }

  getSettings(state:ISettingsState):Array<JSX.Element> {
    const settings:Array<any> = SettingStore.getSettings();

    return settings.map((item:any):JSX.Element =>
        <Switch
          key={item.internal}
          checked={state[item.internal]}
          label={item.label}
          onChange={this.handleChange.bind(this, item.internal)} />
    );
  }

  handleChange(field:string, value:any) {
    const settings:Array<any> = SettingStore.getSettings();
    let matched:boolean = false;

    settings.some((item:any, i:number) => {
      matched = field === item.internal;

      if (matched) { settings[i].value = value; }

      return matched;
    });

    PeopleSearchActions.updateSettings(settings);
  }

  applySettings():Array<any> {
    return SettingsManager.applySettings(getStoreSettingState());
  }

  public render():JSX.Element {
    const settingComponentStyles:any = {
      display: 'none !important',
      paddingTop: this.props.paddingTop,
    };

    if (this.state !== null) {
      return (
        <div id="component-settings" className={styles.component} style={settingComponentStyles}>
          <div className={styles.container}>
              <Title
                text={this.props.title}
                suffix="Settings" />

              <p className={styles.info}>
                <br /><br />
                Settings can be controlled from this page - they will be <strong>applied automatically</strong>.
              </p>

              <div className={styles.checkboxHolder + ' content'}>
                <br /><br />

                <div className="switches-with-broomsticks">
                  {this.getSettings(this.state)}
                </div>
            </div>
          </div>
          <br /><br />
        </div>
      );
    }
  }
}

export default Settings;
