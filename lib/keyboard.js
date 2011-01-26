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
    { key: 'I',
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
    { regex: [ params.times.regex, 'G' ],
      exec: 'jumptoline',
      params: [ params.times ]
    },
    {
      key: '$',
      exec: 'gotolineend'
    },
    {
      key: '^',
      exec: 'gotolinestart'
    },
    {
      regex: [ params.times.regex, '(e|E)' ],
      exec: 'goToEndWord',
      params: [ params.times ]
    },
    {
      regex: [ params.times.regex, '(b|B)' ],
      exec: 'goToBackWord',
      params: [ params.times ]
    },
    {
      key: 'G',
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
      regex: [ params.times.regex, 'X' ],
      exec: 'deleteCharBack',
      params: [ params.times ]
    },
    {
      comment: 'Catch some keyboard input to stop it here',
      match: matchCharacterOnly
    }
  ],
  insertMode: [
    { key: "esc", then: "start" }
  ]
}

exports.bindings = new StateHandler(states)

});
