/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */
define(function(require, exports, module) {

  'use strict';

  var meta = require('plugin-hub/core').meta
  var ENV

  exports.name = 'vice'
  exports.version = '0.0.1'
  exports.description = 'VIM mode integration.'
  exports.author = 'Irakli Gozalishvili <rfobic@gmail.com>'
  exports.stability = 'unstable'

  exports.commands = require('./commands').commands
  exports.settings = require('./settings')

  exports.types = {
    '!': meta('Whethere or not value must be inverted', function() {
      return true
    }),
    'editor': meta('editor type', function editor() { return ENV.editor }),
    'env': meta('environment', function environment() { return ENV }),
    'char': meta('character', function(input) {
      input = input || ''
      return input.length > 1 ? input.replace('shift-', '').toUpperCase() : input
    })
  }


  exports.onstartup = function onstartup(env) {
    ENV = env
    exports.settings.isVimMode.onChange({ value: true, env: env })
  }
  exports.onshutdown = function onshutdown(env) {
    exports.settings.isVimMode.onChange({ value: false, env: env })
  }

});
