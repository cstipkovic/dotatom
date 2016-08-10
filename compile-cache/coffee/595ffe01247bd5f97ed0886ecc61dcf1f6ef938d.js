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
      this.replaceTags = __bind(this.replaceTags, this);
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

    Helper.prototype.formatTypeCompletion = function(obj, isInFunDef) {
      var params, _ref, _ref1;
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
      } else {
        obj.name = (_ref1 = obj.name) != null ? _ref1.replace(/["']/g, '') : void 0;
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
          if (!isInFunDef) {
            obj._snippet = this.buildSnippet(params, obj.name);
          }
          obj._hasParams = params.length ? true : false;
        } else {
          if (!isInFunDef) {
            obj._snippet = params.length ? "" + obj.name + "(${" + 0 + ":" + "})" : "" + obj.name + "()";
          }
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
        param = param.replace(/'"/g, '');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixxQkFBQSxXQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLHFCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEscUJBRUEsU0FBQSxHQUFXLFFBRlgsQ0FBQTs7QUFBQSxxQkFHQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSxLQUFSO0FBQUEsTUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLE1BRUEsT0FBQSxFQUFTLEtBRlQ7S0FKRixDQUFBOztBQUFBLHFCQU9BLHFCQUFBLEdBQXVCLEVBUHZCLENBQUE7O0FBQUEscUJBUUEsSUFBQSxHQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssT0FBTDtBQUFBLE1BQ0EsR0FBQSxFQUFLLE1BREw7QUFBQSxNQUVBLEdBQUEsRUFBSyxNQUZMO0tBVEYsQ0FBQTs7QUFhYSxJQUFBLGdCQUFDLE9BQUQsR0FBQTtBQUNYLHVEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBLENBREEsQ0FEVztJQUFBLENBYmI7O0FBQUEscUJBaUJBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixV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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-helper.coffee
