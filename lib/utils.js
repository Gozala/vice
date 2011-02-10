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

function moveUp(env, count) {
  env.editor.selection.moveCursorBy(-1 * (count || 1), 0);
}
exports.moveUp = moveUp

function moveDown(env, count) {
  env.editor.selection.moveCursorBy(count || 1, 0);
}
exports.moveDown = moveDown

function moveForward(env, count) {
  env.editor.selection.moveCursorBy(0, 1 * (count || 1))
}
exports.moveForward = moveForward

function moveBack(env, count) {
  env.editor.selection.moveCursorBy(0, -1 * (count || 1))
}
exports.moveBack = moveBack


function moveToEnd(env) {
  env.editor.navigateLineEnd()
}
exports.moveToEnd = moveToEnd

function moveToBegining(env) {
  env.editor.navigateLineStart()
}
exports.moveToBegining = moveToBegining

function open(env, count) {
  var content = ''
  while (0 < count --) content += '\n'
  if (content.length) env.editor.insert(content)
}
exports.open = open

function repeat(callee, count, args) {
  while (0 < count--) callee.apply(this, args)
}

function removeLine(env) {
  // Todo suggest patch that would allow passing count arg.
  env.editor.removeLines()
}

function removeLines(env, count) {
  repeat(removeLine, count, [env])
}
exports.removeLines = removeLines

function moveToEndOfNextWord(env) {
  env.editor.navigateWordRight()
}
// Move curret to the end of the n'th word on the right.
function moveToEndOfFollowingWord(env, count) {
  repeat(moveToEndOfNextWord, count, [env])
}
exports.moveToEndOfFollowingWord = moveToEndOfFollowingWord

// Move curret to the enf of the word on the left.
function moveToEndOfPreviosWord(env) {
  env.editor.navigateWordLeft()
}

// Move curret to the end of the n'th word on the left.
function moveToEndOfPassedWord(env, count) {
  repeat(moveToEndOfPreviosWord, count, [env])
}
exports.moveToEndOfPassedWord = moveToEndOfPassedWord

// Remove char on the left side of the curret.
function removePreviosChar(env) {
  env.editor.removeLeft()
}

// Remove `count` chars on the left side of the curret.
function removePreviosChars(env, count) {
  repeat(removePreviosChar, count, [env])
}
exports.removePreviosChars = removePreviosChars

// Remove one chare on the right side of the curret.
function removeFollowingChar(env) {
  env.editor.removeRight()
}

// Remove `count` chars on the right side of the curret.
function removeFollowingChars(env, count) {
  repeat(removeFollowingChar, count, [env])
}
exports.removeFollowingChars = removeFollowingChars

// Switch editor to normal mode
function normalMode(env) {
  //env.editor.focus()
  env.editor.setStyle('normal-mode')
  env.editor.setOverwrite(true)
}
exports.normalMode = normalMode

// Switch editor to insert mode
function insertMode(env) {
  //env.editor.focus()
  env.editor.unsetStyle('normal-mode')
  env.editor.setOverwrite(false)
}
exports.insertMode = insertMode

})
