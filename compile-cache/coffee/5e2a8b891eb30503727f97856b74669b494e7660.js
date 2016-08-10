(function() {
  var Reference, ReferenceView, TextBuffer, fs, path, _;

  ReferenceView = require('./atom-ternjs-reference-view');

  fs = require('fs');

  _ = require('underscore-plus');

  path = require('path');

  TextBuffer = require('atom').TextBuffer;

  module.exports = Reference = (function() {
    Reference.prototype.reference = null;

    Reference.prototype.manager = null;

    Reference.prototype.references = [];

    function Reference(manager, state) {
      if (state == null) {
        state = {};
      }
      this.manager = manager;
      this.reference = new ReferenceView();
      this.reference.initialize(this);
      this.referencePanel = atom.workspace.addBottomPanel({
        item: this.reference,
        priority: 0
      });
      this.referencePanel.hide();
      atom.views.getView(this.referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom');
      this.registerEvents();
    }

    Reference.prototype.registerEvents = function() {
      var close;
      close = this.reference.getClose();
      return close.addEventListener('click', (function(_this) {
        return function(e) {
          var editor, view;
          _this.hide();
          editor = atom.workspace.getActiveTextEditor();
          if (!editor) {
            return;
          }
          view = atom.views.getView(editor);
          return view != null ? typeof view.focus === "function" ? view.focus() : void 0 : void 0;
        };
      })(this));
    };

    Reference.prototype.goToReference = function(idx) {
      var editor, ref;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      ref = this.references.refs[idx];
      return this.manager.helper.openFileAndGoTo(ref.start, ref.file);
    };

    Reference.prototype.findReference = function() {
      var cursor, editor, position;
      if (!this.manager.client) {
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      cursor = editor.getLastCursor();
      position = cursor.getBufferPosition();
      return this.manager.client.update(editor).then((function(_this) {
        return function(data) {
          if (data.isQueried) {
            return;
          }
          return _this.manager.client.refs(atom.project.relativizePath(editor.getURI())[1], {
            line: position.row,
            ch: position.column
          }).then(function(data) {
            var ref, _i, _len, _ref;
            if (!data) {
              atom.notifications.addInfo('No references found.', {
                dismissable: false
              });
              return;
            }
            _this.references = data;
            _ref = data.refs;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              ref = _ref[_i];
              ref.file = ref.file.replace(/^.\//, '');
              ref.file = path.resolve(atom.project.relativizePath(_this.manager.server.projectDir)[0], ref.file);
            }
            data.refs = _.uniq(data.refs, function(item) {
              return JSON.stringify(item);
            });
            data = _this.gatherMeta(data);
            _this.referencePanel.show();
            return _this.reference.buildItems(data);
          });
        };
      })(this));
    };

    Reference.prototype.gatherMeta = function(data) {
      var buffer, content, i, item, _i, _len, _ref;
      _ref = data.refs;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        content = fs.readFileSync(item.file, 'utf8');
        buffer = new TextBuffer({
          text: content
        });
        item.position = buffer.positionForCharacterIndex(item.start);
        item.lineText = buffer.lineForRow(item.position.row);
        item.lineText = item.lineText.replace(data.name, "<strong>" + data.name + "</strong>");
        buffer.destroy();
      }
      return data;
    };

    Reference.prototype.hide = function() {
      return this.referencePanel.hide();
    };

    Reference.prototype.show = function() {
      return this.referencePanel.show();
    };

    Reference.prototype.destroy = function() {
      var _ref, _ref1;
      if ((_ref = this.reference) != null) {
        _ref.destroy();
      }
      this.reference = null;
      if ((_ref1 = this.referencePanel) != null) {
        _ref1.destroy();
      }
      return this.referencePanel = null;
    };

    return Reference;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLDhCQUFSLENBQWhCLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBSkQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSix3QkFBQSxTQUFBLEdBQVcsSUFBWCxDQUFBOztBQUFBLHdCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEsd0JBRUEsVUFBQSxHQUFZLEVBRlosQ0FBQTs7QUFJYSxJQUFBLG1CQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7O1FBQVUsUUFBUTtPQUM3QjtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsYUFBQSxDQUFBLENBRmpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFTLENBQUMsVUFBWCxDQUFzQixJQUF0QixDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxTQUFQO0FBQUEsUUFBa0IsUUFBQSxFQUFVLENBQTVCO09B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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-reference.coffee
