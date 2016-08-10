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

        var builder = this.getBuilder();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OzsrQkFDSyxvQkFBb0I7Ozs7QUFMaEQsV0FBVyxDQUFBOztJQU9VLFFBQVE7QUFDZixXQURPLFFBQVEsR0FDWjswQkFESSxRQUFROztBQUV6QixRQUFJLENBQUMsZUFBZSxHQUFHLGtDQUFxQixDQUFBO0dBQzdDOztlQUhrQixRQUFROztXQUtuQixtQkFBRztBQUNULFVBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO0FBQy9CLFVBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0tBQzNCOzs7NkJBRVcsYUFBRzs7OzhCQUNjLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTs7VUFBM0MsTUFBTSxxQkFBTixNQUFNO1VBQUUsUUFBUSxxQkFBUixRQUFROztBQUV2QixVQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkRBQTJELENBQUMsQ0FBQTtBQUM5RSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN6QyxVQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7QUFDbkIsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLDhDQUE0QyxRQUFRLE9BQUksQ0FBQTtBQUN6RSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdkIsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2Q7O0FBRUQsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDMUIsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7O0FBRTVCLGFBQU8sSUFBSSxPQUFPLG1CQUFDLFdBQU8sT0FBTyxFQUFFLE1BQU0sRUFBSztBQUM1QyxZQUFNLFlBQVksR0FBRyxNQUFLLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3ZELFlBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUMzRCxhQUFLLElBQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUM5QixjQUFJO0FBQ0YsZ0JBQU0sVUFBVSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDM0QsZ0JBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzFELGdCQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQ3ZELG9CQUFLLFNBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzNDLG9CQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7YUFDbkIsTUFBTTtBQUNMLGtCQUFJLE1BQUssZ0JBQWdCLEVBQUUsRUFBRTtBQUMzQixzQkFBSyxVQUFVLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFBO2VBQ3RDOztBQUVELG9CQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN2QixxQkFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2FBQ3BCO1dBQ0YsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGlCQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDOUIsa0JBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7V0FDdEIsU0FBUztBQUNSLGtCQUFLLHdCQUF3QixFQUFFLENBQUE7V0FDaEM7U0FDRjtPQUNGLEVBQUMsQ0FBQTtLQUNIOzs7V0FFSSxnQkFBRzsrQkFDeUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUEvQyxRQUFRLHNCQUFSLFFBQVE7VUFBRSxVQUFVLHNCQUFWLFVBQVU7O0FBQzNCLFVBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzFDLGVBQU07T0FDUDs7QUFFRCxVQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0QsVUFBSSxDQUFDLGNBQWMsRUFBRTtBQUNuQixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO0FBQzVGLGVBQU07T0FDUDs7QUFFRCxVQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDaEMsVUFBSSxNQUFNLEVBQUU7QUFDVixjQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUE7T0FDbEQ7S0FDRjs7OzZCQUVXLGFBQUc7K0JBQ00sSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUFuQyxRQUFRLHNCQUFSLFFBQVE7O0FBQ2YsVUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDMUMsZUFBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDeEI7O0FBRUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3ZELFVBQUksUUFBUSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTs7QUFFekMsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNyRCxVQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUN2Qzs7QUFFRCxVQUFJLFFBQVEsR0FBRyxrQkFBSyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDMUMsY0FBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTs7QUFFM0QsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNoRSxhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsbUJBQUMsV0FBTyxTQUFTLEVBQUs7QUFDMUQsWUFBTSxhQUFhLEdBQUcsa0JBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUE7QUFDL0QsZUFBTyxJQUFJLE9BQU8sbUJBQUMsV0FBTyxPQUFPLEVBQUs7QUFDcEMsOEJBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNsQyxtQkFBTyxPQUFPLENBQUMsRUFBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFBO1dBQ3hELENBQUMsQ0FBQTtTQUNILEVBQUMsQ0FBQTtPQUNILEVBQUMsQ0FBQyxDQUFBO0tBQ0o7OztXQUVZLHNCQUFDLFNBQVMsRUFBRTtBQUN2QixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtLQUMzQjs7O1dBRVUsb0JBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUM1QixVQUFNLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUE7QUFDcEQsWUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlFLFVBQUksb0JBQUcsVUFBVSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7QUFDekMsNEJBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNwQyw0QkFBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO09BQzNEOztBQUVELFVBQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQTtBQUNwRixVQUFJLG9CQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO0FBQ3ZDLFlBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUE7QUFDekUsNEJBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQzNCLDRCQUFHLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLENBQUMsQ0FBQTtPQUNoRDtLQUNGOzs7V0FFbUIsNkJBQUMsUUFBUSxFQUFFO0FBQzdCLFVBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQ3RELFVBQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzVDLGFBQU8sTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUE7S0FDakM7OztXQUVxQiwrQkFBQyxRQUFRLEVBQUU7QUFDL0IsVUFBSSxjQUFjLFlBQUE7VUFBRSxZQUFZLFlBQUEsQ0FBQTs7QUFFaEMsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLHNCQUFjLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3Qzs7QUFFRCxVQUFJLENBQUMsY0FBYyxFQUFFO0FBQ25CLG9CQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVqRCxZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDakMsWUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNqRCxZQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRTtBQUNyQyxlQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzdDLGlCQUFPLElBQUksQ0FBQTtTQUNaOztBQUVELFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUE7QUFDM0MsWUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFBO09BQ3BEOztBQUVELFVBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7QUFDM0Isc0JBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQTtPQUNwRTs7QUFFRCxhQUFPLGNBQWMsQ0FBQTtLQUN0Qjs7O1dBRVUsb0JBQUMsTUFBTSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtBQUFFLGVBQU07T0FBRTs7QUFFeEMsVUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2hDLFVBQUksTUFBTSxFQUFFO2lDQUNxQixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7O1lBQS9DLFFBQVEsc0JBQVIsUUFBUTtZQUFFLFVBQVUsc0JBQVYsVUFBVTs7QUFDM0IsY0FBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQTtPQUN6RDtLQUNGOzs7V0FFUyxtQkFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUN0QyxVQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDL0IsVUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLFdBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDN0M7OztXQUVxQixpQ0FBRztBQUN2QixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFBO09BQUU7QUFDcEMsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFBO09BQUU7O0FBRTdDLFVBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7QUFDcEUsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUE7QUFDeEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFDMUIsWUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQ3BCLGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUMsQ0FBQTtLQUNIOzs7V0FFa0IsNEJBQUMsTUFBTSxFQUFFO0FBQzFCLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUE7T0FBRTtBQUNwQyxVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxjQUFjLENBQUE7T0FBRTs7QUFFdkQsVUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUE7QUFDOUQsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoRCxVQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztBQUMxQixZQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWM7QUFDekIsZ0JBQVEsRUFBRSxJQUFJO09BQ2YsQ0FBQyxDQUFBO0tBQ0g7OztXQUVnQiwwQkFBQyxNQUFNLEVBQUU7OztBQUN4QixVQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQUUsWUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7T0FBRTtBQUNyRixVQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUFFLGVBQU07T0FBRTs7QUFFekMsVUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7O0FBRTdDLFVBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFBOzs0QkFDWCxNQUFNO0FBQ2YsWUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDcEIsY0FBTSxNQUFNLEdBQUcsb0JBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDOUMsbUJBQU8sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7V0FDakQsQ0FBQyxDQUFBO0FBQ0YsY0FBTSxRQUFRLEdBQUcsb0JBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBQSxPQUFPLEVBQUk7QUFDcEQsbUJBQU8sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7V0FDbkQsQ0FBQyxDQUFBO0FBQ0YsY0FBSSxNQUFNLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDcEMsbUJBQUssWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7V0FDbEU7U0FDRjs7O0FBWEgsV0FBSyxJQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUU7Y0FBaEMsTUFBTTtPQVloQjtLQUNGOzs7V0FFd0Isb0NBQUc7QUFDMUIsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQy9CLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO09BQ3RCO0tBQ0Y7OztXQUVxQixpQ0FBRztBQUN2QixVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDcEMsWUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7T0FDM0I7S0FDRjs7O1dBRW1CLCtCQUFHO0FBQ3JCLFVBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyQixhQUFLLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDekMscUJBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNuQixxQkFBVyxHQUFHLElBQUksQ0FBQTtTQUNuQjtBQUNELFlBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFBO09BQ3ZCO0tBQ0Y7OztXQUVTLG1CQUFDLFFBQVEsRUFBRTs7QUFFbkIsYUFBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUN4RDs7O1dBRVUsb0JBQUMsUUFBUSxFQUFFO0FBQ3BCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdELGFBQU8sQUFBQyxXQUFXLElBQUksSUFBSSxHQUFJLElBQUksV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFBO0tBQ3hEOzs7V0FFZ0IsNEJBQUc7QUFDbEIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ25ELFVBQUksUUFBUSxZQUFBO1VBQUUsVUFBVSxZQUFBLENBQUE7QUFDeEIsVUFBSSxNQUFNLEVBQUU7QUFDVixnQkFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMzQixrQkFBVSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7T0FDdEQ7O0FBRUQsYUFBTztBQUNMLGNBQU0sRUFBRSxNQUFNO0FBQ2QsZ0JBQVEsRUFBRSxRQUFRO0FBQ2xCLGtCQUFVLEVBQUUsVUFBVTtPQUN2QixDQUFBO0tBQ0Y7OztXQUVhLHlCQUFHO0FBQ2YsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFBO0tBQ3ZDOzs7V0FFZSx5QkFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLFVBQU0sU0FBUyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUMxQyxhQUFPLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsa0JBQUssUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7S0FDekQ7OztXQUVnQiw0QkFBRztBQUNsQixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBQ3ZFLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUE7QUFDaEUsYUFBTyxVQUFVLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7S0FDaEQ7OztXQUVnQiw0QkFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtLQUFFOzs7U0EvUnpELFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IEJ1aWxkZXJSZWdpc3RyeSBmcm9tICcuL2J1aWxkZXItcmVnaXN0cnknXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2VyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuYnVpbGRlclJlZ2lzdHJ5ID0gbmV3IEJ1aWxkZXJSZWdpc3RyeSgpXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpXG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKVxuICAgIHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpXG4gIH1cblxuICBhc3luYyBidWlsZCAoKSB7XG4gICAgY29uc3Qge2VkaXRvciwgZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcblxuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdGaWxlIG5lZWRzIHRvIGJlIHNhdmVkIHRvIGRpc2sgYmVmb3JlIGl0IGNhbiBiZSBUZVhpZmllZC4nKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWxkZXIgPSB0aGlzLmdldEJ1aWxkZXIoZmlsZVBhdGgpXG4gICAgaWYgKGJ1aWxkZXIgPT0gbnVsbCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoYE5vIHJlZ2lzdGVyZWQgTGFUZVggYnVpbGRlciBjYW4gcHJvY2VzcyAke2ZpbGVQYXRofS5gKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKVxuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpIC8vIFRPRE86IE1ha2UgdGhpcyBjb25maWd1cmFibGU/XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0cm95RXJyb3JNYXJrZXJzKClcbiAgICB0aGlzLmRlc3Ryb3lFcnJvckluZGljYXRvcigpXG4gICAgdGhpcy5zaG93UHJvZ3Jlc3NJbmRpY2F0b3IoKVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJvb3RGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZVJvb3RGaWxlUGF0aChmaWxlUGF0aClcbiAgICAgIGNvbnN0IGpvYm5hbWVzID0gYnVpbGRlci5nZXRKb2JOYW1lc0Zyb21NYWdpYyhyb290RmlsZVBhdGgpXG4gICAgICBmb3IgKGNvbnN0IGpvYm5hbWUgb2Ygam9ibmFtZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBzdGF0dXNDb2RlID0gYXdhaXQgYnVpbGRlci5ydW4ocm9vdEZpbGVQYXRoLCBqb2JuYW1lKVxuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aCwgam9ibmFtZSlcbiAgICAgICAgICBpZiAoc3RhdHVzQ29kZSA+IDAgfHwgIXJlc3VsdCB8fCAhcmVzdWx0Lm91dHB1dEZpbGVQYXRoKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpXG4gICAgICAgICAgICByZWplY3Qoc3RhdHVzQ29kZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvdWxkTW92ZVJlc3VsdCgpKSB7XG4gICAgICAgICAgICAgIHRoaXMubW92ZVJlc3VsdChyZXN1bHQsIHJvb3RGaWxlUGF0aClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zaG93UmVzdWx0KHJlc3VsdClcbiAgICAgICAgICAgIHJlc29sdmUoc3RhdHVzQ29kZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgbGF0ZXgubG9nLmVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgICAgcmVqZWN0KGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdGhpcy5kZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHN5bmMgKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aCwgbGluZU51bWJlcn0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSB0aGlzLnJlc29sdmVPdXRwdXRGaWxlUGF0aChmaWxlUGF0aClcbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnQ291bGQgbm90IHJlc29sdmUgcGF0aCB0byBvdXRwdXQgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgZmlsZS4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKClcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBvcGVuZXIub3BlbihvdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2xlYW4gKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KClcbiAgICB9XG5cbiAgICBjb25zdCByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgbGV0IHJvb3RQYXRoID0gcGF0aC5kaXJuYW1lKHJvb3RGaWxlUGF0aClcblxuICAgIGxldCBvdXRkaXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScpXG4gICAgaWYgKG91dGRpcikge1xuICAgICAgcm9vdFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIG91dGRpcilcbiAgICB9XG5cbiAgICBsZXQgcm9vdEZpbGUgPSBwYXRoLmJhc2VuYW1lKHJvb3RGaWxlUGF0aClcbiAgICByb290RmlsZSA9IHJvb3RGaWxlLnN1YnN0cmluZygwLCByb290RmlsZS5sYXN0SW5kZXhPZignLicpKVxuXG4gICAgY29uc3QgY2xlYW5FeHRlbnNpb25zID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5jbGVhbkV4dGVuc2lvbnMnKVxuICAgIHJldHVybiBQcm9taXNlLmFsbChjbGVhbkV4dGVuc2lvbnMubWFwKGFzeW5jIChleHRlbnNpb24pID0+IHtcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZVBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIHJvb3RGaWxlICsgZXh0ZW5zaW9uKVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGZzLnJlbW92ZShjYW5kaWRhdGVQYXRoLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7ZmlsZVBhdGg6IGNhbmRpZGF0ZVBhdGgsIGVycm9yOiBlcnJvcn0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pKVxuICB9XG5cbiAgc2V0U3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhclxuICB9XG5cbiAgbW92ZVJlc3VsdCAocmVzdWx0LCBmaWxlUGF0aCkge1xuICAgIGNvbnN0IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGggPSByZXN1bHQub3V0cHV0RmlsZVBhdGhcbiAgICByZXN1bHQub3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChmaWxlUGF0aCwgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aClcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhyZXN1bHQub3V0cHV0RmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoLCByZXN1bHQub3V0cHV0RmlsZVBhdGgpXG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxTeW5jRmlsZVBhdGggPSBvcmlnaW5hbE91dHB1dEZpbGVQYXRoLnJlcGxhY2UoL1xcLnBkZiQvLCAnLnN5bmN0ZXguZ3onKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoKSkge1xuICAgICAgY29uc3Qgc3luY0ZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoZmlsZVBhdGgsIG9yaWdpbmFsU3luY0ZpbGVQYXRoKVxuICAgICAgZnMucmVtb3ZlU3luYyhzeW5jRmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCwgc3luY0ZpbGVQYXRoKVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVSb290RmlsZVBhdGggKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgTWFzdGVyVGV4RmluZGVyID0gcmVxdWlyZSgnLi9tYXN0ZXItdGV4LWZpbmRlcicpXG4gICAgY29uc3QgZmluZGVyID0gbmV3IE1hc3RlclRleEZpbmRlcihmaWxlUGF0aClcbiAgICByZXR1cm4gZmluZGVyLmdldE1hc3RlclRleFBhdGgoKVxuICB9XG5cbiAgcmVzb2x2ZU91dHB1dEZpbGVQYXRoIChmaWxlUGF0aCkge1xuICAgIGxldCBvdXRwdXRGaWxlUGF0aCwgcm9vdEZpbGVQYXRoXG5cbiAgICBpZiAodGhpcy5vdXRwdXRMb29rdXApIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5vdXRwdXRMb29rdXBbZmlsZVBhdGhdXG4gICAgfVxuXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuXG4gICAgICBjb25zdCBidWlsZGVyID0gdGhpcy5nZXRCdWlsZGVyKClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aClcbiAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0xvZyBmaWxlIHBhcnNpbmcgZmFpbGVkIScpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwID0gdGhpcy5vdXRwdXRMb29rdXAgfHwge31cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXSA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChyb290RmlsZVBhdGgsIG91dHB1dEZpbGVQYXRoKVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRGaWxlUGF0aFxuICB9XG5cbiAgc2hvd1Jlc3VsdCAocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZE9wZW5SZXN1bHQoKSkgeyByZXR1cm4gfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKClcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICAgIG9wZW5lci5vcGVuKHJlc3VsdC5vdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgc2hvd0Vycm9yIChzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpIHtcbiAgICB0aGlzLnNob3dFcnJvckluZGljYXRvcihyZXN1bHQpXG4gICAgdGhpcy5zaG93RXJyb3JNYXJrZXJzKHJlc3VsdClcbiAgICBsYXRleC5sb2cuZXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKVxuICB9XG5cbiAgc2hvd1Byb2dyZXNzSW5kaWNhdG9yICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdHVzQmFyKSB7IHJldHVybiBudWxsIH1cbiAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuaW5kaWNhdG9yIH1cblxuICAgIGNvbnN0IFByb2dyZXNzSW5kaWNhdG9yID0gcmVxdWlyZSgnLi9zdGF0dXMtYmFyL3Byb2dyZXNzLWluZGljYXRvcicpXG4gICAgdGhpcy5pbmRpY2F0b3IgPSBuZXcgUHJvZ3Jlc3NJbmRpY2F0b3IoKVxuICAgIHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLmluZGljYXRvcixcbiAgICAgIHByaW9yaXR5OiA5MDAxXG4gICAgfSlcbiAgfVxuXG4gIHNob3dFcnJvckluZGljYXRvciAocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbCB9XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuZXJyb3JJbmRpY2F0b3IgfVxuXG4gICAgY29uc3QgRXJyb3JJbmRpY2F0b3IgPSByZXF1aXJlKCcuL3N0YXR1cy1iYXIvZXJyb3ItaW5kaWNhdG9yJylcbiAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbmV3IEVycm9ySW5kaWNhdG9yKHJlc3VsdClcbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5lcnJvckluZGljYXRvcixcbiAgICAgIHByaW9yaXR5OiA5MDAxXG4gICAgfSlcbiAgfVxuXG4gIHNob3dFcnJvck1hcmtlcnMgKHJlc3VsdCkge1xuICAgIGlmICh0aGlzLmVycm9yTWFya2VycyAmJiB0aGlzLmVycm9yTWFya2Vycy5sZW5ndGggPiAwKSB7IHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpIH1cbiAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0LmVycm9ycykgeyByZXR1cm4gfVxuXG4gICAgY29uc3QgRXJyb3JNYXJrZXIgPSByZXF1aXJlKCcuL2Vycm9yLW1hcmtlcicpXG5cbiAgICB0aGlzLmVycm9yTWFya2VycyA9IFtdXG4gICAgZm9yIChjb25zdCBlZGl0b3Igb2YgdGhpcy5nZXRBbGxFZGl0b3JzKCkpIHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0UGF0aCgpKSB7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IF8uZmlsdGVyKHJlc3VsdC5lcnJvcnMsIGVycm9yID0+IHtcbiAgICAgICAgICByZXR1cm4gZWRpdG9yLmdldFBhdGgoKS5pbmNsdWRlcyhlcnJvci5maWxlUGF0aClcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3Qgd2FybmluZ3MgPSBfLmZpbHRlcihyZXN1bHQud2FybmluZ3MsIHdhcm5pbmcgPT4ge1xuICAgICAgICAgIHJldHVybiBlZGl0b3IuZ2V0UGF0aCgpLmluY2x1ZGVzKHdhcm5pbmcuZmlsZVBhdGgpXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoIHx8IHdhcm5pbmdzLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZXJyb3JNYXJrZXJzLnB1c2gobmV3IEVycm9yTWFya2VyKGVkaXRvciwgZXJyb3JzLCB3YXJuaW5ncykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IgKCkge1xuICAgIGlmICh0aGlzLmluZGljYXRvcikge1xuICAgICAgdGhpcy5pbmRpY2F0b3IuZWxlbWVudC5yZW1vdmUoKVxuICAgICAgdGhpcy5pbmRpY2F0b3IgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUVycm9ySW5kaWNhdG9yICgpIHtcbiAgICBpZiAodGhpcy5lcnJvckluZGljYXRvcikge1xuICAgICAgdGhpcy5lcnJvckluZGljYXRvci5lbGVtZW50LnJlbW92ZSgpXG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lFcnJvck1hcmtlcnMgKCkge1xuICAgIGlmICh0aGlzLmVycm9yTWFya2Vycykge1xuICAgICAgZm9yIChsZXQgZXJyb3JNYXJrZXIgb2YgdGhpcy5lcnJvck1hcmtlcnMpIHtcbiAgICAgICAgZXJyb3JNYXJrZXIuY2xlYXIoKVxuICAgICAgICBlcnJvck1hcmtlciA9IG51bGxcbiAgICAgIH1cbiAgICAgIHRoaXMuZXJyb3JNYXJrZXJzID0gW11cbiAgICB9XG4gIH1cblxuICBpc1RleEZpbGUgKGZpbGVQYXRoKSB7XG4gICAgLy8gVE9ETzogSW1wcm92ZSB3aWxsIHN1ZmZpY2UgZm9yIHRoZSB0aW1lIGJlaW5nLlxuICAgIHJldHVybiAhZmlsZVBhdGggfHwgZmlsZVBhdGguc2VhcmNoKC9cXC4odGV4fGxocykkLykgPiAwXG4gIH1cblxuICBnZXRCdWlsZGVyIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IEJ1aWxkZXJJbXBsID0gdGhpcy5idWlsZGVyUmVnaXN0cnkuZ2V0QnVpbGRlcihmaWxlUGF0aClcbiAgICByZXR1cm4gKEJ1aWxkZXJJbXBsICE9IG51bGwpID8gbmV3IEJ1aWxkZXJJbXBsKCkgOiBudWxsXG4gIH1cblxuICBnZXRFZGl0b3JEZXRhaWxzICgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBsZXQgZmlsZVBhdGgsIGxpbmVOdW1iZXJcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIGxpbmVOdW1iZXIgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVkaXRvcjogZWRpdG9yLFxuICAgICAgZmlsZVBhdGg6IGZpbGVQYXRoLFxuICAgICAgbGluZU51bWJlcjogbGluZU51bWJlclxuICAgIH1cbiAgfVxuXG4gIGdldEFsbEVkaXRvcnMgKCkge1xuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gIH1cblxuICBhbHRlclBhcmVudFBhdGggKHRhcmdldFBhdGgsIG9yaWdpbmFsUGF0aCkge1xuICAgIGNvbnN0IHRhcmdldERpciA9IHBhdGguZGlybmFtZSh0YXJnZXRQYXRoKVxuICAgIHJldHVybiBwYXRoLmpvaW4odGFyZ2V0RGlyLCBwYXRoLmJhc2VuYW1lKG9yaWdpbmFsUGF0aCkpXG4gIH1cblxuICBzaG91bGRNb3ZlUmVzdWx0ICgpIHtcbiAgICBjb25zdCBtb3ZlUmVzdWx0ID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnknKVxuICAgIGNvbnN0IG91dHB1dERpcmVjdG9yeSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5JylcbiAgICByZXR1cm4gbW92ZVJlc3VsdCAmJiBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID4gMFxuICB9XG5cbiAgc2hvdWxkT3BlblJlc3VsdCAoKSB7IHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm9wZW5SZXN1bHRBZnRlckJ1aWxkJykgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/composer.js
