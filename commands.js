/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */

define(function(require, exports, module) {

'use strict';

var meta = require('plugin-hub/core').meta
var types = require('./params')
var utils = require('./utils'),
            moveToEndOfFollowingWord = utils.moveToEndOfFollowingWord,
            moveToEndOfPassedWord = utils.moveToEndOfPassedWord,
            removeFollowingChars = utils.removeFollowingChars,
            removePreviosChars = utils.removePreviosChars,
            moveUp = utils.moveUp,
            moveDown = utils.moveDown,
            moveBack = utils.moveBack,
            moveForward = utils.moveForward,
            moveToEnd = utils.moveToEnd,
            moveToBegining = utils.moveToBegining,
            open = utils.open,
            removeLines = utils.removeLines,
            normalMode = utils.normalMode,
            insertMode = utils.insertMode


function FocusEditor(editor, target) {
  function focusEditor(event) {
    // If escape key we set focus to the editor.
    if (event.keyCode === 27) {
      target.value = null
      target.blur()
      editor.focus()
    }
  }
  target.addEventListener("keyup", focusEditor, true);
  return true;
}

var conflicts = {
  'gotoline': 'gotoline',
  'find': 'find'
};

var commands = {
  vice: meta('Group of commands emulating VI', {
    mode: meta('Commands for switching modes', {
      visual: meta({
        description: 'Start **visual** mode',
        takes: [ 'editor' ]
      }, function visual(editor) {
        utils.visualMode(editor)
      }),
      normal: meta({
        description: 'Start **normal** mode',
        manual: 'Stop Insert mode as soon as possible. Works like' +
             'typing <Esc> in **insert** mode.',
        takes: [ 'editor' ]
      }, function stop(editor) {
        normalMode(editor)
      }),
      insert: meta('Insert modes', {
        here: meta({
          description: 'Start **insert** mode',
          manual: 'Start **insert** mode just after executing this command. ' +
               'Works like typing "i" in Normal mode.  When the ! is ' +
               'included it works like "A", append to the line. ' +
               'Otherwise insertion starts at the cursor position. ' +
               'Note that when using this command in a function or ' +
               'script, the insertion only starts after the function ' +
               'or script is finished.\n' +
               'This command does not work from |:normal ',
          takes: [ 'editor' ]
        }, function start(editor, invert) {
          insertMode(editor)
        }),
        start: meta({
          takes: [ 'editor' ]
        }, function insertStart(editor) {
          moveToBegining(editor)
          insertMode(editor)
        }),
        after: meta({
          description: 'Append text and start **normal** mode',
          manual: 'Append text after the cursor / word (if !) word.',
          takes: [ 'editor', 'number' ]
        }, function insertAfter(editor) {
          moveForward(editor, 1)
          insertMode(editor)
        }),
        end: meta({
          takes: [ 'editor' ]
        }, function insertEnd(editor, x) {
          moveToEnd(editor)
          insertMode(editor)
        })
      })
    }),
    cli: meta({
      description: 'Jump to the command line',
      takes: [ 'editor', 'env' ]
    }, function commandLine(editor, env) {
      var cli = env.gcli.display.inputter.element;
      editor.blur()
      cli.focus()
      // Yeap it's an ugly hack to put focus back to an editor.
      return commandLine.inited || (commandLine.inited = FocusEditor(editor, cli))
    }),
    line: meta('Group of commands for working with lines', {
      open: meta('Function for opening lines', {
        below: meta({
          description: 'Begin new line and start **insert**',
          manual: 'Begin a new line below / above (if !) the cursor and' +
                  ' insert text, repeat `count` times.',
          takes: [ 'editor', 'number' ]
        }, function lineOpenBelow(editor, x) {
          moveToEnd(editor)
          open(editor, x || 1)
          insertMode(editor)
        }),
        above: meta({
          takes: [ 'editor', 'number' ]
        }, function lineOpenAbove(editor, x) {
          moveUp(editor)
          commands.vice.line.open.below(editor, x)
        })
      }),
      remove: meta({
        description: 'Delete [count] lines [into register x] |linewise|',
        takes: [ 'editor', 'number' ],
      }, function deleteLines(editor, x) {
        removeLines(editor, x || 1)
      }),
      jump: meta({
        takes: [ 'editor', 'number' ]
      }, function(editor, x) {
        editor.gotoLine(x || 1)
      }),
      substitute: meta({
        takes: [ 'editor', 'number' ]
      }, function substitutePrevious(editor, x) {
        removeLines(editor, x || 1)
        moveUp(editor)
        moveToEnd(editor)
        open(editor, 1)
        insertMode(editor)
      })
    }),
    char: meta('Editor char operations', {
      remove: meta('Editor char removal operations', {
        here: meta({
          takes: [ 'editor', 'number' ]
        }, function(editor, x) {
          removeFollowingChars(editor, x || 1)
        }),
        previous: meta({
          takes: [ 'editor', 'number' ]
        }, function(editor, x) {
          removePreviosChars(editor, x || 1)
        })
      }),
      substitute: meta({
        description: 'Substitite and start **insert**',
        manual: 'Delete `count` characters / lines (if !) and start **insert**' +
                '(s stands for Substitute).',
        takes: [ 'editor', 'number' ]
      }, function substituteNext(editor, x) {
        removeFollowingChars(editor, x || 1)
        insertMode(editor)
      })
    }),
    navigate: meta('Editor navigation commands', {
      up: meta({
        takes: [ 'editor', 'number' ]
      }, function(editor, x) {
          moveUp(editor, x || 1)
      }),
      down: meta({
        takes: [ 'editor', 'number' ]
      }, function(editor, x) {
        moveDown(editor, x || 1)
      }),
      back: meta({
        takes: [ 'editor', 'number' ]
      }, function(editor, x) {
        moveBack(editor, x || 1)
      }),
      forward: meta({
        takes: [ 'editor', 'number' ]
      }, function(editor, x) {
        moveForward(editor, x || 1)
      }),
      word: meta('Word related navigation', {
        end: meta({
          takes: [ 'editor', 'number' ]
        }, function(editor, x) {
          moveToEndOfFollowingWord(editor, x || 1)
        }),
        start: meta({
          takes: [ 'editor', 'number' ]
        }, function(editor, x) {
          moveToEndOfPassedWord(editor, x || 1)
        })
      }),
      start: meta({
        takes: [ 'editor' ]
      }, function(editor) {
        utils.moveToFirstChar(editor)
      }),
      char: meta('Char related navigation commands', {
        next: meta('Move at character', {
          at: meta({
            takes: [ 'editor', 'number', 'char' ]
          }, function atNextChar(editor, x, char) {
            utils.moveForwardAt(editor, types.char.valueOf(char), x || 1)
          }),
          to: meta({
            takes: [ 'editor', 'number', 'char' ]
          }, function toNextChar(editor, x, char) {
            utils.moveForwardTo(editor, types.char.valueOf(char), x || 1)
          })
        }),
        previous: meta('Move to character', {
          at: meta({
            takes: [ 'editor', 'number', 'char' ]
          }, function atPreviousChar(editor, x, char) {
            utils.moveBackwardAt(editor, types.char.valueOf(char), x || 1)
          }),
          to: meta({
            takes: [ 'editor', 'number', 'char' ]
          }, function toPreviousChar(editor, x, char) {
            utils.moveBackwardTo(editor, types.char.valueOf(char), x || 1)
          })
        })
      })
    }),
    find: meta({
      takes: [ 'editor', 'env' ]
    }, function find(editor, env) {
      env.gcli.display.inputter.setInput('search ')
      commands.vice.cli(editor, env)
    })
  }),
  search: meta({
    description: 'search all the matchings',
    takes: [ 'string', 'editor', 'env' ]
  }, function(term, editor, env) {
    editor.find(term)
    env.gcli.display.hide()
    env.gcli.display.inputter.element.blur()
    // Something strange with GCLI Taking focus otherwise.
    setTimeout(editor.focus.bind(editor), 0)
  }),
  'search next': meta({
    description: 'Search for the given term',
    takes: [ 'editor', 'number' ],
  }, function(editor, x) {
    editor.editor.findNext()
  }),
  'search previous': meta({
    takes: [ 'editor', 'number' ]
  }, function(editor, x) {
    editor.editor.findPrevious()
  })
}
exports.commands = commands

});
