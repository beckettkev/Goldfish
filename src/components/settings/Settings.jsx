import React from 'react';
import styles from './Settings.css';
import cssModules from 'react-css-modules';
import Title from '../title/Title.jsx';
import { Switch } from 'react-toolbox';
import Utils from '../../utils/utilities';
import SettingStore from '../../stores/SettingStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import SettingsManager from '../../utils/settings';

function getStoreSettingState() {
      let settings = SettingStore.getSettings();
      let current = {};

      settings.forEach(function(item, i) {
          current[item.internal] = item.value;
      });

      return current;
}

const Settings = React.createClass({

  propTypes: {
      onSettingChange: React.PropTypes.func
  },

  getInitialState() {
      PeopleSearchActions.fetchSettings();

      let settings = getStoreSettingState();

      SettingsManager.applySettings(getStoreSettingState());

      return settings;
  },
  
  componentDidUpdate() {
      if (this.state === null) {
          this.setState(this.getInitialState());
      }
  },

  componentDidMount() {
      SettingStore.addChangeListener(this.onSettingChange.bind(this));
  },

  componentWillMount() {
      SettingStore.removeChangeListener(this.onSettingChange);
  },

  onSettingChange() {
      let settings = getStoreSettingState();

      let collection = SettingsManager.applySettings(getStoreSettingState());

      this.props.onSettingChange(collection);
      this.setState(settings);
  },

  applySettings() {
      return SettingsManager.applySettings(getStoreSettingState());
  },

  handleChange(field, value) {
      let current = {};
      let settings = SettingStore.getSettings();

      settings.some(function(item, i) {
         let matched = field === item.internal;

         if (matched) { settings[i].value = value; }

         return matched;
      });

      PeopleSearchActions.updateSettings(settings);
  },

  getSettings(state) {
      let options = [];
      let settings = SettingStore.getSettings();
      let that = this;

      settings.forEach(function(item, i) {
          options.push(
              <Switch key={item.internal} checked={state[item.internal]} label={item.label} onChange={that.handleChange.bind(that, item.internal)} />
          );
      });

      return options;
  },

  render() {

      let settingComponentStyles = {
          display:'none !important'
      };

      if (this.state !== null) {
            return (
                <div id={'component-settings'} styleName={'component'} style={settingComponentStyles}>
                    <div styleName='container'>
                      
                      <Title text={this.props.title} suffix='Settings' />

                      <p styleName='info'>
                        <br /><br />
                        Settings can be controlled from this page - they will be <strong>applied automatically</strong>.
                      </p>

                      <div className={'content'} styleName={'checkbox-holder'}>
                        
                        <br /><br />
                        
                        <div className={'switches-with-broomsticks'}>
                          {this.getSettings(this.state)}
                        </div>

                      </div>
                    </div>

                    <br /><br />
                </div>
            );
      }      

  }
});

module.exports = cssModules(Settings, styles, { allowMultiple: true });
