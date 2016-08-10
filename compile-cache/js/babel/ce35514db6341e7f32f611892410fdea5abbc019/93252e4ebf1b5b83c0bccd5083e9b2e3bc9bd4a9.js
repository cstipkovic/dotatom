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
          })['catch'](function (err) {

            console.log(err);
            resolve([]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDNUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRW5DLElBQU0sV0FBVyxHQUFHLG9DQUFvQyxDQUFDOztJQUVwQyxRQUFRO0FBRWhCLFdBRlEsUUFBUSxDQUVmLE9BQU8sRUFBRTswQkFGRixRQUFROztBQUl6QixRQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN6QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7O0FBR25CLFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQztBQUNoRCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7O0FBRWxDLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzVCLFFBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzVCLFFBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0dBQ2xDOztlQW5Ca0IsUUFBUTs7V0FxQnZCLGNBQUMsT0FBTyxFQUFFOztBQUVaLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FB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OztBQUVoQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBQy9HLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7U0E5TGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IEZ1bmN0aW9uID0gcmVxdWlyZSgnbG9vcGhvbGUnKS5GdW5jdGlvbjtcbmxldCBfID0gcmVxdWlyZSgndW5kZXJzY29yZS1wbHVzJyk7XG5cbmNvbnN0IFJFR0VYUF9MSU5FID0gLygoW1xcJFxcd10rW1xcdy1dKil8KFsuOjsnXCJbeyggXSspKSQvZztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvdmlkZXIge1xuXG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIpIHtcblxuICAgIHRoaXMubWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZvcmNlID0gZmFsc2U7XG5cbiAgICAvLyBhdXRvbWNvbXBsZXRlLXBsdXNcbiAgICB0aGlzLnNlbGVjdG9yID0gJy5zb3VyY2UuanMnO1xuICAgIHRoaXMuZGlzYWJsZUZvclNlbGVjdG9yID0gJy5zb3VyY2UuanMgLmNvbW1lbnQnO1xuICAgIHRoaXMuaW5jbHVzaW9uUHJpb3JpdHkgPSAxO1xuICAgIHRoaXMuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSBmYWxzZTtcblxuICAgIHRoaXMubGluZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmxpbmVNYXRjaFJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRlbXBQcmVmaXggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdWdnZXN0aW9uc0FyciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN1Z2dlc3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdWdnZXN0aW9uQ2xvbmUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpbml0KG1hbmFnZXIpIHtcblxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5leGNsdWRlTG93ZXJQcmlvcml0eSA9IHRoaXMubWFuYWdlci5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuZXhjbHVkZUxvd2VyUHJpb3JpdHlQcm92aWRlcnM7XG5cbiAgICBpZiAodGhpcy5tYW5hZ2VyLnBhY2thZ2VDb25maWcub3B0aW9ucy5kaXNwbGF5QWJvdmVTbmlwcGV0cykge1xuXG4gICAgICB0aGlzLnN1Z2dlc3Rpb25Qcmlvcml0eSA9IDI7XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZFByZWZpeChwcmVmaXgsIHByZWZpeExhc3QpIHtcblxuICAgIGlmIChwcmVmaXhMYXN0ID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwcmVmaXhMYXN0ID09PSAnXFwuJykge1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJlZml4TGFzdC5tYXRjaCgvO3xcXHMvKSkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHByZWZpeC5sZW5ndGggPiAxKSB7XG5cbiAgICAgIHByZWZpeCA9IGBfJHtwcmVmaXh9YDtcbiAgICB9XG5cbiAgICB0cnkge1xuXG4gICAgICAobmV3IEZ1bmN0aW9uKGB2YXIgJHtwcmVmaXh9YCkpKCk7XG5cbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNoZWNrUHJlZml4KHByZWZpeCkge1xuXG4gICAgaWYgKHByZWZpeC5tYXRjaCgvKFxcc3w7fFxcLnxcXFwifFxcJykkLykgfHwgcHJlZml4LnJlcGxhY2UoL1xccy9nLCAnJykubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG5cbiAgZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIHtcblxuICAgIHRoaXMubGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSk7XG4gICAgdGhpcy5saW5lTWF0Y2hSZXN1bHQgPSB0aGlzLmxpbmUubWF0Y2goUkVHRVhQX0xJTkUpO1xuXG4gICAgaWYgKHRoaXMubGluZU1hdGNoUmVzdWx0KSB7XG5cbiAgICAgIHJldHVybiB0aGlzLmxpbmVNYXRjaFJlc3VsdFswXTtcbiAgICB9XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXgsIGFjdGl2YXRlZE1hbnVhbGx5fSkge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5tYW5hZ2VyLmNsaWVudCkge1xuXG4gICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZW1wUHJlZml4ID0gdGhpcy5nZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgfHwgcHJlZml4O1xuXG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZFByZWZpeCh0aGlzLnRlbXBQcmVmaXgsIHRoaXMudGVtcFByZWZpeFt0aGlzLnRlbXBQcmVmaXgubGVuZ3RoIC0gMV0pICYmICF0aGlzLmZvcmNlICYmICFhY3RpdmF0ZWRNYW51YWxseSkge1xuXG4gICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgIH1cblxuICAgICAgcHJlZml4ID0gdGhpcy5jaGVja1ByZWZpeCh0aGlzLnRlbXBQcmVmaXgpO1xuXG4gICAgICB0aGlzLm1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFuYWdlci5jbGllbnQuY29tcGxldGlvbnMoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sIHtcblxuICAgICAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvdyxcbiAgICAgICAgICBjaDogYnVmZmVyUG9zaXRpb24uY29sdW1uXG5cbiAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWRhdGEuY29tcGxldGlvbnMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyID0gW107XG5cbiAgICAgICAgICBsZXQgc2NvcGVzUGF0aCA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpO1xuICAgICAgICAgIGxldCBpc0luRnVuRGVmID0gc2NvcGVzUGF0aC5pbmRleE9mKCdtZXRhLmZ1bmN0aW9uLmpzJykgPiAtMTtcblxuICAgICAgICAgIGZvciAobGV0IG9iaiBvZiBkYXRhLmNvbXBsZXRpb25zKSB7XG5cbiAgICAgICAgICAgIG9iaiA9IHRoaXMubWFuYWdlci5oZWxwZXIuZm9ybWF0VHlwZUNvbXBsZXRpb24ob2JqLCBpc0luRnVuRGVmKTtcblxuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0ge1xuXG4gICAgICAgICAgICAgIHRleHQ6IG9iai5uYW1lLFxuICAgICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeDogcHJlZml4LFxuICAgICAgICAgICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgICAgICAgICAgIHR5cGU6IG9iai5fdHlwZVNlbGYsXG4gICAgICAgICAgICAgIGxlZnRMYWJlbDogb2JqLmxlZnRMYWJlbCxcbiAgICAgICAgICAgICAgc25pcHBldDogb2JqLl9zbmlwcGV0LFxuICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogb2JqLl9kaXNwbGF5VGV4dCxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IG9iai5kb2MgfHwgbnVsbCxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb25Nb3JlVVJMOiBvYmoudXJsIHx8IG51bGxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1hbmFnZXIucGFja2FnZUNvbmZpZy5vcHRpb25zLnVzZVNuaXBwZXRzQW5kRnVuY3Rpb24gJiYgb2JqLl9oYXNQYXJhbXMpIHtcblxuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25DbG9uZSA9IF8uY2xvbmUodGhpcy5zdWdnZXN0aW9uKTtcbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uQ2xvbmUudHlwZSA9ICdzbmlwcGV0JztcblxuICAgICAgICAgICAgICBpZiAob2JqLl9oYXNQYXJhbXMpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbi5zbmlwcGV0ID0gYCR7b2JqLm5hbWV9KCRcXHswOlxcfSlgO1xuXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24uc25pcHBldCA9IGAke29iai5uYW1lfSgpYDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIucHVzaCh0aGlzLnN1Z2dlc3Rpb24pO1xuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyLnB1c2godGhpcy5zdWdnZXN0aW9uQ2xvbmUpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIucHVzaCh0aGlzLnN1Z2dlc3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUodGhpcy5zdWdnZXN0aW9uc0Fycik7XG5cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICByZXNvbHZlKFtdKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZvcmNlQ29tcGxldGlvbigpIHtcblxuICAgIHRoaXMuZm9yY2UgPSB0cnVlO1xuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSksICdhdXRvY29tcGxldGUtcGx1czphY3RpdmF0ZScpO1xuICAgIHRoaXMuZm9yY2UgPSBmYWxzZTtcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-provider.js
