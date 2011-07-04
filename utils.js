/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */
!define(function(require, exports, module) {

'use strict';

function moveUp(env, count) {
  env.editor.selection.moveCursorBy(-1 * (count || 1), 0);
}
exports.moveUp = moveUp

function moveDown(env, count) {
  env.editor.selection.moveCursorBy(1 * (count || 1), 0);
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

});
