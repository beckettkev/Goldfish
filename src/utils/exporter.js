//file saver (HTML 5)
import ContactFileSaver from '../data/filesaver';

module.exports = {
  convertArrayObjectsToCsv: function (items) {
    let str = '';
    let line = '';
    let heading = '';

    items.forEach(function (item, i) {
        line = '';

        for (let index in item.Cells) {
          if (i === 1) {
            heading += index + ',';
          }

          if (line.length > 0) {
            line += ',';
          }

          line += item.Cells[index] !== null ? item.Cells[index] : '';
        }

        str += line + '\r\n';
    });

    return heading.replace(/,+$/, '') + '\r\n' + str;
  },

  //This function outputs a string (containing comma deliminated data) to a CSV file
  exportCsvStringToFile: function (csvContent, filename) {
    const blob = new Blob([csvContent], {type: 'text/csv;charset=iso-8859-1'});

    ContactFileSaver.saveAs(blob, filename + '.csv');
  },

  //VCF Outlook contact card format
  getContactForExport: function (person) {
      const name = person.PreferredName.split(' ');
      const dateRightNow = new Date();

      let data = 'BEGIN:VCARD';
      data += '\n';
      data += 'VERSION:2.1';
      data += '\n';
      data += 'N;LANGUAGE=en-us:' + name[1] + ';' + name[0];
      data += '\n';
      data += 'FN:' + person.PreferredName;
      data += '\n';
      data += 'ORG:Content and Code';
      data += '\n';
      data += 'TITLE:' + person.JobTitle;
      data += '\n';

      if (typeof person.WorkPhone !== 'undefined') {
        data += 'TEL;TYPE=WORK,VOICE: ' + person.WorkPhone;
        data += '\n';
      }

      if (typeof person.CellPhone !== 'undefined') {
        data += 'TEL;TYPE=CELL:' + person.CellPhone;
        data += '\n';
      }

      data += 'DR;WORK;PREF:;;100 City Road;London;;EC1Y 2BP;United Kingdom';
      data += '\n';
      data += 'LABEL;WORK;PREF;ENCODING=QUOTED-PRINTABLE:100 City Road=0D=0A=';
      data += '\n';
      data += 'London  EC1Y 2BP';
      data += '\n';
      data += 'X-MS-OL-DEFAULT-POSTAL-ADDRESS:2';
      data += '\n';
      data += 'URL;WORK:https://mysite.contentandcode.com/personal/' + name[0] + '_' + name[1] + '/';
      data += '\n';
      data += 'EMAIL;PREF;INTERNET:' + person.WorkEmail;
      data += '\n';
      data += 'X-MS-OL-DESIGN;CHARSET=utf-8:<card xmlns="http://schemas.microsoft.com/office/outlook/12/electronicbusinesscards" ver="1.0" layout="left" bgcolor="ffffff"><img xmlns="" align="fit" area="16" use="cardpicture"/><fld xmlns="" prop="name" align="left" dir="ltr" style="b" color="000000" size="10"/><fld xmlns="" prop="org" align="left" dir="ltr" color="000000" size="8"/><fld xmlns="" prop="title" align="left" dir="ltr" color="000000" size="8"/><fld xmlns="" prop="telwork" align="left" dir="ltr" color="d48d2a" size="8"><label align="right" color="626262">Work</label></fld><fld xmlns="" prop="telcell" align="left" dir="ltr" color="d48d2a" size="8"><label align="right" color="626262">Mobile</label></fld><fld xmlns="" prop="email" align="left" dir="ltr" color="d48d2a" size="8"/><fld xmlns="" prop="addrwork" align="left" dir="ltr" color="000000" size="8"/><fld xmlns="" prop="webwork" align="left" dir="ltr" color="000000" size="8"/><fld xmlns="" prop="blank" size="8"/><fld xmlns="" prop="blank" size="8"/><fld xmlns="" prop="blank" size="8"/><fld xmlns="" prop="blank" size="8"/><fld xmlns="" prop="blank" size="8"/><fld xmlns="" prop="blank" size="8"/><fld xmlns="" prop="blank" size="8"/><fld xmlns="" prop="blank" size="8"/></card>';
      data += '\n';
      data += 'REV:' + dateRightNow.toISOString().replace(/[^a-zA-Z 0-9]+/g, '');
      data += '\n';
      data += 'END:VCARD';

      return {
        name: name[0] + '-' + name[1],
        data: data
      };
  }
};
