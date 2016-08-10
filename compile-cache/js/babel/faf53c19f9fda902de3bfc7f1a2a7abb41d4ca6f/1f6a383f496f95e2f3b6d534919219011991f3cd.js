Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _werkzeug = require('./werkzeug');

'use babel';

function defineDefaultProperty(target, property) {
  var shadowProperty = '__' + property;
  var defaultGetter = 'getDefault' + _lodash2['default'].capitalize(property);

  Object.defineProperty(target, property, {
    get: function get() {
      if (!target[shadowProperty]) {
        target[shadowProperty] = target[defaultGetter].apply(target);
      }
      return target[shadowProperty];
    },

    set: function set(value) {
      target[shadowProperty] = value;
    }
  });
}

var Latex = (function () {
  function Latex() {
    _classCallCheck(this, Latex);

    this.createLogProxy();

    defineDefaultProperty(this, 'builder');
    defineDefaultProperty(this, 'logger');
    defineDefaultProperty(this, 'opener');

    this.observeOpenerConfig();
    this.observeBuilderConfig();
  }

  _createClass(Latex, [{
    key: 'getBuilder',
    value: function getBuilder() {
      return this.builder;
    }
  }, {
    key: 'getLogger',
    value: function getLogger() {
      return this.logger;
    }
  }, {
    key: 'getOpener',
    value: function getOpener() {
      return this.opener;
    }
  }, {
    key: 'setLogger',
    value: function setLogger(logger) {
      this.logger = logger;
    }
  }, {
    key: 'getDefaultBuilder',
    value: function getDefaultBuilder() {
      var BuilderClass = null;
      if (this.useLatexmk()) {
        BuilderClass = require('./builders/latexmk');
      } else {
        BuilderClass = require('./builders/texify');
      }
      return new BuilderClass();
    }
  }, {
    key: 'getDefaultLogger',
    value: function getDefaultLogger() {
      var ConsoleLogger = require('./loggers/console-logger');
      return new ConsoleLogger();
    }
  }, {
    key: 'getDefaultOpener',
    value: function getDefaultOpener() {
      var OpenerImpl = this.resolveOpenerImplementation(process.platform);
      if (OpenerImpl) {
        return new OpenerImpl();
      }

      if (this['__logger'] && this.log) {
        this.log.warning((0, _werkzeug.heredoc)('\n        No PDF opener found.\n        For cross-platform viewing, consider installing the pdf-view package.\n        '));
      }
    }
  }, {
    key: 'createLogProxy',
    value: function createLogProxy() {
      var _this = this;

      this.log = {
        error: function error(statusCode, result, builder) {
          _this.logger.error(statusCode, result, builder);
        },
        warning: function warning(message) {
          _this.logger.warning(message);
        },
        info: function info(message) {
          _this.logger.info(message);
        }
      };
    }
  }, {
    key: 'observeOpenerConfig',
    value: function observeOpenerConfig() {
      var _this2 = this;

      var callback = function callback() {
        _this2['__opener'] = _this2.getDefaultOpener();
      };
      atom.config.onDidChange('latex.alwaysOpenResultInAtom', callback);
      atom.config.onDidChange('latex.skimPath', callback);
      atom.config.onDidChange('latex.sumatraPath', callback);
      atom.config.onDidChange('latex.okularPath', callback);
    }
  }, {
    key: 'observeBuilderConfig',
    value: function observeBuilderConfig() {
      var _this3 = this;

      var callback = function callback() {
        _this3['__builder'] = _this3.getDefaultBuilder();
      };
      atom.config.onDidChange('latex.builder', callback);
    }
  }, {
    key: 'resolveOpenerImplementation',
    value: function resolveOpenerImplementation(platform) {
      if (this.hasPdfViewerPackage() && this.shouldOpenResultInAtom()) {
        return require('./openers/atompdf-opener');
      }

      if (this.viewerExecutableExists()) {
        return require('./openers/custom-opener');
      }

      switch (platform) {
        case 'darwin':
          if (this.skimExecutableExists()) {
            return require('./openers/skim-opener');
          }

          return require('./openers/preview-opener');

        case 'win32':
          if (this.sumatraExecutableExists()) {
            return require('./openers/sumatra-opener');
          }

          break;

        case 'linux':
          if (this.okularExecutableExists()) {
            return require('./openers/okular-opener');
          }
      }

      if (this.hasPdfViewerPackage()) {
        return require('./openers/atompdf-opener');
      }

      return null;
    }
  }, {
    key: 'hasPdfViewerPackage',
    value: function hasPdfViewerPackage() {
      return !!atom.packages.resolvePackagePath('pdf-view');
    }
  }, {
    key: 'shouldOpenResultInAtom',
    value: function shouldOpenResultInAtom() {
      return atom.config.get('latex.alwaysOpenResultInAtom');
    }
  }, {
    key: 'skimExecutableExists',
    value: function skimExecutableExists() {
      return _fsPlus2['default'].existsSync(atom.config.get('latex.skimPath'));
    }
  }, {
    key: 'sumatraExecutableExists',
    value: function sumatraExecutableExists() {
      return _fsPlus2['default'].existsSync(atom.config.get('latex.sumatraPath'));
    }
  }, {
    key: 'okularExecutableExists',
    value: function okularExecutableExists() {
      return _fsPlus2['default'].existsSync(atom.config.get('latex.okularPath'));
    }
  }, {
    key: 'viewerExecutableExists',
    value: function viewerExecutableExists() {
      return _fsPlus2['default'].existsSync(atom.config.get('latex.viewerPath'));
    }
  }, {
    key: 'useLatexmk',
    value: function useLatexmk() {
      return atom.config.get('latex.builder') === 'latexmk';
    }
  }]);

  return Latex;
})();

