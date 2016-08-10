"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

exports["default"] = {
  config: {
    // It should be noted that I, Kepler, hate these Config names. However these
    //  are the names in use by many people. Changing them for the sake of clean
    //  of clean code would cause a mess for our users. Because of this we
    //  override the titles the editor gives them in the settings pane.
    execPath: {
      type: "string",
      "default": "clang"
    },
    clangIncludePaths: {
      type: "array",
      "default": ["."]
    },
    clangSuppressWarnings: {
      type: "boolean",
      "default": false
    },
    clangDefaultCFlags: {
      type: "string",
      "default": "-Wall"
    },
    clangDefaultCppFlags: {
      type: "string",
      "default": "-Wall -std=c++11"
    },
    clangDefaultObjCFlags: {
      type: "string",
      "default": ""
    },
    clangDefaultObjCppFlags: {
      type: "string",
      "default": ""
    },
    clangErrorLimit: {
      type: "integer",
      "default": 0
    },
    verboseDebug: {
      type: "boolean",
      "default": false
    }
  },

  activate: function activate() {
    require("atom-package-deps").install("linter-clang");
  },

  provideLinter: function provideLinter() {
    var helpers = require("atom-linter");
    var clangFlags = require("clang-flags");
    var regex = "(?<file>.+):(?<line>\\d+):(?<col>\\d+):(\{(?<lineStart>\\d+):(?<colStart>\\d+)\-(?<lineEnd>\\d+):(?<colEnd>\\d+)}.*:)? (?<type>[\\w \\-]+): (?<message>.*)";
    return {
      name: "clang",
      grammarScopes: ["source.c", "source.cpp", "source.objc", "source.objcpp"],
      scope: "file",
      lintOnFly: false,
      lint: function lint(activeEditor) {
        var command = atom.config.get("linter-clang.execPath");
        var file = activeEditor.getPath();
        var args = ["-fsyntax-only", "-fno-caret-diagnostics", "-fno-diagnostics-fixit-info", "-fdiagnostics-print-source-range-info", "-fexceptions"];

        var grammar = activeEditor.getGrammar().name;

        if (/^C\+\+/.test(grammar)) {
          //const language = "c++";
          args.push("-xc++");
          args.push.apply(args, _toConsumableArray(atom.config.get("linter-clang.clangDefaultCppFlags").split(/\s+/)));
        }
        if (grammar === "Objective-C++") {
          //const language = "objective-c++";
          args.push("-xobjective-c++");
          args.push.apply(args, _toConsumableArray(atom.config.get("linter-clang.clangDefaultObjCppFlags").split(/\s+/)));
        }
        if (grammar === "C") {
          //const language = "c";
          args.push("-xc");
          args.push.apply(args, _toConsumableArray(atom.config.get("linter-clang.clangDefaultCFlags").split(/\s+/)));
        }
        if (grammar === "Objective-C") {
          //const language = "objective-c";
          args.push("-xobjective-c");
          args.push.apply(args, _toConsumableArray(atom.config.get("linter-clang.clangDefaultObjCFlags").split(/\s+/)));
        }

        args.push("-ferror-limit=" + atom.config.get("linter-clang.clangErrorLimit"));
        if (atom.config.get("linter-clang.clangSuppressWarnings")) {
          args.push("-w");
        }
        if (atom.config.get("linter-clang.verboseDebug")) {
          args.push("--verbose");
        }

        atom.config.get("linter-clang.clangIncludePaths").forEach(function (path) {
          return args.push("-I" + path);
        });

        try {
          flags = clangFlags.getClangFlags(activeEditor.getPath());
          if (flags) {
            args.push.apply(args, flags);
          }
        } catch (error) {
          if (atom.config.get("linter-clang.verboseDebug")) {
            console.log(error);
          }
        }

        // The file is added to the arguments last.
        args.push(file);
        return helpers.exec(command, args, { stream: "stderr" }).then(function (output) {
          return helpers.parse(output, regex);
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWNsYW5nL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7cUJBRUc7QUFDYixRQUFNLEVBQUU7Ozs7O0FBS04sWUFBUSxFQUFFO0FBQ1IsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxPQUFPO0tBQ2pCO0FBQ0QscUJBQWlCLEVBQUU7QUFDakIsVUFBSSxFQUFFLE9BQU87QUFDYixpQkFBUyxDQUFDLEdBQUcsQ0FBQztLQUNmO0FBQ0QseUJBQXFCLEVBQUU7QUFDckIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7QUFDRCxzQkFBa0IsRUFBRTtBQUNsQixVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLE9BQU87S0FDakI7QUFDRCx3QkFBb0IsRUFBRTtBQUNwQixVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLGtCQUFrQjtLQUM1QjtBQUNELHlCQUFxQixFQUFFO0FBQ3JCLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsRUFBRTtLQUNaO0FBQ0QsMkJBQXVCLEVBQUU7QUFDdkIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxFQUFFO0tBQ1o7QUFDRCxtQkFBZSxFQUFFO0FBQ2YsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxDQUFDO0tBQ1g7QUFDRCxnQkFBWSxFQUFFO0FBQ1osVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7R0FDRjs7QUFFRCxVQUFRLEVBQUUsb0JBQU07QUFDZCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7R0FDdEQ7O0FBRUQsZUFBYSxFQUFFLHlCQUFNO0FBQ25CLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxRQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUMsUUFBTSxLQUFLLEdBQUcsNEpBQTRKLENBQUM7QUFDM0ssV0FBTztBQUNMLFVBQUksRUFBRSxPQUFPO0FBQ2IsbUJBQWEsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQztBQUN6RSxXQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVMsRUFBRSxLQUFLO0FBQ2hCLFVBQUksRUFBRSxjQUFDLFlBQVksRUFBSztBQUN0QixZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3pELFlBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQyxZQUFNLElBQUksR0FBRyxDQUFDLGVBQWUsRUFDM0Isd0JBQXdCLEVBQ3hCLDZCQUE2QixFQUM3Qix1Q0FBdUMsRUFDdkMsY0FBYyxDQUFDLENBQUM7O0FBRWxCLFlBQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUM7O0FBRS9DLFlBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFekIsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuQixjQUFJLENBQUMsSUFBSSxNQUFBLENBQVQsSUFBSSxxQkFBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDO1NBQ2pGO0FBQ0QsWUFBRyxPQUFPLEtBQUssZUFBZSxFQUFFOztBQUU5QixjQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDN0IsY0FBSSxDQUFDLElBQUksTUFBQSxDQUFULElBQUkscUJBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQztTQUNwRjtBQUNELFlBQUcsT0FBTyxLQUFLLEdBQUcsRUFBRTs7QUFFbEIsY0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQixjQUFJLENBQUMsSUFBSSxNQUFBLENBQVQsSUFBSSxxQkFBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDO1NBQy9FO0FBQ0QsWUFBRyxPQUFPLEtBQUssYUFBYSxFQUFFOztBQUU1QixjQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzNCLGNBQUksQ0FBQyxJQUFJLE1BQUEsQ0FBVCxJQUFJLHFCQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUM7U0FDbEY7O0FBRUQsWUFBSSxDQUFDLElBQUksb0JBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUcsQ0FBQztBQUM5RSxZQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLEVBQUU7QUFDeEQsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQjtBQUNELFlBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsRUFBRTtBQUMvQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3hCOztBQUVELFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFDN0QsSUFBSSxDQUFDLElBQUksUUFBTSxJQUFJLENBQUc7U0FBQSxDQUN2QixDQUFDOztBQUVGLFlBQUk7QUFDRixlQUFLLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN6RCxjQUFHLEtBQUssRUFBRTtBQUNSLGdCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7V0FDOUI7U0FDRixDQUNELE9BQU8sS0FBSyxFQUFFO0FBQ1osY0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO0FBQy9DLG1CQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1dBQ3BCO1NBQ0Y7OztBQUdELFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEIsZUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2lCQUNoRSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7U0FBQSxDQUM3QixDQUFDO09BQ0g7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jbGFuZy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOiB7XG4gICAgLy8gSXQgc2hvdWxkIGJlIG5vdGVkIHRoYXQgSSwgS2VwbGVyLCBoYXRlIHRoZXNlIENvbmZpZyBuYW1lcy4gSG93ZXZlciB0aGVzZVxuICAgIC8vICBhcmUgdGhlIG5hbWVzIGluIHVzZSBieSBtYW55IHBlb3BsZS4gQ2hhbmdpbmcgdGhlbSBmb3IgdGhlIHNha2Ugb2YgY2xlYW5cbiAgICAvLyAgb2YgY2xlYW4gY29kZSB3b3VsZCBjYXVzZSBhIG1lc3MgZm9yIG91ciB1c2Vycy4gQmVjYXVzZSBvZiB0aGlzIHdlXG4gICAgLy8gIG92ZXJyaWRlIHRoZSB0aXRsZXMgdGhlIGVkaXRvciBnaXZlcyB0aGVtIGluIHRoZSBzZXR0aW5ncyBwYW5lLlxuICAgIGV4ZWNQYXRoOiB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCJjbGFuZ1wiXG4gICAgfSxcbiAgICBjbGFuZ0luY2x1ZGVQYXRoczoge1xuICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgZGVmYXVsdDogW1wiLlwiXVxuICAgIH0sXG4gICAgY2xhbmdTdXBwcmVzc1dhcm5pbmdzOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBjbGFuZ0RlZmF1bHRDRmxhZ3M6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIi1XYWxsXCJcbiAgICB9LFxuICAgIGNsYW5nRGVmYXVsdENwcEZsYWdzOiB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCItV2FsbCAtc3RkPWMrKzExXCJcbiAgICB9LFxuICAgIGNsYW5nRGVmYXVsdE9iakNGbGFnczoge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICB9LFxuICAgIGNsYW5nRGVmYXVsdE9iakNwcEZsYWdzOiB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCJcIlxuICAgIH0sXG4gICAgY2xhbmdFcnJvckxpbWl0OiB7XG4gICAgICB0eXBlOiBcImludGVnZXJcIixcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9LFxuICAgIHZlcmJvc2VEZWJ1Zzoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZTogKCkgPT4ge1xuICAgIHJlcXVpcmUoXCJhdG9tLXBhY2thZ2UtZGVwc1wiKS5pbnN0YWxsKFwibGludGVyLWNsYW5nXCIpO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXI6ICgpID0+IHtcbiAgICBjb25zdCBoZWxwZXJzID0gcmVxdWlyZShcImF0b20tbGludGVyXCIpO1xuICAgIGNvbnN0IGNsYW5nRmxhZ3MgPSByZXF1aXJlKFwiY2xhbmctZmxhZ3NcIik7XG4gICAgY29uc3QgcmVnZXggPSBcIig/PGZpbGU+LispOig/PGxpbmU+XFxcXGQrKTooPzxjb2w+XFxcXGQrKTooXFx7KD88bGluZVN0YXJ0PlxcXFxkKyk6KD88Y29sU3RhcnQ+XFxcXGQrKVxcLSg/PGxpbmVFbmQ+XFxcXGQrKTooPzxjb2xFbmQ+XFxcXGQrKX0uKjopPyAoPzx0eXBlPltcXFxcdyBcXFxcLV0rKTogKD88bWVzc2FnZT4uKilcIjtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJjbGFuZ1wiLFxuICAgICAgZ3JhbW1hclNjb3BlczogW1wic291cmNlLmNcIiwgXCJzb3VyY2UuY3BwXCIsIFwic291cmNlLm9iamNcIiwgXCJzb3VyY2Uub2JqY3BwXCJdLFxuICAgICAgc2NvcGU6IFwiZmlsZVwiLFxuICAgICAgbGludE9uRmx5OiBmYWxzZSxcbiAgICAgIGxpbnQ6IChhY3RpdmVFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IGF0b20uY29uZmlnLmdldChcImxpbnRlci1jbGFuZy5leGVjUGF0aFwiKTtcbiAgICAgICAgY29uc3QgZmlsZSA9IGFjdGl2ZUVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXCItZnN5bnRheC1vbmx5XCIsXG4gICAgICAgICAgXCItZm5vLWNhcmV0LWRpYWdub3N0aWNzXCIsXG4gICAgICAgICAgXCItZm5vLWRpYWdub3N0aWNzLWZpeGl0LWluZm9cIixcbiAgICAgICAgICBcIi1mZGlhZ25vc3RpY3MtcHJpbnQtc291cmNlLXJhbmdlLWluZm9cIixcbiAgICAgICAgICBcIi1mZXhjZXB0aW9uc1wiXTtcblxuICAgICAgICBjb25zdCBncmFtbWFyID0gYWN0aXZlRWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lO1xuXG4gICAgICAgIGlmKC9eQ1xcK1xcKy8udGVzdChncmFtbWFyKSkge1xuICAgICAgICAgIC8vY29uc3QgbGFuZ3VhZ2UgPSBcImMrK1wiO1xuICAgICAgICAgIGFyZ3MucHVzaChcIi14YysrXCIpO1xuICAgICAgICAgIGFyZ3MucHVzaCguLi5hdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItY2xhbmcuY2xhbmdEZWZhdWx0Q3BwRmxhZ3NcIikuc3BsaXQoL1xccysvKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZ3JhbW1hciA9PT0gXCJPYmplY3RpdmUtQysrXCIpIHtcbiAgICAgICAgICAvL2NvbnN0IGxhbmd1YWdlID0gXCJvYmplY3RpdmUtYysrXCI7XG4gICAgICAgICAgYXJncy5wdXNoKFwiLXhvYmplY3RpdmUtYysrXCIpO1xuICAgICAgICAgIGFyZ3MucHVzaCguLi5hdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItY2xhbmcuY2xhbmdEZWZhdWx0T2JqQ3BwRmxhZ3NcIikuc3BsaXQoL1xccysvKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZ3JhbW1hciA9PT0gXCJDXCIpIHtcbiAgICAgICAgICAvL2NvbnN0IGxhbmd1YWdlID0gXCJjXCI7XG4gICAgICAgICAgYXJncy5wdXNoKFwiLXhjXCIpO1xuICAgICAgICAgIGFyZ3MucHVzaCguLi5hdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItY2xhbmcuY2xhbmdEZWZhdWx0Q0ZsYWdzXCIpLnNwbGl0KC9cXHMrLykpO1xuICAgICAgICB9XG4gICAgICAgIGlmKGdyYW1tYXIgPT09IFwiT2JqZWN0aXZlLUNcIikge1xuICAgICAgICAgIC8vY29uc3QgbGFuZ3VhZ2UgPSBcIm9iamVjdGl2ZS1jXCI7XG4gICAgICAgICAgYXJncy5wdXNoKFwiLXhvYmplY3RpdmUtY1wiKTtcbiAgICAgICAgICBhcmdzLnB1c2goLi4uYXRvbS5jb25maWcuZ2V0KFwibGludGVyLWNsYW5nLmNsYW5nRGVmYXVsdE9iakNGbGFnc1wiKS5zcGxpdCgvXFxzKy8pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyZ3MucHVzaChgLWZlcnJvci1saW1pdD0ke2F0b20uY29uZmlnLmdldChcImxpbnRlci1jbGFuZy5jbGFuZ0Vycm9yTGltaXRcIil9YCk7XG4gICAgICAgIGlmKGF0b20uY29uZmlnLmdldChcImxpbnRlci1jbGFuZy5jbGFuZ1N1cHByZXNzV2FybmluZ3NcIikpIHtcbiAgICAgICAgICBhcmdzLnB1c2goXCItd1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZihhdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItY2xhbmcudmVyYm9zZURlYnVnXCIpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKFwiLS12ZXJib3NlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KFwibGludGVyLWNsYW5nLmNsYW5nSW5jbHVkZVBhdGhzXCIpLmZvckVhY2goKHBhdGgpID0+XG4gICAgICAgICAgYXJncy5wdXNoKGAtSSR7cGF0aH1gKVxuICAgICAgICApO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmxhZ3MgPSBjbGFuZ0ZsYWdzLmdldENsYW5nRmxhZ3MoYWN0aXZlRWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICAgICAgaWYoZmxhZ3MpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaC5hcHBseShhcmdzLCBmbGFncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGlmKGF0b20uY29uZmlnLmdldChcImxpbnRlci1jbGFuZy52ZXJib3NlRGVidWdcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZmlsZSBpcyBhZGRlZCB0byB0aGUgYXJndW1lbnRzIGxhc3QuXG4gICAgICAgIGFyZ3MucHVzaChmaWxlKTtcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyhjb21tYW5kLCBhcmdzLCB7c3RyZWFtOiBcInN0ZGVyclwifSkudGhlbihvdXRwdXQgPT5cbiAgICAgICAgICBoZWxwZXJzLnBhcnNlKG91dHB1dCwgcmVnZXgpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/linter-clang/lib/main.js
