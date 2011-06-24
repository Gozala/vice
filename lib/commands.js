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

'use strict'

var canon = require('pilot/canon')
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

var commands = exports.commands = {
  commandLine: {
    exec: function exec(env, params, request) {
      var cli = env.cli.cliView;
      env.editor.blur();
      cli.isUpdating = true;
      cli.element.focus();
      cli.element.select();
      cli.update();
      cli.isUpdating = false;
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
    exec: function start(env, params, request) {
      if (isBang(params)) moveToBegining(env)
      insertMode(env)
    }
  },
  stop: {
    description: 'Start **normal** mode',
    man: 'Stop Insert mode as soon as possible. Works like' +
         'typing <Esc> in **insert** mode.',
    exec: function stop(env, params, request) {
      moveBack(env, 1)
      normalMode(env)
    }
  },
  append: {
    description: 'Append text and start **normal** mode',
    man: 'Append text after the cursor / word (if !) word.',
    params: [ types.count, types['!'] ],
    exec: function append(env, params, request) {
      if (isBang(params)) moveToEnd(env)
      else moveForward(env, params.count)
      insertMode(env)
    }
  },
  openNewLines: {
    description: 'Begin new line and start **insert**',
    man: 'Begin a new line below / above (if !) the cursor and insert text, ' +
         'repeat `count` times.',
    params: [ types.count, types['!'] ],
    exec: function openNewLines(env, params, request) {
      if (isBang(params)) moveUp(env)
      moveToEnd(env)
      open(env, params.count)
      insertMode(env)
    }
  },
  substitute: {
    description: 'Substitite and start **insert**',
    man: 'Delete `count` characters / lines (if !) and start **insert**' +
         '(s stands for Substitute).',
    params: [ types.count, types['!'] ],
    exec: function substitute(env, params, request) {
      if (isBang(params)) {
        moveUp(env)
        moveToBegining(env)
        open(env, 1)
        removeLines(env, params.count)
        moveUp(env)
      } else {
        removeFollowingChars(env, params.count)
      }
      insertMode(env)
    }
  },
  deleteLines: {
    description: 'Delete [count] lines [into register x] |linewise|',
    params: [ types.count ],
    exec: function deleteLines(env, params, request) {
      removeLines(env, params.count)
    }
  },
  jumptoline: function(env, params, request) {
    env.editor.gotoLine(params.line)
  },
  moveUp: {
    params: [ types.count ],
    exec: function(env, params, request) {
      moveUp(env, params.count)
    }
  },
  moveDown: {
    params: [ types.count ],
    exec: function(env, params, request) {
      moveDown(env, params.count)
    }
  },
  moveBack: {
    params: [ types.count ],
    exec: function(env, params, request) {
      moveBack(env, params.count)
    }
  },
  moveForward: {
    params: [ types.count ],
    exec: function(env, params, request) {
      moveForward(env, params.count)
    }
  },
  goToEndWord: function(env, params, request) {
    moveToEndOfFollowingWord(env, params.count)
  },
  goToBackWord: function(env, params, request) {
    moveToEndOfPassedWord(env, params.count)
  },
  deleteChar: function(env, params, request) {
    removeFollowingChars(env, params.count)
  },
  deleteCharBack: function(env, params, request) {
    removePreviosChars(env, params.count)
  }

}

exports.plug = function plug(data, reason) {
  canon.addCommands(exports.commands)
}
exports.unplug = function unplug(data, reason) {
  canon.removeCommands(exports.commands)
}

})
