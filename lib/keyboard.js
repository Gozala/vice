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

"use strict"

var types = require('./params')
var StateHandler = require("ace/keyboard/state_handler").StateHandler
var matchCharacterOnly =  require("ace/keyboard/state_handler").matchCharacterOnly


var states = exports.states = {
  start: [ // normal mode
    {
      key:  'i',
      params: [ types.count ],
      exec: 'start',
      then: 'insertMode'
    },
    {
      key: 'I',
      params: [ types.bang ],
      exec: 'start',
      then: 'insertMode'
    },
    { 
      key: 'a',
      params: [ types.count ],
      exec: 'append',
      then: 'insertMode'
    },
    {
      key: 'A',
      params: [ types.count, types.bang ],
      exec: 'append',
      then: 'insertMode'
    },
    {
      regex: [ types.count.regex, 'o' ],
      params: [ types.count ],
      exec: 'openNewLines',
      then: 'insertMode'
    },
    {
      regex: [ types.count.regex, 'O' ],
      params: [ types.count, types.bang ],
      exec: 'openNewLines',
      then: 'insertMode'
    },
    {
      regex: [ types.count.regex, 's' ],
      params: [ types.count ],
      exec: 'substitute',
      then: 'insertMode'
    },
    {
      regex: [ types.count.regex, 'S' ],
      params: [ types.count, types.bang ],
      exec: 'substitute',
      then: 'insertMode'
    },
    {
      regex:  [ types.count.regex, 'k' ],
      params: [ types.count ],
      exec:   'moveUp',
    },
    {
      regex: [ types.count.regex, 'j' ],
      exec:   'moveDown',
      params: [ types.count ]
    },
    {
      regex:  [ types.count.regex, 'l' ],
      exec: "moveForward",
      params: [ types.count ]
    },
    {
      regex:  [ types.count.regex, 'h' ],
      exec:   "moveBack",
      params: [ types.count ]
    },
    {
      regex: [ types.count.regex, 'd', 'd' ],
      exec: 'deleteLines',
      params: [ types.count ]
    },
    { regex: [ types.line.regex, 'G' ],
      exec: 'jumptoline',
      params: [ types.line ]
    },
    {
      key: '\\$',
      exec: 'gotolineend'
    },
    {
      key: '\\^',
      exec: 'gotolinestart'
    },
    {
      regex: [ types.count.regex, '(e|E)' ],
      exec: 'goToEndWord',
      params: [ types.count ]
    },
    {
      regex: [ types.count.regex, '(b|B)' ],
      exec: 'goToBackWord',
      params: [ types.count ]
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
      regex: [ types.count.regex, 'x' ],
      exec: 'deleteChar',
      params: [ types.count ]
    },
    {
      regex: [ types.count.regex, 'X' ],
      exec: 'deleteCharBack',
      params: [ types.count ]
    },
    {
      comment: 'Catch some keyboard input to stop it here',
      match: matchCharacterOnly
    }
  ],
  insertMode: [
    {
      key: "esc",
      exec: 'stop',
      then: "start"
    }
  ]
}

exports.bindings = new StateHandler(states)

});
