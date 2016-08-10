var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _libIndentationStatusView = require('../lib/indentation-status-view');

var _libIndentationStatusView2 = _interopRequireDefault(_libIndentationStatusView);

var _etchSynchronousScheduler = require('./etch-synchronous-scheduler');

var _etchSynchronousScheduler2 = _interopRequireDefault(_etchSynchronousScheduler);

'use babel';

var MockModel = (function () {
  function MockModel(text) {
    _classCallCheck(this, MockModel);

    this.text = text;
  }

  _createClass(MockModel, [{
    key: 'getText',
    value: function getText() {
      return this.text;
    }
  }]);

  return MockModel;
})();

describe('IndentationStatusView', function () {
  var model = undefined,
      previousScheduler = undefined,
      view = undefined;

  beforeEach(function () {
    previousScheduler = _etch2['default'].getScheduler();
    _etch2['default'].setScheduler(new _etchSynchronousScheduler2['default']());
  });

  afterEach(function () {
    _etch2['default'].setScheduler(previousScheduler);
  });

  it('displays the text given by the model', function () {
    var model = new MockModel('foo');
    var view = new _libIndentationStatusView2['default'](model);

    view.update();

    expect(view.element.textContent).to.eq('foo');
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL3NwZWMvaW5kZW50YXRpb24tc3RhdHVzLXZpZXcuc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWlCLE1BQU07Ozs7d0NBRVcsZ0NBQWdDOzs7O3dDQUNqQyw4QkFBOEI7Ozs7QUFML0QsV0FBVyxDQUFBOztJQU9MLFNBQVM7QUFDRCxXQURSLFNBQVMsQ0FDQSxJQUFJLEVBQUU7MEJBRGYsU0FBUzs7QUFFWCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtHQUNqQjs7ZUFIRyxTQUFTOztXQUtMLG1CQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFBO0tBQ2pCOzs7U0FQRyxTQUFTOzs7QUFVZixRQUFRLENBQUMsdUJBQXVCLEVBQUUsWUFBWTtBQUM1QyxNQUFJLEtBQUssWUFBQTtNQUFFLGlCQUFpQixZQUFBO01BQUUsSUFBSSxZQUFBLENBQUE7O0FBRWxDLFlBQVUsQ0FBQyxZQUFZO0FBQ3JCLHFCQUFpQixHQUFHLGtCQUFLLFlBQVksRUFBRSxDQUFBO0FBQ3ZDLHNCQUFLLFlBQVksQ0FBQywyQ0FBMEIsQ0FBQyxDQUFBO0dBQzlDLENBQUMsQ0FBQTs7QUFFRixXQUFTLENBQUMsWUFBWTtBQUNwQixzQkFBSyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtHQUNyQyxDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLHNDQUFzQyxFQUFFLFlBQVk7QUFDckQsUUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbEMsUUFBTSxJQUFJLEdBQUcsMENBQTBCLEtBQUssQ0FBQyxDQUFBOztBQUU3QyxRQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7O0FBRWIsVUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUM5QyxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9pbmRlbnRhdGlvbi1pbmRpY2F0b3Ivc3BlYy9pbmRlbnRhdGlvbi1zdGF0dXMtdmlldy5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuaW1wb3J0IEluZGVudGF0aW9uU3RhdHVzVmlldyBmcm9tICcuLi9saWIvaW5kZW50YXRpb24tc3RhdHVzLXZpZXcnXG5pbXBvcnQgU3luY2hyb25vdXNTY2hlZHVsZXIgZnJvbSAnLi9ldGNoLXN5bmNocm9ub3VzLXNjaGVkdWxlcidcblxuY2xhc3MgTW9ja01vZGVsIHtcbiAgY29uc3RydWN0b3IgKHRleHQpIHtcbiAgICB0aGlzLnRleHQgPSB0ZXh0XG4gIH1cblxuICBnZXRUZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0XG4gIH1cbn1cblxuZGVzY3JpYmUoJ0luZGVudGF0aW9uU3RhdHVzVmlldycsIGZ1bmN0aW9uICgpIHtcbiAgbGV0IG1vZGVsLCBwcmV2aW91c1NjaGVkdWxlciwgdmlld1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIHByZXZpb3VzU2NoZWR1bGVyID0gZXRjaC5nZXRTY2hlZHVsZXIoKVxuICAgIGV0Y2guc2V0U2NoZWR1bGVyKG5ldyBTeW5jaHJvbm91c1NjaGVkdWxlcigpKVxuICB9KVxuXG4gIGFmdGVyRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgZXRjaC5zZXRTY2hlZHVsZXIocHJldmlvdXNTY2hlZHVsZXIpXG4gIH0pXG5cbiAgaXQoJ2Rpc3BsYXlzIHRoZSB0ZXh0IGdpdmVuIGJ5IHRoZSBtb2RlbCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IG5ldyBNb2NrTW9kZWwoJ2ZvbycpXG4gICAgY29uc3QgdmlldyA9IG5ldyBJbmRlbnRhdGlvblN0YXR1c1ZpZXcobW9kZWwpXG5cbiAgICB2aWV3LnVwZGF0ZSgpXG5cbiAgICBleHBlY3Qodmlldy5lbGVtZW50LnRleHRDb250ZW50KS50by5lcSgnZm9vJylcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/spec/indentation-status-view.spec.js
