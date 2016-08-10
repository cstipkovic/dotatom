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

    Client.prototype.update = function(editor) {
      var file, _editor, _ref;
      _editor = this.manager.getEditor(editor);
      file = atom.project.relativizePath(editor.getURI())[1].replace(/\\/g, '/');
      if ((_ref = this.manager.server) != null ? _ref.dontLoad(file) : void 0) {
        return Promise.resolve({});
      }
      return this.files().then((function(_this) {
        return function(data) {
          var promise, registered;
          registered = data.files.indexOf(file) > -1;
          if (_editor && _editor.diffs.length === 0 && registered) {
            return Promise.resolve({});
          }
          if (_editor != null) {
            _editor.diffs = [];
          }
          promise = _this.post('query', {
            files: [
              {
                type: 'full',
                name: atom.project.relativizePath(editor.getURI())[1],
                text: editor.getText()
              }
            ]
          });
          if (registered) {
            return promise;
          } else {
            return Promise.resolve({
              isQueried: true
            });
          }
        };
      })(this));
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
