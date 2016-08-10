(function() {
  var Type, TypeView;

  TypeView = require('./atom-ternjs-type-view');

  module.exports = Type = (function() {
    Type.prototype.view = null;

    Type.prototype.manager = null;

    Type.prototype.overlayDecoration = null;

    Type.prototype.marker = null;

    function Type(manager) {
      this.manager = manager;
      this.view = new TypeView();
      this.view.initialize(this);
      atom.views.getView(atom.workspace).appendChild(this.view);
    }

    Type.prototype.setPosition = function() {
      var editor;
      if (!this.marker) {
        editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
          return;
        }
        this.marker = typeof editor.getLastCursor === "function" ? editor.getLastCursor().getMarker() : void 0;
        if (!this.marker) {
          return;
        }
        return this.overlayDecoration = editor.decorateMarker(this.marker, {
          type: 'overlay',
          item: this.view,
          "class": 'atom-ternjs-type',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {
        return this.marker.setProperties({
          type: 'overlay',
          item: this.view,
          "class": 'atom-ternjs-type',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    };

    Type.prototype.destroyOverlay = function() {
      var _ref;
      if ((_ref = this.overlayDecoration) != null) {
        _ref.destroy();
      }
      this.overlayDecoration = null;
      return this.marker = null;
    };

    Type.prototype.queryType = function(editor, cursor) {
      var buffer, cancel, lineCount, may, may2, paramPosition, position, rangeBefore, rowStart, scopeDescriptor, skipCounter, skipCounter2, text, tmp, tolerance;
      if (cursor.destroyed) {
        return;
      }
      if (!this.manager.client) {
        return;
      }
      scopeDescriptor = cursor.getScopeDescriptor();
      if (scopeDescriptor.scopes.join().match(/comment/)) {
        this.destroyOverlay();
        return;
      }
      tolerance = 20;
      rowStart = 0;
      position = cursor.getBufferPosition();
      lineCount = editor.getLineCount();
      if (position.row - tolerance < 0) {
        rowStart = 0;
      } else {
        rowStart = position.row - tolerance;
      }
      buffer = editor.getBuffer();
      rangeBefore = false;
      tmp = false;
      may = 0;
      may2 = 0;
      skipCounter = 0;
      skipCounter2 = 0;
      paramPosition = 0;
      cancel = false;
      buffer.backwardsScanInRange(/\]|\[|\(|\)|\,|\{|\}/g, [[rowStart, 0], [position.row, position.column]], (function(_this) {
        return function(obj) {
          if (editor.scopeDescriptorForBufferPosition(obj.range.start).scopes.join().match(/string/)) {
            return;
          }
          if (obj.matchText === '}') {
            may++;
            return;
          }
          if (obj.matchText === ']') {
            if (tmp === false) {
              skipCounter2++;
            }
            may2++;
            return;
          }
          if (obj.matchText === '{') {
            if (!may) {
              rangeBefore = false;
              obj.stop();
              return;
            }
            may--;
            return;
          }
          if (obj.matchText === '[') {
            if (skipCounter2) {
              skipCounter2--;
            }
            if (!may2) {
              rangeBefore = false;
              obj.stop();
              return;
            }
            may2--;
            return;
          }
          if (obj.matchText === ')' && tmp === false) {
            skipCounter++;
            return;
          }
          if (obj.matchText === ',' && !skipCounter && !skipCounter2 && !may && !may2) {
            paramPosition++;
            return;
          }
          if (obj.matchText === ',') {
            return;
          }
          if (obj.matchText === '(' && skipCounter) {
            skipCounter--;
            return;
          }
          if (skipCounter || skipCounter2) {
            return;
          }
          if (obj.matchText === '(' && tmp === false) {
            rangeBefore = obj.range;
            obj.stop();
            return;
          }
          return tmp = obj.matchText;
        };
      })(this));
      if (!rangeBefore) {
        this.destroyOverlay();
        return;
      }
      text = buffer.getTextInRange([[rangeBefore.start.row, 0], [rangeBefore.start.row, rangeBefore.start.column]]);
      return this.manager.client.update(editor).then((function(_this) {
        return function(data) {
          if (data.isQueried) {
            return;
          }
          return _this.manager.client.type(editor, rangeBefore.start).then(function(data) {
            var offsetFix, params, type;
            if (!data || data.type === '?' || !data.exprName) {
              _this.destroyOverlay();
              return;
            }
            type = _this.manager.helper.prepareType(data);
            params = _this.manager.helper.extractParams(type);
            _this.manager.helper.formatType(data);
            if (params != null ? params[paramPosition] : void 0) {
              offsetFix = paramPosition > 0 ? ' ' : '';
              data.type = data.type.replace(params[paramPosition], offsetFix + ("<span class=\"current-param\">" + params[paramPosition] + "</span>"));
            }
            _this.view.setData({
              label: data.type
            });
            return _this.setPosition();
          });
        };
      })(this));
    };

    Type.prototype.destroy = function() {
      var _ref;
      this.destroyOverlay();
      if ((_ref = this.view) != null) {
        _ref.destroy();
      }
      return this.view = null;
    };

    return Type;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEseUJBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLG1CQUFBLElBQUEsR0FBTSxJQUFOLENBQUE7O0FBQUEsbUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSxtQkFFQSxpQkFBQSxHQUFtQixJQUZuQixDQUFBOztBQUFBLG1CQUdBLE1BQUEsR0FBUSxJQUhSLENBQUE7O0FBS2EsSUFBQSxjQUFDLE9BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxRQUFBLENBQUEsQ0FGWixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsV0FBbkMsQ0FBK0MsSUFBQyxDQUFBLElBQWhELENBTEEsQ0FEVztJQUFBLENBTGI7O0FBQUEsbUJBYUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsTUFBQTtBQUFBLE1BQUEsSUFBRyxDQUFBLElBQUUsQ0FBQSxNQUFMO0FBQ0UsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUNBLFFBQUEsSUFBQSxDQUFBLE1BQUE7QUFBQSxnQkFBQSxDQUFBO1NBREE7QUFBQSxRQUVB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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-type.coffee
