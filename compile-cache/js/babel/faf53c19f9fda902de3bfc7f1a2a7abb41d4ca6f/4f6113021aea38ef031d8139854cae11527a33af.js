"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DocumentationView = require('./atom-ternjs-documentation-view');

var Documentation = (function () {
  function Documentation(manager) {
    _classCallCheck(this, Documentation);

    this.manager = manager;
    this.view = new DocumentationView();
    this.view.initialize(this);

    atom.views.getView(atom.workspace).appendChild(this.view);
  }

  _createClass(Documentation, [{
    key: 'request',
    value: function request() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      this.manager.client.update(editor).then(function (data) {

        if (data.isQueried) {

          return;
        }

        _this.manager.client.documentation(atom.project.relativizePath(editor.getURI())[1], {

          line: position.row,
          ch: position.column

        }).then(function (data) {

          if (!data) {

            return;
          }

          _this.view.setData({

            doc: _this.manager.helper.replaceTags(data.doc),
            origin: data.origin,
            type: _this.manager.helper.formatType(data),
            url: data.url || ''
          });

          _this.show();
        });
      });
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.marker) {

        var editor = atom.workspace.getActiveTextEditor();
        var cursor = editor.getLastCursor();

        if (!editor || !cursor) {

          return;
        }

        this.marker = cursor.getMarker();

        if (!this.marker) {

          return;
        }

        this.overlayDecoration = editor.decorateMarker(this.marker, {

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {

        this.marker.setProperties({

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
      this.marker = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.destroyOverlay();
      this.view.destroy();
      this.view = undefined;
    }
  }]);

  return Documentation;
})();

exports['default'] = Documentation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQzs7SUFFL0MsYUFBYTtBQUVyQixXQUZRLGFBQWEsQ0FFcEIsT0FBTyxFQUFFOzBCQUZGLGFBQWE7O0FBSTlCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUzQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMzRDs7ZUFUa0IsYUFBYTs7V0FXekIsbUJBQUc7OztBQUVSLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFbEQsVUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFWCxlQUFPO09BQ1I7O0FBRUQsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3BDLFVBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUUxQyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLOztBQUVoRCxZQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7O0FBRWxCLGlCQUFPO1NBQ1I7O0FBRUQsY0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7QUFFakYsY0FBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHO0FBQ2xCLFlBQUUsRUFBRSxRQUFRLENBQUMsTUFBTTs7U0FFcEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSzs7QUFFaEIsY0FBSSxDQUFDLElBQUksRUFBRTs7QUFFVCxtQkFBTztXQUNSOztBQUVELGdCQUFLLElBQUksQ0FBQyxPQUFPLENBQUM7O0FBRWhCLGVBQUcsRUFBRSxNQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDOUMsa0JBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtBQUNuQixnQkFBSSxFQUFFLE1BQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQzFDLGVBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7V0FDcEIsQ0FBQyxDQUFDOztBQUVILGdCQUFLLElBQUksRUFBRSxDQUFDO1NBQ2IsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVHLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUVoQixZQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDbEQsWUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUVwQyxZQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUV0QixpQkFBTztTQUNSOztBQUVELFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVqQyxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFaEIsaUJBQU87U0FDUjs7QUFFRCxZQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUUxRCxjQUFJLEVBQUUsU0FBUztBQUNmLGNBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLG1CQUFPLDJCQUEyQjtBQUNsQyxrQkFBUSxFQUFFLE1BQU07QUFDaEIsb0JBQVUsRUFBRSxPQUFPO1NBQ3BCLENBQUMsQ0FBQztPQUVKLE1BQU07O0FBRUwsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7O0FBRXhCLGNBQUksRUFBRSxTQUFTO0FBQ2YsY0FBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsbUJBQU8sMkJBQTJCO0FBQ2xDLGtCQUFRLEVBQUUsTUFBTTtBQUNoQixvQkFBVSxFQUFFLE9BQU87U0FDcEIsQ0FBQyxDQUFDO09BQ0o7S0FDRjs7O1dBRWEsMEJBQUc7O0FBRWYsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7O0FBRTFCLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNsQzs7QUFFRCxVQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBQ3BCOzs7V0FFTSxtQkFBRzs7QUFFUixVQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQixVQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztLQUN2Qjs7O1NBaEhrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IERvY3VtZW50YXRpb25WaWV3ID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLXZpZXcnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG5cbiAgY29uc3RydWN0b3IobWFuYWdlcikge1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB0aGlzLnZpZXcgPSBuZXcgRG9jdW1lbnRhdGlvblZpZXcoKTtcbiAgICB0aGlzLnZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcbiAgfVxuXG4gIHJlcXVlc3QoKSB7XG5cbiAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgaWYgKCFlZGl0b3IpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuICAgIGxldCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuXG4gICAgdGhpcy5tYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIGlmIChkYXRhLmlzUXVlcmllZCkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tYW5hZ2VyLmNsaWVudC5kb2N1bWVudGF0aW9uKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdLCB7XG5cbiAgICAgICAgbGluZTogcG9zaXRpb24ucm93LFxuICAgICAgICBjaDogcG9zaXRpb24uY29sdW1uXG5cbiAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlldy5zZXREYXRhKHtcblxuICAgICAgICAgIGRvYzogdGhpcy5tYW5hZ2VyLmhlbHBlci5yZXBsYWNlVGFncyhkYXRhLmRvYyksXG4gICAgICAgICAgb3JpZ2luOiBkYXRhLm9yaWdpbixcbiAgICAgICAgICB0eXBlOiB0aGlzLm1hbmFnZXIuaGVscGVyLmZvcm1hdFR5cGUoZGF0YSksXG4gICAgICAgICAgdXJsOiBkYXRhLnVybCB8fCAnJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2hvdygpIHtcblxuICAgIGlmICghdGhpcy5tYXJrZXIpIHtcblxuICAgICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgIGxldCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gICAgICBpZiAoIWVkaXRvciB8fCAhY3Vyc29yKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1hcmtlciA9IGN1cnNvci5nZXRNYXJrZXIoKTtcblxuICAgICAgaWYgKCF0aGlzLm1hcmtlcikge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IGVkaXRvci5kZWNvcmF0ZU1hcmtlcih0aGlzLm1hcmtlciwge1xuXG4gICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgaXRlbTogdGhpcy52aWV3LFxuICAgICAgICBjbGFzczogJ2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24nLFxuICAgICAgICBwb3NpdGlvbjogJ3RhbGUnLFxuICAgICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMubWFya2VyLnNldFByb3BlcnRpZXMoe1xuXG4gICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgaXRlbTogdGhpcy52aWV3LFxuICAgICAgICBjbGFzczogJ2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24nLFxuICAgICAgICBwb3NpdGlvbjogJ3RhbGUnLFxuICAgICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95T3ZlcmxheSgpIHtcblxuICAgIGlmICh0aGlzLm92ZXJsYXlEZWNvcmF0aW9uKSB7XG5cbiAgICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSBudWxsO1xuICAgIHRoaXMubWFya2VyID0gbnVsbDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgdGhpcy52aWV3LmRlc3Ryb3koKTtcbiAgICB0aGlzLnZpZXcgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-documentation.js
