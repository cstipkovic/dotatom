Object.defineProperty(exports, '__esModule', {
  value: true
});

var _werkzeug = require('./werkzeug');

'use babel';

exports['default'] = {
  alwaysOpenResultInAtom: {
    description: 'Always open result in Atom. Depends on the pdf-view package being installed.',
    type: 'boolean',
    'default': false
  },

  builder: {
    description: 'Select LaTeX builder. MiKTeX distribution is required for texify.',
    type: 'string',
    'enum': ['latexmk', 'texify'],
    'default': 'latexmk'
  },

  cleanExtensions: {
    type: 'array',
    items: { type: 'string' },
    'default': ['.aux', '.bbl', '.blg', '.fdb_latexmk', '.fls', '.lof', '.log', '.lol', '.lot', '.nav', '.out', '.pdf', '.snm', '.synctex.gz', '.toc']
  },

  customEngine: {
    description: 'Enter command for custom LaTeX engine. Overrides Engine.',
    type: 'string',
    'default': ''
  },

  enableShellEscape: {
    type: 'boolean',
    'default': false
  },

  engine: {
    description: 'Select standard LaTeX engine',
    type: 'string',
    'enum': ['pdflatex', 'lualatex', 'xelatex'],
    'default': 'pdflatex'
  },

  moveResultToSourceDirectory: {
    title: 'Move Result to Source Directory',
    description: (0, _werkzeug.heredoc)('Ensures that the output file produced by a successful build\n      is stored together with the TeX document that produced it.'),
    type: 'boolean',
    'default': true
  },

  openResultAfterBuild: {
    title: 'Open Result after Successful Build',
    type: 'boolean',
    'default': true
  },

  openResultInBackground: {
    title: 'Open Result in Background',
    type: 'boolean',
    'default': true
  },

  outputDirectory: {
    description: (0, _werkzeug.heredoc)('All files generated during a build will be redirected here.\n      Leave blank if you want the build output to be stored in the same\n      directory as the TeX document.'),
    type: 'string',
    'default': ''
  },

  skimPath: {
    description: 'Full application path to Skim (OS X).',
    type: 'string',
    'default': '/Applications/Skim.app'
  },

  sumatraPath: {
    title: 'SumatraPDF Path',
    description: 'Full application path to SumatraPDF (Windows).',
    type: 'string',
    'default': 'C:\\Program Files (x86)\\SumatraPDF\\SumatraPDF.exe'
  },

  okularPath: {
    title: 'Okular viewer Path',
    description: 'Full application path to Okular (*nix).',
    type: 'string',
    'default': '/usr/bin/okular'
  },

  viewerPath: {
    title: 'Custom PDF viewer Path',
    description: (0, _werkzeug.heredoc)('Full application path to your PDF viewer. Overrides Skim and SumatraPDF options.'),
    type: 'string',
    'default': ''
  },

  texPath: {
    title: 'TeX Path',
    description: (0, _werkzeug.heredoc)('The full path to your TeX distribution\'s bin directory.\n      Supports $PATH substitution.'),
    type: 'string',
    'default': ''
  },

  useMasterFileSearch: {
    description: (0, _werkzeug.heredoc)('Enables naive search for master/root file when building distributed documents.\n      Does not affect \'Magic Comments\' functionality.'),
    type: 'boolean',
    'default': true
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbmZpZy1zY2hlbWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozt3QkFFc0IsWUFBWTs7QUFGbEMsV0FBVyxDQUFBOztxQkFJSTtBQUNiLHdCQUFzQixFQUFFO0FBQ3RCLGVBQVcsRUFBRSw4RUFBOEU7QUFDM0YsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjs7QUFFRCxTQUFPLEVBQUU7QUFDUCxlQUFXLEVBQUUsbUVBQW1FO0FBQ2hGLFFBQUksRUFBRSxRQUFRO0FBQ2QsWUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7QUFDM0IsZUFBUyxTQUFTO0dBQ25COztBQUVELGlCQUFlLEVBQUU7QUFDZixRQUFJLEVBQUUsT0FBTztBQUNiLFNBQUssRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUM7QUFDdkIsZUFBUyxDQUNQLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLGNBQWMsRUFDZCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixhQUFhLEVBQ2IsTUFBTSxDQUNQO0dBQ0Y7O0FBRUQsY0FBWSxFQUFFO0FBQ1osZUFBVyxFQUFFLDBEQUEwRDtBQUN2RSxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsRUFBRTtHQUNaOztBQUVELG1CQUFpQixFQUFFO0FBQ2pCLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0dBQ2Y7O0FBRUQsUUFBTSxFQUFFO0FBQ04sZUFBVyxFQUFFLDhCQUE4QjtBQUMzQyxRQUFJLEVBQUUsUUFBUTtBQUNkLFlBQU0sQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQztBQUN6QyxlQUFTLFVBQVU7R0FDcEI7O0FBRUQsNkJBQTJCLEVBQUU7QUFDM0IsU0FBSyxFQUFFLGlDQUFpQztBQUN4QyxlQUFXLEVBQUUsdUpBQ2lEO0FBQzlELFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7O0FBRUQsc0JBQW9CLEVBQUU7QUFDcEIsU0FBSyxFQUFFLG9DQUFvQztBQUMzQyxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtHQUNkOztBQUVELHdCQUFzQixFQUFFO0FBQ3RCLFNBQUssRUFBRSwyQkFBMkI7QUFDbEMsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDs7QUFFRCxpQkFBZSxFQUFFO0FBQ2YsZUFBVyxFQUFFLG9NQUVxQjtBQUNsQyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsRUFBRTtHQUNaOztBQUVELFVBQVEsRUFBRTtBQUNSLGVBQVcsRUFBRSx1Q0FBdUM7QUFDcEQsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLHdCQUF3QjtHQUNsQzs7QUFFRCxhQUFXLEVBQUU7QUFDWCxTQUFLLEVBQUUsaUJBQWlCO0FBQ3hCLGVBQVcsRUFBRSxnREFBZ0Q7QUFDN0QsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLHFEQUFxRDtHQUMvRDs7QUFFRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsb0JBQW9CO0FBQzNCLGVBQVcsRUFBRSx5Q0FBeUM7QUFDdEQsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLGlCQUFpQjtHQUMzQjs7QUFFRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGVBQVcsRUFBRSwwR0FBMkY7QUFDeEcsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLEVBQUU7R0FDWjs7QUFFRCxTQUFPLEVBQUU7QUFDUCxTQUFLLEVBQUUsVUFBVTtBQUNqQixlQUFXLEVBQUUsc0hBQ21CO0FBQ2hDLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxFQUFFO0dBQ1o7O0FBRUQscUJBQW1CLEVBQUU7QUFDbkIsZUFBVyxFQUFFLGlLQUNzQztBQUNuRCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtHQUNkO0NBQ0YiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvY29uZmlnLXNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7aGVyZWRvY30gZnJvbSAnLi93ZXJremV1ZydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhbHdheXNPcGVuUmVzdWx0SW5BdG9tOiB7XG4gICAgZGVzY3JpcHRpb246ICdBbHdheXMgb3BlbiByZXN1bHQgaW4gQXRvbS4gRGVwZW5kcyBvbiB0aGUgcGRmLXZpZXcgcGFja2FnZSBiZWluZyBpbnN0YWxsZWQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSxcblxuICBidWlsZGVyOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZWxlY3QgTGFUZVggYnVpbGRlci4gTWlLVGVYIGRpc3RyaWJ1dGlvbiBpcyByZXF1aXJlZCBmb3IgdGV4aWZ5LicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZW51bTogWydsYXRleG1rJywgJ3RleGlmeSddLFxuICAgIGRlZmF1bHQ6ICdsYXRleG1rJ1xuICB9LFxuXG4gIGNsZWFuRXh0ZW5zaW9uczoge1xuICAgIHR5cGU6ICdhcnJheScsXG4gICAgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgZGVmYXVsdDogW1xuICAgICAgJy5hdXgnLFxuICAgICAgJy5iYmwnLFxuICAgICAgJy5ibGcnLFxuICAgICAgJy5mZGJfbGF0ZXhtaycsXG4gICAgICAnLmZscycsXG4gICAgICAnLmxvZicsXG4gICAgICAnLmxvZycsXG4gICAgICAnLmxvbCcsXG4gICAgICAnLmxvdCcsXG4gICAgICAnLm5hdicsXG4gICAgICAnLm91dCcsXG4gICAgICAnLnBkZicsXG4gICAgICAnLnNubScsXG4gICAgICAnLnN5bmN0ZXguZ3onLFxuICAgICAgJy50b2MnXG4gICAgXVxuICB9LFxuXG4gIGN1c3RvbUVuZ2luZToge1xuICAgIGRlc2NyaXB0aW9uOiAnRW50ZXIgY29tbWFuZCBmb3IgY3VzdG9tIExhVGVYIGVuZ2luZS4gT3ZlcnJpZGVzIEVuZ2luZS4nLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcnXG4gIH0sXG5cbiAgZW5hYmxlU2hlbGxFc2NhcGU6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSxcblxuICBlbmdpbmU6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlbGVjdCBzdGFuZGFyZCBMYVRlWCBlbmdpbmUnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGVudW06IFsncGRmbGF0ZXgnLCAnbHVhbGF0ZXgnLCAneGVsYXRleCddLFxuICAgIGRlZmF1bHQ6ICdwZGZsYXRleCdcbiAgfSxcblxuICBtb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3Rvcnk6IHtcbiAgICB0aXRsZTogJ01vdmUgUmVzdWx0IHRvIFNvdXJjZSBEaXJlY3RvcnknLFxuICAgIGRlc2NyaXB0aW9uOiBoZXJlZG9jKGBFbnN1cmVzIHRoYXQgdGhlIG91dHB1dCBmaWxlIHByb2R1Y2VkIGJ5IGEgc3VjY2Vzc2Z1bCBidWlsZFxuICAgICAgaXMgc3RvcmVkIHRvZ2V0aGVyIHdpdGggdGhlIFRlWCBkb2N1bWVudCB0aGF0IHByb2R1Y2VkIGl0LmApLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlXG4gIH0sXG5cbiAgb3BlblJlc3VsdEFmdGVyQnVpbGQ6IHtcbiAgICB0aXRsZTogJ09wZW4gUmVzdWx0IGFmdGVyIFN1Y2Nlc3NmdWwgQnVpbGQnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlXG4gIH0sXG5cbiAgb3BlblJlc3VsdEluQmFja2dyb3VuZDoge1xuICAgIHRpdGxlOiAnT3BlbiBSZXN1bHQgaW4gQmFja2dyb3VuZCcsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcblxuICBvdXRwdXREaXJlY3Rvcnk6IHtcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgQWxsIGZpbGVzIGdlbmVyYXRlZCBkdXJpbmcgYSBidWlsZCB3aWxsIGJlIHJlZGlyZWN0ZWQgaGVyZS5cbiAgICAgIExlYXZlIGJsYW5rIGlmIHlvdSB3YW50IHRoZSBidWlsZCBvdXRwdXQgdG8gYmUgc3RvcmVkIGluIHRoZSBzYW1lXG4gICAgICBkaXJlY3RvcnkgYXMgdGhlIFRlWCBkb2N1bWVudC5gKSxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnJ1xuICB9LFxuXG4gIHNraW1QYXRoOiB7XG4gICAgZGVzY3JpcHRpb246ICdGdWxsIGFwcGxpY2F0aW9uIHBhdGggdG8gU2tpbSAoT1MgWCkuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnL0FwcGxpY2F0aW9ucy9Ta2ltLmFwcCdcbiAgfSxcblxuICBzdW1hdHJhUGF0aDoge1xuICAgIHRpdGxlOiAnU3VtYXRyYVBERiBQYXRoJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Z1bGwgYXBwbGljYXRpb24gcGF0aCB0byBTdW1hdHJhUERGIChXaW5kb3dzKS4nLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdDOlxcXFxQcm9ncmFtIEZpbGVzICh4ODYpXFxcXFN1bWF0cmFQREZcXFxcU3VtYXRyYVBERi5leGUnXG4gIH0sXG5cbiAgb2t1bGFyUGF0aDoge1xuICAgIHRpdGxlOiAnT2t1bGFyIHZpZXdlciBQYXRoJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Z1bGwgYXBwbGljYXRpb24gcGF0aCB0byBPa3VsYXIgKCpuaXgpLicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJy91c3IvYmluL29rdWxhcidcbiAgfSxcblxuICB2aWV3ZXJQYXRoOiB7XG4gICAgdGl0bGU6ICdDdXN0b20gUERGIHZpZXdlciBQYXRoJyxcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgRnVsbCBhcHBsaWNhdGlvbiBwYXRoIHRvIHlvdXIgUERGIHZpZXdlci4gT3ZlcnJpZGVzIFNraW0gYW5kIFN1bWF0cmFQREYgb3B0aW9ucy5gKSxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnJ1xuICB9LFxuXG4gIHRleFBhdGg6IHtcbiAgICB0aXRsZTogJ1RlWCBQYXRoJyxcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgVGhlIGZ1bGwgcGF0aCB0byB5b3VyIFRlWCBkaXN0cmlidXRpb24ncyBiaW4gZGlyZWN0b3J5LlxuICAgICAgU3VwcG9ydHMgJFBBVEggc3Vic3RpdHV0aW9uLmApLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcnXG4gIH0sXG5cbiAgdXNlTWFzdGVyRmlsZVNlYXJjaDoge1xuICAgIGRlc2NyaXB0aW9uOiBoZXJlZG9jKGBFbmFibGVzIG5haXZlIHNlYXJjaCBmb3IgbWFzdGVyL3Jvb3QgZmlsZSB3aGVuIGJ1aWxkaW5nIGRpc3RyaWJ1dGVkIGRvY3VtZW50cy5cbiAgICAgIERvZXMgbm90IGFmZmVjdCAnTWFnaWMgQ29tbWVudHMnIGZ1bmN0aW9uYWxpdHkuYCksXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/config-schema.js
