"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Function = require('loophole').Function;
var _ = require('underscore-plus');

var REGEXP_LINE = /(([\$\w]+[\w-]*)|([.:;'"[{( ]+))$/g;

var Provider = (function () {
  function Provider(manager) {
    _classCallCheck(this, Provider);

    this.manager = undefined;
    this.force = false;

    // automcomplete-plus
    this.selector = '.source.js';
    this.disableForSelector = '.source.js .comment';
    this.inclusionPriority = 1;
    this.excludeLowerPriority = false;

    this.line = undefined;
    this.lineMatchResult = undefined;
    this.tempPrefix = undefined;
    this.suggestionsArr = undefined;
    this.suggestion = undefined;
    this.suggestionClone = undefined;
  }

  _createClass(Provider, [{
    key: 'init',
    value: function init(manager) {

      this.manager = manager;
      this.excludeLowerPriority = this.manager.packageConfig.options.excludeLowerPriorityProviders;

      if (this.manager.packageConfig.options.displayAboveSnippets) {

        this.suggestionPriority = 2;
      }
    }
  }, {
    key: 'isValidPrefix',
    value: function isValidPrefix(prefix, prefixLast) {

      if (prefixLast === undefined) {

        return false;
      }

      if (prefixLast === '\.') {

        return true;
      }

      if (prefixLast.match(/;|\s/)) {

        return false;
      }

      if (prefix.length > 1) {

        prefix = '_' + prefix;
      }

      try {

        new Function('var ' + prefix)();
      } catch (e) {

        return false;
      }

      return true;
    }
  }, {
    key: 'checkPrefix',
    value: function checkPrefix(prefix) {

      if (prefix.match(/(\s|;|\.|\"|\')$/) || prefix.replace(/\s/g, '').length === 0) {

        return '';
      }

      return prefix;
    }
  }, {
    key: 'getPrefix',
    value: function getPrefix(editor, bufferPosition) {

      this.line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      this.lineMatchResult = this.line.match(REGEXP_LINE);

      if (this.lineMatchResult) {

        return this.lineMatchResult[0];
      }
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var scopeDescriptor = _ref.scopeDescriptor;
      var prefix = _ref.prefix;
      var activatedManually = _ref.activatedManually;

      return new Promise(function (resolve) {

        if (!_this.manager.client) {

          return resolve([]);
        }

        _this.tempPrefix = _this.getPrefix(editor, bufferPosition) || prefix;

        if (!_this.isValidPrefix(_this.tempPrefix, _this.tempPrefix[_this.tempPrefix.length - 1]) && !_this.force && !activatedManually) {

          return resolve([]);
        }

        prefix = _this.checkPrefix(_this.tempPrefix);

        _this.manager.client.update(editor).then(function (data) {

          if (!data) {

            return resolve([]);
          }

          _this.manager.client.completions(atom.project.relativizePath(editor.getURI())[1], {

            line: bufferPosition.row,
            ch: bufferPosition.column

          }).then(function (data) {

            if (!data) {

              return resolve([]);
            }

            if (!data.completions.length) {

              return resolve([]);
            }

            _this.suggestionsArr = [];

            var scopesPath = scopeDescriptor.getScopesArray();
            var isInFunDef = scopesPath.indexOf('meta.function.js') > -1;

            for (var obj of data.completions) {

              obj = _this.manager.helper.formatTypeCompletion(obj, isInFunDef);

              _this.suggestion = {

                text: obj.name,
                replacementPrefix: prefix,
                className: null,
                type: obj._typeSelf,
                leftLabel: obj.leftLabel,
                snippet: obj._snippet,
                displayText: obj._displayText,
                description: obj.doc || null,
                descriptionMoreURL: obj.url || null
              };

              if (_this.manager.packageConfig.options.useSnippetsAndFunction && obj._hasParams) {

                _this.suggestionClone = _.clone(_this.suggestion);
                _this.suggestionClone.type = 'snippet';

                if (obj._hasParams) {

                  _this.suggestion.snippet = obj.name + '(${0:})';
                } else {

                  _this.suggestion.snippet = obj.name + '()';
                }

                _this.suggestionsArr.push(_this.suggestion);
                _this.suggestionsArr.push(_this.suggestionClone);
              } else {

                _this.suggestionsArr.push(_this.suggestion);
              }
            }

            resolve(_this.suggestionsArr);
          });
        });
      });
    }
  }, {
    key: 'forceCompletion',
    value: function forceCompletion() {

      this.force = true;
      atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'autocomplete-plus:activate');
      this.force = false;
    }
  }]);

  return Provider;
})();

exports['default'] = Provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDNUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRW5DLElBQU0sV0FBVyxHQUFHLG9DQUFvQyxDQUFDOztJQUVwQyxRQUFRO0FBRWhCLFdBRlEsUUFBUSxDQUVmLE9BQU8sRUFBRTswQkFGRixRQUFROztBQUl6QixRQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN6QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7O0FBR25CLFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQztBQUNoRCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7O0FBRWxDLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzVCLFFBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzVCLFFBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0dBQ2xDOztlQW5Ca0IsUUFBUTs7V0FxQnZCLGNBQUMsT0FBTyxFQUFFOztBQUVaLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUM7O0FBRTdGLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFOztBQUUzRCxZQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO09BQzdCO0tBQ0Y7OztXQUVZLHVCQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7O0FBRWhDLFVBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTs7QUFFNUIsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFFRCxVQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7O0FBRXZCLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsVUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFOztBQUU1QixlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELFVBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O0FBRXJCLGNBQU0sU0FBTyxNQUFNLEFBQUUsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJOztBQUVGLEFBQUMsWUFBSSxRQUFRLFVBQVEsTUFBTSxDQUFHLEVBQUcsQ0FBQztPQUVuQyxDQUFDLE9BQU8sQ0FBQyxFQUFFOztBQUVWLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRVUscUJBQUMsTUFBTSxFQUFFOztBQUVsQixVQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOztBQUU5RSxlQUFPLEVBQUUsQ0FBQztPQUNYOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVRLG1CQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUU7O0FBRWhDLFVBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQzdFLFVBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXBELFVBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTs7QUFFeEIsZUFBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ2hDO0tBQ0Y7OztXQUVhLHdCQUFDLElBQW9FLEVBQUU7OztVQUFyRSxNQUFNLEdBQVAsSUFBb0UsQ0FBbkUsTUFBTTtVQUFFLGNBQWMsR0FBdkIsSUFBb0UsQ0FBM0QsY0FBYztVQUFFLGVBQWUsR0FBeEMsSUFBb0UsQ0FBM0MsZUFBZTtVQUFFLE1BQU0sR0FBaEQsSUFBb0UsQ0FBMUIsTUFBTTtVQUFFLGlCQUFpQixHQUFuRSxJQUFvRSxDQUFsQixpQkFBaUI7O0FBRWhGLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRTlCLFlBQUksQ0FBQyxNQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUU7O0FBRXhCLGlCQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwQjs7QUFFRCxjQUFLLFVBQVUsR0FBRyxNQUFLLFNBQVMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLElBQUksTUFBTSxDQUFDOztBQUVuRSxZQUFJLENBQUMsTUFBSyxhQUFhLENBQUMsTUFBSyxVQUFVLEVBQUUsTUFBSyxVQUFVLENBQUMsTUFBSyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFLLEtBQUssSUFBSSxDQUFDLGlCQUFpQixFQUFFOztBQUUxSCxpQkFBTyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEI7O0FBRUQsY0FBTSxHQUFHLE1BQUssV0FBVyxDQUFDLE1BQUssVUFBVSxDQUFDLENBQUM7O0FBRTNDLGNBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLOztBQUVoRCxjQUFJLENBQUMsSUFBSSxFQUFFOztBQUVULG1CQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztXQUNwQjs7QUFFRCxnQkFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7QUFFL0UsZ0JBQUksRUFBRSxjQUFjLENBQUMsR0FBRztBQUN4QixjQUFFLEVBQUUsY0FBYyxDQUFDLE1BQU07O1dBRTFCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRWhCLGdCQUFJLENBQUMsSUFBSSxFQUFFOztBQUVULHFCQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNwQjs7QUFFRCxnQkFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFOztBQUU1QixxQkFBTyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDcEI7O0FBRUQsa0JBQUssY0FBYyxHQUFHLEVBQUUsQ0FBQzs7QUFFekIsZ0JBQUksVUFBVSxHQUFHLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNsRCxnQkFBSSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUU3RCxpQkFBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFOztBQUVoQyxpQkFBRyxHQUFHLE1BQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7O0FBRWhFLG9CQUFLLFVBQVUsR0FBRzs7QUFFaEIsb0JBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtBQUNkLGlDQUFpQixFQUFFLE1BQU07QUFDekIseUJBQVMsRUFBRSxJQUFJO0FBQ2Ysb0JBQUksRUFBRSxHQUFHLENBQUMsU0FBUztBQUNuQix5QkFBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTO0FBQ3hCLHVCQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVE7QUFDckIsMkJBQVcsRUFBRSxHQUFHLENBQUMsWUFBWTtBQUM3QiwyQkFBVyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSTtBQUM1QixrQ0FBa0IsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUk7ZUFDcEMsQ0FBQzs7QUFFRixrQkFBSSxNQUFLLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLHNCQUFzQixJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7O0FBRS9FLHNCQUFLLGVBQWUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQUssVUFBVSxDQUFDLENBQUM7QUFDaEQsc0JBQUssZUFBZSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRXRDLG9CQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7O0FBRWxCLHdCQUFLLFVBQVUsQ0FBQyxPQUFPLEdBQU0sR0FBRyxDQUFDLElBQUksWUFBVyxDQUFDO2lCQUVsRCxNQUFNOztBQUVMLHdCQUFLLFVBQVUsQ0FBQyxPQUFPLEdBQU0sR0FBRyxDQUFDLElBQUksT0FBSSxDQUFDO2lCQUMzQzs7QUFFRCxzQkFBSyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQUssVUFBVSxDQUFDLENBQUM7QUFDMUMsc0JBQUssY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFLLGVBQWUsQ0FBQyxDQUFDO2VBRWhELE1BQU07O0FBRUwsc0JBQUssY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFLLFVBQVUsQ0FBQyxDQUFDO2VBQzNDO2FBQ0Y7O0FBRUQsbUJBQU8sQ0FBQyxNQUFLLGNBQWMsQ0FBQyxDQUFDO1dBQzlCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0FFYywyQkFBRzs7QUFFaEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUMvRyxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1NBekxrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCBGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvb3Bob2xlJykuRnVuY3Rpb247XG5sZXQgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUtcGx1cycpO1xuXG5jb25zdCBSRUdFWFBfTElORSA9IC8oKFtcXCRcXHddK1tcXHctXSopfChbLjo7J1wiW3soIF0rKSkkL2c7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3ZpZGVyIHtcblxuICBjb25zdHJ1Y3RvcihtYW5hZ2VyKSB7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5mb3JjZSA9IGZhbHNlO1xuXG4gICAgLy8gYXV0b21jb21wbGV0ZS1wbHVzXG4gICAgdGhpcy5zZWxlY3RvciA9ICcuc291cmNlLmpzJztcbiAgICB0aGlzLmRpc2FibGVGb3JTZWxlY3RvciA9ICcuc291cmNlLmpzIC5jb21tZW50JztcbiAgICB0aGlzLmluY2x1c2lvblByaW9yaXR5ID0gMTtcbiAgICB0aGlzLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gZmFsc2U7XG5cbiAgICB0aGlzLmxpbmUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5saW5lTWF0Y2hSZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50ZW1wUHJlZml4ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdWdnZXN0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc3VnZ2VzdGlvbkNsb25lID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaW5pdChtYW5hZ2VyKSB7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSB0aGlzLm1hbmFnZXIucGFja2FnZUNvbmZpZy5vcHRpb25zLmV4Y2x1ZGVMb3dlclByaW9yaXR5UHJvdmlkZXJzO1xuXG4gICAgaWYgKHRoaXMubWFuYWdlci5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuZGlzcGxheUFib3ZlU25pcHBldHMpIHtcblxuICAgICAgdGhpcy5zdWdnZXN0aW9uUHJpb3JpdHkgPSAyO1xuICAgIH1cbiAgfVxuXG4gIGlzVmFsaWRQcmVmaXgocHJlZml4LCBwcmVmaXhMYXN0KSB7XG5cbiAgICBpZiAocHJlZml4TGFzdCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocHJlZml4TGFzdCA9PT0gJ1xcLicpIHtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByZWZpeExhc3QubWF0Y2goLzt8XFxzLykpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwcmVmaXgubGVuZ3RoID4gMSkge1xuXG4gICAgICBwcmVmaXggPSBgXyR7cHJlZml4fWA7XG4gICAgfVxuXG4gICAgdHJ5IHtcblxuICAgICAgKG5ldyBGdW5jdGlvbihgdmFyICR7cHJlZml4fWApKSgpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjaGVja1ByZWZpeChwcmVmaXgpIHtcblxuICAgIGlmIChwcmVmaXgubWF0Y2goLyhcXHN8O3xcXC58XFxcInxcXCcpJC8pIHx8IHByZWZpeC5yZXBsYWNlKC9cXHMvZywgJycpLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxuXG4gIGdldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB7XG5cbiAgICB0aGlzLmxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuICAgIHRoaXMubGluZU1hdGNoUmVzdWx0ID0gdGhpcy5saW5lLm1hdGNoKFJFR0VYUF9MSU5FKTtcblxuICAgIGlmICh0aGlzLmxpbmVNYXRjaFJlc3VsdCkge1xuXG4gICAgICByZXR1cm4gdGhpcy5saW5lTWF0Y2hSZXN1bHRbMF07XG4gICAgfVxuICB9XG5cbiAgZ2V0U3VnZ2VzdGlvbnMoe2VkaXRvciwgYnVmZmVyUG9zaXRpb24sIHNjb3BlRGVzY3JpcHRvciwgcHJlZml4LCBhY3RpdmF0ZWRNYW51YWxseX0pIHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICBpZiAoIXRoaXMubWFuYWdlci5jbGllbnQpIHtcblxuICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGVtcFByZWZpeCA9IHRoaXMuZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIHx8IHByZWZpeDtcblxuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQcmVmaXgodGhpcy50ZW1wUHJlZml4LCB0aGlzLnRlbXBQcmVmaXhbdGhpcy50ZW1wUHJlZml4Lmxlbmd0aCAtIDFdKSAmJiAhdGhpcy5mb3JjZSAmJiAhYWN0aXZhdGVkTWFudWFsbHkpIHtcblxuICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICB9XG5cbiAgICAgIHByZWZpeCA9IHRoaXMuY2hlY2tQcmVmaXgodGhpcy50ZW1wUHJlZml4KTtcblxuICAgICAgdGhpcy5tYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hbmFnZXIuY2xpZW50LmNvbXBsZXRpb25zKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdLCB7XG5cbiAgICAgICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3csXG4gICAgICAgICAgY2g6IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuXG4gICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFkYXRhLmNvbXBsZXRpb25zLmxlbmd0aCkge1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc0FyciA9IFtdO1xuXG4gICAgICAgICAgbGV0IHNjb3Blc1BhdGggPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKTtcbiAgICAgICAgICBsZXQgaXNJbkZ1bkRlZiA9IHNjb3Blc1BhdGguaW5kZXhPZignbWV0YS5mdW5jdGlvbi5qcycpID4gLTE7XG5cbiAgICAgICAgICBmb3IgKGxldCBvYmogb2YgZGF0YS5jb21wbGV0aW9ucykge1xuXG4gICAgICAgICAgICBvYmogPSB0aGlzLm1hbmFnZXIuaGVscGVyLmZvcm1hdFR5cGVDb21wbGV0aW9uKG9iaiwgaXNJbkZ1bkRlZik7XG5cbiAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbiA9IHtcblxuICAgICAgICAgICAgICB0ZXh0OiBvYmoubmFtZSxcbiAgICAgICAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeCxcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgICAgICAgICB0eXBlOiBvYmouX3R5cGVTZWxmLFxuICAgICAgICAgICAgICBsZWZ0TGFiZWw6IG9iai5sZWZ0TGFiZWwsXG4gICAgICAgICAgICAgIHNuaXBwZXQ6IG9iai5fc25pcHBldCxcbiAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IG9iai5fZGlzcGxheVRleHQsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBvYmouZG9jIHx8IG51bGwsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogb2JqLnVybCB8fCBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tYW5hZ2VyLnBhY2thZ2VDb25maWcub3B0aW9ucy51c2VTbmlwcGV0c0FuZEZ1bmN0aW9uICYmIG9iai5faGFzUGFyYW1zKSB7XG5cbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uQ2xvbmUgPSBfLmNsb25lKHRoaXMuc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbkNsb25lLnR5cGUgPSAnc25pcHBldCc7XG5cbiAgICAgICAgICAgICAgaWYgKG9iai5faGFzUGFyYW1zKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24uc25pcHBldCA9IGAke29iai5uYW1lfSgkXFx7MDpcXH0pYDtcblxuICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uLnNuaXBwZXQgPSBgJHtvYmoubmFtZX0oKWA7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyLnB1c2godGhpcy5zdWdnZXN0aW9uKTtcbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc0Fyci5wdXNoKHRoaXMuc3VnZ2VzdGlvbkNsb25lKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyLnB1c2godGhpcy5zdWdnZXN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKHRoaXMuc3VnZ2VzdGlvbnNBcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZm9yY2VDb21wbGV0aW9uKCkge1xuXG4gICAgdGhpcy5mb3JjZSA9IHRydWU7XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSwgJ2F1dG9jb21wbGV0ZS1wbHVzOmFjdGl2YXRlJyk7XG4gICAgdGhpcy5mb3JjZSA9IGZhbHNlO1xuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-provider.js
