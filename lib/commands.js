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

var lang = require("pilot/lang")
var canon = require("pilot/canon")

canon.addCommands = function addCommands(commands) {
  Object.keys(commands).forEach(function (name) {
    var command = commands[name]
    if ('function' === typeof command) command = { exec: command }
    if (!command.name) command.name = name
    canon.addCommand(command)
  })
}

function moveUp(env, times) {
  env.editor.navigateUp(times)
}
function moveDown(env, times) {
  env.editor.navigateDown(times)
}
function moveToEnd(env) {
  env.editor.navigateLineEnd()
}
function moveToBegining(env) {
  env.editor.navigateLineStart()
}
function open(env) {
  env.editor.insert('\n')
}
function repeat(callee, times, args) {
  while (0 < times--) callee.apply(this, args)
}
function removeLine(env) {
  // Todo suggest patch that would allow passing times arg.
  env.editor.removeLines()
}
function removeLines(env, times) {
  repeat(removeLine, times, [env])
}
function moveToEndOfNextWord(env) {
  env.editor.navigateWordRight()
}
function moveToEndOfFollowingWord(env, times) {
  repeat(moveToEndOfNextWord, times, [env])
}
function moveToEndOfPreviosWord(env) {
  env.editor.navigateWordLeft()
}
function moveToEndOfPassedWord(env, times) {
  repeat(moveToEndOfPreviosWord, times, [env])
}
function removePreviosChar(env) {
  env.editor.removeLeft()
}
function removePreviosChars(env, count) {
  repeat(removePreviosChar, count, [env])
}
function removeFollowingChar(env) {
  env.editor.removeRight()
}
function removeFollowingChars(env, count) {
  repeat(removeFollowingChar, count, [env])
}

canon.addCommands({
  jumptoline: function(env, args, request) {
    env.editor.gotoLine(args.line)
  },
  goToEndWord: function(env, args, request) {
    moveToEndOfFollowingWord(env, args.times)
  },
  goToBackWord: function(env, args, request) {
    moveToEndOfPassedWord(env, args.times)
  },
  deleteChar: function(env, args, request) {
    removeFollowingChars(env, args.times)
  },
  deleteCharBack: function(env, args, request) {
    removePreviosChars(env, args.times)
  },
  openBelow: function(env, args, request) {
    moveToEnd(env)
    open(env)
  },
  openAbove: function(env, args, request) {
    moveUp(env)
    moveToEnd(env)
    open(env)
  },
  substractLines: function(env, args, request) {
    moveUp(env)
    moveToBegining(env)
    open(env)
    removeLines(env, args.times)
    moveUp(env)
  }
})

})
