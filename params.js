/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */
!define(function(require, exports, module) {

'use strict';

exports['!'] = exports.ifBang = {
  name: '!',
  type: '!',
  defaultValue: ''
}

exports.bang = {
  name: '!',
  type: '!',
  defaultValue: '!'
}

exports.count = {
  name: 'count',
  regex: '^([0-9]*)',
  match: 1,
  type: 'number',
  defaultValue: 1
}

exports.line = {
  name: 'line',
  regex: '([0-9]+)',
  match: 1,
  type: 'number'
}

exports.char = {
  name: 'char',
  regex: '((?:shift-){0,1}[\\s\\S])',
  match: 2,
  type: 'text',
  valueOf: function(input) {
    return input.length > 1 ? input.replace('shift-', '').toUpperCase() : input
  }
}

});
