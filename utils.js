/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */

!define(function(require, exports, module) {

'use strict';

function moveUp(editor, count) {
  editor.selection.moveCursorBy(-1 * (count || 1), 0);
}
exports.moveUp = moveUp

function moveDown(editor, count) {
  editor.selection.moveCursorBy(1 * (count || 1), 0);
}
exports.moveDown = moveDown

function moveForward(editor, count) {
  editor.selection.moveCursorBy(0, 1 * (count || 1))
}
exports.moveForward = moveForward

function moveBack(editor, count) {
  editor.selection.moveCursorBy(0, -1 * (count || 1))
}
exports.moveBack = moveBack


function moveToEnd(editor) {
  editor.navigateLineEnd()
}
exports.moveToEnd = moveToEnd

function moveToBegining(editor) {
  editor.navigateLineStart()
}
exports.moveToBegining = moveToBegining

function open(editor, count) {
  var content = ''
  while (0 < count --) content += '\n'
  if (content.length) editor.insert(content)
}
exports.open = open

function repeat(callee, count, args) {
  while (0 < count--) callee.apply(this, args)
}

function removeLine(editor) {
  // Todo suggest patch that would allow passing count arg.
  editor.removeLines()
}

function removeLines(editor, count) {
  repeat(removeLine, count, [ editor ])
}
exports.removeLines = removeLines

function moveToEndOfNextWord(editor) {
  editor.navigateWordRight()
}

function moveToEndOfFollowingWord(editor, count) {
  doc: "Move caret to the end of the n'th word on the right."

  repeat(moveToEndOfNextWord, count, [editor])
}
exports.moveToEndOfFollowingWord = moveToEndOfFollowingWord

function moveToEndOfPreviosWord(editor) {
  doc: "Move caret to the enf of the word on the left."

  editor.navigateWordLeft()
}

function moveToEndOfPassedWord(editor, count) {
  doc: "Move caret to the end of the n'th word on the left."

  repeat(moveToEndOfPreviosWord, count, [editor])
}
exports.moveToEndOfPassedWord = moveToEndOfPassedWord

function removePreviosChar(editor) {
  doc: "Remove char on the left side of the caret."

  editor.removeLeft()
}

function removePreviosChars(editor, count) {
  doc: "Remove `count` chars on the left side of the caret."

  repeat(removePreviosChar, count, [editor])
}
exports.removePreviosChars = removePreviosChars

function removeFollowingChar(editor) {
  doc: "Remove one chare on the right side of the caret."

  editor.removeRight()
}

function removeFollowingChars(editor, count) {
  doc: "Remove `count` chars on the right side of the caret."

  repeat(removeFollowingChar, count, [editor])
}
exports.removeFollowingChars = removeFollowingChars

function normalMode(editor) {
  doc: "Switch editor to normal mode"

  editor.setStyle('normal-mode')
  editor.clearSelection()
  if (!editor.getOverwrite()) moveBack(editor, 1)
  editor.setOverwrite(true)
}
exports.normalMode = normalMode

function insertMode(editor) {
  doc: "Switch editor to insert mode"

  editor.unsetStyle('normal-mode')
  editor.setOverwrite(false)
}
exports.insertMode = insertMode

function visualMode(editor) {
  doc: "Switch editor to visual mode"

  var selection, position

  selection = editor.getSelection()
  position = cursor(editor)
  selection.clearSelection()
  selection.selectTo(position.row, position.column)
}
exports.visualMode = visualMode

function cursor(editor) {
  doc: "Gets current cursor position: { row: 5, column: 2 }"

  return editor.getSelection().getSelectionLead()
}

function row(editor) {
  doc: "Returns row cursor is on."

  return cursor(editor).row
}

function column(editor) {
  doc: "Returns column cursor is at."

  return cursor(editor).column
}

function line(editor, number) {
  doc: "Returns content under the given line number."

  return editor.getSession().getLine(number)
}

function navigateTo(editor, row, column) {
  doc: "Moves cursor to the given row and column."

  editor.moveCursorToPosition({ row: row, column: column })
}
exports.navigateTo = navigateTo

function moveToFirstChar(editor) {
  doc: "Move to the first character of the line."

  navigateTo(editor, row(editor), 0)
}
exports.moveToFirstChar = moveToFirstChar

function followingCharColumn(editor, row, column, char, n) {
  doc: "Returns position of the `n`-th `char` on the give `row` from the given"
     | "column`. If not found `0` is returned."

  var matches = line(editor, row).substr(column).split(char)
  return n < matches.length ? matches.slice(0, n).join(char).length : 0
}

function previousCharColumn(editor, row, column, char, n) {
  doc: "Returns position of the `n`-th `char` on the give `row` from the given"
     | "column` to the left. If not found `0` is returned."

  var matches = line(editor, row).substr(0, column).split(char)
  return n < matches.length ? matches.slice(-1 * n).join(char).length + 1: 0
}

function moveForwardTo(editor, char, n) {
  doc: "Moves caret in front of next `n`-th `char` on the line."

  var axis = cursor(editor)
  var column = followingCharColumn(editor, axis.row, axis.column + 1, char, n)
  if (column) navigateTo(editor, axis.row, axis.column + column)
}
exports.moveForwardTo = moveForwardTo

function moveForwardAt(editor, char, n) {
  doc: "Moves caret to the next `n`-th (right) `char` on the line."

  var axis = cursor(editor)
  var column = followingCharColumn(editor, axis.row, axis.column + 1, char, n)
  if (column) navigateTo(editor, axis.row, axis.column + column + 1)
}
exports.moveForwardAt = moveForwardAt

function moveBackwardTo(editor, char, n) {
  doc: "Moves caret just after the previous `n`-th (left) `char` on the line."

  var axis = cursor(editor)
  var column = previousCharColumn(editor, axis.row, axis.column - 1, char, n)
  if (column) navigateTo(editor, axis.row, axis.column - column)
}
exports.moveBackwardTo = moveBackwardTo

function moveBackwardAt(editor, char, n) {
  doc: "Moves caret to the prvious `n`-th (left) `char` on the line."

  var axis = cursor(editor)
  var column = previousCharColumn(editor, axis.row, axis.column, char, n)
  if (column) navigateTo(editor, axis.row, axis.column - column)
}
exports.moveBackwardAt = moveBackwardAt

});
