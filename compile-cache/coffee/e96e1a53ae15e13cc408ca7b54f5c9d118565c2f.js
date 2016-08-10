(function() {
  var Point, Range, Rename, RenameView, path, _, _ref;

  RenameView = require('./atom-ternjs-rename-view');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Rename = (function() {
    Rename.prototype.renameView = null;

    Rename.prototype.manager = null;

    function Rename(manager, state) {
      if (state == null) {
        state = {};
      }
      this.manager = manager;
      this.renameView = new RenameView();
      this.renameView.initialize(this);
      this.renamePanel = atom.workspace.addBottomPanel({
        item: this.renameView,
        priority: 0
      });
      this.renamePanel.hide();
      atom.views.getView(this.renamePanel).classList.add('atom-ternjs-rename-panel', 'panel-bottom');
    }

    Rename.prototype.hide = function() {
      var _ref1;
      if (!((_ref1 = this.renamePanel) != null ? _ref1.isVisible() : void 0)) {
        return;
      }
      this.renamePanel.hide();
      return this.manager.helper.focusEditor();
    };

    Rename.prototype.show = function() {
      var codeEditor, currentName, currentNameRange;
      codeEditor = atom.workspace.getActiveTextEditor();
      currentNameRange = codeEditor.getLastCursor().getCurrentWordBufferRange({
        includeNonWordCharacters: false
      });
      currentName = codeEditor.getTextInBufferRange(currentNameRange);
      this.renameView.nameEditor.getModel().setText(currentName);
      this.renameView.nameEditor.getModel().selectAll();
      this.renamePanel.show();
      return this.renameView.nameEditor.focus();
    };

    Rename.prototype.updateAllAndRename = function(newName) {
      var editor, editors, idx, _i, _len, _results;
      if (!this.manager.client) {
        return;
      }
      idx = 0;
      editors = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        if (!this.manager.isValidEditor(editor)) {
          idx++;
          continue;
        }
        if (atom.project.relativizePath(editor.getURI())[0] !== this.manager.client.projectDir) {
          idx++;
          continue;
        }
        _results.push(this.manager.client.update(editor).then((function(_this) {
          return function(data) {
            var cursor, position;
            if (data.isQueried) {
              return;
            }
            if (++idx === editors.length) {
              editor = atom.workspace.getActiveTextEditor();
              cursor = editor.getLastCursor();
              if (!cursor) {
                return;
              }
              position = cursor.getBufferPosition();
              return _this.manager.client.rename(atom.project.relativizePath(editor.getURI())[1], {
                line: position.row,
                ch: position.column
              }, newName).then(function(data) {
                if (!data) {
                  return;
                }
                return _this.rename(data);
              }, function(err) {
                var content;
                content = "atom-ternjs<br />" + err.responseText;
                return atom.notifications.addError(content, {
                  dismissable: false
                });
              });
            }
          };
        })(this)));
      }
      return _results;
    };

    Rename.prototype.rename = function(obj) {
      var arr, arrObj, change, changes, currentFile, dir, idx, translateColumnBy, _i, _j, _k, _len, _len1, _len2, _ref1, _results;
      dir = this.manager.server.projectDir;
      if (!dir) {
        return;
      }
      translateColumnBy = obj.changes[0].text.length - obj.name.length;
      _ref1 = obj.changes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        change = _ref1[_i];
        change.file = change.file.replace(/^.\//, '');
        change.file = path.resolve(atom.project.relativizePath(dir)[0], change.file);
      }
      changes = _.uniq(obj.changes, (function(_this) {
        return function(item) {
          return JSON.stringify(item);
        };
      })(this));
      currentFile = false;
      arr = [];
      idx = 0;
      for (_j = 0, _len1 = changes.length; _j < _len1; _j++) {
        change = changes[_j];
        if (currentFile !== change.file) {
          currentFile = change.file;
          idx = (arr.push([])) - 1;
        }
        arr[idx].push(change);
      }
      _results = [];
      for (_k = 0, _len2 = arr.length; _k < _len2; _k++) {
        arrObj = arr[_k];
        _results.push(this.openFilesAndRename(arrObj, translateColumnBy));
      }
      return _results;
    };

    Rename.prototype.openFilesAndRename = function(obj, translateColumnBy) {
      return atom.workspace.open(obj[0].file).then((function(_this) {
        return function(textEditor) {
          var buffer, change, currentColumnOffset, i, _i, _len, _results;
          currentColumnOffset = 0;
          buffer = textEditor.getBuffer();
          _results = [];
          for (i = _i = 0, _len = obj.length; _i < _len; i = ++_i) {
            change = obj[i];
            _this.setTextInRange(buffer, change, currentColumnOffset, i === obj.length - 1, textEditor);
            _results.push(currentColumnOffset += translateColumnBy);
          }
          return _results;
        };
      })(this));
    };

    Rename.prototype.setTextInRange = function(buffer, change, offset, moveCursor, textEditor) {
      var end, length, position, range, _ref1;
      change.start += offset;
      change.end += offset;
      position = buffer.positionForCharacterIndex(change.start);
      length = change.end - change.start;
      end = position.translate(new Point(0, length));
      range = new Range(position, end);
      buffer.setTextInRange(range, change.text);
      if (!moveCursor) {
        return;
      }
      return (_ref1 = textEditor.getLastCursor()) != null ? _ref1.setBufferPosition(position) : void 0;
    };

    Rename.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.renameView) != null) {
        _ref1.destroy();
      }
      this.renameView = null;
      if ((_ref2 = this.renamePanel) != null) {
        _ref2.destroy();
      }
      return this.renamePanel = null;
    };

    return Rename;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVuYW1lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQ0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsMkJBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRFIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixxQkFBQSxVQUFBLEdBQVksSUFBWixDQUFBOztBQUFBLHFCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBR2EsSUFBQSxnQkFBQyxPQUFELEVBQVUsS0FBVixHQUFBOztRQUFVLFFBQVE7T0FDN0I7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBQSxDQUZsQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBdUIsSUFBdkIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxVQUFQO0FBQUEsUUFBbUIsUUFBQSxFQUFVLENBQTdCO09BQTlCLENBSmYsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQUEsQ0FM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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-rename.coffee
