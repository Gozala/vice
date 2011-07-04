/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */
!define(function(require, exports, module) {

'use strict';

  var plugins = [
    require('./types'),
    require('./commands'),
    require('./settings')
  ]

  exports.startup = function startup(data, reason) {
    // Unfortunately plugins are initialized before `editor` is created and
    // there is no event we can listen to be called when editor is ready so we
    // use this ugly hack to init settings ones editor is ready.
    if (!data.env.editor) setTimeout(startup, 0, data, reason)
    else exports.plug(data, reason)
  }

  exports.plug = function plug(data, reason) {
    plugins.forEach(function(plugin) {
      plugin.plug(data, reason)
    })
  }

  exports.unplug = function unplug(data, reason) {
     plugins.forEach(function(plugin) {
      plugin.unplug(data, reason)
    })
  }
  exports.shutdown = exports.unplug

});
