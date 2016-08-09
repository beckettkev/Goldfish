import React from 'react';
import styles from './Settings.css';
import cssModules from 'react-css-modules';
import Title from '../title/Title.jsx';
import Switch from '../../ui/Switch.jsx';
import SettingStore from '../../stores/SettingStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';
import SettingsManager from '../../utils/settings';

function getStoreSettingState() {
  const settings = SettingStore.getSettings();
  const current = {};

  settings.forEach(function(item) {
    current[item.internal] = item.value;
  });

  return current;
}

function getSettingsAndApply() {
  PeopleSearchActions.fetchSettings();

  const settings = getStoreSettingState();

  SettingsManager.applySettings(getStoreSettingState());

  return settings;
}

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = getSettingsAndApply();
  }

  componentWillMount() {
    SettingStore.removeChangeListener(this.onSettingChange);
  }

  componentDidMount() {
    SettingStore.addChangeListener(this.onSettingChange.bind(this));
  }

  componentDidUpdate() {
    if (this.state === null) {
      this.state = getSettingsAndApply();
    }
  }

  onSettingChange() {
    const settings = getStoreSettingState();
    const collection = SettingsManager.applySettings(getStoreSettingState());

    this.props.onSettingChange(collection);

    this.setState(settings);
  }

  getSettings(state) {
    const options = [];
    const settings = SettingStore.getSettings();
    const self = this;

    settings.forEach(function(item) {
      options.push(
        <Switch
          key={item.internal}
          checked={state[item.internal]}
          label={item.label}
          onChange={self.handleChange.bind(self, item.internal)} />
      );
    });

    return options;
  }

  handleChange(field, value) {
    const settings = SettingStore.getSettings();

    settings.some(function(item, i) {
      const matched = field === item.internal;

      if (matched) { settings[i].value = value; }

      return matched;
    });

    PeopleSearchActions.updateSettings(settings);
  }

  applySettings() {
    return SettingsManager.applySettings(getStoreSettingState());
  }

  render() {
    const settingComponentStyles = {
      display: 'none !important',
      paddingTop: this.props.paddingTop,
    };

    if (this.state !== null) {
      return (
        <div id="component-settings" styleName="component" style={settingComponentStyles}>
          <div styleName="container">
              <Title
                text={this.props.title}
                suffix="Settings" />

              <p styleName="info">
                <br /><br />
                Settings can be controlled from this page - they will be <strong>applied automatically</strong>.
              </p>

              <div className="content" styleName="checkbox-holder">

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

Settings.propTypes = {
  title: React.PropTypes.string,
  paddingTop: React.PropTypes.string,
  onSettingChange: React.PropTypes.func,
};

export default cssModules(Settings, styles, { allowMultiple: true });
