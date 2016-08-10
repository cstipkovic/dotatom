Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _configSchema = require('./config-schema');

var _configSchema2 = _interopRequireDefault(_configSchema);

'use babel';

exports['default'] = {
  config: _configSchema2['default'],

  activate: function activate() {
    var _this = this;

    this.commands = atom.commands.add('atom-workspace', {
      'latex:build': function latexBuild() {
        _this.bootstrap();
        _this.composer.build();
      },
      'latex:sync': function latexSync() {
        _this.bootstrap();
        _this.composer.sync();
      },
      'latex:clean': function latexClean() {
        _this.bootstrap();
        _this.composer.clean();
      }
    });
  },

  deactivate: function deactivate() {
    if (this.commands) {
      this.commands.dispose();
      delete this.commands;
    }

    if (this.composer) {
      this.composer.destroy();
      delete this.composer;
    }

    if (global.latex) {
      delete global.latex;
    }
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.bootstrap();
    this.composer.setStatusBar(statusBar);
  },

  bootstrap: function bootstrap() {
    if (this.composer && global.latex) {
      return;
    }

    var Latex = require('./latex');
    var Composer = require('./composer');

    global.latex = new Latex();
    this.composer = new Composer();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzRCQUV5QixpQkFBaUI7Ozs7QUFGMUMsV0FBVyxDQUFBOztxQkFJSTtBQUNiLFFBQU0sMkJBQWM7O0FBRXBCLFVBQVEsRUFBQyxvQkFBRzs7O0FBQ1YsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNsRCxtQkFBYSxFQUFFLHNCQUFNO0FBQ25CLGNBQUssU0FBUyxFQUFFLENBQUE7QUFDaEIsY0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7T0FDdEI7QUFDRCxrQkFBWSxFQUFFLHFCQUFNO0FBQ2xCLGNBQUssU0FBUyxFQUFFLENBQUE7QUFDaEIsY0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDckI7QUFDRCxtQkFBYSxFQUFFLHNCQUFNO0FBQ25CLGNBQUssU0FBUyxFQUFFLENBQUE7QUFDaEIsY0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7T0FDdEI7S0FDRixDQUFDLENBQUE7R0FDSDs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN2QixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDckI7O0FBRUQsUUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdkIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCOztBQUVELFFBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNoQixhQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUE7S0FDcEI7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBQywwQkFBQyxTQUFTLEVBQUU7QUFDM0IsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2hCLFFBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBQ3RDOztBQUVELFdBQVMsRUFBQyxxQkFBRztBQUNYLFFBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTTtLQUFFOztBQUU3QyxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDaEMsUUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUV0QyxVQUFNLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUE7QUFDMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFBO0dBQy9CO0NBQ0YiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBDb25maWdTY2hlbWEgZnJvbSAnLi9jb25maWctc2NoZW1hJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzogQ29uZmlnU2NoZW1hLFxuXG4gIGFjdGl2YXRlICgpIHtcbiAgICB0aGlzLmNvbW1hbmRzID0gYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2xhdGV4OmJ1aWxkJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmJvb3RzdHJhcCgpXG4gICAgICAgIHRoaXMuY29tcG9zZXIuYnVpbGQoKVxuICAgICAgfSxcbiAgICAgICdsYXRleDpzeW5jJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmJvb3RzdHJhcCgpXG4gICAgICAgIHRoaXMuY29tcG9zZXIuc3luYygpXG4gICAgICB9LFxuICAgICAgJ2xhdGV4OmNsZWFuJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmJvb3RzdHJhcCgpXG4gICAgICAgIHRoaXMuY29tcG9zZXIuY2xlYW4oKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKHRoaXMuY29tbWFuZHMpIHtcbiAgICAgIHRoaXMuY29tbWFuZHMuZGlzcG9zZSgpXG4gICAgICBkZWxldGUgdGhpcy5jb21tYW5kc1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbXBvc2VyKSB7XG4gICAgICB0aGlzLmNvbXBvc2VyLmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIHRoaXMuY29tcG9zZXJcbiAgICB9XG5cbiAgICBpZiAoZ2xvYmFsLmxhdGV4KSB7XG4gICAgICBkZWxldGUgZ2xvYmFsLmxhdGV4XG4gICAgfVxuICB9LFxuXG4gIGNvbnN1bWVTdGF0dXNCYXIgKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuYm9vdHN0cmFwKClcbiAgICB0aGlzLmNvbXBvc2VyLnNldFN0YXR1c0JhcihzdGF0dXNCYXIpXG4gIH0sXG5cbiAgYm9vdHN0cmFwICgpIHtcbiAgICBpZiAodGhpcy5jb21wb3NlciAmJiBnbG9iYWwubGF0ZXgpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IExhdGV4ID0gcmVxdWlyZSgnLi9sYXRleCcpXG4gICAgY29uc3QgQ29tcG9zZXIgPSByZXF1aXJlKCcuL2NvbXBvc2VyJylcblxuICAgIGdsb2JhbC5sYXRleCA9IG5ldyBMYXRleCgpXG4gICAgdGhpcy5jb21wb3NlciA9IG5ldyBDb21wb3NlcigpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/main.js
