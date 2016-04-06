/*
  Antonio Lopes | ISC License
  antonio.lopes@arup.com
*/
/* eslint new-cap: [2, {"capIsNewExceptions": ["IMNRC"]}] */

// CustomEvent Polyfill
(() => {
  if (typeof window.CustomEvent === 'function') {
    return false;
  }

  function CustomEvent(event, params) {
    const eventParams = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, eventParams.bubbles, eventParams.cancelable, eventParams.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

// avoiding network requests
const blankImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA` +
                   `1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVO` +
                   `RK5CYII%3D`;

function normaliseStatusName(status) {
  let normalisedStatus;
  switch (status) {
    case 'online':
      normalisedStatus = 'available';
      break;
    case 'busy':
      normalisedStatus = 'busy';
      break;
    case 'donotdisturb':
      normalisedStatus = 'dnd';
      break;
    case 'away':
      normalisedStatus = 'away';
      break;
    default:
      normalisedStatus = 'offline';
      break;
  }
  return normalisedStatus;
}

function notifyStatusUpdate(sip, status) {
  const event = new CustomEvent('LyncStatusUpdate',
    { detail: { sip, status: normaliseStatusName(status) } }
  );
  window.dispatchEvent(event);
}

function bindLync(sip, id) {
  const node = document.getElementById(id);
  node.addEventListener('DOMSubtreeModified', () => {
    const classList = node.className;
    let status = 'busy';

    if (classList && classList.split('-') && classList.split('-').length > 4) {
      // ["ms", "spimn", "presence", "online", "5x48x32"]
      status = classList.split('-')[3];
    }
    notifyStatusUpdate(sip, status);
  }, false);

  window.IMNRC(sip, node);
}

function getContactMarkup(sip) {
  const id = 'lync' + Math.floor(Math.random() * 10000);
  const contact = document.createElement('img');
  contact.setAttribute('id', id);
  contact.setAttribute('src', blankImage);
  contact.setAttribute('sip', sip);
  contact.setAttribute('class', 'ms-spimn-presence-offline-5x48x32');
  contact.setAttribute('onload', setTimeout(() => { bindLync(sip, id); }, 2000));
  return contact;
}

function createContactsContainer() {
  const contactsContainer = document.createElement('div');
  contactsContainer.setAttribute('id', 'contactsContainer');
  contactsContainer.setAttribute('style', 'display:none;');
  document.body.appendChild(contactsContainer);
}

window.addEventListener('createLyncContact', event => {
  if( !document.getElementById('contactsContainer') ){
    createContactsContainer();
  }
  
  const contact = getContactMarkup(event.detail.sip);
  document.getElementById('contactsContainer').appendChild(contact);
});
