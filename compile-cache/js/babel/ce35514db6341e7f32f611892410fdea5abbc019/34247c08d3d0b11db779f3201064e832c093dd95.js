Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _indentationStatusView = require('./indentation-status-view');

var _indentationStatusView2 = _interopRequireDefault(_indentationStatusView);

'use babel';

var IndentationStatus = (function () {
  function IndentationStatus(statusBar) {
    var atomEnv = arguments.length <= 1 || arguments[1] === undefined ? global.atom : arguments[1];
    var config = arguments.length <= 2 || arguments[2] === undefined ? atomEnv.config : arguments[2];
    var workspace = arguments.length <= 3 || arguments[3] === undefined ? atomEnv.workspace : arguments[3];
    return (function () {
      _classCallCheck(this, IndentationStatus);

      this.atomEnv = atomEnv;
      this.config = config;
      this.workspace = workspace;
      this.statusBar = statusBar;

      this.observeEvents();
      this.displayTile();
    }).apply(this, arguments);
  }

  _createClass(IndentationStatus, [{
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.destroyTile();
    }
  }, {
    key: 'getText',
    value: function getText() {
      var editor = this.workspace.getActiveTextEditor();

      if (!editor) {
        return '';
      }

      var softTabs = editor.getSoftTabs();
      var length = editor.getTabLength();
      var separator = this.config.get('indentation-indicator.spaceAfterColon') ? ': ' : ':';

      return '' + this.softTabsSettingToText(softTabs) + separator + length;
    }
  }, {
    key: 'destroyTile',
    value: function destroyTile() {
      if (this.tooltipDisposable) {
        this.tooltipDisposable.dispose();
        this.tooltipDisposable = null;
      }

      if (this.view) {
        this.view.destroy();
        this.view = null;
      }

      if (this.tile) {
        this.tile.destroy();
        this.tile = null;
      }
    }
  }, {
    key: 'displayTile',
    value: function displayTile() {
      var priority = 100;
      this.view = new _indentationStatusView2['default'](this);

      if (this.config.get('indentation-indicator.indicatorPosition') === 'right') {
        this.tile = this.statusBar.addRightTile({ item: this.view.element, priority: priority });
        this.updateTooltip();
      } else {
        this.tile = this.statusBar.addLeftTile({ item: this.view.element, priority: priority });
        this.updateTooltip();
      }
    }
  }, {
    key: 'observeEvents',
    value: function observeEvents() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();

      this.subscriptions.add(this.config.onDidChange('indentation-indicator.indicatorPosition', function () {
        _this.destroyTile();
        _this.displayTile();
      }));

      this.subscriptions.add(this.config.onDidChange('indentation-indicator.spaceAfterColon', function () {
        if (_this.view) {
          _this.updateView();
        }
      }));

      this.subscriptions.add(this.workspace.onDidChangeActivePaneItem(function () {
        if (_this.view) {
          _this.updateView();
        }
      }));

      this.subscriptions.add(this.workspace.observeTextEditors(function (editor) {
        var disposable = editor.onDidChangeGrammar(function () {
          if (_this.view) {
            _this.updateView();
          }
        });

        editor.onDidDestroy(function () {
          disposable.dispose();
        });
      }));
    }
  }, {
    key: 'softTabsSettingToText',
    value: function softTabsSettingToText(softTabs) {
      return softTabs ? 'Spaces' : 'Tabs';
    }
  }, {
    key: 'updateTooltip',
    value: function updateTooltip() {
      if (this.tooltipDisposable) {
        this.tooltipDisposable.dispose();
        this.tooltipDisposable = null;
      }

      var editor = this.workspace.getActiveTextEditor();

      if (editor) {
        var tooltipText = 'Active editor is using ' + editor.getTabLength() + ' ' + this.softTabsSettingToText(editor.getSoftTabs()) + '\nfor indentation';

        this.tooltipDisposable = this.atomEnv.tooltips.add(this.view.element, { title: tooltipText, trigger: 'hover' });
      }
    }
  }, {
    key: 'updateView',
    value: _asyncToGenerator(function* () {
      yield this.view.update();

      this.updateTooltip();
    })
  }]);

  return IndentationStatus;
})();

