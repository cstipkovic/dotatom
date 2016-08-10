Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _werkzeug = require('../werkzeug');

'use babel';

var ConsoleLogger = (function (_Logger) {
  _inherits(ConsoleLogger, _Logger);

  function ConsoleLogger() {
    _classCallCheck(this, ConsoleLogger);

    _get(Object.getPrototypeOf(ConsoleLogger.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ConsoleLogger, [{
    key: 'error',
    value: function error(statusCode, result, builder) {
      console.group('LaTeX errors');
      switch (statusCode) {
        case 127:
          var executable = builder.executable;
          console.log((0, _werkzeug.heredoc)('\n          %cTeXification failed! Builder executable \'' + executable + '\' not found.\n\n            latex.texPath\n              as configured: ' + atom.config.get('latex.texPath') + '\n              when resolved: ' + builder.constructPath() + '\n\n          Make sure latex.texPath is configured correctly either adjust it           via the settings view, or directly in your config.cson file.\n          '), 'color: red');
          break;

        default:
          if (result && result.errors) {
            console.group('TeXification failed with status code ' + statusCode);
            for (var error of result.errors) {
              console.log('%c' + error.filePath + ':' + error.lineNumber + ': ' + error.message, 'color: red');
            }
            console.groupEnd();
          } else {
            console.log('%cTeXification failed with status code ' + statusCode, 'color: red');
          }
      }
      console.groupEnd();
    }
  }, {
    key: 'warning',
    value: function warning(message) {
      console.group('LaTeX warnings');
      console.log(message);
      console.groupEnd();
    }
  }]);

  return ConsoleLogger;
})(_logger2['default']);

exports['default'] = ConsoleLogger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xvZ2dlcnMvY29uc29sZS1sb2dnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7d0JBQ1IsYUFBYTs7QUFIbkMsV0FBVyxDQUFBOztJQUtVLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDMUIsZUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUNsQyxhQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQzdCLGNBQVEsVUFBVTtBQUNoQixhQUFLLEdBQUc7QUFDTixjQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBO0FBQ3JDLGlCQUFPLENBQUMsR0FBRyxDQUFDLG9GQUNtQyxVQUFVLGlGQUdsQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsdUNBQ2hDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsdUtBSTFDLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDbkIsZ0JBQUs7O0FBQUEsQUFFUDtBQUNFLGNBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDM0IsbUJBQU8sQ0FBQyxLQUFLLDJDQUF5QyxVQUFVLENBQUcsQ0FBQTtBQUNuRSxpQkFBSyxJQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2pDLHFCQUFPLENBQUMsR0FBRyxRQUFNLEtBQUssQ0FBQyxRQUFRLFNBQUksS0FBSyxDQUFDLFVBQVUsVUFBSyxLQUFLLENBQUMsT0FBTyxFQUFJLFlBQVksQ0FBQyxDQUFBO2FBQ3ZGO0FBQ0QsbUJBQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtXQUNuQixNQUFNO0FBQ0wsbUJBQU8sQ0FBQyxHQUFHLDZDQUEyQyxVQUFVLEVBQUksWUFBWSxDQUFDLENBQUE7V0FDbEY7QUFBQSxPQUNKO0FBQ0QsYUFBTyxDQUFDLFFBQVEsRUFBRSxDQUFBO0tBQ25COzs7V0FFTyxpQkFBQyxPQUFPLEVBQUU7QUFDaEIsYUFBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQy9CLGFBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEIsYUFBTyxDQUFDLFFBQVEsRUFBRSxDQUFBO0tBQ25COzs7U0FwQ2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xvZ2dlcnMvY29uc29sZS1sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2xvZ2dlcidcbmltcG9ydCB7aGVyZWRvY30gZnJvbSAnLi4vd2Vya3pldWcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnNvbGVMb2dnZXIgZXh0ZW5kcyBMb2dnZXIge1xuICBlcnJvciAoc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKSB7XG4gICAgY29uc29sZS5ncm91cCgnTGFUZVggZXJyb3JzJylcbiAgICBzd2l0Y2ggKHN0YXR1c0NvZGUpIHtcbiAgICAgIGNhc2UgMTI3OlxuICAgICAgICBjb25zdCBleGVjdXRhYmxlID0gYnVpbGRlci5leGVjdXRhYmxlXG4gICAgICAgIGNvbnNvbGUubG9nKGhlcmVkb2MoYFxuICAgICAgICAgICVjVGVYaWZpY2F0aW9uIGZhaWxlZCEgQnVpbGRlciBleGVjdXRhYmxlICcke2V4ZWN1dGFibGV9JyBub3QgZm91bmQuXG5cbiAgICAgICAgICAgIGxhdGV4LnRleFBhdGhcbiAgICAgICAgICAgICAgYXMgY29uZmlndXJlZDogJHthdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnRleFBhdGgnKX1cbiAgICAgICAgICAgICAgd2hlbiByZXNvbHZlZDogJHtidWlsZGVyLmNvbnN0cnVjdFBhdGgoKX1cblxuICAgICAgICAgIE1ha2Ugc3VyZSBsYXRleC50ZXhQYXRoIGlzIGNvbmZpZ3VyZWQgY29ycmVjdGx5IGVpdGhlciBhZGp1c3QgaXQgXFxcbiAgICAgICAgICB2aWEgdGhlIHNldHRpbmdzIHZpZXcsIG9yIGRpcmVjdGx5IGluIHlvdXIgY29uZmlnLmNzb24gZmlsZS5cbiAgICAgICAgICBgKSwgJ2NvbG9yOiByZWQnKVxuICAgICAgICBicmVha1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5lcnJvcnMpIHtcbiAgICAgICAgICBjb25zb2xlLmdyb3VwKGBUZVhpZmljYXRpb24gZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJHtzdGF0dXNDb2RlfWApXG4gICAgICAgICAgZm9yIChjb25zdCBlcnJvciBvZiByZXN1bHQuZXJyb3JzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMke2Vycm9yLmZpbGVQYXRofToke2Vycm9yLmxpbmVOdW1iZXJ9OiAke2Vycm9yLm1lc3NhZ2V9YCwgJ2NvbG9yOiByZWQnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJWNUZVhpZmljYXRpb24gZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJHtzdGF0dXNDb2RlfWAsICdjb2xvcjogcmVkJylcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHdhcm5pbmcgKG1lc3NhZ2UpIHtcbiAgICBjb25zb2xlLmdyb3VwKCdMYVRlWCB3YXJuaW5ncycpXG4gICAgY29uc29sZS5sb2cobWVzc2FnZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/loggers/console-logger.js
