Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _builderRegistry = require('./builder-registry');

var _builderRegistry2 = _interopRequireDefault(_builderRegistry);

'use babel';

var Composer = (function () {
  function Composer() {
    _classCallCheck(this, Composer);

    this.builderRegistry = new _builderRegistry2['default']();
  }

  _createClass(Composer, [{
    key: 'destroy',
    value: function destroy() {
      this.destroyProgressIndicator();
      this.destroyErrorIndicator();
      this.destroyErrorMarkers();
    }
  }, {
    key: 'build',
    value: _asyncToGenerator(function* () {
      var _this = this;

      var _getEditorDetails = this.getEditorDetails();

      var editor = _getEditorDetails.editor;
      var filePath = _getEditorDetails.filePath;

      if (!filePath) {
        latex.log.warning('File needs to be saved to disk before it can be TeXified.');
        return Promise.reject(false);
      }

      var builder = this.getBuilder(filePath);
      if (builder == null) {
        latex.log.warning('No registered LaTeX builder can process ' + filePath + '.');
        return Promise.reject(false);
      }

      if (editor.isModified()) {
        editor.save(); // TODO: Make this configurable?
      }

      this.destroyErrorMarkers();
      this.destroyErrorIndicator();
      this.showProgressIndicator();

      return new Promise(_asyncToGenerator(function* (resolve, reject) {
        var rootFilePath = _this.resolveRootFilePath(filePath);
        var jobnames = builder.getJobNamesFromMagic(rootFilePath);
        for (var jobname of jobnames) {
          try {
            var statusCode = yield builder.run(rootFilePath, jobname);
            var result = builder.parseLogFile(rootFilePath, jobname);
            if (statusCode > 0 || !result || !result.outputFilePath) {
              _this.showError(statusCode, result, builder);
              reject(statusCode);
            } else {
              if (_this.shouldMoveResult()) {
                _this.moveResult(result, rootFilePath);
              }

              _this.showResult(result);
              resolve(statusCode);
            }
          } catch (error) {
            latex.log.error(error.message);
            reject(error.message);
          } finally {
            _this.destroyProgressIndicator();
          }
        }
      }));
    })
  }, {
    key: 'sync',
    value: function sync() {
      var _getEditorDetails2 = this.getEditorDetails();

      var filePath = _getEditorDetails2.filePath;
      var lineNumber = _getEditorDetails2.lineNumber;

      if (!filePath || !this.isTexFile(filePath)) {
        return;
      }

      var outputFilePath = this.resolveOutputFilePath(filePath);
      if (!outputFilePath) {
        latex.log.warning('Could not resolve path to output file associated with the current file.');
        return;
      }

      var opener = latex.getOpener();
      if (opener) {
        opener.open(outputFilePath, filePath, lineNumber);
      }
    }
  }, {
    key: 'clean',
    value: _asyncToGenerator(function* () {
      var _getEditorDetails3 = this.getEditorDetails();

      var filePath = _getEditorDetails3.filePath;

      if (!filePath || !this.isTexFile(filePath)) {
        return Promise.reject();
      }

      var rootFilePath = this.resolveRootFilePath(filePath);
      var rootPath = _path2['default'].dirname(rootFilePath);

      var outdir = atom.config.get('latex.outputDirectory');
      if (outdir) {
        rootPath = _path2['default'].join(rootPath, outdir);
      }

      var rootFile = _path2['default'].basename(rootFilePath);
      rootFile = rootFile.substring(0, rootFile.lastIndexOf('.'));

      var cleanExtensions = atom.config.get('latex.cleanExtensions');
      return Promise.all(cleanExtensions.map(_asyncToGenerator(function* (extension) {
        var candidatePath = _path2['default'].join(rootPath, rootFile + extension);
        return new Promise(_asyncToGenerator(function* (resolve) {
          _fsPlus2['default'].remove(candidatePath, function (error) {
            return resolve({ filePath: candidatePath, error: error });
          });
        }));
      })));
    })
  }, {
    key: 'setStatusBar',
    value: function setStatusBar(statusBar) {
      this.statusBar = statusBar;
    }
  }, {
    key: 'moveResult',
    value: function moveResult(result, filePath) {
      var originalOutputFilePath = result.outputFilePath;
      result.outputFilePath = this.alterParentPath(filePath, originalOutputFilePath);
      if (_fsPlus2['default'].existsSync(originalOutputFilePath)) {
        _fsPlus2['default'].removeSync(result.outputFilePath);
        _fsPlus2['default'].moveSync(originalOutputFilePath, result.outputFilePath);
      }

      var originalSyncFilePath = originalOutputFilePath.replace(/\.pdf$/, '.synctex.gz');
      if (_fsPlus2['default'].existsSync(originalSyncFilePath)) {
        var syncFilePath = this.alterParentPath(filePath, originalSyncFilePath);
        _fsPlus2['default'].removeSync(syncFilePath);
        _fsPlus2['default'].moveSync(originalSyncFilePath, syncFilePath);
      }
    }
  }, {
    key: 'resolveRootFilePath',
    value: function resolveRootFilePath(filePath) {
      var MasterTexFinder = require('./master-tex-finder');
      var finder = new MasterTexFinder(filePath);
      return finder.getMasterTexPath();
    }
  }, {
    key: 'resolveOutputFilePath',
    value: function resolveOutputFilePath(filePath) {
      var outputFilePath = undefined,
          rootFilePath = undefined;

      if (this.outputLookup) {
        outputFilePath = this.outputLookup[filePath];
      }

      if (!outputFilePath) {
        rootFilePath = this.resolveRootFilePath(filePath);

        var builder = this.getBuilder(rootFilePath);
        if (builder == null) {
          latex.log.warning('No registered LaTeX builder can process ' + rootFilePath + '.');
          return null;
        }

        var result = builder.parseLogFile(rootFilePath);
        if (!result || !result.outputFilePath) {
          latex.log.warning('Log file parsing failed!');
          return null;
        }

        this.outputLookup = this.outputLookup || {};
        this.outputLookup[filePath] = result.outputFilePath;
      }

      if (this.shouldMoveResult()) {
        outputFilePath = this.alterParentPath(rootFilePath, outputFilePath);
      }

      return outputFilePath;
    }
  }, {
    key: 'showResult',
    value: function showResult(result) {
      if (!this.shouldOpenResult()) {
        return;
      }

      var opener = latex.getOpener();
      if (opener) {
        var _getEditorDetails4 = this.getEditorDetails();

        var filePath = _getEditorDetails4.filePath;
        var lineNumber = _getEditorDetails4.lineNumber;

        opener.open(result.outputFilePath, filePath, lineNumber);
      }
    }
  }, {
    key: 'showError',
    value: function showError(statusCode, result, builder) {
      this.showErrorIndicator(result);
      this.showErrorMarkers(result);
      latex.log.error(statusCode, result, builder);
    }
  }, {
    key: 'showProgressIndicator',
    value: function showProgressIndicator() {
      if (!this.statusBar) {
        return null;
      }
      if (this.indicator) {
        return this.indicator;
      }

      var ProgressIndicator = require('./status-bar/progress-indicator');
      this.indicator = new ProgressIndicator();
      this.statusBar.addRightTile({
        item: this.indicator,
        priority: 9001
      });
    }
  }, {
    key: 'showErrorIndicator',
    value: function showErrorIndicator(result) {
      if (!this.statusBar) {
        return null;
      }
      if (this.errorIndicator) {
        return this.errorIndicator;
      }

      var ErrorIndicator = require('./status-bar/error-indicator');
      this.errorIndicator = new ErrorIndicator(result);
      this.statusBar.addRightTile({
        item: this.errorIndicator,
        priority: 9001
      });
    }
  }, {
    key: 'showErrorMarkers',
    value: function showErrorMarkers(result) {
      var _this2 = this;

      if (this.errorMarkers && this.errorMarkers.length > 0) {
        this.destroyErrorMarkers();
      }
      if (!result || !result.errors) {
        return;
      }

      var ErrorMarker = require('./error-marker');

      this.errorMarkers = [];

      var _loop = function (editor) {
        if (editor.getPath()) {
          var errors = _lodash2['default'].filter(result.errors, function (error) {
            return editor.getPath().includes(error.filePath);
          });
          var warnings = _lodash2['default'].filter(result.warnings, function (warning) {
            return editor.getPath().includes(warning.filePath);
          });
          if (errors.length || warnings.length) {
            _this2.errorMarkers.push(new ErrorMarker(editor, errors, warnings));
          }
        }
      };

      for (var editor of this.getAllEditors()) {
        _loop(editor);
      }
    }
  }, {
    key: 'destroyProgressIndicator',
    value: function destroyProgressIndicator() {
      if (this.indicator) {
        this.indicator.element.remove();
        this.indicator = null;
      }
    }
  }, {
    key: 'destroyErrorIndicator',
    value: function destroyErrorIndicator() {
      if (this.errorIndicator) {
        this.errorIndicator.element.remove();
        this.errorIndicator = null;
      }
    }
  }, {
    key: 'destroyErrorMarkers',
    value: function destroyErrorMarkers() {
      if (this.errorMarkers) {
        for (var errorMarker of this.errorMarkers) {
          errorMarker.clear();
          errorMarker = null;
        }
        this.errorMarkers = [];
      }
    }
  }, {
    key: 'isTexFile',
    value: function isTexFile(filePath) {
      // TODO: Improve will suffice for the time being.
      return !filePath || filePath.search(/\.(tex|lhs)$/) > 0;
    }
  }, {
    key: 'getBuilder',
    value: function getBuilder(filePath) {
      var BuilderImpl = this.builderRegistry.getBuilder(filePath);
      return BuilderImpl != null ? new BuilderImpl() : null;
    }
  }, {
    key: 'getEditorDetails',
    value: function getEditorDetails() {
      var editor = atom.workspace.getActiveTextEditor();
      var filePath = undefined,
          lineNumber = undefined;
      if (editor) {
        filePath = editor.getPath();
        lineNumber = editor.getCursorBufferPosition().row + 1;
      }

      return {
        editor: editor,
        filePath: filePath,
        lineNumber: lineNumber
      };
    }
  }, {
    key: 'getAllEditors',
    value: function getAllEditors() {
      return atom.workspace.getTextEditors();
    }
  }, {
    key: 'alterParentPath',
    value: function alterParentPath(targetPath, originalPath) {
      var targetDir = _path2['default'].dirname(targetPath);
      return _path2['default'].join(targetDir, _path2['default'].basename(originalPath));
    }
  }, {
    key: 'shouldMoveResult',
    value: function shouldMoveResult() {
      var moveResult = atom.config.get('latex.moveResultToSourceDirectory');
      var outputDirectory = atom.config.get('latex.outputDirectory');
      return moveResult && outputDirectory.length > 0;
    }
  }, {
    key: 'shouldOpenResult',
    value: function shouldOpenResult() {
      return atom.config.get('latex.openResultAfterBuild');
    }
  }]);

  return Composer;
})();

