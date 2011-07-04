/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */

!define(function(require, exports, module) {

'use strict';

var types = require('./params')
var StateHandler = require("ace/keyboard/state_handler").StateHandler
var matchCharacterOnly =  require("ace/keyboard/state_handler").matchCharacterOnly


var states = exports.states = {
  start: [ // normal mode
    {
      key: ':',
      exec: 'commandLine'
    },
    {
      key:  'i',
      params: [ types.count ],
      exec: 'start',
      then: 'insertMode'
    },
    {
      key: 'shift-i',
      params: [ types.bang ],
      exec: 'start',
      then: 'insertMode'
    },
    { 
      key: 'a',
      params: [ types.count ],
      exec: 'append',
      then: 'insertMode'
    },
    {
      key: 'shift-a',
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
      regex:  [ types.count.regex, 'h' ],
      exec:   "moveBack",
      params: [ types.count ]
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
      key: 'shift-4',
      exec: 'gotolineend'
    },
    {
      key: 'shift-6',
      exec: 'gotolinestart'
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
      key: 'shift-g',
      exec: 'gotoend'
    },
    {
      regex: [ 'g', 'g' ],
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
      comment: 'Catch some keyboard input to stop it here',
      match: matchCharacterOnly
    }
  ],
  insertMode: [
    {
      key: "esc",
      exec: 'stop',
      then: "start"
    }
  ]
}

exports.bindings = new StateHandler(states)

});
