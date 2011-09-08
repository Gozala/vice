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

function moveToEndOfFollowingWord(env, count) {
  doc: "Move caret to the end of the n'th word on the right."

  repeat(moveToEndOfNextWord, count, [env])
}
exports.moveToEndOfFollowingWord = moveToEndOfFollowingWord

function moveToEndOfPreviosWord(env) {
  doc: "Move caret to the enf of the word on the left."

  env.editor.navigateWordLeft()
}

function moveToEndOfPassedWord(env, count) {
  doc: "Move caret to the end of the n'th word on the left."

  repeat(moveToEndOfPreviosWord, count, [env])
}
exports.moveToEndOfPassedWord = moveToEndOfPassedWord

function removePreviosChar(env) {
  doc: "Remove char on the left side of the caret."

  env.editor.removeLeft()
}

function removePreviosChars(env, count) {
  doc: "Remove `count` chars on the left side of the caret."

  repeat(removePreviosChar, count, [env])
}
exports.removePreviosChars = removePreviosChars

function removeFollowingChar(env) {
  doc: "Remove one chare on the right side of the caret."

  env.editor.removeRight()
}

function removeFollowingChars(env, count) {
  doc: "Remove `count` chars on the right side of the caret."

  repeat(removeFollowingChar, count, [env])
}
exports.removeFollowingChars = removeFollowingChars

function normalMode(env) {
  doc: "Switch editor to normal mode"

  env.editor.setStyle('normal-mode')
  env.editor.clearSelection()
  if (!env.editor.getOverwrite()) moveBack(env, 1)
  env.editor.setOverwrite(true)
}
exports.normalMode = normalMode

function insertMode(env) {
  doc: "Switch editor to insert mode"

  env.editor.unsetStyle('normal-mode')
  env.editor.setOverwrite(false)
}
exports.insertMode = insertMode

function cursor(env) {
  doc: "Gets current cursor position: { row: 5, column: 2 }"

  return env.editor.getSelection().getSelectionLead()
}

function row(env) {
  doc: "Returns row cursor is on."

  return cursor(env).row
}

function column(env) {
  doc: "Returns column cursor is at."

  return cursor(env).column
}

function line(env, number) {
  doc: "Returns content under the given line number."

  return env.editor.getSession().getLine(number)
}

function navigateTo(env, row, column) {
  doc: "Moves cursor to the given row and column."

  env.editor.moveCursorToPosition({ row: row, column: column })
}
exports.navigateTo = navigateTo

function moveToFirstChar(env) {
  doc: "Move to the first character of the line."

  navigateTo(env, row(env), 0)
}
exports.moveToFirstChar = moveToFirstChar

function followingCharColumn(env, row, column, char, n) {
  doc: "Returns position of the `n`-th `char` on the give `row` from the given"
     | "column`. If not found `0` is returned."

  var matches = line(env, row).substr(column).split(char)
  return n < matches.length ? matches.slice(0, n).join(char).length : 0
}

function previousCharColumn(env, row, column, char, n) {
  doc: "Returns position of the `n`-th `char` on the give `row` from the given"
     | "column` to the left. If not found `0` is returned."

  var matches = line(env, row).substr(0, column).split(char)
  return n < matches.length ? matches.slice(-1 * n).join(char).length + 1: 0
}

function moveForwardTo(env, char, n) {
  doc: "Moves caret in front of next `n`-th `char` on the line."

  var axis = cursor(env)
  var column = followingCharColumn(env, axis.row, axis.column + 1, char, n)
  if (column) navigateTo(env, axis.row, axis.column + column)
}
exports.moveForwardTo = moveForwardTo

function moveForwardAt(env, char, n) {
  doc: "Moves caret to the next `n`-th (right) `char` on the line."

  var axis = cursor(env)
  var column = followingCharColumn(env, axis.row, axis.column + 1, char, n)
  if (column) navigateTo(env, axis.row, axis.column + column + 1)
}
exports.moveForwardAt = moveForwardAt

function moveBackwardTo(env, char, n) {
  doc: "Moves caret just after the previous `n`-th (left) `char` on the line."

  var axis = cursor(env)
  var column = previousCharColumn(env, axis.row, axis.column - 1, char, n)
  if (column) navigateTo(env, axis.row, axis.column - column)
}
exports.moveBackwardTo = moveBackwardTo

function moveBackwardAt(env, char, n) {
  doc: "Moves caret to the prvious `n`-th (left) `char` on the line."

  var axis = cursor(env)
  var column = previousCharColumn(env, axis.row, axis.column, char, n)
  if (column) navigateTo(env, axis.row, axis.column - column)
}
exports.moveBackwardAt = moveBackwardAt

});
