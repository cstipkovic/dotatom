'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Client = (function () {
  function Client(manager, projectDir) {
    _classCallCheck(this, Client);

    this.manager = manager;
    this.projectDir = projectDir;
  }

  _createClass(Client, [{
    key: 'completions',
    value: function completions(file, end) {

      return this.post('query', {

        query: {

          type: 'completions',
          file: file,
          end: end,
          types: true,
          includeKeywords: true,
          sort: this.manager.packageConfig.options.sort,
          guess: this.manager.packageConfig.options.guess,
          docs: this.manager.packageConfig.options.documentation,
          urls: this.manager.packageConfig.options.urls,
          origins: this.manager.packageConfig.options.origins,
          lineCharPositions: true,
          caseInsensitive: this.manager.packageConfig.options.caseInsensitive
        }
      });
    }
  }, {
    key: 'documentation',
    value: function documentation(file, end) {

      return this.post('query', {

        query: {

          type: 'documentation',
          file: file,
          end: end
        }
      });
    }
  }, {
    key: 'refs',
    value: function refs(file, end) {

      return this.post('query', {

        query: {

          type: 'refs',
          file: file,
          end: end
        }
      });
    }
  }, {
    key: 'updateFull',
    value: function updateFull(editor, editorMeta) {

      if (editorMeta) {

        editorMeta.diffs = [];
      }

      return this.post('query', { files: [{

          type: 'full',
          name: atom.project.relativizePath(editor.getURI())[1],
          text: editor.getText()
        }] });
    }
  }, {
    key: 'updatePart',
    value: function updatePart(editor, editorMeta, start, text) {

      if (editorMeta) {

        editorMeta.diffs = [];
      }

      return this.post('query', [{

        type: 'full',
        name: atom.project.relativizePath(editor.getURI())[1],
        offset: {

          line: start,
          ch: 0
        },
        text: editor.getText()
      }]);
    }
  }, {
    key: 'update',
    value: function update(editor) {
      var _this = this;

      var editorMeta = this.manager.getEditor(editor);
      var file = atom.project.relativizePath(editor.getURI())[1].replace(/\\/g, '/');

      // check if this file is excluded via dontLoad
      if (this.manager.server && this.manager.server.dontLoad(file)) {

        return Promise.resolve({});
      }

      // check if the file is registered, else return
      return this.files().then(function (data) {

        if (data.files) {

          for (var i = 0; i < data.files.length; i++) {

            data.files[i] = data.files[i].replace(/\\/g, '/');
          }
        }

        var registered = data.files && data.files.indexOf(file) > -1;

        if (editorMeta && editorMeta.diffs.length === 0 && registered) {

          return Promise.resolve({});
        }

        if (registered) {

          // const buffer = editor.getBuffer();
          // if buffer.getMaxCharacterIndex() > 5000
          //   start = 0
          //   end = 0
          //   text = ''
          //   for diff in editorMeta.diffs
          //     start = Math.max(0, diff.oldRange.start.row - 50)
          //     end = Math.min(buffer.getLineCount(), diff.oldRange.end.row + 5)
          //     text = buffer.getTextInRange([[start, 0], [end, buffer.lineLengthForRow(end)]])
          //   promise = this.updatePart(editor, editorMeta, start, text)
          // else
          return _this.updateFull(editor, editorMeta);
        } else {

          return Promise.resolve({});
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'rename',
    value: function rename(file, end, newName) {

      return this.post('query', {

        query: {

          type: 'rename',
          file: file,
          end: end,
          newName: newName
        }
      });
    }
  }, {
    key: 'lint',
    value: function lint(file, text) {

      return this.post('query', {

        query: {

          type: 'lint',
          file: file,
          files: [{
            type: 'full',
            name: file,
            text: text
          }]
        }
      });
    }
  }, {
    key: 'type',
    value: function type(editor, position) {

      var file = atom.project.relativizePath(editor.getURI())[1];
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'type',
          file: file,
          end: end,
          preferFunction: true
        }
      });
    }
  }, {
    key: 'definition',
    value: function definition() {
      var _this2 = this;

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();
      var file = atom.project.relativizePath(editor.getURI())[1];
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'definition',
          file: file,
          end: end
        }

      }).then(function (data) {

        if (data && data.start) {

          if (_this2.manager.helper) {

            _this2.manager.helper.setMarkerCheckpoint();
            _this2.manager.helper.openFileAndGoTo(data.start, data.file);
          }
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'files',
    value: function files() {

      return this.post('query', {

        query: {

          type: 'files'
        }

      }).then(function (data) {

        return data;
      });
    }
  }, {
    key: 'post',
    value: function post(type, data) {

      var promise = this.manager.server.request(type, data);

      return promise;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFUyxNQUFNO0FBRWQsV0FGUSxNQUFNLENBRWIsT0FBTyxFQUFFLFVBQVUsRUFBRTswQkFGZCxNQUFNOztBQUl2QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztHQUM5Qjs7ZUFOa0IsTUFBTTs7V0FRZCxxQkFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFOztBQUVyQixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUV4QixhQUFLLEVBQUU7O0FBRUwsY0FBSSxFQUFFLGFBQWE7QUFDbkIsY0FBSSxFQUFFLElBQUk7QUFDVixhQUFHLEVBQUUsR0FBRztBQUNSLGVBQUssRUFBRSxJQUFJO0FBQ1gseUJBQWUsRUFBRSxJQUFJO0FBQ3JCLGNBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSTtBQUM3QyxlQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUs7QUFDL0MsY0FBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxhQUFhO0FBQ3RELGNBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSTtBQUM3QyxpQkFBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPO0FBQ25ELDJCQUFpQixFQUFFLElBQUk7QUFDdkIseUJBQWUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsZUFBZTtTQUNwRTtPQUNGLENBQUMsQ0FB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QUFDLElBQUksRUFBSzs7QUFFaEIsWUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTs7QUFFdEIsY0FBSSxPQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUU7O0FBRXZCLG1CQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUMxQyxtQkFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUM1RDtTQUNGO09BQ0YsQ0FBQyxTQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7O0FBRWhCLGVBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDcEIsQ0FBQyxDQUFDO0tBQ0o7OztXQUVJLGlCQUFHOztBQUVOLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRXhCLGFBQUssRUFBRTs7QUFFTCxjQUFJLEVBQUUsT0FBTztTQUNkOztPQUVGLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRWhCLGVBQU8sSUFBSSxDQUFDO09BQ2IsQ0FBQyxDQUFDO0tBQ0o7OztXQUVHLGNBQUMsSUFBSSxFQUFFLElBQUksRUFBRTs7QUFFZixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUV4RCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBclFrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcblxuICBjb25zdHJ1Y3RvcihtYW5hZ2VyLCBwcm9qZWN0RGlyKSB7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMucHJvamVjdERpciA9IHByb2plY3REaXI7XG4gIH1cblxuICBjb21wbGV0aW9ucyhmaWxlLCBlbmQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdjb21wbGV0aW9ucycsXG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGVuZDogZW5kLFxuICAgICAgICB0eXBlczogdHJ1ZSxcbiAgICAgICAgaW5jbHVkZUtleXdvcmRzOiB0cnVlLFxuICAgICAgICBzb3J0OiB0aGlzLm1hbmFnZXIucGFja2FnZUNvbmZpZy5vcHRpb25zLnNvcnQsXG4gICAgICAgIGd1ZXNzOiB0aGlzLm1hbmFnZXIucGFja2FnZUNvbmZpZy5vcHRpb25zLmd1ZXNzLFxuICAgICAgICBkb2NzOiB0aGlzLm1hbmFnZXIucGFja2FnZUNvbmZpZy5vcHRpb25zLmRvY3VtZW50YXRpb24sXG4gICAgICAgIHVybHM6IHRoaXMubWFuYWdlci5wYWNrYWdlQ29uZmlnLm9wdGlvbnMudXJscyxcbiAgICAgICAgb3JpZ2luczogdGhpcy5tYW5hZ2VyLnBhY2thZ2VDb25maWcub3B0aW9ucy5vcmlnaW5zLFxuICAgICAgICBsaW5lQ2hhclBvc2l0aW9uczogdHJ1ZSxcbiAgICAgICAgY2FzZUluc2Vuc2l0aXZlOiB0aGlzLm1hbmFnZXIucGFja2FnZUNvbmZpZy5vcHRpb25zLmNhc2VJbnNlbnNpdGl2ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZG9jdW1lbnRhdGlvbihmaWxlLCBlbmQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdkb2N1bWVudGF0aW9uJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZnMoZmlsZSwgZW5kKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAncmVmcycsXG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGVuZDogZW5kXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVGdWxsKGVkaXRvciwgZWRpdG9yTWV0YSkge1xuXG4gICAgaWYgKGVkaXRvck1ldGEpIHtcblxuICAgICAgZWRpdG9yTWV0YS5kaWZmcyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5JywgeyBmaWxlczogW3tcblxuICAgICAgdHlwZTogJ2Z1bGwnLFxuICAgICAgbmFtZTogYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sXG4gICAgICB0ZXh0OiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgfV19KTtcbiAgfVxuXG4gIHVwZGF0ZVBhcnQoZWRpdG9yLCBlZGl0b3JNZXRhLCBzdGFydCwgdGV4dCkge1xuXG4gICAgaWYgKGVkaXRvck1ldGEpIHtcblxuICAgICAgZWRpdG9yTWV0YS5kaWZmcyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5JywgW3tcblxuICAgICAgdHlwZTogJ2Z1bGwnLFxuICAgICAgbmFtZTogYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sXG4gICAgICBvZmZzZXQ6IHtcblxuICAgICAgICBsaW5lOiBzdGFydCxcbiAgICAgICAgY2g6IDBcbiAgICAgIH0sXG4gICAgICB0ZXh0OiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgfV0pO1xuICB9XG5cbiAgdXBkYXRlKGVkaXRvcikge1xuXG4gICAgY29uc3QgZWRpdG9yTWV0YSA9IHRoaXMubWFuYWdlci5nZXRFZGl0b3IoZWRpdG9yKTtcbiAgICBjb25zdCBmaWxlID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0ucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgLy8gY2hlY2sgaWYgdGhpcyBmaWxlIGlzIGV4Y2x1ZGVkIHZpYSBkb250TG9hZFxuICAgIGlmIChcbiAgICAgIHRoaXMubWFuYWdlci5zZXJ2ZXIgJiZcbiAgICAgIHRoaXMubWFuYWdlci5zZXJ2ZXIuZG9udExvYWQoZmlsZSlcbiAgICApIHtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpbGUgaXMgcmVnaXN0ZXJlZCwgZWxzZSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5maWxlcygpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgaWYgKGRhdGEuZmlsZXMpIHtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuZmlsZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIGRhdGEuZmlsZXNbaV0gPSBkYXRhLmZpbGVzW2ldLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZWdpc3RlcmVkID0gZGF0YS5maWxlcyAmJiBkYXRhLmZpbGVzLmluZGV4T2YoZmlsZSkgPiAtMTtcblxuICAgICAgaWYgKFxuICAgICAgICBlZGl0b3JNZXRhICYmXG4gICAgICAgIGVkaXRvck1ldGEuZGlmZnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgIHJlZ2lzdGVyZWRcbiAgICAgICkge1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVnaXN0ZXJlZCkge1xuXG4gICAgICAgIC8vIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICAgICAgLy8gaWYgYnVmZmVyLmdldE1heENoYXJhY3RlckluZGV4KCkgPiA1MDAwXG4gICAgICAgIC8vICAgc3RhcnQgPSAwXG4gICAgICAgIC8vICAgZW5kID0gMFxuICAgICAgICAvLyAgIHRleHQgPSAnJ1xuICAgICAgICAvLyAgIGZvciBkaWZmIGluIGVkaXRvck1ldGEuZGlmZnNcbiAgICAgICAgLy8gICAgIHN0YXJ0ID0gTWF0aC5tYXgoMCwgZGlmZi5vbGRSYW5nZS5zdGFydC5yb3cgLSA1MClcbiAgICAgICAgLy8gICAgIGVuZCA9IE1hdGgubWluKGJ1ZmZlci5nZXRMaW5lQ291bnQoKSwgZGlmZi5vbGRSYW5nZS5lbmQucm93ICsgNSlcbiAgICAgICAgLy8gICAgIHRleHQgPSBidWZmZXIuZ2V0VGV4dEluUmFuZ2UoW1tzdGFydCwgMF0sIFtlbmQsIGJ1ZmZlci5saW5lTGVuZ3RoRm9yUm93KGVuZCldXSlcbiAgICAgICAgLy8gICBwcm9taXNlID0gdGhpcy51cGRhdGVQYXJ0KGVkaXRvciwgZWRpdG9yTWV0YSwgc3RhcnQsIHRleHQpXG4gICAgICAgIC8vIGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRnVsbChlZGl0b3IsIGVkaXRvck1ldGEpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcblxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuYW1lKGZpbGUsIGVuZCwgbmV3TmFtZSkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ3JlbmFtZScsXG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGVuZDogZW5kLFxuICAgICAgICBuZXdOYW1lOiBuZXdOYW1lXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBsaW50KGZpbGUsIHRleHQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdsaW50JyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZmlsZXM6IFt7XG4gICAgICAgICAgdHlwZTogJ2Z1bGwnLFxuICAgICAgICAgIG5hbWU6IGZpbGUsXG4gICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdHlwZShlZGl0b3IsIHBvc2l0aW9uKSB7XG5cbiAgICBjb25zdCBmaWxlID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV07XG4gICAgY29uc3QgZW5kID0ge1xuXG4gICAgICBsaW5lOiBwb3NpdGlvbi5yb3csXG4gICAgICBjaDogcG9zaXRpb24uY29sdW1uXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICd0eXBlJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIHByZWZlckZ1bmN0aW9uOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZWZpbml0aW9uKCkge1xuXG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKTtcbiAgICBjb25zdCBmaWxlID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV07XG4gICAgY29uc3QgZW5kID0ge1xuXG4gICAgICBsaW5lOiBwb3NpdGlvbi5yb3csXG4gICAgICBjaDogcG9zaXRpb24uY29sdW1uXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdkZWZpbml0aW9uJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgIH1cblxuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgaWYgKGRhdGEgJiYgZGF0YS5zdGFydCkge1xuXG4gICAgICAgIGlmICh0aGlzLm1hbmFnZXIuaGVscGVyKSB7XG5cbiAgICAgICAgICB0aGlzLm1hbmFnZXIuaGVscGVyLnNldE1hcmtlckNoZWNrcG9pbnQoKTtcbiAgICAgICAgICB0aGlzLm1hbmFnZXIuaGVscGVyLm9wZW5GaWxlQW5kR29UbyhkYXRhLnN0YXJ0LCBkYXRhLmZpbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfSk7XG4gIH1cblxuICBmaWxlcygpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdmaWxlcydcbiAgICAgIH1cblxuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSk7XG4gIH1cblxuICBwb3N0KHR5cGUsIGRhdGEpIHtcblxuICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLm1hbmFnZXIuc2VydmVyLnJlcXVlc3QodHlwZSwgZGF0YSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-client.js
