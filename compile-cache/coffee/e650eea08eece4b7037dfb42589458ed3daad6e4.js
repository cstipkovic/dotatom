(function() {
  var Helper, fs, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  module.exports = Helper = (function() {
    Helper.prototype.projectRoot = null;

    Helper.prototype.manager = null;

    Helper.prototype.accessKey = 'altKey';

    Helper.prototype.platform = {
      darwin: false,
      linux: false,
      windows: false
    };

    Helper.prototype.checkpointsDefinition = [];

    Helper.prototype.tags = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };

    function Helper(manager) {
      this.replaceTag = __bind(this.replaceTag, this);
      this.manager = manager;
      this.initPlatform();
    }

    Helper.prototype.initPlatform = function() {
      var classList;
      classList = document.getElementsByTagName('body')[0].classList.toString();
      this.platform.darwin = classList.indexOf('platform-darwin') > -1;
      this.platform.linux = classList.indexOf('platform-linux') > -1;
      return this.platform.windows = classList.indexOf('platform-win') > -1;
    };

    Helper.prototype.updateTernFile = function(content, restartServer) {
      var _ref;
      this.projectRoot = (_ref = this.manager.server) != null ? _ref.projectDir : void 0;
      if (!this.projectRoot) {
        return;
      }
      return this.writeFile(path.resolve(__dirname, this.projectRoot + '/.tern-project'), content, restartServer);
    };

    Helper.prototype.fileExists = function(path) {
      var e;
      try {
        return fs.accessSync(path, fs.F_OK, (function(_this) {
          return function(err) {
            return console.log(err);
          };
        })(this));
      } catch (_error) {
        e = _error;
        return false;
      }
    };

    Helper.prototype.isDirectory = function(dir) {
      try {
        return fs.statSync(dir).isDirectory();
      } catch (_error) {
        return false;
      }
    };

    Helper.prototype.writeFile = function(filePath, content, restartServer) {
      return fs.writeFile(filePath, content, (function(_this) {
        return function(err) {
          var message;
          atom.workspace.open(filePath);
          if (!err && restartServer) {
            _this.manager.restartServer();
          }
          if (!err) {
            return;
          }
          message = 'Could not create/update .tern-project file. Use the README to manually create a .tern-project file.';
          return atom.notifications.addInfo(message, {
            dismissable: true
          });
        };
      })(this));
    };

    Helper.prototype.readFile = function(path) {
      return fs.readFileSync(path, 'utf8');
    };

    Helper.prototype.getFileContent = function(filePath, projectRoot) {
      var resolvedPath, _ref;
      this.projectRoot = (_ref = this.manager.server) != null ? _ref.projectDir : void 0;
      if (!this.projectRoot) {
        return false;
      }
      if (projectRoot) {
        filePath = this.projectRoot + filePath;
      }
      resolvedPath = path.resolve(__dirname, filePath);
      if (this.fileExists(resolvedPath) !== void 0) {
        return false;
      }
      return this.readFile(resolvedPath);
    };

    Helper.prototype.markerCheckpointBack = function() {
      var checkpoint;
      if (!this.checkpointsDefinition.length) {
        return;
      }
      checkpoint = this.checkpointsDefinition.pop();
      return this.openFileAndGoToPosition(checkpoint.marker.getRange().start, checkpoint.editor.getURI());
    };

    Helper.prototype.setMarkerCheckpoint = function() {
      var buffer, cursor, editor, marker;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      cursor = editor.getLastCursor();
      if (!cursor) {
        return;
      }
      marker = buffer.markPosition(cursor.getBufferPosition(), {});
      return this.checkpointsDefinition.push({
        marker: marker,
        editor: editor
      });
    };

    Helper.prototype.openFileAndGoToPosition = function(position, file) {
      return atom.workspace.open(file).then(function(textEditor) {
        var buffer, cursor;
        buffer = textEditor.getBuffer();
        cursor = textEditor.getLastCursor();
        return cursor.setBufferPosition(position);
      });
    };

    Helper.prototype.openFileAndGoTo = function(start, file) {
      return atom.workspace.open(file).then((function(_this) {
        return function(textEditor) {
          var buffer, cursor;
          buffer = textEditor.getBuffer();
          cursor = textEditor.getLastCursor();
          cursor.setBufferPosition(buffer.positionForCharacterIndex(start));
          return _this.markDefinitionBufferRange(cursor, textEditor);
        };
      })(this));
    };

    Helper.prototype.replaceTag = function(tag) {
      return this.tags[tag];
    };

    Helper.prototype.replaceTags = function(str) {
      if (!str) {
        return '';
      }
      return str.replace(/[&<>]/g, this.replaceTag);
    };

    Helper.prototype.formatType = function(data) {
      if (!data.type) {
        return '';
      }
      data.type = data.type.replace(/->/g, ':').replace('<top>', 'window');
      if (!data.exprName) {
        return data.type;
      }
      return data.type = data.type.replace(/^fn/, data.exprName);
    };

    Helper.prototype.prepareType = function(data) {
      var type;
      if (!data.type) {
        return;
      }
      return type = data.type.replace(/->/g, ':').replace('<top>', 'window');
    };

    Helper.prototype.formatTypeCompletion = function(obj) {
      var params, _ref;
      if (obj.isKeyword) {
        obj._typeSelf = 'keyword';
      }
      if (!obj.type) {
        return obj;
      }
      if (!obj.type.startsWith('fn')) {
        obj._typeSelf = 'variable';
      }
      if (obj.type === 'string') {
        obj.name = (_ref = obj.name) != null ? _ref.replace(/(^"|"$)/g, '') : void 0;
      }
      obj.type = obj.rightLabel = this.prepareType(obj);
      if (obj.type.replace(/fn\(.+\)/, '').length === 0) {
        obj.leftLabel = '';
      } else {
        if (obj.type.indexOf('fn') === -1) {
          obj.leftLabel = obj.type;
        } else {
          obj.leftLabel = obj.type.replace(/fn\(.{0,}\)/, '').replace(' : ', '');
        }
      }
      if (obj.rightLabel.startsWith('fn')) {
        params = this.extractParams(obj.rightLabel);
        if (this.manager.packageConfig.options.useSnippets || this.manager.packageConfig.options.useSnippetsAndFunction) {
          obj._snippet = this.buildSnippet(params, obj.name);
          obj._hasParams = params.length ? true : false;
        } else {
          obj._snippet = params.length ? "" + obj.name + "(${" + 0 + ":" + "})" : "" + obj.name + "()";
          obj._displayText = this.buildDisplayText(params, obj.name);
        }
        obj._typeSelf = 'function';
      }
      if (obj.name) {
        if (obj.leftLabel === obj.name) {
          obj.leftLabel = null;
          obj.rightLabel = null;
        }
      }
      if (obj.leftLabel === obj.rightLabel) {
        obj.rightLabel = null;
      }
      return obj;
    };

    Helper.prototype.buildDisplayText = function(params, name) {
      var i, param, suggestionParams, _i, _len;
      if (params.length === 0) {
        return "" + name + "()";
      }
      suggestionParams = [];
      for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
        param = params[i];
        param = param.replace('}', '\\}');
        suggestionParams.push("" + param);
      }
      return "" + name + "(" + (suggestionParams.join(',')) + ")";
    };

    Helper.prototype.buildSnippet = function(params, name) {
      var i, param, suggestionParams, _i, _len;
      if (params.length === 0) {
        return "" + name + "()";
      }
      suggestionParams = [];
      for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
        param = params[i];
        param = param.replace('}', '\\}');
        suggestionParams.push("${" + (i + 1) + ":" + param + "}");
      }
      return "" + name + "(" + (suggestionParams.join(',')) + ")";
    };

    Helper.prototype.extractParams = function(type) {
      var i, inside, param, params, start, _i, _ref;
      if (!type) {
        return [];
      }
      start = type.indexOf('(') + 1;
      params = [];
      inside = 0;
      for (i = _i = start, _ref = type.length - 1; start <= _ref ? _i <= _ref : _i >= _ref; i = start <= _ref ? ++_i : --_i) {
        if (type[i] === ':' && inside === -1) {
          params.push(type.substring(start, i - 2));
          break;
        }
        if (i === type.length - 1) {
          param = type.substring(start, i);
          if (param.length) {
            params.push(param);
          }
          break;
        }
        if (type[i] === ',' && inside === 0) {
          params.push(type.substring(start, i));
          start = i + 1;
          continue;
        }
        if (type[i].match(/[{\[\(]/)) {
          inside++;
          continue;
        }
        if (type[i].match(/[}\]\)]/)) {
          inside--;
        }
      }
      return params;
    };

    Helper.prototype.markDefinitionBufferRange = function(cursor, editor) {
      var decoration, marker, range;
      range = cursor.getCurrentWordBufferRange();
      marker = editor.markBufferRange(range, {
        invalidate: 'touch'
      });
      decoration = editor.decorateMarker(marker, {
        type: 'highlight',
        "class": 'atom-ternjs-definition-marker',
        invalidate: 'touch'
      });
      setTimeout((function() {
        return decoration != null ? decoration.setProperties({
          type: 'highlight',
          "class": 'atom-ternjs-definition-marker active',
          invalidate: 'touch'
        }) : void 0;
      }), 1);
      setTimeout((function() {
        return decoration != null ? decoration.setProperties({
          type: 'highlight',
          "class": 'atom-ternjs-definition-marker',
          invalidate: 'touch'
        }) : void 0;
      }), 1501);
      return setTimeout((function() {
        return marker.destroy();
      }), 2500);
    };

    Helper.prototype.focusEditor = function() {
      var editor, view;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      view = atom.views.getView(editor);
      return view != null ? typeof view.focus === "function" ? view.focus() : void 0 : void 0;
    };

    Helper.prototype.destroy = function() {
      var checkpoint, _i, _len, _ref, _ref1, _results;
      _ref = this.checkpointsDefinition;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        checkpoint = _ref[_i];
        _results.push((_ref1 = checkpoint.marker) != null ? _ref1.destroy() : void 0);
      }
      return _results;
    };

    return Helper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixxQkFBQSxXQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLHFCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEscUJBRUEsU0FBQSxHQUFXLFFBRlgsQ0FBQTs7QUFBQSxxQkFHQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSxLQUFSO0FBQUEsTUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLE1BRUEsT0FBQSxFQUFTLEtBRlQ7S0FKRixDQUFBOztBQUFBLHFCQU9BLHFCQUFBLEdBQXVCLEVBUHZCLENBQUE7O0FBQUEscUJBUUEsSUFBQSxHQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssT0FBTDtBQUFBLE1BQ0EsR0FBQSxFQUFLLE1BREw7QUFBQSxNQUVBLEdBQUEsRUFBSyxNQUZMO0tBVEYsQ0FBQTs7QUFhYSxJQUFBLGdCQUFDLE9BQUQsR0FBQTtBQUNYLHFEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBLENBREEsQ0FEVztJQUFBLENBYmI7O0FBQUEscUJBaUJBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixV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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-helper.coffee
