/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false */
/*global define: true */
!define(function(require, exports, module) {

'use strict';

// Ideally `onChange` have to be called with `env`, but as it's not we
// save `env` given on startup and use it in setting change listeners.
var env

var types = require('pilot/types')
var SelectionType = require('pilot/types/basic').SelectionType

exports.types = {
  '!': new SelectionType({
    name: '!',
    description: 'Whethere or not value must be inverted',
    data: [ '!', '' ]
  })
}

exports.plug = function plug() {
  types.registerTypes(exports.types)
}
exports.unplug = function unplug() {
  types.unregisterTypes(exports.types)
}

});
