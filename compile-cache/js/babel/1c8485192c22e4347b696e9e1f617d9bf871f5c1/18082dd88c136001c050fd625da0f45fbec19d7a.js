Object.defineProperty(exports, "__esModule", {
  value: true
});

var _werkzeug = require("./werkzeug");

"use babel";

exports["default"] = {
  alwaysOpenResultInAtom: {
    type: "boolean",
    "default": false
  },

  builder: {
    description: "Select compiler for LaTeX",
    type: "string",
    "enum": ["latexmk", "texify"],
    "default": "latexmk"
  },

  cleanExtensions: {
    type: "array",
    items: { type: "string" },
    "default": [".aux", ".bbl", ".blg", ".fdb_latexmk", ".fls", ".log", ".out", ".pdf", ".synctex.gz"]
  },

  customEngine: {
    description: "Enter command for custom LaTeX engine. Overrides Engine.",
    type: "string",
    "default": ""
  },

  enableShellEscape: {
    type: "boolean",
    "default": false
  },

  engine: {
    description: "Select standard LaTeX engine",
    type: "string",
    "enum": ["pdflatex", "lualatex", "xelatex"],
    "default": "pdflatex"
  },

  moveResultToSourceDirectory: {
    title: "Move Result to Source Directory",
    description: (0, _werkzeug.heredoc)("Ensures that the output file produced by a successful build\n      is stored together with the TeX document that produced it."),
    type: "boolean",
    "default": true
  },

  openResultAfterBuild: {
    title: "Open Result after Successful Build",
    type: "boolean",
    "default": true
  },

  openResultInBackground: {
    title: "Open Result in Background",
    type: "boolean",
    "default": true
  },

  outputDirectory: {
    description: (0, _werkzeug.heredoc)("All files generated during a build will be redirected here.\n      Leave blank if you want the build output to be stored in the same\n      directory as the TeX document."),
    type: "string",
    "default": ""
  },

  skimPath: {
    description: "Full application path to Skim (OS X).",
    type: "string",
    "default": "/Applications/Skim.app"
  },

  sumatraPath: {
    title: "SumatraPDF Path",
    description: "Full application path to SumatraPDF (Windows).",
    type: "string",
    "default": "C:\\Program Files (x86)\\SumatraPDF\\SumatraPDF.exe"
  },

  viewerPath: {
    title: "Custom PDF viewer Path",
    description: (0, _werkzeug.heredoc)("Full application path to your PDF viewer. Overrides Skim and SumatraPDF options."),
    type: "string",
    "default": ""
  },

  texPath: {
    title: "TeX Path",
    description: (0, _werkzeug.heredoc)("The full path to your TeX distribution's bin directory.\n      Supports $PATH substitution."),
    type: "string",
    "default": ""
  },

  useMasterFileSearch: {
    description: (0, _werkzeug.heredoc)("Enables naive search for master/root file when building distributed documents.\n      Does not affect \"Magic Comments\" functionality."),
    type: "boolean",
    "default": true
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbmZpZy1zY2hlbWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozt3QkFFc0IsWUFBWTs7QUFGbEMsV0FBVyxDQUFDOztxQkFJRztBQUNiLHdCQUFzQixFQUFFO0FBQ3RCLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0dBQ2Y7O0FBRUQsU0FBTyxFQUFFO0FBQ1AsZUFBVyxFQUFFLDJCQUEyQjtBQUN4QyxRQUFJLEVBQUUsUUFBUTtBQUNkLFlBQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0FBQzNCLGVBQVMsU0FBUztHQUNuQjs7QUFFRCxpQkFBZSxFQUFFO0FBQ2YsUUFBSSxFQUFFLE9BQU87QUFDYixTQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDO0FBQ3ZCLGVBQVMsQ0FDUCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLGFBQWEsQ0FDZDtHQUNGOztBQUVELGNBQVksRUFBRTtBQUNaLGVBQVcsRUFBRSwwREFBMEQ7QUFDdkUsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLEVBQUU7R0FDWjs7QUFFRCxtQkFBaUIsRUFBRTtBQUNqQixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmOztBQUVELFFBQU0sRUFBRTtBQUNOLGVBQVcsRUFBRSw4QkFBOEI7QUFDM0MsUUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUM7QUFDekMsZUFBUyxVQUFVO0dBQ3BCOztBQUVELDZCQUEyQixFQUFFO0FBQzNCLFNBQUssRUFBRSxpQ0FBaUM7QUFDeEMsZUFBVyxFQUFFLGNBbkRULE9BQU8sa0lBb0RtRDtBQUM5RCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtHQUNkOztBQUVELHNCQUFvQixFQUFFO0FBQ3BCLFNBQUssRUFBRSxvQ0FBb0M7QUFDM0MsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDs7QUFFRCx3QkFBc0IsRUFBRTtBQUN0QixTQUFLLEVBQUUsMkJBQTJCO0FBQ2xDLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7O0FBRUQsaUJBQWUsRUFBRTtBQUNmLGVBQVcsRUFBRSxjQXRFVCxPQUFPLCtLQXdFdUI7QUFDbEMsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLEVBQUU7R0FDWjs7QUFFRCxVQUFRLEVBQUU7QUFDUixlQUFXLEVBQUUsdUNBQXVDO0FBQ3BELFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyx3QkFBd0I7R0FDbEM7O0FBRUQsYUFBVyxFQUFFO0FBQ1gsU0FBSyxFQUFFLGlCQUFpQjtBQUN4QixlQUFXLEVBQUUsZ0RBQWdEO0FBQzdELFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxxREFBcUQ7R0FDL0Q7O0FBRUQsWUFBVSxFQUFFO0FBQ1YsU0FBSyxFQUFFLHdCQUF3QjtBQUMvQixlQUFXLEVBQUUsY0E1RlQsT0FBTyxxRkE0RjZGO0FBQ3hHLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxFQUFFO0dBQ1o7O0FBRUQsU0FBTyxFQUFFO0FBQ1AsU0FBSyxFQUFFLFVBQVU7QUFDakIsZUFBVyxFQUFFLGNBbkdULE9BQU8sZ0dBb0dxQjtBQUNoQyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsRUFBRTtHQUNaOztBQUVELHFCQUFtQixFQUFFO0FBQ25CLGVBQVcsRUFBRSxjQTFHVCxPQUFPLDRJQTJHd0M7QUFDbkQsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDtDQUNGIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbmZpZy1zY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQge2hlcmVkb2N9IGZyb20gXCIuL3dlcmt6ZXVnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWx3YXlzT3BlblJlc3VsdEluQXRvbToge1xuICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxuXG4gIGJ1aWxkZXI6IHtcbiAgICBkZXNjcmlwdGlvbjogXCJTZWxlY3QgY29tcGlsZXIgZm9yIExhVGVYXCIsXG4gICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICBlbnVtOiBbXCJsYXRleG1rXCIsIFwidGV4aWZ5XCJdLFxuICAgIGRlZmF1bHQ6IFwibGF0ZXhta1wiLFxuICB9LFxuXG4gIGNsZWFuRXh0ZW5zaW9uczoge1xuICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICBpdGVtczoge3R5cGU6IFwic3RyaW5nXCJ9LFxuICAgIGRlZmF1bHQ6IFtcbiAgICAgIFwiLmF1eFwiLFxuICAgICAgXCIuYmJsXCIsXG4gICAgICBcIi5ibGdcIixcbiAgICAgIFwiLmZkYl9sYXRleG1rXCIsXG4gICAgICBcIi5mbHNcIixcbiAgICAgIFwiLmxvZ1wiLFxuICAgICAgXCIub3V0XCIsXG4gICAgICBcIi5wZGZcIixcbiAgICAgIFwiLnN5bmN0ZXguZ3pcIixcbiAgICBdLFxuICB9LFxuXG4gIGN1c3RvbUVuZ2luZToge1xuICAgIGRlc2NyaXB0aW9uOiBcIkVudGVyIGNvbW1hbmQgZm9yIGN1c3RvbSBMYVRlWCBlbmdpbmUuIE92ZXJyaWRlcyBFbmdpbmUuXCIsXG4gICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICBkZWZhdWx0OiBcIlwiLFxuICB9LFxuXG4gIGVuYWJsZVNoZWxsRXNjYXBlOiB7XG4gICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gIH0sXG5cbiAgZW5naW5lOiB7XG4gICAgZGVzY3JpcHRpb246IFwiU2VsZWN0IHN0YW5kYXJkIExhVGVYIGVuZ2luZVwiLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZW51bTogW1wicGRmbGF0ZXhcIiwgXCJsdWFsYXRleFwiLCBcInhlbGF0ZXhcIl0sXG4gICAgZGVmYXVsdDogXCJwZGZsYXRleFwiLFxuICB9LFxuXG4gIG1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeToge1xuICAgIHRpdGxlOiBcIk1vdmUgUmVzdWx0IHRvIFNvdXJjZSBEaXJlY3RvcnlcIixcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgRW5zdXJlcyB0aGF0IHRoZSBvdXRwdXQgZmlsZSBwcm9kdWNlZCBieSBhIHN1Y2Nlc3NmdWwgYnVpbGRcbiAgICAgIGlzIHN0b3JlZCB0b2dldGhlciB3aXRoIHRoZSBUZVggZG9jdW1lbnQgdGhhdCBwcm9kdWNlZCBpdC5gKSxcbiAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICBkZWZhdWx0OiB0cnVlLFxuICB9LFxuXG4gIG9wZW5SZXN1bHRBZnRlckJ1aWxkOiB7XG4gICAgdGl0bGU6IFwiT3BlbiBSZXN1bHQgYWZ0ZXIgU3VjY2Vzc2Z1bCBCdWlsZFwiLFxuICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gIH0sXG5cbiAgb3BlblJlc3VsdEluQmFja2dyb3VuZDoge1xuICAgIHRpdGxlOiBcIk9wZW4gUmVzdWx0IGluIEJhY2tncm91bmRcIixcbiAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICBkZWZhdWx0OiB0cnVlLFxuICB9LFxuXG4gIG91dHB1dERpcmVjdG9yeToge1xuICAgIGRlc2NyaXB0aW9uOiBoZXJlZG9jKGBBbGwgZmlsZXMgZ2VuZXJhdGVkIGR1cmluZyBhIGJ1aWxkIHdpbGwgYmUgcmVkaXJlY3RlZCBoZXJlLlxuICAgICAgTGVhdmUgYmxhbmsgaWYgeW91IHdhbnQgdGhlIGJ1aWxkIG91dHB1dCB0byBiZSBzdG9yZWQgaW4gdGhlIHNhbWVcbiAgICAgIGRpcmVjdG9yeSBhcyB0aGUgVGVYIGRvY3VtZW50LmApLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCJcIixcbiAgfSxcblxuICBza2ltUGF0aDoge1xuICAgIGRlc2NyaXB0aW9uOiBcIkZ1bGwgYXBwbGljYXRpb24gcGF0aCB0byBTa2ltIChPUyBYKS5cIixcbiAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgIGRlZmF1bHQ6IFwiL0FwcGxpY2F0aW9ucy9Ta2ltLmFwcFwiLFxuICB9LFxuXG4gIHN1bWF0cmFQYXRoOiB7XG4gICAgdGl0bGU6IFwiU3VtYXRyYVBERiBQYXRoXCIsXG4gICAgZGVzY3JpcHRpb246IFwiRnVsbCBhcHBsaWNhdGlvbiBwYXRoIHRvIFN1bWF0cmFQREYgKFdpbmRvd3MpLlwiLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCJDOlxcXFxQcm9ncmFtIEZpbGVzICh4ODYpXFxcXFN1bWF0cmFQREZcXFxcU3VtYXRyYVBERi5leGVcIixcbiAgfSxcblxuICB2aWV3ZXJQYXRoOiB7XG4gICAgdGl0bGU6IFwiQ3VzdG9tIFBERiB2aWV3ZXIgUGF0aFwiLFxuICAgIGRlc2NyaXB0aW9uOiBoZXJlZG9jKGBGdWxsIGFwcGxpY2F0aW9uIHBhdGggdG8geW91ciBQREYgdmlld2VyLiBPdmVycmlkZXMgU2tpbSBhbmQgU3VtYXRyYVBERiBvcHRpb25zLmApLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCJcIixcbiAgfSxcblxuICB0ZXhQYXRoOiB7XG4gICAgdGl0bGU6IFwiVGVYIFBhdGhcIixcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgVGhlIGZ1bGwgcGF0aCB0byB5b3VyIFRlWCBkaXN0cmlidXRpb24ncyBiaW4gZGlyZWN0b3J5LlxuICAgICAgU3VwcG9ydHMgJFBBVEggc3Vic3RpdHV0aW9uLmApLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCJcIixcbiAgfSxcblxuICB1c2VNYXN0ZXJGaWxlU2VhcmNoOiB7XG4gICAgZGVzY3JpcHRpb246IGhlcmVkb2MoYEVuYWJsZXMgbmFpdmUgc2VhcmNoIGZvciBtYXN0ZXIvcm9vdCBmaWxlIHdoZW4gYnVpbGRpbmcgZGlzdHJpYnV0ZWQgZG9jdW1lbnRzLlxuICAgICAgRG9lcyBub3QgYWZmZWN0IFwiTWFnaWMgQ29tbWVudHNcIiBmdW5jdGlvbmFsaXR5LmApLFxuICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gIH0sXG59O1xuIl19