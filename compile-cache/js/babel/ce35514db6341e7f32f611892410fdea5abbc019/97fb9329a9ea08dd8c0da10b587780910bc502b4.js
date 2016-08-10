Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

'use babel';

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.bootstrap();
    this.disposables = new _atom.CompositeDisposable();

    this.disposables.add(atom.commands.add('atom-workspace', {
      'latex:build': function latexBuild() {
        return _this.composer.build();
      },
      'latex:clean': function latexClean() {
        return _this.composer.clean();
      },
      'latex:sync': function latexSync() {
        return _this.composer.sync();
      }
    }));

    this.disposables.add(atom.workspace.observeTextEditors(function (editor) {
      _this.disposables.add(editor.onDidSave(function () {
        // Let's play it safe; only trigger builds for the active editor.
        var activeEditor = atom.workspace.getActiveTextEditor();
        if (editor === activeEditor && atom.config.get('latex.buildOnSave')) {
          _this.composer.build();
        }
      }));
    }));
  },

  deactivate: function deactivate() {
    if (this.disposables) {
      this.disposables.dispose();
      delete this.disposables;
    }

    if (this.composer) {
      this.composer.destroy();
      delete this.composer;
    }

    if (global.latex) {
      delete global.latex;
    }
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.bootstrap();
    this.composer.setStatusBar(statusBar);
  },

  bootstrap: function bootstrap() {
    if (this.composer && global.latex) {
      return;
    }

    var Latex = require('./latex');
    var Composer = require('./composer');

    global.latex = new Latex();
    this.composer = new Composer();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFa0MsTUFBTTs7QUFGeEMsV0FBVyxDQUFBOztxQkFJSTtBQUNiLFVBQVEsRUFBQyxvQkFBRzs7O0FBQ1YsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2hCLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUE7O0FBRTVDLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3ZELG1CQUFhLEVBQUU7ZUFBTSxNQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUU7T0FBQTtBQUMxQyxtQkFBYSxFQUFFO2VBQU0sTUFBSyxRQUFRLENBQUMsS0FBSyxFQUFFO09BQUE7QUFDMUMsa0JBQVksRUFBRTtlQUFNLE1BQUssUUFBUSxDQUFDLElBQUksRUFBRTtPQUFBO0tBQ3pDLENBQUMsQ0FBQyxDQUFBOztBQUVILFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDL0QsWUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBTTs7QUFFMUMsWUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3pELFlBQUksTUFBTSxLQUFLLFlBQVksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0FBQ25FLGdCQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtTQUN0QjtPQUNGLENBQUMsQ0FBQyxDQUFBO0tBQ0osQ0FBQyxDQUFDLENBQUE7R0FDSjs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMxQixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7S0FDeEI7O0FBRUQsUUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdkIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCOztBQUVELFFBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNoQixhQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUE7S0FDcEI7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBQywwQkFBQyxTQUFTLEVBQUU7QUFDM0IsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2hCLFFBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBQ3RDOztBQUVELFdBQVMsRUFBQyxxQkFBRztBQUNYLFFBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTTtLQUFFOztBQUU3QyxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDaEMsUUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUV0QyxVQUFNLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUE7QUFDMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFBO0dBQy9CO0NBQ0YiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5ib290c3RyYXAoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnbGF0ZXg6YnVpbGQnOiAoKSA9PiB0aGlzLmNvbXBvc2VyLmJ1aWxkKCksXG4gICAgICAnbGF0ZXg6Y2xlYW4nOiAoKSA9PiB0aGlzLmNvbXBvc2VyLmNsZWFuKCksXG4gICAgICAnbGF0ZXg6c3luYyc6ICgpID0+IHRoaXMuY29tcG9zZXIuc3luYygpXG4gICAgfSkpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGVkaXRvci5vbkRpZFNhdmUoKCkgPT4ge1xuICAgICAgICAvLyBMZXQncyBwbGF5IGl0IHNhZmU7IG9ubHkgdHJpZ2dlciBidWlsZHMgZm9yIHRoZSBhY3RpdmUgZWRpdG9yLlxuICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgaWYgKGVkaXRvciA9PT0gYWN0aXZlRWRpdG9yICYmIGF0b20uY29uZmlnLmdldCgnbGF0ZXguYnVpbGRPblNhdmUnKSkge1xuICAgICAgICAgIHRoaXMuY29tcG9zZXIuYnVpbGQoKVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICB9KSlcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICBpZiAodGhpcy5kaXNwb3NhYmxlcykge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgIGRlbGV0ZSB0aGlzLmRpc3Bvc2FibGVzXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29tcG9zZXIpIHtcbiAgICAgIHRoaXMuY29tcG9zZXIuZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5jb21wb3NlclxuICAgIH1cblxuICAgIGlmIChnbG9iYWwubGF0ZXgpIHtcbiAgICAgIGRlbGV0ZSBnbG9iYWwubGF0ZXhcbiAgICB9XG4gIH0sXG5cbiAgY29uc3VtZVN0YXR1c0JhciAoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5ib290c3RyYXAoKVxuICAgIHRoaXMuY29tcG9zZXIuc2V0U3RhdHVzQmFyKHN0YXR1c0JhcilcbiAgfSxcblxuICBib290c3RyYXAgKCkge1xuICAgIGlmICh0aGlzLmNvbXBvc2VyICYmIGdsb2JhbC5sYXRleCkgeyByZXR1cm4gfVxuXG4gICAgY29uc3QgTGF0ZXggPSByZXF1aXJlKCcuL2xhdGV4JylcbiAgICBjb25zdCBDb21wb3NlciA9IHJlcXVpcmUoJy4vY29tcG9zZXInKVxuXG4gICAgZ2xvYmFsLmxhdGV4ID0gbmV3IExhdGV4KClcbiAgICB0aGlzLmNvbXBvc2VyID0gbmV3IENvbXBvc2VyKClcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/main.js
