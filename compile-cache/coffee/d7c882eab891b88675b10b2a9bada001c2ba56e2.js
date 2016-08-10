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
      return this.post(JSON.stringify({
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
      }));
    };

    Client.prototype.documentation = function(file, end) {
      return this.post(JSON.stringify({
        query: {
          type: 'documentation',
          file: file,
          end: end
        }
      }));
    };

    Client.prototype.refs = function(file, end) {
      return this.post(JSON.stringify({
        query: {
          type: 'refs',
          file: file,
          end: end
        }
      }));
    };

    Client.prototype.update = function(editor) {
      var _editor;
      _editor = this.manager.getEditor(editor);
      return this.files().then((function(_this) {
        return function(data) {
          var promise, registered;
          registered = data.files.indexOf(atom.project.relativizePath(editor.getURI())[1].replace(/\\/g, '/')) > -1;
          if (_editor && _editor.diffs.length === 0 && registered) {
            return Promise.resolve({});
          }
          if (_editor != null) {
            _editor.diffs = [];
          }
          promise = _this.post(JSON.stringify({
            files: [
              {
                type: 'full',
                name: atom.project.relativizePath(editor.getURI())[1],
                text: editor.getText()
              }
            ]
          }));
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
      return this.post(JSON.stringify({
        query: {
          type: 'rename',
          file: file,
          end: end,
          newName: newName
        }
      }));
    };

    Client.prototype.lint = function(file, text) {
      return this.post(JSON.stringify({
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
      }));
    };

    Client.prototype.type = function(editor, position) {
      var end, file;
      file = atom.project.relativizePath(editor.getURI())[1];
      end = {
        line: position.row,
        ch: position.column
      };
      return this.post(JSON.stringify({
        query: {
          type: 'type',
          file: file,
          end: end,
          preferFunction: true
        }
      }));
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
      return this.post(JSON.stringify({
        query: {
          type: 'definition',
          file: file,
          end: end
        }
      })).then((function(_this) {
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
      return this.post(JSON.stringify({
        query: {
          type: 'files'
        }
      })).then((function(_this) {
        return function(data) {
          return data;
        };
      })(this));
    };

    Client.prototype.post = function(data) {
      return fetch("http://localhost:" + this.port, {
        method: 'post',
        body: data
      }).then(function(response) {
        if (response.ok) {
          return response.json().then(function(data) {
            return data || {};
          });
        }
      });
    };

    return Client;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY2xpZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHFCQUFBLElBQUEsR0FBTSxJQUFOLENBQUE7O0FBQUEscUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSxxQkFFQSxVQUFBLEdBQVksSUFGWixDQUFBOztBQUlhLElBQUEsZ0JBQUMsT0FBRCxFQUFVLFVBQVYsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsVUFEZCxDQURXO0lBQUEsQ0FKYjs7QUFBQSxxQkFRQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sR0FBUCxHQUFBO2FBQ1gsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFJLENBQUMsU0FBTCxDQUNKO0FBQUEsUUFBQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxhQUFOO0FBQUEsVUFDQSxJQUFBLEVBQU0sSUFETjtBQUFBLFVBRUEsR0FBQSxFQUFLLEdBRkw7QUFBQSxVQUdBLEtBQUEsRUFBTyxJQUhQO0FBQUEsVUFJQSxlQUFBLEVBQWlCLElBSmpCO0FBQUEsVUFLQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBTHJDO0FBQUEsVUFNQSxLQUFBLEVBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBTnRDO0FBQUEsVUFPQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBUHJDO0FBQUEsVUFR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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-client.coffee
