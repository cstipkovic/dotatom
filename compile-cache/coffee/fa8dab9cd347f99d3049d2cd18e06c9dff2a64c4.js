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
                return atom.notifications.addError(err, {
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
          var buffer, change, checkpoint, currentColumnOffset, i, _i, _len;
          currentColumnOffset = 0;
          buffer = textEditor.getBuffer();
          checkpoint = buffer.createCheckpoint();
          for (i = _i = 0, _len = obj.length; _i < _len; i = ++_i) {
            change = obj[i];
            _this.setTextInRange(buffer, change, currentColumnOffset, i === obj.length - 1, textEditor);
            currentColumnOffset += translateColumnBy;
          }
          return buffer.groupChangesSinceCheckpoint(checkpoint);
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
