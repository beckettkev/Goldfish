/* global SP */
/* global ExecuteOrDelayUntilScriptLoaded */
/* eslint new-cap: 0 */
/* eslint consistent-return: 0 */

// ensure that every word in the string has a capital first letter...
const isIncorrectCase = (text) => text.split(' ').some(word => word.substring(0, 1) !== word.substring(0, 1).toUpperCase());

module.exports = {
  // checks to see if the selection could be a name...
  isName: text => /^([A-Za-z]{3,}\s[a-zA-z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/.test(text) && text.indexOf(' ') > -1 && !isIncorrectCase(text),

  /*
    getSelectedText: checks for text selection on mouseup (does not currently work for keys) and returns the value to the callback
    function if it looks like it could be the name of a person.

    example usage:
        document.mouseup = (e) => selection.getSelectedText(e, callback);
  */
  getSelectedText: (e, callback) => {
      // get the currently selected text...
      var selection = (document.all) ? document.selection.createRange().text : document.getSelection();

      // if there is a selection, we are still intrested...
      if (selection.focusNode.nodeValue) {
          // get the full string from the node of where the selection was made...
          var nodeText = selection.focusNode.nodeValue;

          // get the actual selected text...
          var selectedText = nodeText.substring(selection.anchorOffset, selection.extentOffset);

          if (isName(selectedText.trim())) {
              // this could be a name!
              callback(selectedText.trim());
          }
      }
  },
};
