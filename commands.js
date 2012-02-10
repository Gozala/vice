/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */

!define(function(require, exports, module) {

'use strict';

var motion = require('./motion')
var canon = require('pilot/canon')
var baseTypes = require('pilot/types')
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


canon.addCommands = function addCommands(commands) {
  Object.keys(commands).forEach(function (name) {
    var command = commands[name]
    if ('function' === typeof command) command = { exec: command }
    if (!command.name) command.name = name
    canon.addCommand(command)
  })
}

canon.removeCommands = function removeCommands(commands) {
  Object.keys(commands).forEach(function (name) {
    canon.removeCommand(commands[name])
  })
}

function isBang(params) {
  return '!' === params['!']
}

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
var commands = exports.commands = {
  commandLine: {
    exec: function exec(editor, params, request) {
      var cli = editor.container.ownerDocument.getElementById("cockpitInput")
      editor.blur()
      cli.focus()
      // Yeap it's an ugly hack to put focus back to an editor.
      return exec.inited || (exec.inited = FocusEditor(editor, cli))
    }
  },
  start: {
    description: 'Start **insert** mode',
    man: 'Start **insert** mode just after executing this command. ' +
         'Works like typing "i" in Normal mode.  When the ! is ' +
         'included it works like "A", append to the line. ' +
         'Otherwise insertion starts at the cursor position. ' +
         'Note that when using this command in a function or ' +
         'script, the insertion only starts after the function ' +
         'or script is finished.\n' +
         'This command does not work from |:normal ',
    params: [ types['!'] ],
    exec: function start(editor, params, request) {
      if (isBang(params)) moveToBegining(editor)
      insertMode(editor)
    }
  },
  stop: {
    description: 'Start **normal** mode',
    man: 'Stop Insert mode as soon as possible. Works like' +
         'typing <Esc> in **insert** mode.',
    exec: function stop(editor, params, request) {
      normalMode(editor)
    }
  },
  enableVisualMode: {
    description: 'Start **visual** mode',
    exec: function visual(editor, params, request) {
      utils.visualMode(editor)
    }
  },
  append: {
    description: 'Append text and start **normal** mode',
    man: 'Append text after the cursor / word (if !) word.',
    params: [ types.count, types['!'] ],
    exec: function append(editor, params, request) {
      if (isBang(params)) moveToEnd(editor)
      else moveForward(editor, params.count)
      insertMode(editor)
    }
  },
  openNewLines: {
    description: 'Begin new line and start **insert**',
    man: 'Begin a new line below / above (if !) the cursor and insert text, ' +
         'repeat `count` times.',
    params: [ types.count, types['!'] ],
    exec: function openNewLines(editor, params, request) {
      if (isBang(params)) moveUp(editor)
      moveToEnd(editor)
      open(editor, params.count)
      insertMode(editor)
    }
  },
  substitute: {
    description: 'Substitite and start **insert**',
    man: 'Delete `count` characters / lines (if !) and start **insert**' +
         '(s stands for Substitute).',
    params: [ types.count, types['!'] ],
    exec: function substitute(editor, params, request) {
      if (isBang(params)) {
        moveUp(editor)
        moveToBegining(editor)
        open(editor, 1)
        removeLines(editor, params.count)
        moveUp(editor)
      } else {
        removeFollowingChars(editor, params.count)
      }
      insertMode(editor)
    }
  },
  deleteLines: {
    description: 'Delete [count] lines [into register x] |linewise|',
    params: [ types.count ],
    exec: function deleteLines(editor, params, request) {
      removeLines(editor, params.count)
    }
  },
  jumptoline: function(editor, params, request) {
    editor.gotoLine(params.line)
  },
  moveUp: {
    params: [ types.count ],
    exec: function(editor, params, request) {
      moveUp(editor, params.count)
    }
  },
  moveDown: {
    params: [ types.count ],
    exec: function(editor, params, request) {
      moveDown(editor, params.count)
    }
  },
  moveBack: {
    params: [ types.count ],
    exec: function(editor, params, request) {
      moveBack(editor, params.count)
    }
  },
  moveForward: {
    params: [ types.count ],
    exec: function(editor, params, request) {
      moveForward(editor, params.count)
    }
  },
  goToEndWord: function(editor, params, request) {
    moveToEndOfFollowingWord(editor, params.count)
  },
  goToBackWord: function(editor, params, request) {
    moveToEndOfPassedWord(editor, params.count)
  },
  deleteChar: function(editor, params, request) {
    removeFollowingChars(editor, params.count)
  },
  deleteCharBack: function(editor, params, request) {
    removePreviosChars(editor, params.count)
  },
  moveForwardTo: {
    params: [ types.count, types.char ],
    exec: function(editor, params, request) {
      utils.moveForwardTo(editor, types.char.valueOf(params.char), params.count)
    }
  },
  moveForwardAt: {
    params: [ types.count, types.char ],
    exec: function(editor, params, request) {
      utils.moveForwardAt(editor, types.char.valueOf(params.char), params.count)
    }
  },
  moveBackwardTo: {
    params: [ types.count, types.char ],
    exec: function(editor, params, request) {
      utils.moveBackwardTo(editor, types.char.valueOf(params.char), params.count)
    }
  },
  moveBackwardAt: {
    params: [ types.count, types.char ],
    exec: function(editor, params, request) {
      utils.moveBackwardAt(editor, types.char.valueOf(params.char), params.count)
    }
  },
  moveToFirstChar: function(editor, params, request) {
    utils.moveToFirstChar(editor)
  },
  search: {
    description: 'search all the matchings',
    params: [{
      name: 'term',
      type: 'text',
      description: 'Search term.'
    }],
    exec: function(editor, params, request) {
      editor.editor.find(params.term)
      editor.editor.focus()
    }
  },
  searchForward: {
    description: 'Search for the given term',
    exec: function(editor, params, request) {
      editor.editor.findNext()
    }
  },
  searchBackword: {
    exec: function(editor, params, request) {
      editor.editor.findPrevious()
    }
  }
}

exports.plug = function plug(data, reason) {
  data.env.editor.commands.removeCommands(conflicts)
  data.env.editor.commands.addCommands(exports.commands)
}
exports.unplug = function unplug(data, reason) {
  data.env.editor.commands.removeCommands(exports.commands)
}

})
