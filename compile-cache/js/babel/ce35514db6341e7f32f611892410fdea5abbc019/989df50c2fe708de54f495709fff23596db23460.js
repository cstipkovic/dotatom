Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

exports['default'] = {
  jscsPath: {
    title: 'Path to JSCS binary',
    type: 'string',
    'default': _path2['default'].join(__dirname, '..', 'node_modules', 'jscs', 'bin', 'jscs')
  },
  jscsConfigPath: {
    title: 'Path to custom .jscsrc file',
    type: 'string',
    'default': _path2['default'].join(__dirname, '~/', '.jscsrc')
  },
  defaultPreset: {
    title: 'Default preset',
    description: 'What preset to use if no rules file is found.',
    'enum': ['airbnb', 'crockford', 'google', 'grunt', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'yandex'],
    type: 'string',
    'default': 'google'
  },
  esprima: {
    title: 'ES2015 and JSX Support',
    description: 'Attempts to parse your ES2015 and JSX code using the\n                  esprima-fb version of the esprima parser.',
    type: 'boolean',
    'default': false
  },
  esprimaPath: {
    title: 'Path to esprima parser folder',
    type: 'string',
    'default': _path2['default'].join(__dirname, '..', 'node_modules', 'esprima-fb')
  },
  notifications: {
    title: 'Enable editor notifications',
    description: 'If enabled, notifications will be shown after each attempt\n                  to fix a file. Shows both success and error messages.',
    type: 'boolean',
    'default': true
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvanNjcy1maXhlci9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFaUIsTUFBTTs7OztBQUZ2QixXQUFXLENBQUM7O3FCQUlHO0FBQ2IsVUFBUSxFQUFFO0FBQ1IsU0FBSyxFQUFFLHFCQUFxQjtBQUM1QixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDO0dBQzNFO0FBQ0QsZ0JBQWMsRUFBRTtBQUNkLFNBQUssRUFBRSw2QkFBNkI7QUFDcEMsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQztHQUMvQztBQUNELGVBQWEsRUFBRTtBQUNiLFNBQUssRUFBRSxnQkFBZ0I7QUFDdkIsZUFBVyxFQUFFLCtDQUErQztBQUM1RCxZQUFNLENBQ0osUUFBUSxFQUNSLFdBQVcsRUFDWCxRQUFRLEVBQ1IsT0FBTyxFQUNQLFFBQVEsRUFDUixNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFdBQVcsRUFDWCxRQUFRLENBQ1Q7QUFDRCxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsUUFBUTtHQUNsQjtBQUNELFNBQU8sRUFBRTtBQUNQLFNBQUssRUFBRSx3QkFBd0I7QUFDL0IsZUFBVyxxSEFDNkM7QUFDeEQsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjtBQUNELGFBQVcsRUFBRTtBQUNYLFNBQUssRUFBRSwrQkFBK0I7QUFDdEMsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxZQUFZLENBQUM7R0FDbEU7QUFDRCxlQUFhLEVBQUU7QUFDYixTQUFLLEVBQUUsNkJBQTZCO0FBQ3BDLGVBQVcsdUlBQ3lEO0FBQ3BFLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7Q0FDRiIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2pzY3MtZml4ZXIvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGpzY3NQYXRoOiB7XG4gICAgdGl0bGU6ICdQYXRoIHRvIEpTQ1MgYmluYXJ5JyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2pzY3MnLCAnYmluJywgJ2pzY3MnKVxuICB9LFxuICBqc2NzQ29uZmlnUGF0aDoge1xuICAgIHRpdGxlOiAnUGF0aCB0byBjdXN0b20gLmpzY3NyYyBmaWxlJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnfi8nLCAnLmpzY3NyYycpXG4gIH0sXG4gIGRlZmF1bHRQcmVzZXQ6IHtcbiAgICB0aXRsZTogJ0RlZmF1bHQgcHJlc2V0JyxcbiAgICBkZXNjcmlwdGlvbjogJ1doYXQgcHJlc2V0IHRvIHVzZSBpZiBubyBydWxlcyBmaWxlIGlzIGZvdW5kLicsXG4gICAgZW51bTogW1xuICAgICAgJ2FpcmJuYicsXG4gICAgICAnY3JvY2tmb3JkJyxcbiAgICAgICdnb29nbGUnLFxuICAgICAgJ2dydW50JyxcbiAgICAgICdqcXVlcnknLFxuICAgICAgJ21kY3MnLFxuICAgICAgJ25vZGUtc3R5bGUtZ3VpZGUnLFxuICAgICAgJ3dpa2ltZWRpYScsXG4gICAgICAneWFuZGV4J1xuICAgIF0sXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ2dvb2dsZScsXG4gIH0sXG4gIGVzcHJpbWE6IHtcbiAgICB0aXRsZTogJ0VTMjAxNSBhbmQgSlNYIFN1cHBvcnQnLFxuICAgIGRlc2NyaXB0aW9uOiBgQXR0ZW1wdHMgdG8gcGFyc2UgeW91ciBFUzIwMTUgYW5kIEpTWCBjb2RlIHVzaW5nIHRoZVxuICAgICAgICAgICAgICAgICAgZXNwcmltYS1mYiB2ZXJzaW9uIG9mIHRoZSBlc3ByaW1hIHBhcnNlci5gLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZVxuICB9LFxuICBlc3ByaW1hUGF0aDoge1xuICAgIHRpdGxlOiAnUGF0aCB0byBlc3ByaW1hIHBhcnNlciBmb2xkZXInLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdub2RlX21vZHVsZXMnLCAnZXNwcmltYS1mYicpXG4gIH0sXG4gIG5vdGlmaWNhdGlvbnM6IHtcbiAgICB0aXRsZTogJ0VuYWJsZSBlZGl0b3Igbm90aWZpY2F0aW9ucycsXG4gICAgZGVzY3JpcHRpb246IGBJZiBlbmFibGVkLCBub3RpZmljYXRpb25zIHdpbGwgYmUgc2hvd24gYWZ0ZXIgZWFjaCBhdHRlbXB0XG4gICAgICAgICAgICAgICAgICB0byBmaXggYSBmaWxlLiBTaG93cyBib3RoIHN1Y2Nlc3MgYW5kIGVycm9yIG1lc3NhZ2VzLmAsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/jscs-fixer/lib/config.js
