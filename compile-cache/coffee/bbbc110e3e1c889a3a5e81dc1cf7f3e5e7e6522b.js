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
