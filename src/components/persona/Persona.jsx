import React from 'react';
import cssModules from 'react-css-modules';
import styles from './persona.css';
require('./lync');

/*
  Antonio Lopes | ISC License
  antonio.lopes@arup.com
*/
class Persona extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      presence: 'offline',
    };

    this.updatePresence = this.updatePresence.bind(this);
  }

  componentDidMount() {
    window.addEventListener('LyncStatusUpdate', this.updatePresence.bind(this));

    const contactRequest = new CustomEvent('createLyncContact',
      { detail: { sip: this.props.member.email } }
    );

    window.dispatchEvent(contactRequest);
  }

  componentDidUpdate() {
    if (this.state === null) {
      this.state = {
        presence: 'offline',
      };
    }

    const syncPersonaCard = new CustomEvent('syncPersonaCard',
      { detail: { presence: this.state.presence } }
    );

    window.dispatchEvent(syncPersonaCard);
  }

  componentWillUnmount() {
    window.removeEventListener('LyncStatusUpdate', this.updatePresence);
  }

  updatePresence(e) {
    if (this.props.member.email === e.detail.sip) {
      this.setState({ presence: e.detail.status });
    }
  }

  render() {
    if (this.state !== null) {
      const presence = `ms-Persona--${this.state.presence}`;
      const img = `/_layouts/15/userphoto.aspx?size=S&username=${this.props.member.email}`;

      return (
        <div className="contact" title={this.state.name}>
          <div className={`ms-Persona ms-Persona--square ${presence} ms-Persona--xs`}>
            <div className="ms-Persona-imageArea">
              <i className="ms-Persona-placeholder ms-Icon ms-Icon--person"></i>
                <img className="ms-Persona-image" src={img} />
            </div>
            <div className="ms-Persona-presence"></div>
            { this.props.names === false ? <div className="ms-Persona-details">
              <div className="ms-Persona-primaryText">
                {this.props.member.name}
              </div>
            </div> : null }
          </div>
        </div>
      );
    }
  }
}

Persona.propTypes = {
  names: React.PropTypes.bool,
  member: React.PropTypes.object.isRequired,
};

export default cssModules(Persona, styles, { allowMultiple: true });
