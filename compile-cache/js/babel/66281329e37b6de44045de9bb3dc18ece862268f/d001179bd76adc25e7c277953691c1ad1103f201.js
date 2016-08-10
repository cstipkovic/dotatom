"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PackageConfig = (function () {
  function PackageConfig(manager) {
    _classCallCheck(this, PackageConfig);

    this.manager = manager;

    this.disposables = [];
    this.options = {

      excludeLowerPriority: atom.config.get('atom-ternjs.excludeLowerPriorityProviders'),
      inlineFnCompletion: atom.config.get('atom-ternjs.inlineFnCompletion'),
      useSnippets: atom.config.get('atom-ternjs.useSnippets'),
      displayAboveSnippets: atom.config.get('atom-ternjs.displayAboveSnippets'),
      useSnippetsAndFunction: atom.config.get('atom-ternjs.useSnippetsAndFunction'),
      sort: atom.config.get('atom-ternjs.sort'),
      guess: atom.config.get('atom-ternjs.guess'),
      urls: atom.config.get('atom-ternjs.urls'),
      origins: atom.config.get('atom-ternjs.origins'),
      caseInsensitive: atom.config.get('atom-ternjs.caseInsensitive'),
      documentation: atom.config.get('atom-ternjs.documentation')
    };

    this.registerEvents();
  }

  _createClass(PackageConfig, [{
    key: 'registerEvents',
    value: function registerEvents() {
      var _this = this;

      this.disposables.push(atom.config.observe('atom-ternjs.excludeLowerPriorityProviders', function (value) {

        _this.options.excludeLowerPriority = value;

        if (_this.manager.provider) {

          _this.manager.provider.excludeLowerPriority = value;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletion', function (value) {

        _this.options.inlineFnCompletion = value;

        if (_this.manager.type) {

          _this.manager.type.destroyOverlay();
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.useSnippets', function (value) {

        _this.options.useSnippets = value;

        if (!value) {

          return;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.useSnippetsAndFunction', function (value) {

        _this.options.useSnippetsAndFunction = value;

        if (!value) {

          return;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.sort', function (value) {

        _this.options.sort = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.guess', function (value) {

        _this.options.guess = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.urls', function (value) {

        _this.options.urls = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.origins', function (value) {

        _this.options.origins = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.caseInsensitive', function (value) {

        _this.options.caseInsensitive = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.documentation', function (value) {

        _this.options.documentation = value;
      }));
    }
  }, {
    key: 'unregisterEvents',
    value: function unregisterEvents() {

      for (var disposable of this.disposables) {

        disposable.dispose();
      }

      this.disposables = [];
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.unregisterEvents();
    }
  }]);

  return PackageConfig;
})();

exports['default'] = PackageConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztJQUVTLGFBQWE7QUFFckIsV0FGUSxhQUFhLENBRXBCLE9BQU8sRUFBRTswQkFGRixhQUFhOztBQUk5QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLE9BQU8sR0FBRzs7QUFFYiwwQkFBb0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQztBQUNsRix3QkFBa0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQztBQUNyRSxpQkFBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDO0FBQ3ZELDBCQUFvQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDO0FBQ3pFLDRCQUFzQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDO0FBQzdFLFVBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztBQUN6QyxXQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7QUFDM0MsVUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0FBQ3pDLGFBQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztBQUMvQyxxQkFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDO0FBQy9E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QUMsQ0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUVoRixjQUFLLE9BQU8sQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO09BQ3BDLENBQUMsQ0FBQyxDQUFDO0tBQ0w7OztXQUVlLDRCQUFHOztBQUVqQixXQUFLLElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7O0FBRXZDLGtCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDdEI7O0FBRUQsVUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7S0FDdkI7OztXQUVNLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0tBQ3pCOzs7U0EvR2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZUNvbmZpZyB7XG5cbiAgY29uc3RydWN0b3IobWFuYWdlcikge1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG5cbiAgICAgIGV4Y2x1ZGVMb3dlclByaW9yaXR5OiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdGVybmpzLmV4Y2x1ZGVMb3dlclByaW9yaXR5UHJvdmlkZXJzJyksXG4gICAgICBpbmxpbmVGbkNvbXBsZXRpb246IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJuanMuaW5saW5lRm5Db21wbGV0aW9uJyksXG4gICAgICB1c2VTbmlwcGV0czogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy51c2VTbmlwcGV0cycpLFxuICAgICAgZGlzcGxheUFib3ZlU25pcHBldHM6IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJuanMuZGlzcGxheUFib3ZlU25pcHBldHMnKSxcbiAgICAgIHVzZVNuaXBwZXRzQW5kRnVuY3Rpb246IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJuanMudXNlU25pcHBldHNBbmRGdW5jdGlvbicpLFxuICAgICAgc29ydDogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy5zb3J0JyksXG4gICAgICBndWVzczogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy5ndWVzcycpLFxuICAgICAgdXJsczogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy51cmxzJyksXG4gICAgICBvcmlnaW5zOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdGVybmpzLm9yaWdpbnMnKSxcbiAgICAgIGNhc2VJbnNlbnNpdGl2ZTogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy5jYXNlSW5zZW5zaXRpdmUnKSxcbiAgICAgIGRvY3VtZW50YXRpb246IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJuanMuZG9jdW1lbnRhdGlvbicpXG4gICAgfTtcblxuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmV4Y2x1ZGVMb3dlclByaW9yaXR5UHJvdmlkZXJzJywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5leGNsdWRlTG93ZXJQcmlvcml0eSA9IHZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5tYW5hZ2VyLnByb3ZpZGVyKSB7XG5cbiAgICAgICAgdGhpcy5tYW5hZ2VyLnByb3ZpZGVyLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmlubGluZUZuQ29tcGxldGlvbicsICh2YWx1ZSkgPT4ge1xuXG4gICAgICB0aGlzLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uID0gdmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLm1hbmFnZXIudHlwZSkge1xuXG4gICAgICAgIHRoaXMubWFuYWdlci50eXBlLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnVzZVNuaXBwZXRzJywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIHRoaXMub3B0aW9ucy51c2VTbmlwcGV0cyA9IHZhbHVlO1xuXG4gICAgICBpZiAoIXZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy51c2VTbmlwcGV0c0FuZEZ1bmN0aW9uJywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIHRoaXMub3B0aW9ucy51c2VTbmlwcGV0c0FuZEZ1bmN0aW9uID0gdmFsdWU7XG5cbiAgICAgIGlmICghdmFsdWUpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnNvcnQnLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLnNvcnQgPSB2YWx1ZTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuZ3Vlc3MnLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLmd1ZXNzID0gdmFsdWU7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnVybHMnLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLnVybHMgPSB2YWx1ZTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMub3JpZ2lucycsICh2YWx1ZSkgPT4ge1xuXG4gICAgICB0aGlzLm9wdGlvbnMub3JpZ2lucyA9IHZhbHVlO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5jYXNlSW5zZW5zaXRpdmUnLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLmNhc2VJbnNlbnNpdGl2ZSA9IHZhbHVlO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5kb2N1bWVudGF0aW9uJywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5kb2N1bWVudGF0aW9uID0gdmFsdWU7XG4gICAgfSkpO1xuICB9XG5cbiAgdW5yZWdpc3RlckV2ZW50cygpIHtcblxuICAgIGZvciAobGV0IGRpc3Bvc2FibGUgb2YgdGhpcy5kaXNwb3NhYmxlcykge1xuXG4gICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgdGhpcy51bnJlZ2lzdGVyRXZlbnRzKCk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-package-config.js
