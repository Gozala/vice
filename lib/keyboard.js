/* vim:ts=2:sts=2:sw=2:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Irakli Gozalishvili <rfobic@gmail.com> (http://jeditoolkit.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

var StateHandler = require("ace/keyboard/state_handler").StateHandler
var matchCharacterOnly =  require("ace/keyboard/state_handler").matchCharacterOnly

var params = {
  times: {
    regex: '([0-9]*)',
    name: 'times',
    match: 1,
    type: 'number',
    defaultValue: 1
  }
}


var states = {
  start: [ // normal mode
    {
      key:  'i',
      then: 'insertMode'
    },
    { key: 'shift-i',
      exec: 'gotolinestart',
      then: 'insertMode'
    },
    {
      regex:  [ params.times.regex, 'k' ],
      exec:   'golineup',
      params: [ params.times ]
    },
    {
      regex: [ params.times.regex, 'j' ],
      exec:   'golinedown',
      params: [ params.times ]
    },
    {
      regex:  [ params.times.regex, 'l' ],
      exec: "gotoright",
      params: [ params.times ]
    },
    {
      regex:  [ params.times.regex, 'h' ],
      exec:   "gotoleft",
      params: [ params.times ]
    },
    {
      regex: [ params.times.regex, 'd', 'd' ],
      exec: 'removeline',
      params: [ params.times ]
    },
    /* param is not caught for some reason yet so it always jumps to #1.
    { regex: [ params.times.regex, 'shift-g' ],
      exec: 'jumptoline',
      params: [ params.times ]
    },
    */
    {
      key: 'shift-4',
      exec: 'gotolineend'
    },
    {
      key: 'shift-6',
      exec: 'gotolinestart'
    },
    {
      regex: [ params.times.regex, '(e|shift-e)' ],
      exec: 'goToEndWord',
      params: [ params.times ]
    },
    {
      regex: [ params.times.regex, '(b|shift-b)' ],
      exec: 'goToBackWord',
      params: [ params.times ]
    },
    {
      key: 'shift-g',
      exec: 'gotoend'
    },
    {
      regex: [ 'g', 'g' ],
      exec: 'gotostart'
    },
    {
      regex: [ params.times.regex, 'x' ],
      exec: 'deleteChar',
      params: [ params.times ]
    },
    {
      regex: [ params.times.regex, 'shift-x' ],
      exec: 'deleteCharBack',
      params: [ params.times ]
    },
    {
      comment: 'Catch some keyboard input to stop it here',
      match: matchCharacterOnly
      /*function(buffer, hashId, key, symbolicName) {
        // If no command keys are pressed, then catch the input.
        if (hashId == 0) {
            return true;
        }
        // If only the shift key is pressed and a character key, then
        // catch that input as well.
        else if ((hashId == 4) && key.length == 1 && String.charAt('a') < key) {
            console.log(buffer, hashId, key, symbolicName)
            return true;
        }
        // Otherwise, we let the input got through.
        else {
            return false;
        }
      }*/
    }
  ],
  insertMode: [
    { key: "esc", then: "start" }
  ]
}

exports.bindings = new StateHandler(states)

});
