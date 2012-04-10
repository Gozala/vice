/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */
define(function(require, exports, module) {

'use strict';

var handler = require('./keyboard').handler
var utils = require('./utils')

exports.isVimMode = {
  name: 'isVimMode',
  description: 'Whethere or not Vim mode is enabled',
  type: 'bool',
  defaultValue: true,
  onChange: function onChange(event) {
    if (event.value) {
      event.env.editor.setKeyboardHandler(handler)
      utils.normalMode(env.editor)
    } else {
      event.env.editor.setKeyboardHandler(null)
      utils.insertMode(env.editor)
    }
  }
}

exports.isKeyword = {
  name: 'isKeyword',
  description: 'Keywords are used in searching and recognizing with many commands',
  type: 'text',
  defaultValue: '@,48-57,_,192-255'
}

});
