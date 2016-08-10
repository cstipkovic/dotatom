function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _specHelpers = require("./spec-helpers");

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _libComposer = require("../lib/composer");

var _libComposer2 = _interopRequireDefault(_libComposer);

"use babel";

describe("Composer", function () {
  var composer = undefined;

  beforeEach(function () {
    composer = new _libComposer2["default"]();
  });

  describe("build", function () {
    var editor = undefined,
        builder = undefined;

    function initializeSpies(filePath) {
      var statusCode = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      editor = jasmine.createSpyObj("MockEditor", ["save", "isModified"]);
      spyOn(composer, "resolveRootFilePath").andReturn(filePath);
      spyOn(composer, "getEditorDetails").andReturn({
        editor: editor,
        filePath: filePath
      });

      builder = jasmine.createSpyObj("MockBuilder", ["run", "constructArgs", "parseLogFile"]);
      builder.run.andCallFake(function () {
        switch (statusCode) {
          case 0:
            {
              return Promise.resolve(statusCode);
            }
        }

        return Promise.reject(statusCode);
      });
      spyOn(latex, "getBuilder").andReturn(builder);
    }

    beforeEach(function () {
      spyOn(composer, "showResult").andReturn();
      spyOn(composer, "showError").andReturn();
    });

    it("does nothing for new, unsaved files", function () {
      initializeSpies(null);

      var result = "aaaaaaaaaaaa";
      waitsForPromise(function () {
        return composer.build()["catch"](function (r) {
          return result = r;
        });
      });

      runs(function () {
        expect(result).toBe(false);
        expect(composer.showResult).not.toHaveBeenCalled();
        expect(composer.showError).not.toHaveBeenCalled();
      });
    });

    it("does nothing for unsupported file extensions", function () {
      initializeSpies("foo.bar");

      var result = undefined;
      waitsForPromise(function () {
        return composer.build()["catch"](function (r) {
          return result = r;
        });
      });

      runs(function () {
        expect(result).toBe(false);
        expect(composer.showResult).not.toHaveBeenCalled();
        expect(composer.showError).not.toHaveBeenCalled();
      });
    });

    it("saves the file before building, if modified", function () {
      initializeSpies("file.tex");
      editor.isModified.andReturn(true);

      builder.parseLogFile.andReturn({
        outputFilePath: "file.pdf",
        errors: [],
        warnings: []
      });

      waitsForPromise(function () {
        return composer.build();
      });

      runs(function () {
        expect(editor.isModified).toHaveBeenCalled();
        expect(editor.save).toHaveBeenCalled();
      });
    });

    it("invokes `showResult` after a successful build, with expected log parsing result", function () {
      var result = {
        outputFilePath: "file.pdf",
        errors: [],
        warnings: []
      };

      initializeSpies("file.tex");
      builder.parseLogFile.andReturn(result);

      waitsForPromise(function () {
        return composer.build();
      });

      runs(function () {
        expect(composer.showResult).toHaveBeenCalledWith(result);
      });
    });

    it("treats missing output file data in log file as an error", function () {
      initializeSpies("file.tex");

      builder.parseLogFile.andReturn({
        outputFilePath: null,
        errors: [],
        warnings: []
      });

      waitsForPromise(function () {
        return composer.build()["catch"](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.showError).toHaveBeenCalled();
      });
    });

    it("treats missing result from parser as an error", function () {
      initializeSpies("file.tex");
      builder.parseLogFile.andReturn(null);

      waitsForPromise(function () {
        return composer.build()["catch"](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.showError).toHaveBeenCalled();
      });
    });

    it("handles active item not being a text editor", function () {
      spyOn(atom.workspace, "getActiveTextEditor").andReturn();
      spyOn(composer, "getEditorDetails").andCallThrough();

      waitsForPromise(function () {
        return composer.build()["catch"](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.getEditorDetails).toHaveBeenCalled();
      });
    });
  });

  describe("clean", function () {
    var extensions = [".bar", ".baz", ".quux"];

    function fakeFilePaths(filePath) {
      var filePathSansExtension = filePath.substring(0, filePath.lastIndexOf("."));
      return extensions.map(function (ext) {
        return filePathSansExtension + ext;
      });
    }

    function initializeSpies(filePath) {
      spyOn(composer, "getEditorDetails").andReturn({ filePath: filePath });
      spyOn(composer, "resolveRootFilePath").andReturn(filePath);
    }

    beforeEach(function () {
      spyOn(_fsPlus2["default"], "remove").andCallThrough();
      _specHelpers2["default"].spyOnConfig("latex.cleanExtensions", extensions);
    });

    it("deletes all files for the current tex document when output has not been redirected", function () {
      var filePath = _path2["default"].normalize("/a/foo.tex");
      var filesToDelete = fakeFilePaths(filePath);
      initializeSpies(filePath);

      var candidatePaths = undefined;
      waitsForPromise(function () {
        return composer.clean().then(function (resolutions) {
          candidatePaths = _lodash2["default"].pluck(resolutions, "filePath");
        });
      });

      runs(function () {
        expect(candidatePaths).toEqual(filesToDelete);
      });
    });

    it("stops immidiately if the file is not a TeX document", function () {
      var filePath = "foo.bar";
      initializeSpies(filePath, []);

      waitsForPromise(function () {
        return composer.clean()["catch"](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.resolveRootFilePath).not.toHaveBeenCalled();
        expect(_fsPlus2["default"].remove).not.toHaveBeenCalled();
      });
    });
  });

  describe("shouldMoveResult", function () {
    it("should return false when using neither an output directory, nor the move option", function () {
      _specHelpers2["default"].spyOnConfig("latex.outputDirectory", "");
      _specHelpers2["default"].spyOnConfig("latex.moveResultToSourceDirectory", false);

      expect(composer.shouldMoveResult()).toBe(false);
    });

    it("should return false when not using an output directory, but using the move option", function () {
      _specHelpers2["default"].spyOnConfig("latex.outputDirectory", "");
      _specHelpers2["default"].spyOnConfig("latex.moveResultToSourceDirectory", true);

      expect(composer.shouldMoveResult()).toBe(false);
    });

    it("should return false when not using the move option, but using an output directory", function () {
      _specHelpers2["default"].spyOnConfig("latex.outputDirectory", "baz");
      _specHelpers2["default"].spyOnConfig("latex.moveResultToSourceDirectory", false);

      expect(composer.shouldMoveResult()).toBe(false);
    });

    it("should return true when using both an output directory and the move option", function () {
      _specHelpers2["default"].spyOnConfig("latex.outputDirectory", "baz");
      _specHelpers2["default"].spyOnConfig("latex.moveResultToSourceDirectory", true);

      expect(composer.shouldMoveResult()).toBe(true);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9jb21wb3Nlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzJCQUVvQixnQkFBZ0I7Ozs7c0JBQ3JCLFNBQVM7Ozs7c0JBQ1YsUUFBUTs7OztvQkFDTCxNQUFNOzs7OzJCQUNGLGlCQUFpQjs7OztBQU50QyxXQUFXLENBQUM7O0FBUVosUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFXO0FBQzlCLE1BQUksUUFBUSxZQUFBLENBQUM7O0FBRWIsWUFBVSxDQUFDLFlBQVc7QUFDcEIsWUFBUSxHQUFHLDhCQUFjLENBQUM7R0FDM0IsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUMzQixRQUFJLE1BQU0sWUFBQTtRQUFFLE9BQU8sWUFBQSxDQUFDOztBQUVwQixhQUFTLGVBQWUsQ0FBQyxRQUFRLEVBQWtCO1VBQWhCLFVBQVUseURBQUcsQ0FBQzs7QUFDL0MsWUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7QUFDcEUsV0FBSyxDQUFDLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzRCxXQUFLLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzVDLGNBQU0sRUFBRSxNQUFNO0FBQ2QsZ0JBQVEsRUFBRSxRQUFRO09BQ25CLENBQUMsQ0FBQzs7QUFFSCxhQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDeEYsYUFBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBVztBQUNqQyxnQkFBUSxVQUFVO0FBQ2hCLGVBQUssQ0FBQztBQUFFO0FBQUUscUJBQU8sT0FBTyxD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QUFFaEUsWUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2pELENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsNEVBQTRFLEVBQUUsWUFBVztBQUMxRiwrQkFBUSxXQUFXLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEQsK0JBQVEsV0FBVyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUUvRCxZQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEQsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9jb21wb3Nlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IGhlbHBlcnMgZnJvbSBcIi4vc3BlYy1oZWxwZXJzXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzLXBsdXNcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgQ29tcG9zZXIgZnJvbSBcIi4uL2xpYi9jb21wb3NlclwiO1xuXG5kZXNjcmliZShcIkNvbXBvc2VyXCIsIGZ1bmN0aW9uKCkge1xuICBsZXQgY29tcG9zZXI7XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBjb21wb3NlciA9IG5ldyBDb21wb3NlcigpO1xuICB9KTtcblxuICBkZXNjcmliZShcImJ1aWxkXCIsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBlZGl0b3IsIGJ1aWxkZXI7XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplU3BpZXMoZmlsZVBhdGgsIHN0YXR1c0NvZGUgPSAwKSB7XG4gICAgICBlZGl0b3IgPSBqYXNtaW5lLmNyZWF0ZVNweU9iaihcIk1vY2tFZGl0b3JcIiwgW1wic2F2ZVwiLCBcImlzTW9kaWZpZWRcIl0pO1xuICAgICAgc3B5T24oY29tcG9zZXIsIFwicmVzb2x2ZVJvb3RGaWxlUGF0aFwiKS5hbmRSZXR1cm4oZmlsZVBhdGgpO1xuICAgICAgc3B5T24oY29tcG9zZXIsIFwiZ2V0RWRpdG9yRGV0YWlsc1wiKS5hbmRSZXR1cm4oe1xuICAgICAgICBlZGl0b3I6IGVkaXRvcixcbiAgICAgICAgZmlsZVBhdGg6IGZpbGVQYXRoLFxuICAgICAgfSk7XG5cbiAgICAgIGJ1aWxkZXIgPSBqYXNtaW5lLmNyZWF0ZVNweU9iaihcIk1vY2tCdWlsZGVyXCIsIFtcInJ1blwiLCBcImNvbnN0cnVjdEFyZ3NcIiwgXCJwYXJzZUxvZ0ZpbGVcIl0pO1xuICAgICAgYnVpbGRlci5ydW4uYW5kQ2FsbEZha2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3aXRjaCAoc3RhdHVzQ29kZSkge1xuICAgICAgICAgIGNhc2UgMDogeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHN0YXR1c0NvZGUpOyB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoc3RhdHVzQ29kZSk7XG4gICAgICB9KTtcbiAgICAgIHNweU9uKGxhdGV4LCBcImdldEJ1aWxkZXJcIikuYW5kUmV0dXJuKGJ1aWxkZXIpO1xuICAgIH1cblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBzcHlPbihjb21wb3NlciwgXCJzaG93UmVzdWx0XCIpLmFuZFJldHVybigpO1xuICAgICAgc3B5T24oY29tcG9zZXIsIFwic2hvd0Vycm9yXCIpLmFuZFJldHVybigpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJkb2VzIG5vdGhpbmcgZm9yIG5ldywgdW5zYXZlZCBmaWxlc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGluaXRpYWxpemVTcGllcyhudWxsKTtcblxuICAgICAgbGV0IHJlc3VsdCA9IFwiYWFhYWFhYWFhYWFhXCI7XG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpLmNhdGNoKHIgPT4gcmVzdWx0ID0gcik7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93UmVzdWx0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICBleHBlY3QoY29tcG9zZXIuc2hvd0Vycm9yKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdChcImRvZXMgbm90aGluZyBmb3IgdW5zdXBwb3J0ZWQgZmlsZSBleHRlbnNpb25zXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKFwiZm9vLmJhclwiKTtcblxuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmJ1aWxkKCkuY2F0Y2gociA9PiByZXN1bHQgPSByKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dSZXN1bHQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93RXJyb3IpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KFwic2F2ZXMgdGhlIGZpbGUgYmVmb3JlIGJ1aWxkaW5nLCBpZiBtb2RpZmllZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGluaXRpYWxpemVTcGllcyhcImZpbGUudGV4XCIpO1xuICAgICAgZWRpdG9yLmlzTW9kaWZpZWQuYW5kUmV0dXJuKHRydWUpO1xuXG4gICAgICBidWlsZGVyLnBhcnNlTG9nRmlsZS5hbmRSZXR1cm4oe1xuICAgICAgICBvdXRwdXRGaWxlUGF0aDogXCJmaWxlLnBkZlwiLFxuICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICB3YXJuaW5nczogW10sXG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoZWRpdG9yLmlzTW9kaWZpZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgZXhwZWN0KGVkaXRvci5zYXZlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KFwiaW52b2tlcyBgc2hvd1Jlc3VsdGAgYWZ0ZXIgYSBzdWNjZXNzZnVsIGJ1aWxkLCB3aXRoIGV4cGVjdGVkIGxvZyBwYXJzaW5nIHJlc3VsdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgb3V0cHV0RmlsZVBhdGg6IFwiZmlsZS5wZGZcIixcbiAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgd2FybmluZ3M6IFtdLFxuICAgICAgfTtcblxuICAgICAgaW5pdGlhbGl6ZVNwaWVzKFwiZmlsZS50ZXhcIik7XG4gICAgICBidWlsZGVyLnBhcnNlTG9nRmlsZS5hbmRSZXR1cm4ocmVzdWx0KTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoY29tcG9zZXIuc2hvd1Jlc3VsdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJ0cmVhdHMgbWlzc2luZyBvdXRwdXQgZmlsZSBkYXRhIGluIGxvZyBmaWxlIGFzIGFuIGVycm9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKFwiZmlsZS50ZXhcIik7XG5cbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlLmFuZFJldHVybih7XG4gICAgICAgIG91dHB1dEZpbGVQYXRoOiBudWxsLFxuICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICB3YXJuaW5nczogW10sXG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKS5jYXRjaChyID0+IHIpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93RXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJ0cmVhdHMgbWlzc2luZyByZXN1bHQgZnJvbSBwYXJzZXIgYXMgYW4gZXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoXCJmaWxlLnRleFwiKTtcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlLmFuZFJldHVybihudWxsKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKS5jYXRjaChyID0+IHIpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93RXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJoYW5kbGVzIGFjdGl2ZSBpdGVtIG5vdCBiZWluZyBhIHRleHQgZWRpdG9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsIFwiZ2V0QWN0aXZlVGV4dEVkaXRvclwiKS5hbmRSZXR1cm4oKTtcbiAgICAgIHNweU9uKGNvbXBvc2VyLCBcImdldEVkaXRvckRldGFpbHNcIikuYW5kQ2FsbFRocm91Z2goKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKS5jYXRjaChyID0+IHIpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5nZXRFZGl0b3JEZXRhaWxzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJjbGVhblwiLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBleHRlbnNpb25zID0gW1wiLmJhclwiLCBcIi5iYXpcIiwgXCIucXV1eFwiXTtcblxuICAgIGZ1bmN0aW9uIGZha2VGaWxlUGF0aHMoZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoU2Fuc0V4dGVuc2lvbiA9IGZpbGVQYXRoLnN1YnN0cmluZygwLCBmaWxlUGF0aC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgcmV0dXJuIGV4dGVuc2lvbnMubWFwKGV4dCA9PiBmaWxlUGF0aFNhbnNFeHRlbnNpb24gKyBleHQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVTcGllcyhmaWxlUGF0aCkge1xuICAgICAgc3B5T24oY29tcG9zZXIsIFwiZ2V0RWRpdG9yRGV0YWlsc1wiKS5hbmRSZXR1cm4oe2ZpbGVQYXRofSk7XG4gICAgICBzcHlPbihjb21wb3NlciwgXCJyZXNvbHZlUm9vdEZpbGVQYXRoXCIpLmFuZFJldHVybihmaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHNweU9uKGZzLCBcInJlbW92ZVwiKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4LmNsZWFuRXh0ZW5zaW9uc1wiLCBleHRlbnNpb25zKTtcbiAgICB9KTtcblxuICAgIGl0KFwiZGVsZXRlcyBhbGwgZmlsZXMgZm9yIHRoZSBjdXJyZW50IHRleCBkb2N1bWVudCB3aGVuIG91dHB1dCBoYXMgbm90IGJlZW4gcmVkaXJlY3RlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5ub3JtYWxpemUoXCIvYS9mb28udGV4XCIpO1xuICAgICAgY29uc3QgZmlsZXNUb0RlbGV0ZSA9IGZha2VGaWxlUGF0aHMoZmlsZVBhdGgpO1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKGZpbGVQYXRoKTtcblxuICAgICAgbGV0IGNhbmRpZGF0ZVBhdGhzO1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuY2xlYW4oKS50aGVuKHJlc29sdXRpb25zID0+IHtcbiAgICAgICAgICBjYW5kaWRhdGVQYXRocyA9IF8ucGx1Y2socmVzb2x1dGlvbnMsIFwiZmlsZVBhdGhcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChjYW5kaWRhdGVQYXRocykudG9FcXVhbChmaWxlc1RvRGVsZXRlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzdG9wcyBpbW1pZGlhdGVseSBpZiB0aGUgZmlsZSBpcyBub3QgYSBUZVggZG9jdW1lbnRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IFwiZm9vLmJhclwiO1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKGZpbGVQYXRoLCBbXSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmNsZWFuKCkuY2F0Y2gociA9PiByKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoY29tcG9zZXIucmVzb2x2ZVJvb3RGaWxlUGF0aCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgZXhwZWN0KGZzLnJlbW92ZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcInNob3VsZE1vdmVSZXN1bHRcIiwgZnVuY3Rpb24oKSB7XG4gICAgaXQoXCJzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gdXNpbmcgbmVpdGhlciBhbiBvdXRwdXQgZGlyZWN0b3J5LCBub3IgdGhlIG1vdmUgb3B0aW9uXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiLCBcIlwiKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnlcIiwgZmFsc2UpO1xuXG4gICAgICBleHBlY3QoY29tcG9zZXIuc2hvdWxkTW92ZVJlc3VsdCgpKS50b0JlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIG5vdCB1c2luZyBhbiBvdXRwdXQgZGlyZWN0b3J5LCBidXQgdXNpbmcgdGhlIG1vdmUgb3B0aW9uXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiLCBcIlwiKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnlcIiwgdHJ1ZSk7XG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KCkpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbm90IHVzaW5nIHRoZSBtb3ZlIG9wdGlvbiwgYnV0IHVzaW5nIGFuIG91dHB1dCBkaXJlY3RvcnlcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIsIFwiYmF6XCIpO1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4Lm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeVwiLCBmYWxzZSk7XG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KCkpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgcmV0dXJuIHRydWUgd2hlbiB1c2luZyBib3RoIGFuIG91dHB1dCBkaXJlY3RvcnkgYW5kIHRoZSBtb3ZlIG9wdGlvblwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC5vdXRwdXREaXJlY3RvcnlcIiwgXCJiYXpcIik7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5XCIsIHRydWUpO1xuXG4gICAgICBleHBlY3QoY29tcG9zZXIuc2hvdWxkTW92ZVJlc3VsdCgpKS50b0JlKHRydWUpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/composer-spec.js