exports['default'] = IndentationStatus;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL2xpYi9pbmRlbnRhdGlvbi1zdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUVrQyxNQUFNOztxQ0FFTiwyQkFBMkI7Ozs7QUFKN0QsV0FBVyxDQUFBOztJQU1VLGlCQUFpQjtBQUN4QixXQURPLGlCQUFpQixDQUN2QixTQUFTO1FBQUUsT0FBTyx5REFBRyxNQUFNLENBQUMsSUFBSTtRQUFFLE1BQU0seURBQUcsT0FBTyxDQUFDLE1BQU07UUFBRSxTQUFTLHlEQUFHLE9BQU8sQ0FBQyxTQUFTO3dCQUFFOzRCQURwRixpQkFBaUI7O0FBRWxDLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0FBQzFCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBOztBQUUxQixVQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7QUFDcEIsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0tBQ25CO0dBQUE7O2VBVGtCLGlCQUFpQjs7V0FXNUIsbUJBQUc7QUFDVCxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUNuQjs7O1dBRU8sbUJBQUc7QUFDVCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7O0FBRW5ELFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxlQUFPLEVBQUUsQ0FBQTtPQUNWOztBQUVELFVBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNyQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDcEMsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFBOztBQUV2RixrQkFBVSxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBRTtLQUN0RTs7O1dBRVcsdUJBQUc7QUFDYixVQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUMxQixZQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDaEMsWUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQTtPQUM5Qjs7QUFFRCxVQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDYixZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ25CLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO09BQ2pCOztBQUVELFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbkIsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7T0FDakI7S0FDRjs7O1dBRVcsdUJBQUc7QUFDYixVQUFNLFFBQVEsR0FBRyxHQUFHLENBQUE7QUFDcEIsVUFBSSxDQUFDLElBQUksR0FBRyx1Q0FBMEIsSUFBSSxDQUFDLENBQUE7O0FBRTNDLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsS0FBSyxPQUFPLEVBQUU7QUFDMUUsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQTtBQUN0RixZQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7T0FDckIsTUFBTTtBQUNMLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7QUFDckYsWUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO09BQ3JCO0tBQ0Y7OztXQUVhLHlCQUFHOzs7QUFDZixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyx5Q0FBeUMsRUFBRSxZQUFNO0FBQzlGLGNBQUssV0FBVyxFQUFFLENBQUE7QUFDbEIsY0FBSyxXQUFXLEVBQUUsQ0FBQTtPQUNuQixDQUFDLENBQUMsQ0FBQTs7QUFFSCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyx1Q0FBdUMsRUFBRSxZQUFNO0FBQzVGLFlBQUksTUFBSyxJQUFJLEVBQUU7QUFDYixnQkFBSyxVQUFVLEVBQUUsQ0FBQTtTQUNsQjtPQUNGLENBQUMsQ0FBQyxDQUFBOztBQUVILFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsWUFBTTtBQUNwRSxZQUFJLE1BQUssSUFBSSxFQUFFO0FBQ2IsZ0JBQUssVUFBVSxFQUFFLENBQUE7U0FDbEI7T0FDRixDQUFDLENBQUMsQ0FBQTs7QUFFSCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ25FLFlBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFNO0FBQy9DLGNBQUksTUFBSyxJQUFJLEVBQUU7QUFDYixrQkFBSyxVQUFVLEVBQUUsQ0FBQTtXQUNsQjtTQUNGLENBQUMsQ0FBQTs7QUFFRixjQUFNLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDeEIsb0JBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUNyQixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUMsQ0FBQTtLQUNKOzs7V0FFcUIsK0JBQUMsUUFBUSxFQUFFO0FBQy9CLGFBQU8sUUFBUSxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUE7S0FDcEM7OztXQUVhLHlCQUFHO0FBQ2YsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7QUFDMUIsWUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2hDLFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUE7T0FDOUI7O0FBRUQsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBOztBQUVqRCxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQU0sV0FBVywrQkFBNkIsTUFBTSxDQUFDLFlBQVksRUFBRSxTQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsc0JBQW1CLENBQUE7O0FBRTFJLFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQ2pCLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtPQUMzRjtLQUNGOzs7NkJBRWdCLGFBQUc7QUFDbEIsWUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBOztBQUV4QixVQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7S0FDckI7OztTQXJIa0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2luZGVudGF0aW9uLWluZGljYXRvci9saWIvaW5kZW50YXRpb24tc3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgSW5kZW50YXRpb25TdGF0dXNWaWV3IGZyb20gJy4vaW5kZW50YXRpb24tc3RhdHVzLXZpZXcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGVudGF0aW9uU3RhdHVzIHtcbiAgY29uc3RydWN0b3IgKHN0YXR1c0JhciwgYXRvbUVudiA9IGdsb2JhbC5hdG9tLCBjb25maWcgPSBhdG9tRW52LmNvbmZpZywgd29ya3NwYWNlID0gYXRvbUVudi53b3Jrc3BhY2UpIHtcbiAgICB0aGlzLmF0b21FbnYgPSBhdG9tRW52XG4gICAgdGhpcy5jb25maWcgPSBjb25maWdcbiAgICB0aGlzLndvcmtzcGFjZSA9IHdvcmtzcGFjZVxuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyXG5cbiAgICB0aGlzLm9ic2VydmVFdmVudHMoKVxuICAgIHRoaXMuZGlzcGxheVRpbGUoKVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuZGVzdHJveVRpbGUoKVxuICB9XG5cbiAgZ2V0VGV4dCAoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgY29uc3Qgc29mdFRhYnMgPSBlZGl0b3IuZ2V0U29mdFRhYnMoKVxuICAgIGNvbnN0IGxlbmd0aCA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKVxuICAgIGNvbnN0IHNlcGFyYXRvciA9IHRoaXMuY29uZmlnLmdldCgnaW5kZW50YXRpb24taW5kaWNhdG9yLnNwYWNlQWZ0ZXJDb2xvbicpID8gJzogJyA6ICc6J1xuXG4gICAgcmV0dXJuIGAke3RoaXMuc29mdFRhYnNTZXR0aW5nVG9UZXh0KHNvZnRUYWJzKX0ke3NlcGFyYXRvcn0ke2xlbmd0aH1gXG4gIH1cblxuICBkZXN0cm95VGlsZSAoKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcERpc3Bvc2FibGUpIHtcbiAgICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldy5kZXN0cm95KClcbiAgICAgIHRoaXMudmlldyA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aWxlKSB7XG4gICAgICB0aGlzLnRpbGUuZGVzdHJveSgpXG4gICAgICB0aGlzLnRpbGUgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgZGlzcGxheVRpbGUgKCkge1xuICAgIGNvbnN0IHByaW9yaXR5ID0gMTAwXG4gICAgdGhpcy52aWV3ID0gbmV3IEluZGVudGF0aW9uU3RhdHVzVmlldyh0aGlzKVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLmdldCgnaW5kZW50YXRpb24taW5kaWNhdG9yLmluZGljYXRvclBvc2l0aW9uJykgPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMudGlsZSA9IHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7aXRlbTogdGhpcy52aWV3LmVsZW1lbnQsIHByaW9yaXR5OiBwcmlvcml0eX0pXG4gICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRpbGUgPSB0aGlzLnN0YXR1c0Jhci5hZGRMZWZ0VGlsZSh7aXRlbTogdGhpcy52aWV3LmVsZW1lbnQsIHByaW9yaXR5OiBwcmlvcml0eX0pXG4gICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAoKVxuICAgIH1cbiAgfVxuXG4gIG9ic2VydmVFdmVudHMgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb25maWcub25EaWRDaGFuZ2UoJ2luZGVudGF0aW9uLWluZGljYXRvci5pbmRpY2F0b3JQb3NpdGlvbicsICgpID0+IHtcbiAgICAgIHRoaXMuZGVzdHJveVRpbGUoKVxuICAgICAgdGhpcy5kaXNwbGF5VGlsZSgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29uZmlnLm9uRGlkQ2hhbmdlKCdpbmRlbnRhdGlvbi1pbmRpY2F0b3Iuc3BhY2VBZnRlckNvbG9uJywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMudmlldykge1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KClcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGxldCBkaXNwb3NhYmxlID0gZWRpdG9yLm9uRGlkQ2hhbmdlR3JhbW1hcigoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICAgIH0pXG4gICAgfSkpXG4gIH1cblxuICBzb2Z0VGFic1NldHRpbmdUb1RleHQgKHNvZnRUYWJzKSB7XG4gICAgcmV0dXJuIHNvZnRUYWJzID8gJ1NwYWNlcycgOiAnVGFicydcbiAgfVxuXG4gIHVwZGF0ZVRvb2x0aXAgKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXBEaXNwb3NhYmxlKSB7XG4gICAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgICAgdGhpcy50b29sdGlwRGlzcG9zYWJsZSA9IG51bGxcbiAgICB9XG5cbiAgICBsZXQgZWRpdG9yID0gdGhpcy53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBjb25zdCB0b29sdGlwVGV4dCA9IGBBY3RpdmUgZWRpdG9yIGlzIHVzaW5nICR7ZWRpdG9yLmdldFRhYkxlbmd0aCgpfSAke3RoaXMuc29mdFRhYnNTZXR0aW5nVG9UZXh0KGVkaXRvci5nZXRTb2Z0VGFicygpKX1cXG5mb3IgaW5kZW50YXRpb25gXG5cbiAgICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSB0aGlzLmF0b21FbnYudG9vbHRpcHMuYWRkKHRoaXMudmlldy5lbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RpdGxlOiB0b29sdGlwVGV4dCwgdHJpZ2dlcjogJ2hvdmVyJ30pXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdXBkYXRlVmlldyAoKSB7XG4gICAgYXdhaXQgdGhpcy52aWV3LnVwZGF0ZSgpXG5cbiAgICB0aGlzLnVwZGF0ZVRvb2x0aXAoKVxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/lib/indentation-status.js
