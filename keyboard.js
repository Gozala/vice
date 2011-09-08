/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */

!define(function(require, exports, module) {

'use strict';

var types = require('./params')
var canon = require("pilot/canon")
var event = require("pilot/event")
var StateHandler = require("ace/keyboard/state_handler").StateHandler
var keyUtil  = require("pilot/keys");
var matchCharacterOnly =  require("ace/keyboard/state_handler").matchCharacterOnly

var states = exports.states = {
  start: [ // normal mode
    {
      key: "esc",
      exec: 'stop',
      then: "start"
    },
    {
      regex: '^:$',
      exec: 'commandLine'
    },
    {
      regex: '^u$',
      exec: 'undo'
    },
    {
      regex:  '^i$',
      params: [ types.count ],
      exec: 'start',
      then: 'insertMode'
    },
    {
      regex: '^shift-i$',
      params: [ types.bang ],
      exec: 'start',
      then: 'insertMode'
    },
    { 
      regex: '^a$',
      params: [ types.count ],
      exec: 'append',
      then: 'insertMode'
    },
    {
      regex: '^shift-a$',
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
      regex: [ types.count.regex, 'shift-o' ],
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
      regex: [ types.count.regex, 'shift-s' ],
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
      regex:  [ types.count.regex, 'h|backspace' ],
      exec:   "moveBack",
      params: [ types.count ]
    },
    {
      key: null,
      regex: [ types.count.regex, 't', types.char.regex ],
      exec: "moveForwardTo",
      params: [ types.count, types.char ]
    },
    {
      key: null,
      regex: [ types.count.regex, 'shift-t', types.char.regex ],
      exec: "moveBackwardTo",
      params: [ types.count, types.char ]
    },
    {
      key: null,
      regex: [ types.count.regex, 'f', types.char.regex ],
      exec: "moveForwardAt",
      params: [ types.count, types.char ]
    },
    {
      key: null,
      regex: [ types.count.regex, 'shift-f', types.char.regex ],
      exec: "moveBackwardAt",
      params: [ types.count, types.char ]
    },
    {
      regex: [ types.count.regex, 'd', 'd' ],
      exec: 'deleteLines',
      params: [ types.count ]
    },
    { regex: [ types.line.regex, 'shift-g' ],
      exec: 'jumptoline',
      params: [ types.line ]
    },
    {
      regex: '^shift-4$',
      exec: 'gotolineend'
    },
    {
      regex: '^shift-6$',
      exec: 'gotolinestart'
    },
    {
      regex: '^0$',
      exec: 'moveToFirstChar'
    },
    {
      regex: [ types.count.regex, '(e|shift-e)' ],
      exec: 'goToEndWord',
      params: [ types.count ]
    },
    {
      regex: [ types.count.regex, '(b|shift-b)' ],
      exec: 'goToBackWord',
      params: [ types.count ]
    },
    {
      regex: '^shift-g$',
      exec: 'gotoend'
    },
    {
      regex: '^gg$',
      exec: 'gotostart'
    },
    {
      regex: [ types.count.regex, 'x' ],
      exec: 'deleteChar',
      params: [ types.count ]
    },
    {
      regex: [ types.count.regex, 'shift-x' ],
      exec: 'deleteCharBack',
      params: [ types.count ]
    },
    {
      regex: 'command-s',
      exec: 'write'
    },
    {
      comment: 'Catch some keyboard input to stop it here',
      match: matchCharacterOnly
    },
  ],
  insertMode: [
    {
      key: "esc",
      exec: 'stop',
      then: "start"
    },
    {
      key: 'backspace',
      exec: 'backspace'
    }
  ]
}

var handler = new StateHandler(states)
exports.bindings = function(env) {
  var data = {}
  return {
    setKeyboardHandler: function() {},
    getKeyboardHandler: function() { return handler },
    handle: function handle(e, hashId, keyOrText, keyCode) {
      var action = handler.handleKeyboard(data, hashId, keyOrText, keyCode, e)
      if ((!action || !action.command) && hashId === 0 && keyCode === 0)
        action = { command: "inserttext", args: { text: keyOrText } }
      if (canon && canon.exec(action.command, env, "editor", action.args))
        return event.stopEvent(e)
    },
    onCommandKey: function onCommandKey(event, hashId, keyCode) {
      var keyString = keyUtil.keyCodeToString(keyCode)
      this.handle(event, hashId, keyString, keyCode)
    },
    onTextInput: function onTextInput(input) {
      this.handle({}, 0, input, 0)
    }
  }
}

});
