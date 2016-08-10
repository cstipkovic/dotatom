Object.defineProperty(exports, "__esModule", {
  value: true
});

var _werkzeug = require("./werkzeug");

"use babel";

exports["default"] = {
  alwaysOpenResultInAtom: {
    description: "Always open result in Atom. Depends on the pdf-view package being installed.",
    type: "boolean",
    "default": false
  },

  builder: {
    description: "Select LaTeX builder. MiKTeX distribution is required for texify.",
    type: "string",
    "enum": ["latexmk", "texify"],
    "default": "latexmk"
  },

  cleanExtensions: {
    type: "array",
    items: { type: "string" },
    "default": [".aux", ".bbl", ".blg", ".fdb_latexmk", ".fls", ".lof", ".log", ".lol", ".lot", ".nav", ".out", ".pdf", ".snm", ".synctex.gz", ".toc"]
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

  okularPath: {
    title: "Okular viewer Path",
    description: "Full application path to Okular (*nix).",
    type: "string",
    "default": "/usr/bin/okular"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbmZpZy1zY2hlbWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozt3QkFFc0IsWUFBWTs7QUFGbEMsV0FBVyxDQUFDOztxQkFJRztBQUNiLHdCQUFzQixFQUFFO0FBQ3RCLGVBQVcsRUFBRSw4RUFBOEU7QUFDM0YsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjs7QUFFRCxTQUFPLEVBQUU7QUFDUCxlQUFXLEVBQUUsbUVBQW1FO0FBQ2hGLFFBQUksRUFBRSxRQUFRO0FBQ2QsWUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7QUFDM0IsZUFBUyxTQUFTO0dBQ25COztBQUVELGlCQUFlLEVBQUU7QUFDZixRQUFJLEVBQUUsT0FBTztBQUNiLFNBQUssRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUM7QUFDdkIsZUFBUyxDQUNQLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLGNBQWMsRUFDZCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixhQUFhLEVBQ2IsTUFBTSxDQUNQO0dBQ0Y7O0FBRUQsY0FBWSxFQUFFO0FBQ1osZUFBVyxFQUFFLDBEQUEwRDtBQUN2RSxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsRUFBRTtHQUNaOztBQUVELG1CQUFpQixFQUFFO0FBQ2pCLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0dBQ2Y7O0FBRUQsUUFBTSxFQUFFO0FBQ04sZUFBVyxFQUFFLDhCQUE4QjtBQUMzQyxRQUFJLEVBQUUsUUFBUTtBQUNkLFlBQU0sQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQztBQUN6QyxlQUFTLFVBQVU7R0FDcEI7O0FBRUQsNkJBQTJCLEVBQUU7QUFDM0IsU0FBSyxFQUFFLGlDQUFpQztBQUN4QyxlQUFXLEVBQUUsY0ExRFQsT0FBTyxrSUEyRG1EO0FBQzlELFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7O0FBRUQsc0JBQW9CLEVBQUU7QUFDcEIsU0FBSyxFQUFFLG9DQUFvQztBQUMzQyxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtHQUNkOztBQUVELHdCQUFzQixFQUFFO0FBQ3RCLFNBQUssRUFBRSwyQkFBMkI7QUFDbEMsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDs7QUFFRCxpQkFBZSxFQUFFO0FBQ2YsZUFBVyxFQUFFLGNBN0VULE9BQU8sK0tBK0V1QjtBQUNsQyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsRUFBRTtHQUNaOztBQUVELFVBQVEsRUFBRTtBQUNSLGVBQVcsRUFBRSx1Q0FBdUM7QUFDcEQsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLHdCQUF3QjtHQUNsQzs7QUFFRCxhQUFXLEVBQUU7QUFDWCxTQUFLLEVBQUUsaUJBQWlCO0FBQ3hCLGVBQVcsRUFBRSxnREFBZ0Q7QUFDN0QsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLHFEQUFxRDtHQUMvRDs7QUFFRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsb0JBQW9CO0FBQzNCLGVBQVcsRUFBRSx5Q0FBeUM7QUFDdEQsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLGlCQUFpQjtHQUMzQjs7QUFFRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGVBQVcsRUFBRSxjQTFHVCxPQUFPLHFGQTBHNkY7QUFDeEcsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLEVBQUU7R0FDWjs7QUFFRCxTQUFPLEVBQUU7QUFDUCxTQUFLLEVBQUUsVUFBVTtBQUNqQixlQUFXLEVBQUUsY0FqSFQsT0FBTyxnR0FrSHFCO0FBQ2hDLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxFQUFFO0dBQ1o7O0FBRUQscUJBQW1CLEVBQUU7QUFDbkIsZUFBVyxFQUFFLGNBeEhULE9BQU8sNElBeUh3QztBQUNuRCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtHQUNkO0NBQ0YiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvY29uZmlnLXNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCB7aGVyZWRvY30gZnJvbSBcIi4vd2Vya3pldWdcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhbHdheXNPcGVuUmVzdWx0SW5BdG9tOiB7XG4gICAgZGVzY3JpcHRpb246IFwiQWx3YXlzIG9wZW4gcmVzdWx0IGluIEF0b20uIERlcGVuZHMgb24gdGhlIHBkZi12aWV3IHBhY2thZ2UgYmVpbmcgaW5zdGFsbGVkLlwiLFxuICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxuXG4gIGJ1aWxkZXI6IHtcbiAgICBkZXNjcmlwdGlvbjogXCJTZWxlY3QgTGFUZVggYnVpbGRlci4gTWlLVGVYIGRpc3RyaWJ1dGlvbiBpcyByZXF1aXJlZCBmb3IgdGV4aWZ5LlwiLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZW51bTogW1wibGF0ZXhta1wiLCBcInRleGlmeVwiXSxcbiAgICBkZWZhdWx0OiBcImxhdGV4bWtcIixcbiAgfSxcblxuICBjbGVhbkV4dGVuc2lvbnM6IHtcbiAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgaXRlbXM6IHt0eXBlOiBcInN0cmluZ1wifSxcbiAgICBkZWZhdWx0OiBbXG4gICAgICBcIi5hdXhcIixcbiAgICAgIFwiLmJibFwiLFxuICAgICAgXCIuYmxnXCIsXG4gICAgICBcIi5mZGJfbGF0ZXhta1wiLFxuICAgICAgXCIuZmxzXCIsXG4gICAgICBcIi5sb2ZcIixcbiAgICAgIFwiLmxvZ1wiLFxuICAgICAgXCIubG9sXCIsXG4gICAgICBcIi5sb3RcIixcbiAgICAgIFwiLm5hdlwiLFxuICAgICAgXCIub3V0XCIsXG4gICAgICBcIi5wZGZcIixcbiAgICAgIFwiLnNubVwiLFxuICAgICAgXCIuc3luY3RleC5nelwiLFxuICAgICAgXCIudG9jXCIsXG4gICAgXSxcbiAgfSxcblxuICBjdXN0b21FbmdpbmU6IHtcbiAgICBkZXNjcmlwdGlvbjogXCJFbnRlciBjb21tYW5kIGZvciBjdXN0b20gTGFUZVggZW5naW5lLiBPdmVycmlkZXMgRW5naW5lLlwiLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCJcIixcbiAgfSxcblxuICBlbmFibGVTaGVsbEVzY2FwZToge1xuICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxuXG4gIGVuZ2luZToge1xuICAgIGRlc2NyaXB0aW9uOiBcIlNlbGVjdCBzdGFuZGFyZCBMYVRlWCBlbmdpbmVcIixcbiAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgIGVudW06IFtcInBkZmxhdGV4XCIsIFwibHVhbGF0ZXhcIiwgXCJ4ZWxhdGV4XCJdLFxuICAgIGRlZmF1bHQ6IFwicGRmbGF0ZXhcIixcbiAgfSxcblxuICBtb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3Rvcnk6IHtcbiAgICB0aXRsZTogXCJNb3ZlIFJlc3VsdCB0byBTb3VyY2UgRGlyZWN0b3J5XCIsXG4gICAgZGVzY3JpcHRpb246IGhlcmVkb2MoYEVuc3VyZXMgdGhhdCB0aGUgb3V0cHV0IGZpbGUgcHJvZHVjZWQgYnkgYSBzdWNjZXNzZnVsIGJ1aWxkXG4gICAgICBpcyBzdG9yZWQgdG9nZXRoZXIgd2l0aCB0aGUgVGVYIGRvY3VtZW50IHRoYXQgcHJvZHVjZWQgaXQuYCksXG4gICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgfSxcblxuICBvcGVuUmVzdWx0QWZ0ZXJCdWlsZDoge1xuICAgIHRpdGxlOiBcIk9wZW4gUmVzdWx0IGFmdGVyIFN1Y2Nlc3NmdWwgQnVpbGRcIixcbiAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICBkZWZhdWx0OiB0cnVlLFxuICB9LFxuXG4gIG9wZW5SZXN1bHRJbkJhY2tncm91bmQ6IHtcbiAgICB0aXRsZTogXCJPcGVuIFJlc3VsdCBpbiBCYWNrZ3JvdW5kXCIsXG4gICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgfSxcblxuICBvdXRwdXREaXJlY3Rvcnk6IHtcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgQWxsIGZpbGVzIGdlbmVyYXRlZCBkdXJpbmcgYSBidWlsZCB3aWxsIGJlIHJlZGlyZWN0ZWQgaGVyZS5cbiAgICAgIExlYXZlIGJsYW5rIGlmIHlvdSB3YW50IHRoZSBidWlsZCBvdXRwdXQgdG8gYmUgc3RvcmVkIGluIHRoZSBzYW1lXG4gICAgICBkaXJlY3RvcnkgYXMgdGhlIFRlWCBkb2N1bWVudC5gKSxcbiAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgIGRlZmF1bHQ6IFwiXCIsXG4gIH0sXG5cbiAgc2tpbVBhdGg6IHtcbiAgICBkZXNjcmlwdGlvbjogXCJGdWxsIGFwcGxpY2F0aW9uIHBhdGggdG8gU2tpbSAoT1MgWCkuXCIsXG4gICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICBkZWZhdWx0OiBcIi9BcHBsaWNhdGlvbnMvU2tpbS5hcHBcIixcbiAgfSxcblxuICBzdW1hdHJhUGF0aDoge1xuICAgIHRpdGxlOiBcIlN1bWF0cmFQREYgUGF0aFwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkZ1bGwgYXBwbGljYXRpb24gcGF0aCB0byBTdW1hdHJhUERGIChXaW5kb3dzKS5cIixcbiAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgIGRlZmF1bHQ6IFwiQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxTdW1hdHJhUERGXFxcXFN1bWF0cmFQREYuZXhlXCIsXG4gIH0sXG5cbiAgb2t1bGFyUGF0aDoge1xuICAgIHRpdGxlOiBcIk9rdWxhciB2aWV3ZXIgUGF0aFwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkZ1bGwgYXBwbGljYXRpb24gcGF0aCB0byBPa3VsYXIgKCpuaXgpLlwiLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCIvdXNyL2Jpbi9va3VsYXJcIixcbiAgfSxcblxuICB2aWV3ZXJQYXRoOiB7XG4gICAgdGl0bGU6IFwiQ3VzdG9tIFBERiB2aWV3ZXIgUGF0aFwiLFxuICAgIGRlc2NyaXB0aW9uOiBoZXJlZG9jKGBGdWxsIGFwcGxpY2F0aW9uIHBhdGggdG8geW91ciBQREYgdmlld2VyLiBPdmVycmlkZXMgU2tpbSBhbmQgU3VtYXRyYVBERiBvcHRpb25zLmApLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCJcIixcbiAgfSxcblxuICB0ZXhQYXRoOiB7XG4gICAgdGl0bGU6IFwiVGVYIFBhdGhcIixcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgVGhlIGZ1bGwgcGF0aCB0byB5b3VyIFRlWCBkaXN0cmlidXRpb24ncyBiaW4gZGlyZWN0b3J5LlxuICAgICAgU3VwcG9ydHMgJFBBVEggc3Vic3RpdHV0aW9uLmApLFxuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCJcIixcbiAgfSxcblxuICB1c2VNYXN0ZXJGaWxlU2VhcmNoOiB7XG4gICAgZGVzY3JpcHRpb246IGhlcmVkb2MoYEVuYWJsZXMgbmFpdmUgc2VhcmNoIGZvciBtYXN0ZXIvcm9vdCBmaWxlIHdoZW4gYnVpbGRpbmcgZGlzdHJpYnV0ZWQgZG9jdW1lbnRzLlxuICAgICAgRG9lcyBub3QgYWZmZWN0IFwiTWFnaWMgQ29tbWVudHNcIiBmdW5jdGlvbmFsaXR5LmApLFxuICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gIH0sXG59O1xuIl19