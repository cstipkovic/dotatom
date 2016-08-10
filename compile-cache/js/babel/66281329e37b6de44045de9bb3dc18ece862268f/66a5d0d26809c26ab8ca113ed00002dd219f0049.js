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

  outputFormat: {
    description: 'Output file format. DVI and PS currently only supported for latexmk.',
    type: 'string',
    'enum': ['pdf', 'dvi', 'ps'],
    'default': 'pdf'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbmZpZy1zY2hlbWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozt3QkFFc0IsWUFBWTs7QUFGbEMsV0FBVyxDQUFBOztxQkFJSTtBQUNiLHdCQUFzQixFQUFFO0FBQ3RCLGVBQVcsRUFBRSw4RUFBOEU7QUFDM0YsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjs7QUFFRCxTQUFPLEVBQUU7QUFDUCxlQUFXLEVBQUUsbUVBQW1FO0FBQ2hGLFFBQUksRUFBRSxRQUFRO0FBQ2QsWUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7QUFDM0IsZUFBUyxTQUFTO0dBQ25COztBQUVELGlCQUFlLEVBQUU7QUFDZixRQUFJLEVBQUUsT0FBTztBQUNiLFNBQUssRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUM7QUFDdkIsZUFBUyxDQUNQLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLGNBQWMsRUFDZCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixhQUFhLEVBQ2IsTUFBTSxDQUNQO0dBQ0Y7O0FBRUQsY0FBWSxFQUFFO0FBQ1osZUFBVyxFQUFFLDBEQUEwRDtBQUN2RSxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsRUFBRTtHQUNaOztBQUVELGNBQVksRUFBRTtBQUNaLGVBQVcsRUFBRSxzRUFBc0U7QUFDbkYsUUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7QUFDMUIsZUFBUyxLQUFLO0dBQ2Y7O0FBRUQsbUJBQWlCLEVBQUU7QUFDakIsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjs7QUFFRCxRQUFNLEVBQUU7QUFDTixlQUFXLEVBQUUsOEJBQThCO0FBQzNDLFFBQUksRUFBRSxRQUFRO0FBQ2QsWUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDO0FBQ3pDLGVBQVMsVUFBVTtHQUNwQjs7QUFFRCw2QkFBMkIsRUFBRTtBQUMzQixTQUFLLEVBQUUsaUNBQWlDO0FBQ3hDLGVBQVcsRUFBRSx1SkFDaUQ7QUFDOUQsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDs7QUFFRCxzQkFBb0IsRUFBRTtBQUNwQixTQUFLLEVBQUUsb0NBQW9DO0FBQzNDLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7O0FBRUQsd0JBQXNCLEVBQUU7QUFDdEIsU0FBSyxFQUFFLDJCQUEyQjtBQUNsQyxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtHQUNkOztBQUVELGlCQUFlLEVBQUU7QUFDZixlQUFXLEVBQUUsb01BRXFCO0FBQ2xDLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxFQUFFO0dBQ1o7O0FBRUQsVUFBUSxFQUFFO0FBQ1IsZUFBVyxFQUFFLHVDQUF1QztBQUNwRCxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsd0JBQXdCO0dBQ2xDOztBQUVELGFBQVcsRUFBRTtBQUNYLFNBQUssRUFBRSxpQkFBaUI7QUFDeEIsZUFBVyxFQUFFLGdEQUFnRDtBQUM3RCxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMscURBQXFEO0dBQy9EOztBQUVELFlBQVUsRUFBRTtBQUNWLFNBQUssRUFBRSxvQkFBb0I7QUFDM0IsZUFBVyxFQUFFLHlDQUF5QztBQUN0RCxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsaUJBQWlCO0dBQzNCOztBQUVELFlBQVUsRUFBRTtBQUNWLFNBQUssRUFBRSx3QkFBd0I7QUFDL0IsZUFBVyxFQUFFLDBHQUEyRjtBQUN4RyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsRUFBRTtHQUNaOztBQUVELFNBQU8sRUFBRTtBQUNQLFNBQUssRUFBRSxVQUFVO0FBQ2pCLGVBQVcsRUFBRSxzSEFDbUI7QUFDaEMsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLEVBQUU7R0FDWjs7QUFFRCxxQkFBbUIsRUFBRTtBQUNuQixlQUFXLEVBQUUsaUtBQ3NDO0FBQ25ELFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7Q0FDRiIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9jb25maWctc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtoZXJlZG9jfSBmcm9tICcuL3dlcmt6ZXVnJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFsd2F5c09wZW5SZXN1bHRJbkF0b206IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Fsd2F5cyBvcGVuIHJlc3VsdCBpbiBBdG9tLiBEZXBlbmRzIG9uIHRoZSBwZGYtdmlldyBwYWNrYWdlIGJlaW5nIGluc3RhbGxlZC4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZVxuICB9LFxuXG4gIGJ1aWxkZXI6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlbGVjdCBMYVRlWCBidWlsZGVyLiBNaUtUZVggZGlzdHJpYnV0aW9uIGlzIHJlcXVpcmVkIGZvciB0ZXhpZnkuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBlbnVtOiBbJ2xhdGV4bWsnLCAndGV4aWZ5J10sXG4gICAgZGVmYXVsdDogJ2xhdGV4bWsnXG4gIH0sXG5cbiAgY2xlYW5FeHRlbnNpb25zOiB7XG4gICAgdHlwZTogJ2FycmF5JyxcbiAgICBpdGVtczoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICBkZWZhdWx0OiBbXG4gICAgICAnLmF1eCcsXG4gICAgICAnLmJibCcsXG4gICAgICAnLmJsZycsXG4gICAgICAnLmZkYl9sYXRleG1rJyxcbiAgICAgICcuZmxzJyxcbiAgICAgICcubG9mJyxcbiAgICAgICcubG9nJyxcbiAgICAgICcubG9sJyxcbiAgICAgICcubG90JyxcbiAgICAgICcubmF2JyxcbiAgICAgICcub3V0JyxcbiAgICAgICcucGRmJyxcbiAgICAgICcuc25tJyxcbiAgICAgICcuc3luY3RleC5neicsXG4gICAgICAnLnRvYydcbiAgICBdXG4gIH0sXG5cbiAgY3VzdG9tRW5naW5lOiB7XG4gICAgZGVzY3JpcHRpb246ICdFbnRlciBjb21tYW5kIGZvciBjdXN0b20gTGFUZVggZW5naW5lLiBPdmVycmlkZXMgRW5naW5lLicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJydcbiAgfSxcblxuICBvdXRwdXRGb3JtYXQ6IHtcbiAgICBkZXNjcmlwdGlvbjogJ091dHB1dCBmaWxlIGZvcm1hdC4gRFZJIGFuZCBQUyBjdXJyZW50bHkgb25seSBzdXBwb3J0ZWQgZm9yIGxhdGV4bWsuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBlbnVtOiBbJ3BkZicsICdkdmknLCAncHMnXSxcbiAgICBkZWZhdWx0OiAncGRmJ1xuICB9LFxuXG4gIGVuYWJsZVNoZWxsRXNjYXBlOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIH0sXG5cbiAgZW5naW5lOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZWxlY3Qgc3RhbmRhcmQgTGFUZVggZW5naW5lJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBlbnVtOiBbJ3BkZmxhdGV4JywgJ2x1YWxhdGV4JywgJ3hlbGF0ZXgnXSxcbiAgICBkZWZhdWx0OiAncGRmbGF0ZXgnXG4gIH0sXG5cbiAgbW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5OiB7XG4gICAgdGl0bGU6ICdNb3ZlIFJlc3VsdCB0byBTb3VyY2UgRGlyZWN0b3J5JyxcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgRW5zdXJlcyB0aGF0IHRoZSBvdXRwdXQgZmlsZSBwcm9kdWNlZCBieSBhIHN1Y2Nlc3NmdWwgYnVpbGRcbiAgICAgIGlzIHN0b3JlZCB0b2dldGhlciB3aXRoIHRoZSBUZVggZG9jdW1lbnQgdGhhdCBwcm9kdWNlZCBpdC5gKSxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZVxuICB9LFxuXG4gIG9wZW5SZXN1bHRBZnRlckJ1aWxkOiB7XG4gICAgdGl0bGU6ICdPcGVuIFJlc3VsdCBhZnRlciBTdWNjZXNzZnVsIEJ1aWxkJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZVxuICB9LFxuXG4gIG9wZW5SZXN1bHRJbkJhY2tncm91bmQ6IHtcbiAgICB0aXRsZTogJ09wZW4gUmVzdWx0IGluIEJhY2tncm91bmQnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlXG4gIH0sXG5cbiAgb3V0cHV0RGlyZWN0b3J5OiB7XG4gICAgZGVzY3JpcHRpb246IGhlcmVkb2MoYEFsbCBmaWxlcyBnZW5lcmF0ZWQgZHVyaW5nIGEgYnVpbGQgd2lsbCBiZSByZWRpcmVjdGVkIGhlcmUuXG4gICAgICBMZWF2ZSBibGFuayBpZiB5b3Ugd2FudCB0aGUgYnVpbGQgb3V0cHV0IHRvIGJlIHN0b3JlZCBpbiB0aGUgc2FtZVxuICAgICAgZGlyZWN0b3J5IGFzIHRoZSBUZVggZG9jdW1lbnQuYCksXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJydcbiAgfSxcblxuICBza2ltUGF0aDoge1xuICAgIGRlc2NyaXB0aW9uOiAnRnVsbCBhcHBsaWNhdGlvbiBwYXRoIHRvIFNraW0gKE9TIFgpLicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJy9BcHBsaWNhdGlvbnMvU2tpbS5hcHAnXG4gIH0sXG5cbiAgc3VtYXRyYVBhdGg6IHtcbiAgICB0aXRsZTogJ1N1bWF0cmFQREYgUGF0aCcsXG4gICAgZGVzY3JpcHRpb246ICdGdWxsIGFwcGxpY2F0aW9uIHBhdGggdG8gU3VtYXRyYVBERiAoV2luZG93cykuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxTdW1hdHJhUERGXFxcXFN1bWF0cmFQREYuZXhlJ1xuICB9LFxuXG4gIG9rdWxhclBhdGg6IHtcbiAgICB0aXRsZTogJ09rdWxhciB2aWV3ZXIgUGF0aCcsXG4gICAgZGVzY3JpcHRpb246ICdGdWxsIGFwcGxpY2F0aW9uIHBhdGggdG8gT2t1bGFyICgqbml4KS4nLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcvdXNyL2Jpbi9va3VsYXInXG4gIH0sXG5cbiAgdmlld2VyUGF0aDoge1xuICAgIHRpdGxlOiAnQ3VzdG9tIFBERiB2aWV3ZXIgUGF0aCcsXG4gICAgZGVzY3JpcHRpb246IGhlcmVkb2MoYEZ1bGwgYXBwbGljYXRpb24gcGF0aCB0byB5b3VyIFBERiB2aWV3ZXIuIE92ZXJyaWRlcyBTa2ltIGFuZCBTdW1hdHJhUERGIG9wdGlvbnMuYCksXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJydcbiAgfSxcblxuICB0ZXhQYXRoOiB7XG4gICAgdGl0bGU6ICdUZVggUGF0aCcsXG4gICAgZGVzY3JpcHRpb246IGhlcmVkb2MoYFRoZSBmdWxsIHBhdGggdG8geW91ciBUZVggZGlzdHJpYnV0aW9uJ3MgYmluIGRpcmVjdG9yeS5cbiAgICAgIFN1cHBvcnRzICRQQVRIIHN1YnN0aXR1dGlvbi5gKSxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnJ1xuICB9LFxuXG4gIHVzZU1hc3RlckZpbGVTZWFyY2g6IHtcbiAgICBkZXNjcmlwdGlvbjogaGVyZWRvYyhgRW5hYmxlcyBuYWl2ZSBzZWFyY2ggZm9yIG1hc3Rlci9yb290IGZpbGUgd2hlbiBidWlsZGluZyBkaXN0cmlidXRlZCBkb2N1bWVudHMuXG4gICAgICBEb2VzIG5vdCBhZmZlY3QgJ01hZ2ljIENvbW1lbnRzJyBmdW5jdGlvbmFsaXR5LmApLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/config-schema.js