exports['default'] = Latex;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xhdGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztzQkFDVixRQUFROzs7O3dCQUNBLFlBQVk7O0FBSmxDLFdBQVcsQ0FBQTs7QUFNWCxTQUFTLHFCQUFxQixDQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDaEQsTUFBTSxjQUFjLFVBQVEsUUFBUSxBQUFFLENBQUE7QUFDdEMsTUFBTSxhQUFhLGtCQUFnQixvQkFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLEFBQUUsQ0FBQTs7QUFFM0QsUUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3RDLE9BQUcsRUFBRSxlQUFZO0FBQ2YsVUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUMzQixjQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtPQUM3RDtBQUNELGFBQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0tBQzlCOztBQUVELE9BQUcsRUFBRSxhQUFVLEtBQUssRUFBRTtBQUFFLFlBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUE7S0FBRTtHQUN6RCxDQUFDLENBQUE7Q0FDSDs7SUFFb0IsS0FBSztBQUNaLFdBRE8sS0FBSyxHQUNUOzBCQURJLEtBQUs7O0FBRXRCLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTs7QUFFckIseUJBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ3RDLHlCQUFxQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUNyQyx5QkFBcUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7O0FBRXJDLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQzFCLFFBQUksQ0FBQyxvQkFBb0Is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QkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFBO0tBQzNEOzs7V0FFc0Isa0NBQUc7QUFDeEIsYUFBTyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO0tBQzFEOzs7V0FFc0Isa0NBQUc7QUFDeEIsYUFBTyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO0tBQzFEOzs7V0FFVSxzQkFBRztBQUNaLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssU0FBUyxDQUFBO0tBQ3REOzs7U0E1SWtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xhdGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQge2hlcmVkb2N9IGZyb20gJy4vd2Vya3pldWcnXG5cbmZ1bmN0aW9uIGRlZmluZURlZmF1bHRQcm9wZXJ0eSAodGFyZ2V0LCBwcm9wZXJ0eSkge1xuICBjb25zdCBzaGFkb3dQcm9wZXJ0eSA9IGBfXyR7cHJvcGVydHl9YFxuICBjb25zdCBkZWZhdWx0R2V0dGVyID0gYGdldERlZmF1bHQke18uY2FwaXRhbGl6ZShwcm9wZXJ0eSl9YFxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRhcmdldFtzaGFkb3dQcm9wZXJ0eV0pIHtcbiAgICAgICAgdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XSA9IHRhcmdldFtkZWZhdWx0R2V0dGVyXS5hcHBseSh0YXJnZXQpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XVxuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkgeyB0YXJnZXRbc2hhZG93UHJvcGVydHldID0gdmFsdWUgfVxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmNyZWF0ZUxvZ1Byb3h5KClcblxuICAgIGRlZmluZURlZmF1bHRQcm9wZXJ0eSh0aGlzLCAnYnVpbGRlcicpXG4gICAgZGVmaW5lRGVmYXVsdFByb3BlcnR5KHRoaXMsICdsb2dnZXInKVxuICAgIGRlZmluZURlZmF1bHRQcm9wZXJ0eSh0aGlzLCAnb3BlbmVyJylcblxuICAgIHRoaXMub2JzZXJ2ZU9wZW5lckNvbmZpZygpXG4gICAgdGhpcy5vYnNlcnZlQnVpbGRlckNvbmZpZygpXG4gIH1cblxuICBnZXRCdWlsZGVyICgpIHsgcmV0dXJuIHRoaXMuYnVpbGRlciB9XG4gIGdldExvZ2dlciAoKSB7IHJldHVybiB0aGlzLmxvZ2dlciB9XG4gIGdldE9wZW5lciAoKSB7IHJldHVybiB0aGlzLm9wZW5lciB9XG5cbiAgc2V0TG9nZ2VyIChsb2dnZXIpIHtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlclxuICB9XG5cbiAgZ2V0RGVmYXVsdEJ1aWxkZXIgKCkge1xuICAgIGxldCBCdWlsZGVyQ2xhc3MgPSBudWxsXG4gICAgaWYgKHRoaXMudXNlTGF0ZXhtaygpKSB7XG4gICAgICBCdWlsZGVyQ2xhc3MgPSByZXF1aXJlKCcuL2J1aWxkZXJzL2xhdGV4bWsnKVxuICAgIH0gZWxzZSB7XG4gICAgICBCdWlsZGVyQ2xhc3MgPSByZXF1aXJlKCcuL2J1aWxkZXJzL3RleGlmeScpXG4gICAgfVxuICAgIHJldHVybiBuZXcgQnVpbGRlckNsYXNzKClcbiAgfVxuXG4gIGdldERlZmF1bHRMb2dnZXIgKCkge1xuICAgIGNvbnN0IENvbnNvbGVMb2dnZXIgPSByZXF1aXJlKCcuL2xvZ2dlcnMvY29uc29sZS1sb2dnZXInKVxuICAgIHJldHVybiBuZXcgQ29uc29sZUxvZ2dlcigpXG4gIH1cblxuICBnZXREZWZhdWx0T3BlbmVyICgpIHtcbiAgICBjb25zdCBPcGVuZXJJbXBsID0gdGhpcy5yZXNvbHZlT3BlbmVySW1wbGVtZW50YXRpb24ocHJvY2Vzcy5wbGF0Zm9ybSlcbiAgICBpZiAoT3BlbmVySW1wbCkge1xuICAgICAgcmV0dXJuIG5ldyBPcGVuZXJJbXBsKClcbiAgICB9XG5cbiAgICBpZiAodGhpc1snX19sb2dnZXInXSAmJiB0aGlzLmxvZykge1xuICAgICAgdGhpcy5sb2cud2FybmluZyhoZXJlZG9jKGBcbiAgICAgICAgTm8gUERGIG9wZW5lciBmb3VuZC5cbiAgICAgICAgRm9yIGNyb3NzLXBsYXRmb3JtIHZpZXdpbmcsIGNvbnNpZGVyIGluc3RhbGxpbmcgdGhlIHBkZi12aWV3IHBhY2thZ2UuXG4gICAgICAgIGApXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY3JlYXRlTG9nUHJveHkgKCkge1xuICAgIHRoaXMubG9nID0ge1xuICAgICAgZXJyb3I6IChzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKVxuICAgICAgfSxcbiAgICAgIHdhcm5pbmc6IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm5pbmcobWVzc2FnZSlcbiAgICAgIH0sXG4gICAgICBpbmZvOiAobWVzc2FnZSkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb2JzZXJ2ZU9wZW5lckNvbmZpZyAoKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoKSA9PiB7IHRoaXNbJ19fb3BlbmVyJ10gPSB0aGlzLmdldERlZmF1bHRPcGVuZXIoKSB9XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xhdGV4LmFsd2F5c09wZW5SZXN1bHRJbkF0b20nLCBjYWxsYmFjaylcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXguc2tpbVBhdGgnLCBjYWxsYmFjaylcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXguc3VtYXRyYVBhdGgnLCBjYWxsYmFjaylcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXgub2t1bGFyUGF0aCcsIGNhbGxiYWNrKVxuICB9XG5cbiAgb2JzZXJ2ZUJ1aWxkZXJDb25maWcgKCkge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gKCkgPT4geyB0aGlzWydfX2J1aWxkZXInXSA9IHRoaXMuZ2V0RGVmYXVsdEJ1aWxkZXIoKSB9XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xhdGV4LmJ1aWxkZXInLCBjYWxsYmFjaylcbiAgfVxuXG4gIHJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbiAocGxhdGZvcm0pIHtcbiAgICBpZiAodGhpcy5oYXNQZGZWaWV3ZXJQYWNrYWdlKCkgJiYgdGhpcy5zaG91bGRPcGVuUmVzdWx0SW5BdG9tKCkpIHtcbiAgICAgIHJldHVybiByZXF1aXJlKCcuL29wZW5lcnMvYXRvbXBkZi1vcGVuZXInKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnZpZXdlckV4ZWN1dGFibGVFeGlzdHMoKSkge1xuICAgICAgcmV0dXJuIHJlcXVpcmUoJy4vb3BlbmVycy9jdXN0b20tb3BlbmVyJylcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHBsYXRmb3JtKSB7XG4gICAgICBjYXNlICdkYXJ3aW4nOlxuICAgICAgICBpZiAodGhpcy5za2ltRXhlY3V0YWJsZUV4aXN0cygpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJy4vb3BlbmVycy9za2ltLW9wZW5lcicpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi9vcGVuZXJzL3ByZXZpZXctb3BlbmVyJylcblxuICAgICAgY2FzZSAnd2luMzInOlxuICAgICAgICBpZiAodGhpcy5zdW1hdHJhRXhlY3V0YWJsZUV4aXN0cygpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJy4vb3BlbmVycy9zdW1hdHJhLW9wZW5lcicpXG4gICAgICAgIH1cblxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICdsaW51eCc6XG4gICAgICAgIGlmICh0aGlzLm9rdWxhckV4ZWN1dGFibGVFeGlzdHMoKSkge1xuICAgICAgICAgIHJldHVybiByZXF1aXJlKCcuL29wZW5lcnMvb2t1bGFyLW9wZW5lcicpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNQZGZWaWV3ZXJQYWNrYWdlKCkpIHtcbiAgICAgIHJldHVybiByZXF1aXJlKCcuL29wZW5lcnMvYXRvbXBkZi1vcGVuZXInKVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBoYXNQZGZWaWV3ZXJQYWNrYWdlICgpIHtcbiAgICByZXR1cm4gISFhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aCgncGRmLXZpZXcnKVxuICB9XG5cbiAgc2hvdWxkT3BlblJlc3VsdEluQXRvbSAoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGF0ZXguYWx3YXlzT3BlblJlc3VsdEluQXRvbScpXG4gIH1cblxuICBza2ltRXhlY3V0YWJsZUV4aXN0cyAoKSB7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KCdsYXRleC5za2ltUGF0aCcpKVxuICB9XG5cbiAgc3VtYXRyYUV4ZWN1dGFibGVFeGlzdHMgKCkge1xuICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGF0b20uY29uZmlnLmdldCgnbGF0ZXguc3VtYXRyYVBhdGgnKSlcbiAgfVxuXG4gIG9rdWxhckV4ZWN1dGFibGVFeGlzdHMgKCkge1xuICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGF0b20uY29uZmlnLmdldCgnbGF0ZXgub2t1bGFyUGF0aCcpKVxuICB9XG5cbiAgdmlld2VyRXhlY3V0YWJsZUV4aXN0cyAoKSB7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KCdsYXRleC52aWV3ZXJQYXRoJykpXG4gIH1cblxuICB1c2VMYXRleG1rICgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5idWlsZGVyJykgPT09ICdsYXRleG1rJ1xuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/latex.js
