/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */

define(function(require, exports, module) {

'use strict';

var types = require('./params')
var StateHandler = require("ace/keyboard/state_handler").StateHandler
var matchCharacterOnly =  require("ace/keyboard/state_handler").matchCharacterOnly

function takes() {
  return Array.prototype.slice.call(arguments).map(function(item, index) {
    return {
      name: index,
      match: index,
      type: item
    }
  })
}

var states = exports.states = {
  start: [ // normal mode
    { key: 'v',
      exec: 'vice mode visual'
    },
    {
      key: "esc",
      exec: 'vice mode normal',
      then: 'start'
    },
    {
      key: '/',
      exec: 'vice find'
    },
    {
      regex: '^:|shift-;|shift-º$', // Webkit gets shift-º for some reason.
      exec: 'vice cli'
    },
    {
      regex: '^u$',
      exec: 'undo'
    },
    {
      regex:  '^i$',
      params: takes('editor', 'number'),
      exec: 'vice mode insert here',
      then: 'insertMode'
    },
    {
      regex: '^shift-i$',
      params: takes('editor', '!'),
      exec: 'vice mode insert start',
      then: 'insertMode'
    },
    { 
      regex: '^a$',
      params: takes('editor'),
      exec: 'vice mode insert after',
      then: 'insertMode'
    },
    {
      regex: '^shift-a$',
      params: takes('editor'),
      exec: 'vice mode insert end',
      then: 'insertMode'
    },
    {
      regex: [ types.count.regex, 'o' ],
      params: takes('editor', 'number'),
      exec: 'vice line open below',
      then: 'insertMode'
    },
    {
      regex: [ types.count.regex, 'shift-o' ],
      params: takes('editor', 'number'),
      exec: 'vice line open above',
      then: 'insertMode'
    },
    {
      regex: [ types.count.regex, 's' ],
      params: takes('editor', 'number'),
      exec: 'vice char substitute',
      then: 'insertMode'
    },
    {
      regex: [ types.count.regex, 'shift-s' ],
      params: takes('editor', 'number'),
      exec: 'vice line substitute',
      then: 'insertMode'
    },
    {
      regex:  [ types.count.regex, 'k' ],
      params: takes('editor', 'number'),
      exec:   'vice navigate up',
    },
    {
      regex: [ types.count.regex, 'j' ],
      exec:   'vice navigate down',
      params: takes('editor', 'number')
    },
    {
      regex:  [ types.count.regex, 'l' ],
      exec: 'vice navigate forward',
      params: takes('editor', 'number')
    },
    {
      regex:  [ types.count.regex, 'h|backspace' ],
      exec:   'vice navigate back',
      params: takes('editor', 'number')
    },
    {
      key: null,
      regex: [ types.count.regex, 't', types.char.regex ],
      exec: 'vice navigate char next to',
      params: takes('editor', 'number', 'char')
    },
    {
      key: null,
      regex: [ types.count.regex, 'shift-t', types.char.regex ],
      exec: 'vice navigate char previous to',
      params: takes('editor', 'number', 'char')
    },
    {
      key: null,
      regex: [ types.count.regex, 'f', types.char.regex ],
      exec: 'vice navigate char next at',
      params: takes('editor', 'number', 'char')
    },
    {
      key: null,
      regex: [ types.count.regex, 'shift-f', types.char.regex ],
      exec: 'vice navigate char previous at',
      params: takes('editor', 'number', 'char')
    },
    {
      regex: [ types.count.regex, 'd', 'd' ],
      exec: 'vice line remove',
      params: takes('editor', 'number')
    },
    { regex: [ types.line.regex, 'shift-g' ],
      exec: 'vice line jump',
      params: takes('editor', 'number')
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
      exec: 'vice navigate start'
    },
    {
      regex: [ types.count.regex, '(e|shift-e)' ],
      exec: 'vice navigate word end',
      params: takes('editor', 'number')
    },
    {
      regex: [ types.count.regex, '(b|shift-b)' ],
      exec: 'vice navigate word start',
      params: takes('editor', 'number')
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
      exec: 'vice char remove here',
      params: takes('editor', 'number')
    },
    {
      regex: [ types.count.regex, 'shift-x' ],
      exec: 'vice char remove previous',
      params: takes('editor', 'number')
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
      key: 'esc',
      exec: 'vice mode normal',
      then: 'start'
    },
    {
      key: 'backspace',
      exec: 'backspace'
    }
  ]
}

var handler = exports.handler = new StateHandler(states)

});
