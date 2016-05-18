/* global SP */
/* global ExecuteOrDelayUntilScriptLoaded */
/* eslint new-cap: 0 */
/* eslint consistent-return: 0 */
module.exports = {
  setNotificationMessage: function setNotificationMessage(msg, sticky) {
    ExecuteOrDelayUntilScriptLoaded(function() {
      const note = SP.UI.Notify.addNotification(msg, sticky);
    }, 'sp.js');
  },
  prefixZeroToSingleInt: function prefixZeroToSingleInt(num) {
    return num.toString().length === 1 ? '0' + num.toString() : num;
  },
  // accepts an offset of hours to add to the current date time
  getDateAsIsoStandard: function getDateAsIsoStandard(hours) {
    const d = new Date();

    if (hours !== 0) {
      d.setHours(d.getHours() + hours);
    }

    return d.getFullYear() + '-' + this.prefixZeroToSingleInt((d.getMonth() + 1)) + '-' + this.prefixZeroToSingleInt(d.getDate()) + 'T' + this.prefixZeroToSingleInt(d.getHours()) + ':' + this.prefixZeroToSingleInt(d.getMinutes()) + ':00.000Z';
  },
  getDaysBetweenDates: function getDaysBetweenDates(d0, d1) {
    const msPerDay = 8.64e7;

    // Copy dates so don't mess them up
    const x0 = new Date(d0);
    const x1 = new Date(d1);

    // Set to noon - avoid DST errors
    x0.setHours(12, 0, 0);
    x1.setHours(12, 0, 0);

    // Round to remove daylight saving errors
    return Math.round((x1 - x0) / msPerDay);
  },
  buildStoragePayload: function buildStoragePayload(payload) {
    return {
      birthday: this.getDateAsIsoStandard(0),
      payload: payload,
    };
  },
  createStorageKey: function createStorageKey(s) {
    const storageKey = s.replace(/(^|\s)([a-z])/g, function(m, p1, p2) { return p1 + p2.toUpperCase(); });

    return storageKey.replace(/ /g, '');
  },
  getRequestDigestToken: function getRequestDigestToken() {
    if (document.getElementById('__REQUESTDIGEST')) {
      return document.getElementById('__REQUESTDIGEST').value;
    }

    return 0;
  },
  getHeaders: function getHeaders() {
    return {
      'Accept': 'application/json; charset=utf-8',
      'X-RequestDigest': this.getRequestDigestToken(),
    };
  },
  getBaseUrl: function getBaseUrl() {
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    const path = window.location.pathname.split('/');

    if (typeof path[2] === 'undefined' || path[1].toLowerCase() === 'pages') {
      return `${window.location.origin}`;
    }

    return `${window.location.origin}/${path[1]}/${path[2]}`;
  },
  getFullSearchQueryUrl: function getFullSearchQueryUrl(term, selectProperties) {
    const properties = selectProperties !== '' ? `, ${selectProperties}` : '';

    return `${this.getBaseUrl().replace('_layouts/15', '')}/_api/search/query?sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&querytext='${term.replace("'", "")}*'&selectproperties='JobTitle,Department,Path,WorkPhone,MobilePhone,BaseOfficeLocation,PreferredName,WorkEmail,Office,Region,SipAddress,SPS-Skills,Manager${properties}'&sortby='PreferredName:descending'`;
  },
  removeEncodedAmpersand: function removeEncodedAmpersand(str) {
    return str.replace('amp;', '');
  },
  getTrimmedString: function getTrimmedString(s, limit) {
    // check for null and undefined with a double equals
    const timmed = s === null ? '' : s;

    return timmed.length > limit ? timmed.substring(0, limit - 4) + '...' : timmed;
  },
  capitalizeFirstLetter: function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  formatNumber: function formatNumber(number) {
    if (!number) { return; }

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  renderStaffListLink: function renderStaffListLink(query, propertyName, locationExportType) {
    const baseUrl = this.locationProtocol() + '//' + this.locationHost() + '/sites/search/Pages/peopleresults.aspx';
    const linkViewStaff = baseUrl + '#Default={"k":"","r":[{"n":"' + propertyName + '","t":["\\"' + unescape('%u01C2') + unescape('%u01C2') + this.stringToHex(query) + '\\""],"o":"and","k":false,"m":null}]}';

    return {
      linkViewStaff,
      linkExportCsv: { locationExportType, query },
    };
  },
  locationProtocol: function locationProtocol() {
    return window.location.protocol;
  },
  locationHost: function locationHost() {
    return window.location.host;
  },
  stringToHex: function stringToHex(s) {
    if (!s) {
      return;
    }

    let hex = '';

    for (let i = 0; i < s.length; i++) {
      if (s.charCodeAt(i) > 2048) {
        hex += this.toUTF8(s.charCodeAt(i));
      } else {
        hex += (s.charCodeAt(i).toString(16));
      }
    }

    return hex.toLowerCase();
  },
  toUTF8: function toUTF8(codepoint) {
    // make sure the codepoint is >2048
    const bit3 = codepoint & 63;
    const bit2 = (codepoint >> 6) & 63;
    const bit1 = (codepoint >> 12) & 15;

    return (bit1 | 0xE0).toString(16) + (bit2 | 0x80).toString(16) + (bit3 | 0x80).toString(16);
  },
  _spPageContextInfo: function _spPageContextInfo() {
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    const path = window.location.pathname.split('/');

    return `${window.location.origin}/${path[1]}/${path[2]}`;
  },
};