exports['default'] = Composer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OzsrQkFDSyxvQkFBb0I7Ozs7QUFMaEQsV0FBVyxDQUFBOztJQU9VLFFBQVE7QUFDZixXQURPLFFBQVEsR0FDWjswQkFESSxRQUFROztBQUV6QixRQUFJLENBQUMsZUFBZSxHQUFHLGtDQUFxQixDQUFBO0dBQzdDOztlQUhrQixRQUFROztXQUtuQixtQkFBRztBQUNULFVBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO0FBQy9CLFVBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0tBQzNCOzs7NkJBRVcsYUFBRzs7OzhCQUNjLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTs7VUFBM0MsTUFBTSxxQkFBTixNQUFNO1VBQUUsUUFBUSxxQkFBUixRQUFROztBQUV2QixVQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkRBQTJELENBQUMsQ0FBQTtBQUM5RSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN6QyxVQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7QUFDbkIsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLDhDQUE0QyxRQUFRLE9BQUksQ0FBQTtBQUN6RSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdkIsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2Q7O0FBRUQsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDMUIsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7O0FBRTVCLGFBQU8sSUFBSSxPQUFPLG1CQUFDLFdBQU8sT0FBTyxFQUFFLE1BQU0sRUFBSztBQUM1QyxZQUFNLFlBQVksR0FBRyxNQUFLLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3ZELFlBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUMzRCxhQUFLLElBQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUM5QixjQUFJO0FBQ0YsZ0JBQU0sVUFBVSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDM0QsZ0JBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzFELGdCQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQ3ZELG9CQUFLLFNBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzNDLG9CQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7YUFDbkIsTUFBTTtBQUNMLGtCQUFJLE1BQUssZ0JBQWdCLEVBQUUsRUFBRTtBQUMzQixzQkFBSyxVQUFVLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFBO2VBQ3RDOztBQUVELG9CQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN2QixxQkFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2FBQ3BCO1dBQ0YsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGlCQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDOUIsa0JBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7V0FDdEIsU0FBUztBQUNSLGtCQUFLLHdCQUF3QixFQUFFLENBQUE7V0FDaEM7U0FDRjtPQUNGLEVBQUMsQ0FBQTtLQUNIOzs7V0FFSSxnQkFBRzsrQkFDeUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUEvQyxRQUFRLHNCQUFSLFFBQVE7VUFBRSxVQUFVLHNCQUFWLFVBQVU7O0FBQzNCLFVBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzFDLGVBQU07T0FDUDs7QUFFRCxVQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0QsVUFBSSxDQUFDLGNBQWMsRUFBRTtBQUNuQixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO0FBQzVGLGVBQU07T0FDUDs7QUFFRCxVQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDaEMsVUFBSSxNQUFNLEVBQUU7QUFDVixjQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUE7T0FDbEQ7S0FDRjs7OzZCQUVXLGFBQUc7K0JBQ00sSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUFuQyxRQUFRLHNCQUFSLFFBQVE7O0FBQ2YsVUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDMUMsZUFBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDeEI7O0FBRUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3ZELFVBQUksUUFBUSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTs7QUFFekMsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNyRCxVQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUN2Qzs7QUFFRCxVQUFJLFFBQVEsR0FBRyxrQkFBSyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDMUMsY0FBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTs7QUFFM0QsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNoRSxhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsbUJBQUMsV0FBTyxTQUFTLEVBQUs7QUFDMUQsWUFBTSxhQUFhLEdBQUcsa0JBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUE7QUFDL0QsZUFBTyxJQUFJLE9BQU8sbUJBQUMsV0FBTyxPQUFPLEVBQUs7QUFDcEMsOEJBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNsQyxtQkFBTyxPQUFPLENBQUMsRUFBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFBO1dBQ3hELENBQUMsQ0FBQTtTQUNILEVBQUMsQ0FBQTtPQUNILEVBQUMsQ0FBQyxDQUFBO0tBQ0o7OztXQUVZLHNCQUFDLFNBQVMsRUFBRTtBQUN2QixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtLQUMzQjs7O1dBRVUsb0JBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUM1QixVQUFNLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUE7QUFDcEQsWUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlFLFVBQUksb0JBQUcsVUFBVSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7QUFDekMsNEJBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNwQyw0QkFBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO09BQzNEOztBQUVELFVBQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQTtBQUNwRixVQUFJLG9CQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO0FBQ3ZDLFlBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUE7QUFDekUsNEJBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQzNCLDRCQUFHLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLENBQUMsQ0FBQTtPQUNoRDtLQUNGOzs7V0FFbUIsNkJBQUMsUUFBUSxFQUFFO0FBQzdCLFVBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQ3RELFVBQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzVDLGFBQU8sTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUE7S0FDakM7OztXQUVxQiwrQkFBQyxRQUFRLEVBQUU7QUFDL0IsVUFBSSxjQUFjLFlBQUE7VUFBRSxZQUFZLFlBQUEsQ0FBQTs7QUFFaEMsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLHNCQUFjLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3Qzs7QUFFRCxVQUFJLENBQUMsY0FBYyxFQUFFO0FBQ25CLG9CQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVqRCxZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQzdDLFlBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUNuQixlQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sOENBQTRDLFlBQVksT0FBSSxDQUFBO0FBQzdFLGlCQUFPLElBQUksQ0FBQTtTQUNaOztBQUVELFlBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDakQsWUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7QUFDckMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUM3QyxpQkFBTyxJQUFJLENBQUE7U0FDWjs7QUFFRCxZQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFBO0FBQzNDLFlBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQTtPQUNwRDs7QUFFRCxVQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO0FBQzNCLHNCQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUE7T0FDcEU7O0FBRUQsYUFBTyxjQUFjLENBQUE7S0FDdEI7OztXQUVVLG9CQUFDLE1BQU0sRUFBRTtBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7QUFBRSxlQUFNO09BQUU7O0FBRXhDLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUNoQyxVQUFJLE1BQU0sRUFBRTtpQ0FDcUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztZQUEvQyxRQUFRLHNCQUFSLFFBQVE7WUFBRSxVQUFVLHNCQUFWLFVBQVU7O0FBQzNCLGNBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUE7T0FDekQ7S0FDRjs7O1dBRVMsbUJBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDdEMsVUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQy9CLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM3QixXQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0tBQzdDOzs7V0FFcUIsaUNBQUc7QUFDdkIsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQTtPQUFFO0FBQ3BDLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtPQUFFOztBQUU3QyxVQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO0FBQ3BFLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFBO0FBQ3hDLFVBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO0FBQzFCLFlBQUksRUFBRSxJQUFJLENBQUMsU0FBUztBQUNwQixnQkFBUSxFQUFFLElBQUk7T0FDZixDQUFDLENBQUE7S0FDSDs7O1dBRWtCLDRCQUFDLE1BQU0sRUFBRTtBQUMxQixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFBO09BQUU7QUFDcEMsVUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsY0FBYyxDQUFBO09BQUU7O0FBRXZELFVBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0FBQzlELFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFDMUIsWUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjO0FBQ3pCLGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUMsQ0FBQTtLQUNIOzs7V0FFZ0IsMEJBQUMsTUFBTSxFQUFFOzs7QUFDeEIsVUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUFFLFlBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO09BQUU7QUFDckYsVUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFBRSxlQUFNO09BQUU7O0FBRXpDLFVBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBOztBQUU3QyxVQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQTs7NEJBQ1gsTUFBTTtBQUNmLFlBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ3BCLGNBQU0sTUFBTSxHQUFHLG9CQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQzlDLG1CQUFPLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1dBQ2pELENBQUMsQ0FBQTtBQUNGLGNBQU0sUUFBUSxHQUFHLG9CQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQUEsT0FBTyxFQUFJO0FBQ3BELG1CQUFPLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1dBQ25ELENBQUMsQ0FBQTtBQUNGLGNBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ3BDLG1CQUFLLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO1dBQ2xFO1NBQ0Y7OztBQVhILFdBQUssSUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO2NBQWhDLE1BQU07T0FZaEI7S0FDRjs7O1dBRXdCLG9DQUFHO0FBQzFCLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUMvQixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtPQUN0QjtLQUNGOzs7V0FFcUIsaUNBQUc7QUFDdkIsVUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3BDLFlBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFBO09BQzNCO0tBQ0Y7OztXQUVtQiwrQkFBRztBQUNyQixVQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckIsYUFBSyxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3pDLHFCQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDbkIscUJBQVcsR0FBRyxJQUFJLENBQUE7U0FDbkI7QUFDRCxZQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQTtPQUN2QjtLQUNGOzs7V0FFUyxtQkFBQyxRQUFRLEVBQUU7O0FBRW5CLGFBQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDeEQ7OztXQUVVLG9CQUFDLFFBQVEsRUFBRTtBQUNwQixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM3RCxhQUFPLEFBQUMsV0FBVyxJQUFJLElBQUksR0FBSSxJQUFJLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQTtLQUN4RDs7O1dBRWdCLDRCQUFHO0FBQ2xCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNuRCxVQUFJLFFBQVEsWUFBQTtVQUFFLFVBQVUsWUFBQSxDQUFBO0FBQ3hCLFVBQUksTUFBTSxFQUFFO0FBQ1YsZ0JBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDM0Isa0JBQVUsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO09BQ3REOztBQUVELGFBQU87QUFDTCxjQUFNLEVBQUUsTUFBTTtBQUNkLGdCQUFRLEVBQUUsUUFBUTtBQUNsQixrQkFBVSxFQUFFLFVBQVU7T0FDdkIsQ0FBQTtLQUNGOzs7V0FFYSx5QkFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtLQUN2Qzs7O1dBRWUseUJBQUMsVUFBVSxFQUFFLFlBQVksRUFBRTtBQUN6QyxVQUFNLFNBQVMsR0FBRyxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDMUMsYUFBTyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFLLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO0tBQ3pEOzs7V0FFZ0IsNEJBQUc7QUFDbEIsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtBQUN2RSxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2hFLGFBQU8sVUFBVSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FFZ0IsNEJBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUE7S0FBRTs7O1NBcFN6RCxRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9jb21wb3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyUmVnaXN0cnkgZnJvbSAnLi9idWlsZGVyLXJlZ2lzdHJ5J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb3NlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmJ1aWxkZXJSZWdpc3RyeSA9IG5ldyBCdWlsZGVyUmVnaXN0cnkoKVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5kZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKVxuICAgIHRoaXMuZGVzdHJveUVycm9ySW5kaWNhdG9yKClcbiAgICB0aGlzLmRlc3Ryb3lFcnJvck1hcmtlcnMoKVxuICB9XG5cbiAgYXN5bmMgYnVpbGQgKCkge1xuICAgIGNvbnN0IHtlZGl0b3IsIGZpbGVQYXRofSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpXG5cbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnRmlsZSBuZWVkcyB0byBiZSBzYXZlZCB0byBkaXNrIGJlZm9yZSBpdCBjYW4gYmUgVGVYaWZpZWQuJylcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChmYWxzZSlcbiAgICB9XG5cbiAgICBjb25zdCBidWlsZGVyID0gdGhpcy5nZXRCdWlsZGVyKGZpbGVQYXRoKVxuICAgIGlmIChidWlsZGVyID09IG51bGwpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBObyByZWdpc3RlcmVkIExhVGVYIGJ1aWxkZXIgY2FuIHByb2Nlc3MgJHtmaWxlUGF0aH0uYClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChmYWxzZSlcbiAgICB9XG5cbiAgICBpZiAoZWRpdG9yLmlzTW9kaWZpZWQoKSkge1xuICAgICAgZWRpdG9yLnNhdmUoKSAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlP1xuICAgIH1cblxuICAgIHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpXG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKVxuICAgIHRoaXMuc2hvd1Byb2dyZXNzSW5kaWNhdG9yKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgICBjb25zdCBqb2JuYW1lcyA9IGJ1aWxkZXIuZ2V0Sm9iTmFtZXNGcm9tTWFnaWMocm9vdEZpbGVQYXRoKVxuICAgICAgZm9yIChjb25zdCBqb2JuYW1lIG9mIGpvYm5hbWVzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgc3RhdHVzQ29kZSA9IGF3YWl0IGJ1aWxkZXIucnVuKHJvb3RGaWxlUGF0aCwgam9ibmFtZSlcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgsIGpvYm5hbWUpXG4gICAgICAgICAgaWYgKHN0YXR1c0NvZGUgPiAwIHx8ICFyZXN1bHQgfHwgIXJlc3VsdC5vdXRwdXRGaWxlUGF0aCkge1xuICAgICAgICAgICAgdGhpcy5zaG93RXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKVxuICAgICAgICAgICAgcmVqZWN0KHN0YXR1c0NvZGUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgICAgICAgICB0aGlzLm1vdmVSZXN1bHQocmVzdWx0LCByb290RmlsZVBhdGgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2hvd1Jlc3VsdChyZXN1bHQpXG4gICAgICAgICAgICByZXNvbHZlKHN0YXR1c0NvZGUpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGxhdGV4LmxvZy5lcnJvcihlcnJvci5tZXNzYWdlKVxuICAgICAgICAgIHJlamVjdChlcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMuZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzeW5jICgpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0NvdWxkIG5vdCByZXNvbHZlIHBhdGggdG8gb3V0cHV0IGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGZpbGUuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LmdldE9wZW5lcigpXG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgb3BlbmVyLm9wZW4ob3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNsZWFuICgpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpXG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuICAgIGxldCByb290UGF0aCA9IHBhdGguZGlybmFtZShyb290RmlsZVBhdGgpXG5cbiAgICBsZXQgb3V0ZGlyID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vdXRwdXREaXJlY3RvcnknKVxuICAgIGlmIChvdXRkaXIpIHtcbiAgICAgIHJvb3RQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBvdXRkaXIpXG4gICAgfVxuXG4gICAgbGV0IHJvb3RGaWxlID0gcGF0aC5iYXNlbmFtZShyb290RmlsZVBhdGgpXG4gICAgcm9vdEZpbGUgPSByb290RmlsZS5zdWJzdHJpbmcoMCwgcm9vdEZpbGUubGFzdEluZGV4T2YoJy4nKSlcblxuICAgIGNvbnN0IGNsZWFuRXh0ZW5zaW9ucyA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguY2xlYW5FeHRlbnNpb25zJylcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2xlYW5FeHRlbnNpb25zLm1hcChhc3luYyAoZXh0ZW5zaW9uKSA9PiB7XG4gICAgICBjb25zdCBjYW5kaWRhdGVQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCByb290RmlsZSArIGV4dGVuc2lvbilcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICBmcy5yZW1vdmUoY2FuZGlkYXRlUGF0aCwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoe2ZpbGVQYXRoOiBjYW5kaWRhdGVQYXRoLCBlcnJvcjogZXJyb3J9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KSlcbiAgfVxuXG4gIHNldFN0YXR1c0JhciAoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdGF0dXNCYXIgPSBzdGF0dXNCYXJcbiAgfVxuXG4gIG1vdmVSZXN1bHQgKHJlc3VsdCwgZmlsZVBhdGgpIHtcbiAgICBjb25zdCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoID0gcmVzdWx0Lm91dHB1dEZpbGVQYXRoXG4gICAgcmVzdWx0Lm91dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoZmlsZVBhdGgsIG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMob3JpZ2luYWxPdXRwdXRGaWxlUGF0aCkpIHtcbiAgICAgIGZzLnJlbW92ZVN5bmMocmVzdWx0Lm91dHB1dEZpbGVQYXRoKVxuICAgICAgZnMubW92ZVN5bmMob3JpZ2luYWxPdXRwdXRGaWxlUGF0aCwgcmVzdWx0Lm91dHB1dEZpbGVQYXRoKVxuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsU3luY0ZpbGVQYXRoID0gb3JpZ2luYWxPdXRwdXRGaWxlUGF0aC5yZXBsYWNlKC9cXC5wZGYkLywgJy5zeW5jdGV4Lmd6JylcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IHN5bmNGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGZpbGVQYXRoLCBvcmlnaW5hbFN5bmNGaWxlUGF0aClcbiAgICAgIGZzLnJlbW92ZVN5bmMoc3luY0ZpbGVQYXRoKVxuICAgICAgZnMubW92ZVN5bmMob3JpZ2luYWxTeW5jRmlsZVBhdGgsIHN5bmNGaWxlUGF0aClcbiAgICB9XG4gIH1cblxuICByZXNvbHZlUm9vdEZpbGVQYXRoIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IE1hc3RlclRleEZpbmRlciA9IHJlcXVpcmUoJy4vbWFzdGVyLXRleC1maW5kZXInKVxuICAgIGNvbnN0IGZpbmRlciA9IG5ldyBNYXN0ZXJUZXhGaW5kZXIoZmlsZVBhdGgpXG4gICAgcmV0dXJuIGZpbmRlci5nZXRNYXN0ZXJUZXhQYXRoKClcbiAgfVxuXG4gIHJlc29sdmVPdXRwdXRGaWxlUGF0aCAoZmlsZVBhdGgpIHtcbiAgICBsZXQgb3V0cHV0RmlsZVBhdGgsIHJvb3RGaWxlUGF0aFxuXG4gICAgaWYgKHRoaXMub3V0cHV0TG9va3VwKSB7XG4gICAgICBvdXRwdXRGaWxlUGF0aCA9IHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXVxuICAgIH1cblxuICAgIGlmICghb3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgIHJvb3RGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZVJvb3RGaWxlUGF0aChmaWxlUGF0aClcblxuICAgICAgY29uc3QgYnVpbGRlciA9IHRoaXMuZ2V0QnVpbGRlcihyb290RmlsZVBhdGgpXG4gICAgICBpZiAoYnVpbGRlciA9PSBudWxsKSB7XG4gICAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBObyByZWdpc3RlcmVkIExhVGVYIGJ1aWxkZXIgY2FuIHByb2Nlc3MgJHtyb290RmlsZVBhdGh9LmApXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aClcbiAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0xvZyBmaWxlIHBhcnNpbmcgZmFpbGVkIScpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwID0gdGhpcy5vdXRwdXRMb29rdXAgfHwge31cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXSA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChyb290RmlsZVBhdGgsIG91dHB1dEZpbGVQYXRoKVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRGaWxlUGF0aFxuICB9XG5cbiAgc2hvd1Jlc3VsdCAocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZE9wZW5SZXN1bHQoKSkgeyByZXR1cm4gfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKClcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICAgIG9wZW5lci5vcGVuKHJlc3VsdC5vdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgc2hvd0Vycm9yIChzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpIHtcbiAgICB0aGlzLnNob3dFcnJvckluZGljYXRvcihyZXN1bHQpXG4gICAgdGhpcy5zaG93RXJyb3JNYXJrZXJzKHJlc3VsdClcbiAgICBsYXRleC5sb2cuZXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKVxuICB9XG5cbiAgc2hvd1Byb2dyZXNzSW5kaWNhdG9yICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdHVzQmFyKSB7IHJldHVybiBudWxsIH1cbiAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuaW5kaWNhdG9yIH1cblxuICAgIGNvbnN0IFByb2dyZXNzSW5kaWNhdG9yID0gcmVxdWlyZSgnLi9zdGF0dXMtYmFyL3Byb2dyZXNzLWluZGljYXRvcicpXG4gICAgdGhpcy5pbmRpY2F0b3IgPSBuZXcgUHJvZ3Jlc3NJbmRpY2F0b3IoKVxuICAgIHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLmluZGljYXRvcixcbiAgICAgIHByaW9yaXR5OiA5MDAxXG4gICAgfSlcbiAgfVxuXG4gIHNob3dFcnJvckluZGljYXRvciAocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbCB9XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuZXJyb3JJbmRpY2F0b3IgfVxuXG4gICAgY29uc3QgRXJyb3JJbmRpY2F0b3IgPSByZXF1aXJlKCcuL3N0YXR1cy1iYXIvZXJyb3ItaW5kaWNhdG9yJylcbiAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbmV3IEVycm9ySW5kaWNhdG9yKHJlc3VsdClcbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5lcnJvckluZGljYXRvcixcbiAgICAgIHByaW9yaXR5OiA5MDAxXG4gICAgfSlcbiAgfVxuXG4gIHNob3dFcnJvck1hcmtlcnMgKHJlc3VsdCkge1xuICAgIGlmICh0aGlzLmVycm9yTWFya2VycyAmJiB0aGlzLmVycm9yTWFya2Vycy5sZW5ndGggPiAwKSB7IHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpIH1cbiAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0LmVycm9ycykgeyByZXR1cm4gfVxuXG4gICAgY29uc3QgRXJyb3JNYXJrZXIgPSByZXF1aXJlKCcuL2Vycm9yLW1hcmtlcicpXG5cbiAgICB0aGlzLmVycm9yTWFya2VycyA9IFtdXG4gICAgZm9yIChjb25zdCBlZGl0b3Igb2YgdGhpcy5nZXRBbGxFZGl0b3JzKCkpIHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0UGF0aCgpKSB7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IF8uZmlsdGVyKHJlc3VsdC5lcnJvcnMsIGVycm9yID0+IHtcbiAgICAgICAgICByZXR1cm4gZWRpdG9yLmdldFBhdGgoKS5pbmNsdWRlcyhlcnJvci5maWxlUGF0aClcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3Qgd2FybmluZ3MgPSBfLmZpbHRlcihyZXN1bHQud2FybmluZ3MsIHdhcm5pbmcgPT4ge1xuICAgICAgICAgIHJldHVybiBlZGl0b3IuZ2V0UGF0aCgpLmluY2x1ZGVzKHdhcm5pbmcuZmlsZVBhdGgpXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoIHx8IHdhcm5pbmdzLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZXJyb3JNYXJrZXJzLnB1c2gobmV3IEVycm9yTWFya2VyKGVkaXRvciwgZXJyb3JzLCB3YXJuaW5ncykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IgKCkge1xuICAgIGlmICh0aGlzLmluZGljYXRvcikge1xuICAgICAgdGhpcy5pbmRpY2F0b3IuZWxlbWVudC5yZW1vdmUoKVxuICAgICAgdGhpcy5pbmRpY2F0b3IgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUVycm9ySW5kaWNhdG9yICgpIHtcbiAgICBpZiAodGhpcy5lcnJvckluZGljYXRvcikge1xuICAgICAgdGhpcy5lcnJvckluZGljYXRvci5lbGVtZW50LnJlbW92ZSgpXG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lFcnJvck1hcmtlcnMgKCkge1xuICAgIGlmICh0aGlzLmVycm9yTWFya2Vycykge1xuICAgICAgZm9yIChsZXQgZXJyb3JNYXJrZXIgb2YgdGhpcy5lcnJvck1hcmtlcnMpIHtcbiAgICAgICAgZXJyb3JNYXJrZXIuY2xlYXIoKVxuICAgICAgICBlcnJvck1hcmtlciA9IG51bGxcbiAgICAgIH1cbiAgICAgIHRoaXMuZXJyb3JNYXJrZXJzID0gW11cbiAgICB9XG4gIH1cblxuICBpc1RleEZpbGUgKGZpbGVQYXRoKSB7XG4gICAgLy8gVE9ETzogSW1wcm92ZSB3aWxsIHN1ZmZpY2UgZm9yIHRoZSB0aW1lIGJlaW5nLlxuICAgIHJldHVybiAhZmlsZVBhdGggfHwgZmlsZVBhdGguc2VhcmNoKC9cXC4odGV4fGxocykkLykgPiAwXG4gIH1cblxuICBnZXRCdWlsZGVyIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IEJ1aWxkZXJJbXBsID0gdGhpcy5idWlsZGVyUmVnaXN0cnkuZ2V0QnVpbGRlcihmaWxlUGF0aClcbiAgICByZXR1cm4gKEJ1aWxkZXJJbXBsICE9IG51bGwpID8gbmV3IEJ1aWxkZXJJbXBsKCkgOiBudWxsXG4gIH1cblxuICBnZXRFZGl0b3JEZXRhaWxzICgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBsZXQgZmlsZVBhdGgsIGxpbmVOdW1iZXJcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIGxpbmVOdW1iZXIgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVkaXRvcjogZWRpdG9yLFxuICAgICAgZmlsZVBhdGg6IGZpbGVQYXRoLFxuICAgICAgbGluZU51bWJlcjogbGluZU51bWJlclxuICAgIH1cbiAgfVxuXG4gIGdldEFsbEVkaXRvcnMgKCkge1xuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gIH1cblxuICBhbHRlclBhcmVudFBhdGggKHRhcmdldFBhdGgsIG9yaWdpbmFsUGF0aCkge1xuICAgIGNvbnN0IHRhcmdldERpciA9IHBhdGguZGlybmFtZSh0YXJnZXRQYXRoKVxuICAgIHJldHVybiBwYXRoLmpvaW4odGFyZ2V0RGlyLCBwYXRoLmJhc2VuYW1lKG9yaWdpbmFsUGF0aCkpXG4gIH1cblxuICBzaG91bGRNb3ZlUmVzdWx0ICgpIHtcbiAgICBjb25zdCBtb3ZlUmVzdWx0ID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnknKVxuICAgIGNvbnN0IG91dHB1dERpcmVjdG9yeSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5JylcbiAgICByZXR1cm4gbW92ZVJlc3VsdCAmJiBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID4gMFxuICB9XG5cbiAgc2hvdWxkT3BlblJlc3VsdCAoKSB7IHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm9wZW5SZXN1bHRBZnRlckJ1aWxkJykgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/composer.js
