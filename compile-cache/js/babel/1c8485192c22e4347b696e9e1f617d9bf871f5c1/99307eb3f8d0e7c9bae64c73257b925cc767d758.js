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
      var statusCode = arguments[1] === undefined ? 0 : arguments[1];

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

      waitsForPromise({ shouldReject: true }, function () {
        return composer.build();
      });

      runs(function () {
        expect(composer.showError).toHaveBeenCalled();
      });
    });

    it("treats missing result from parser as an error", function () {
      initializeSpies("file.tex");
      builder.parseLogFile.andReturn(null);

      waitsForPromise({ shouldReject: true }, function () {
        return composer.build();
      });

      runs(function () {
        expect(composer.showError).toHaveBeenCalled();
      });
    });

    it("handles active item not being a text editor", function () {
      spyOn(atom.workspace, "getActiveTextEditor").andReturn();
      spyOn(composer, "getEditorDetails").andCallThrough();

      waitsForPromise({ shouldReject: true }, function () {
        return composer.build();
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

      waitsForPromise({ shouldReject: true }, function () {
        return composer.clean();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9jb21wb3Nlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzJCQUVvQixnQkFBZ0I7Ozs7c0JBQ3JCLFNBQVM7Ozs7c0JBQ1YsUUFBUTs7OztvQkFDTCxNQUFNOzs7OzJCQUNGLGlCQUFpQjs7OztBQU50QyxXQUFXLENBQUM7O0FBUVosUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFXO0FBQzlCLE1BQUksUUFBUSxZQUFBLENBQUM7O0FBRWIsWUFBVSxDQUFDLFlBQVc7QUFDcEIsWUFBUSxHQUFHLDhCQUFjLENBQUM7R0FDM0IsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUMzQixRQUFJLE1BQU0sWUFBQTtRQUFFLE9BQU8sWUFBQSxDQUFDOztBQUVwQixhQUFTLGVBQWUsQ0FBQyxRQUFRLEVBQWtCO1VBQWhCLFVBQVUsZ0NBQUcsQ0FBQzs7QUFDL0MsWUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7QUFDcEUsV0FBSyxDQUFDLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzRCxXQUFLLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzVDLGNBQU0sRUFBRSxNQUFNO0FBQ2QsZ0JBQVEsRUFBRSxRQUFRO09BQ25CLENBQUMsQ0FBQzs7QUFFSCxhQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDeEYsYUFBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBVztBQUNqQyxnQkFBUSxVQUFVO0FBQ2hCLGVBQUssQ0FBQztBQUFFO0FBQUUscUJBQU8sT0FBTyxD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QUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNqRCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDRFQUE0RSxFQUFFLFlBQVc7QUFDMUYsK0JBQVEsV0FBVyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BELCtCQUFRLFdBQVcsQ0FBQyxtQ0FBbUMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFL0QsWUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2hELENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvY29tcG9zZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBoZWxwZXJzIGZyb20gXCIuL3NwZWMtaGVscGVyc1wiO1xuaW1wb3J0IGZzIGZyb20gXCJmcy1wbHVzXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IENvbXBvc2VyIGZyb20gXCIuLi9saWIvY29tcG9zZXJcIjtcblxuZGVzY3JpYmUoXCJDb21wb3NlclwiLCBmdW5jdGlvbigpIHtcbiAgbGV0IGNvbXBvc2VyO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgY29tcG9zZXIgPSBuZXcgQ29tcG9zZXIoKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJidWlsZFwiLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgZWRpdG9yLCBidWlsZGVyO1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVNwaWVzKGZpbGVQYXRoLCBzdGF0dXNDb2RlID0gMCkge1xuICAgICAgZWRpdG9yID0gamFzbWluZS5jcmVhdGVTcHlPYmooXCJNb2NrRWRpdG9yXCIsIFtcInNhdmVcIiwgXCJpc01vZGlmaWVkXCJdKTtcbiAgICAgIHNweU9uKGNvbXBvc2VyLCBcInJlc29sdmVSb290RmlsZVBhdGhcIikuYW5kUmV0dXJuKGZpbGVQYXRoKTtcbiAgICAgIHNweU9uKGNvbXBvc2VyLCBcImdldEVkaXRvckRldGFpbHNcIikuYW5kUmV0dXJuKHtcbiAgICAgICAgZWRpdG9yOiBlZGl0b3IsXG4gICAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aCxcbiAgICAgIH0pO1xuXG4gICAgICBidWlsZGVyID0gamFzbWluZS5jcmVhdGVTcHlPYmooXCJNb2NrQnVpbGRlclwiLCBbXCJydW5cIiwgXCJjb25zdHJ1Y3RBcmdzXCIsIFwicGFyc2VMb2dGaWxlXCJdKTtcbiAgICAgIGJ1aWxkZXIucnVuLmFuZENhbGxGYWtlKGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2l0Y2ggKHN0YXR1c0NvZGUpIHtcbiAgICAgICAgICBjYXNlIDA6IHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzdGF0dXNDb2RlKTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHN0YXR1c0NvZGUpO1xuICAgICAgfSk7XG4gICAgICBzcHlPbihsYXRleCwgXCJnZXRCdWlsZGVyXCIpLmFuZFJldHVybihidWlsZGVyKTtcbiAgICB9XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24oY29tcG9zZXIsIFwic2hvd1Jlc3VsdFwiKS5hbmRSZXR1cm4oKTtcbiAgICAgIHNweU9uKGNvbXBvc2VyLCBcInNob3dFcnJvclwiKS5hbmRSZXR1cm4oKTtcbiAgICB9KTtcblxuICAgIGl0KFwiZG9lcyBub3RoaW5nIGZvciBuZXcsIHVuc2F2ZWQgZmlsZXNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBpbml0aWFsaXplU3BpZXMobnVsbCk7XG5cbiAgICAgIGxldCByZXN1bHQgPSBcImFhYWFhYWFhYWFhYVwiO1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKS5jYXRjaChyID0+IHJlc3VsdCA9IHIpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoY29tcG9zZXIuc2hvd1Jlc3VsdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dFcnJvcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJkb2VzIG5vdGhpbmcgZm9yIHVuc3VwcG9ydGVkIGZpbGUgZXh0ZW5zaW9uc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGluaXRpYWxpemVTcGllcyhcImZvby5iYXJcIik7XG5cbiAgICAgIGxldCByZXN1bHQ7XG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpLmNhdGNoKHIgPT4gcmVzdWx0ID0gcik7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93UmVzdWx0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICBleHBlY3QoY29tcG9zZXIuc2hvd0Vycm9yKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNhdmVzIHRoZSBmaWxlIGJlZm9yZSBidWlsZGluZywgaWYgbW9kaWZpZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoXCJmaWxlLnRleFwiKTtcbiAgICAgIGVkaXRvci5pc01vZGlmaWVkLmFuZFJldHVybih0cnVlKTtcblxuICAgICAgYnVpbGRlci5wYXJzZUxvZ0ZpbGUuYW5kUmV0dXJuKHtcbiAgICAgICAgb3V0cHV0RmlsZVBhdGg6IFwiZmlsZS5wZGZcIixcbiAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgd2FybmluZ3M6IFtdLFxuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmJ1aWxkKCk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGVkaXRvci5pc01vZGlmaWVkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGV4cGVjdChlZGl0b3Iuc2F2ZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdChcImludm9rZXMgYHNob3dSZXN1bHRgIGFmdGVyIGEgc3VjY2Vzc2Z1bCBidWlsZCwgd2l0aCBleHBlY3RlZCBsb2cgcGFyc2luZyByZXN1bHRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgIG91dHB1dEZpbGVQYXRoOiBcImZpbGUucGRmXCIsXG4gICAgICAgIGVycm9yczogW10sXG4gICAgICAgIHdhcm5pbmdzOiBbXSxcbiAgICAgIH07XG5cbiAgICAgIGluaXRpYWxpemVTcGllcyhcImZpbGUudGV4XCIpO1xuICAgICAgYnVpbGRlci5wYXJzZUxvZ0ZpbGUuYW5kUmV0dXJuKHJlc3VsdCk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmJ1aWxkKCk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dSZXN1bHQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KFwidHJlYXRzIG1pc3Npbmcgb3V0cHV0IGZpbGUgZGF0YSBpbiBsb2cgZmlsZSBhcyBhbiBlcnJvclwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGluaXRpYWxpemVTcGllcyhcImZpbGUudGV4XCIpO1xuXG4gICAgICBidWlsZGVyLnBhcnNlTG9nRmlsZS5hbmRSZXR1cm4oe1xuICAgICAgICBvdXRwdXRGaWxlUGF0aDogbnVsbCxcbiAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgd2FybmluZ3M6IFtdLFxuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSh7c2hvdWxkUmVqZWN0OiB0cnVlfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93RXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJ0cmVhdHMgbWlzc2luZyByZXN1bHQgZnJvbSBwYXJzZXIgYXMgYW4gZXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoXCJmaWxlLnRleFwiKTtcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlLmFuZFJldHVybihudWxsKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKHtzaG91bGRSZWplY3Q6IHRydWV9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmJ1aWxkKCk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dFcnJvcikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdChcImhhbmRsZXMgYWN0aXZlIGl0ZW0gbm90IGJlaW5nIGEgdGV4dCBlZGl0b3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgXCJnZXRBY3RpdmVUZXh0RWRpdG9yXCIpLmFuZFJldHVybigpO1xuICAgICAgc3B5T24oY29tcG9zZXIsIFwiZ2V0RWRpdG9yRGV0YWlsc1wiKS5hbmRDYWxsVGhyb3VnaCgpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2Uoe3Nob3VsZFJlamVjdDogdHJ1ZX0sIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoY29tcG9zZXIuZ2V0RWRpdG9yRGV0YWlscykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiY2xlYW5cIiwgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZXh0ZW5zaW9ucyA9IFtcIi5iYXJcIiwgXCIuYmF6XCIsIFwiLnF1dXhcIl07XG5cbiAgICBmdW5jdGlvbiBmYWtlRmlsZVBhdGhzKGZpbGVQYXRoKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aFNhbnNFeHRlbnNpb24gPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgZmlsZVBhdGgubGFzdEluZGV4T2YoXCIuXCIpKTtcbiAgICAgIHJldHVybiBleHRlbnNpb25zLm1hcChleHQgPT4gZmlsZVBhdGhTYW5zRXh0ZW5zaW9uICsgZXh0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplU3BpZXMoZmlsZVBhdGgpIHtcbiAgICAgIHNweU9uKGNvbXBvc2VyLCBcImdldEVkaXRvckRldGFpbHNcIikuYW5kUmV0dXJuKHtmaWxlUGF0aH0pO1xuICAgICAgc3B5T24oY29tcG9zZXIsIFwicmVzb2x2ZVJvb3RGaWxlUGF0aFwiKS5hbmRSZXR1cm4oZmlsZVBhdGgpO1xuICAgIH1cblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBzcHlPbihmcywgXCJyZW1vdmVcIikuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC5jbGVhbkV4dGVuc2lvbnNcIiwgZXh0ZW5zaW9ucyk7XG4gICAgfSk7XG5cbiAgICBpdChcImRlbGV0ZXMgYWxsIGZpbGVzIGZvciB0aGUgY3VycmVudCB0ZXggZG9jdW1lbnQgd2hlbiBvdXRwdXQgaGFzIG5vdCBiZWVuIHJlZGlyZWN0ZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGgubm9ybWFsaXplKFwiL2EvZm9vLnRleFwiKTtcbiAgICAgIGNvbnN0IGZpbGVzVG9EZWxldGUgPSBmYWtlRmlsZVBhdGhzKGZpbGVQYXRoKTtcbiAgICAgIGluaXRpYWxpemVTcGllcyhmaWxlUGF0aCk7XG5cbiAgICAgIGxldCBjYW5kaWRhdGVQYXRocztcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmNsZWFuKCkudGhlbihyZXNvbHV0aW9ucyA9PiB7XG4gICAgICAgICAgY2FuZGlkYXRlUGF0aHMgPSBfLnBsdWNrKHJlc29sdXRpb25zLCBcImZpbGVQYXRoXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoY2FuZGlkYXRlUGF0aHMpLnRvRXF1YWwoZmlsZXNUb0RlbGV0ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KFwic3RvcHMgaW1taWRpYXRlbHkgaWYgdGhlIGZpbGUgaXMgbm90IGEgVGVYIGRvY3VtZW50XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBcImZvby5iYXJcIjtcbiAgICAgIGluaXRpYWxpemVTcGllcyhmaWxlUGF0aCwgW10pO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2Uoe3Nob3VsZFJlamVjdDogdHJ1ZX0sIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuY2xlYW4oKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoY29tcG9zZXIucmVzb2x2ZVJvb3RGaWxlUGF0aCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgZXhwZWN0KGZzLnJlbW92ZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcInNob3VsZE1vdmVSZXN1bHRcIiwgZnVuY3Rpb24oKSB7XG4gICAgaXQoXCJzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gdXNpbmcgbmVpdGhlciBhbiBvdXRwdXQgZGlyZWN0b3J5LCBub3IgdGhlIG1vdmUgb3B0aW9uXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiLCBcIlwiKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnlcIiwgZmFsc2UpO1xuXG4gICAgICBleHBlY3QoY29tcG9zZXIuc2hvdWxkTW92ZVJlc3VsdCgpKS50b0JlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIG5vdCB1c2luZyBhbiBvdXRwdXQgZGlyZWN0b3J5LCBidXQgdXNpbmcgdGhlIG1vdmUgb3B0aW9uXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiLCBcIlwiKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnlcIiwgdHJ1ZSk7XG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KCkpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbm90IHVzaW5nIHRoZSBtb3ZlIG9wdGlvbiwgYnV0IHVzaW5nIGFuIG91dHB1dCBkaXJlY3RvcnlcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIsIFwiYmF6XCIpO1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4Lm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeVwiLCBmYWxzZSk7XG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KCkpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgcmV0dXJuIHRydWUgd2hlbiB1c2luZyBib3RoIGFuIG91dHB1dCBkaXJlY3RvcnkgYW5kIHRoZSBtb3ZlIG9wdGlvblwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC5vdXRwdXREaXJlY3RvcnlcIiwgXCJiYXpcIik7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5XCIsIHRydWUpO1xuXG4gICAgICBleHBlY3QoY29tcG9zZXIuc2hvdWxkTW92ZVJlc3VsdCgpKS50b0JlKHRydWUpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19