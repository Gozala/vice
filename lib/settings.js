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

// Ideally `onChange` have to be called with `env`, but as it's not we
// save `env` given on startup and use it in setting change listeners.
var env

var types = require("pilot/types")
var SelectionType = require('pilot/types/basic').SelectionType
var keyboardBindings = require('./keyboard').bindings

var settings = {
  isVimMode: {
    name: 'isVimMode',
    description: 'Whethere or not Vim mode is enabled',
    type: 'bool',
    defaultValue: true,
    onChange: function onChange(event) {
      if (event.value) env.editor.setKeyboardHandler(keyboardBindings)
      else env.editor.setKeyboardHandler(null)
    }
  }
}

exports.startup = function startup(data, reason) {
  env = data.env
  // Unfortunately plugins are initialized before `editor` is created and there
  // is no event we can listen to be called when editor is ready so we use
  // this ugly hack to init settings ones editor is ready.
  if (!env.editor) setTimeout(startup, 0, data, reason)
  else data.env.settings.addSettings(settings)
}

exports.shutdown = function shutdown(data, reason) {
  data.env.settings.removeSettings(settings)
}

})
