(function() {
  var Client;

  module.exports = Client = (function() {
    Client.prototype.port = null;

    Client.prototype.manager = null;

    Client.prototype.projectDir = null;

    function Client(manager, projectDir) {
      this.manager = manager;
      this.projectDir = projectDir;
    }

    Client.prototype.completions = function(file, end) {
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
    };

    Client.prototype.documentation = function(file, end) {
      return this.post('query', {
        query: {
          type: 'documentation',
          file: file,
          end: end
        }
      });
    };

    Client.prototype.refs = function(file, end) {
      return this.post('query', {
        query: {
          type: 'refs',
          file: file,
          end: end
        }
      });
    };

    Client.prototype.updateFull = function(editor, editorMeta) {
      if (editorMeta != null) {
        editorMeta.diffs = [];
      }
      return this.post('query', {
        files: [
          {
            type: 'full',
            name: atom.project.relativizePath(editor.getURI())[1],
            text: editor.getText()
          }
        ]
      });
    };

    Client.prototype.updatePart = function(editor, editorMeta, start, text) {
      if (editorMeta != null) {
        editorMeta.diffs = [];
      }
      return this.post('query', {
        files: [
          {
            type: 'part',
            name: atom.project.relativizePath(editor.getURI())[1],
            offset: {
              line: start,
              ch: 0
            },
            text: editor.getText()
          }
        ]
      });
    };

    Client.prototype.update = function(editor) {
      var editorMeta, file, _ref;
      editorMeta = this.manager.getEditor(editor);
      file = atom.project.relativizePath(editor.getURI())[1].replace(/\\/g, '/');
      if ((_ref = this.manager.server) != null ? _ref.dontLoad(file) : void 0) {
        return Promise.resolve({});
      }
      return this.files().then((function(_this) {
        return function(data) {
          var buffer, promise, registered;
          registered = data.files.indexOf(file) > -1;
          if (editorMeta && editorMeta.diffs.length === 0 && registered) {
            return Promise.resolve({});
          }
          if (registered) {
            buffer = editor.getBuffer();
            return promise = _this.updateFull(editor, editorMeta);
          } else {
            return Promise.resolve({});
          }
        };
      })(this), function(err) {
        return console.log(err);
      });
    };

    Client.prototype.rename = function(file, end, newName) {
      return this.post('query', {
        query: {
          type: 'rename',
          file: file,
          end: end,
          newName: newName
        }
      });
    };

    Client.prototype.lint = function(file, text) {
      return this.post('query', {
        query: {
          type: 'lint',
          file: file,
          files: [
            {
              type: 'full',
              name: file,
              text: text
            }
          ]
        }
      });
    };

    Client.prototype.type = function(editor, position) {
      var end, file;
      file = atom.project.relativizePath(editor.getURI())[1];
      end = {
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
    };

    Client.prototype.definition = function() {
      var cursor, editor, end, file, position;
      editor = atom.workspace.getActiveTextEditor();
      cursor = editor.getLastCursor();
      position = cursor.getBufferPosition();
      file = atom.project.relativizePath(editor.getURI())[1];
      end = {
        line: position.row,
        ch: position.column
      };
      return this.post('query', {
        query: {
          type: 'definition',
          file: file,
          end: end
        }
      }).then((function(_this) {
        return function(data) {
          var _ref, _ref1;
          if (data != null ? data.start : void 0) {
            if ((_ref = _this.manager.helper) != null) {
              _ref.setMarkerCheckpoint();
            }
            return (_ref1 = _this.manager.helper) != null ? _ref1.openFileAndGoTo(data.start, data.file) : void 0;
          }
        };
      })(this), function(err) {
        return console.log(err);
      });
    };

    Client.prototype.files = function() {
      return this.post('query', {
        query: {
          type: 'files'
        }
      }).then((function(_this) {
        return function(data) {
          return data;
        };
      })(this));
    };

    Client.prototype.post = function(type, data) {
      var promise;
      promise = this.manager.server.request(type, data);
      return promise;
    };

    return Client;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY2xpZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHFCQUFBLElBQUEsR0FBTSxJQUFOLENBQUE7O0FBQUEscUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSxxQkFFQSxVQUFBLEdBQVksSUFGWixDQUFBOztBQUlhLElBQUEsZ0JBQUMsT0FBRCxFQUFVLFVBQVYsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsVUFEZCxDQURXO0lBQUEsQ0FKYjs7QUFBQSxxQkFRQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sR0FBUCxHQUFBO2FBQ1gsSUFBQyxDQUFBLElBQUQsQ0FBTSxPQUFOLEVBQWU7QUFBQSxRQUFBLEtBQUEsRUFDYjtBQUFBLFVBQUEsSUFBQSxFQUFNLGFBQU47QUFBQSxVQUNBLElBQUEsRUFBTSxJQUROO0FBQUEsVUFFQSxHQUFBLEVBQUssR0FGTDtBQUFBLFVBR0EsS0FBQSxFQUFPLElBSFA7QUFBQSxVQUlBLGVBQUEsRUFBaUIsSUFKakI7QUFBQSxVQUtBLElBQUEsRUFBTSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFMckM7QUFBQSxVQU1BLEtBQUEsRUFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FOdEM7QUFBQSxVQU9BLElBQUEsRUFBTSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsYUFQckM7QUFBQSxVQVFBLElBQUEsRUFB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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-client.coffee
