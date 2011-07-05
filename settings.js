/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */
!define(function(require, exports, module) {

'use strict';

// Ideally `onChange` have to be called with `env`, but as it's not we
// save `env` given on startup and use it in setting change listeners.
var env

var keyboardBindings = require('./keyboard').bindings
var utils = require('./utils')
var defaultKeyboardBindings;

var settings = {
  isVimMode: {
    name: 'isVimMode',
    description: 'Whethere or not Vim mode is enabled',
    type: 'bool',
    defaultValue: true,
    onChange: function onChange(event) {
      if (event.value) {
        defaultKeyboardBindings = env.editor.keyBinding
        env.editor.keyBinding = keyboardBindings(env);
        utils.normalMode(env)
      } else {
        utils.insertMode(env)
        env.editor.keyBinding = defaultKeyboardBindings;
      }
    }
  }
}

exports.plug = function plug(data, reason) {
  env = data.env
  data.env.settings.addSettings(settings)
}

exports.unplug = function unplug(data, reason) {
  // if (env.settings) env.settings.setSetting('isVimMode', false)
  settings.isVimMode.onChange({ value: false })
  data.env.settings.removeSettings(settings)
}

});
