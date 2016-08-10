(function() {
  var path;

  path = require('path');

  module.exports = {
    config: {
      htmlhintExecutablePath: {
        "default": path.join(__dirname, '..', 'node_modules', 'htmlhint', 'bin'),
        title: 'HTMLHint Executable Path',
        type: 'string'
      }
    },
    activate: function() {
      return console.log('activate linter-htmlhint');
    }
  };

}).call(this);
