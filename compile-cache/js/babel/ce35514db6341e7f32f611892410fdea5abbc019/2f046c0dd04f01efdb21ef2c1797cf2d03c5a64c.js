function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndentationStatus = require('../lib/indentation-status');

var _libIndentationStatus2 = _interopRequireDefault(_libIndentationStatus);

var _mockConfig = require('./mock-config');

var _mockConfig2 = _interopRequireDefault(_mockConfig);

var _mockEditor = require('./mock-editor');

var _mockEditor2 = _interopRequireDefault(_mockEditor);

var _mockStatusBar = require('./mock-status-bar');

var _mockStatusBar2 = _interopRequireDefault(_mockStatusBar);

var _mockWorkspace = require('./mock-workspace');

var _mockWorkspace2 = _interopRequireDefault(_mockWorkspace);

'use babel';

describe('IndentationStatus', function () {
  var config = undefined,
      editor = undefined,
      status = undefined,
      statusBar = undefined,
      workspace = undefined;

  beforeEach(function () {
    var configMap = {
      'indentation-indicator.spaceAfterColon': false,
      'indentation-indicator.indicatorPosition': 'left'
    };

    config = new _mockConfig2['default'](configMap);
    editor = new _mockEditor2['default']();
    statusBar = new _mockStatusBar2['default']();
    workspace = new _mockWorkspace2['default'](editor);

    status = new _libIndentationStatus2['default'](statusBar, null, config, workspace);
  });

  describe('when there is no active editor', function () {
    beforeEach(function () {
      workspace = new _mockWorkspace2['default']();

      status = new _libIndentationStatus2['default'](statusBar, null, config, workspace);
    });

    it('returns nothing', function () {
      expect(status.getText()).to.eq('');
    });
  });

  describe('when soft tabs is false', function () {
    beforeEach(function () {
      status = new _libIndentationStatus2['default'](statusBar, null, config, workspace);
    });

    it('returns "Tabs:3"', function () {
      expect(status.getText()).to.eq('Tabs:3');
    });
  });

  describe('when soft tabs is true', function () {
    beforeEach(function () {
      editor = new _mockEditor2['default'](true);
      workspace = new _mockWorkspace2['default'](editor);

      status = new _libIndentationStatus2['default'](statusBar, null, config, workspace);
    });

    it('returns "Spaces:3"', function () {
      expect(status.getText()).to.eq('Spaces:3');
    });
  });

  describe('when space after colon is true', function () {
    beforeEach(function () {
      var configMap = {
        'indentation-indicator.spaceAfterColon': true,
        'indentation-indicator.indicatorPosition': 'left'
      };

      config = new _mockConfig2['default'](configMap);

      status = new _libIndentationStatus2['default'](statusBar, null, config, workspace);
    });

    it('returns "Tabs: 3"', function () {
      expect(status.getText()).to.eq('Tabs: 3');
    });
  });

  describe('when indicatorPosition is right', function () {
    beforeEach(function () {
      configMap = {
        'indentation-indicator.spaceAfterColon': false,
        'indentation-indicator.indicatorPosition': 'right'
      };

      config = new _mockConfig2['default'](configMap);
      statusBar = new _mockStatusBar2['default']();

      status = new _libIndentationStatus2['default'](statusBar, null, config, workspace);
    });

    it('displays on the right', function () {
      expect(statusBar.position).to.eq('right');
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL3NwZWMvaW5kZW50YXRpb24tc3RhdHVzLnNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0NBRThCLDJCQUEyQjs7OzswQkFFbEMsZUFBZTs7OzswQkFDZixlQUFlOzs7OzZCQUNaLG1CQUFtQjs7Ozs2QkFDbkIsa0JBQWtCOzs7O0FBUDVDLFdBQVcsQ0FBQTs7QUFTWCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsWUFBWTtBQUN4QyxNQUFJLE1BQU0sWUFBQTtNQUFFLE1BQU0sWUFBQTtNQUFFLE1BQU0sWUFBQTtNQUFFLFNBQVMsWUFBQTtNQUFFLFNBQVMsWUFBQSxDQUFBOztBQUVoRCxZQUFVLENBQUMsWUFBWTtBQUNyQixRQUFJLFNBQVMsR0FBRztBQUNkLDZDQUF1QyxFQUFFLEtBQUs7QUFDOUMsK0NBQXlDLEVBQUUsTUFBTTtLQUNsRCxDQUFBOztBQUVELFVBQU0sR0FBRyw0QkFBZSxTQUFTLENBQUMsQ0FBQTtBQUNsQyxVQUFNLEdBQUcsNkJBQWdCLENBQUE7QUFDekIsYUFBUyxHQUFHLGdDQUFtQixDQUFBO0FBQy9CLGFBQVMsR0FBRywrQkFBa0IsTUFBTSxDQUFDLENBQUE7O0FBRXJDLFVBQU0sR0FBRyxzQ0FBc0IsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDbkUsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxZQUFZO0FBQ3JELGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLGVBQVMsR0FBRyxnQ0FBbUIsQ0FBQTs7QUFFL0IsWUFBTSxHQUFHLHNDQUFzQixTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUNuRSxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLGlCQUFpQixFQUFFLFlBQVk7QUFDaEMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7S0FDbkMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyx5QkFBeUIsRUFBRSxZQUFZO0FBQzlDLGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLFlBQU0sR0FBRyxzQ0FBc0IsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7S0FDbkUsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZO0FBQ2pDLFlBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3pDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsd0JBQXdCLEVBQUUsWUFBWTtBQUM3QyxjQUFVLENBQUMsWUFBWTtBQUNyQixZQUFNLEdBQUcsNEJBQWUsSUFBSSxDQUFDLENBQUE7QUFDN0IsZUFBUyxHQUFHLCtCQUFrQixNQUFNLENBQUMsQ0FBQTs7QUFFckMsWUFBTSxHQUFHLHNDQUFzQixTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUNuRSxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLG9CQUFvQixFQUFFLFlBQVk7QUFDbkMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDM0MsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxZQUFZO0FBQ3JELGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLFVBQUksU0FBUyxHQUFHO0FBQ2QsK0NBQXVDLEVBQUUsSUFBSTtBQUM3QyxpREFBeUMsRUFBRSxNQUFNO09BQ2xELENBQUE7O0FBRUQsWUFBTSxHQUFHLDRCQUFlLFNBQVMsQ0FBQyxDQUFBOztBQUVsQyxZQUFNLEdBQUcsc0NBQXNCLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQ25FLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsbUJBQW1CLEVBQUUsWUFBWTtBQUNsQyxZQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUMxQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLGlDQUFpQyxFQUFFLFlBQVk7QUFDdEQsY0FBVSxDQUFDLFlBQVk7QUFDckIsZUFBUyxHQUFHO0FBQ1YsK0NBQXVDLEVBQUUsS0FBSztBQUM5QyxpREFBeUMsRUFBRSxPQUFPO09BQ25ELENBQUE7O0FBRUQsWUFBTSxHQUFHLDRCQUFlLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLGVBQVMsR0FBRyxnQ0FBbUIsQ0FBQTs7QUFFL0IsWUFBTSxHQUFHLHNDQUFzQixTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUNuRSxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLHVCQUF1QixFQUFFLFlBQVk7QUFDdEMsWUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzFDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2luZGVudGF0aW9uLWluZGljYXRvci9zcGVjL2luZGVudGF0aW9uLXN0YXR1cy5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IEluZGVudGF0aW9uU3RhdHVzIGZyb20gJy4uL2xpYi9pbmRlbnRhdGlvbi1zdGF0dXMnXG5cbmltcG9ydCBNb2NrQ29uZmlnIGZyb20gJy4vbW9jay1jb25maWcnXG5pbXBvcnQgTW9ja0VkaXRvciBmcm9tICcuL21vY2stZWRpdG9yJ1xuaW1wb3J0IE1vY2tTdGF0dXNCYXIgZnJvbSAnLi9tb2NrLXN0YXR1cy1iYXInXG5pbXBvcnQgTW9ja1dvcmtzcGFjZSBmcm9tICcuL21vY2std29ya3NwYWNlJ1xuXG5kZXNjcmliZSgnSW5kZW50YXRpb25TdGF0dXMnLCBmdW5jdGlvbiAoKSB7XG4gIGxldCBjb25maWcsIGVkaXRvciwgc3RhdHVzLCBzdGF0dXNCYXIsIHdvcmtzcGFjZVxuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIGxldCBjb25maWdNYXAgPSB7XG4gICAgICAnaW5kZW50YXRpb24taW5kaWNhdG9yLnNwYWNlQWZ0ZXJDb2xvbic6IGZhbHNlLFxuICAgICAgJ2luZGVudGF0aW9uLWluZGljYXRvci5pbmRpY2F0b3JQb3NpdGlvbic6ICdsZWZ0J1xuICAgIH1cblxuICAgIGNvbmZpZyA9IG5ldyBNb2NrQ29uZmlnKGNvbmZpZ01hcClcbiAgICBlZGl0b3IgPSBuZXcgTW9ja0VkaXRvcigpXG4gICAgc3RhdHVzQmFyID0gbmV3IE1vY2tTdGF0dXNCYXIoKVxuICAgIHdvcmtzcGFjZSA9IG5ldyBNb2NrV29ya3NwYWNlKGVkaXRvcilcblxuICAgIHN0YXR1cyA9IG5ldyBJbmRlbnRhdGlvblN0YXR1cyhzdGF0dXNCYXIsIG51bGwsIGNvbmZpZywgd29ya3NwYWNlKVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBlZGl0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB3b3Jrc3BhY2UgPSBuZXcgTW9ja1dvcmtzcGFjZSgpXG5cbiAgICAgIHN0YXR1cyA9IG5ldyBJbmRlbnRhdGlvblN0YXR1cyhzdGF0dXNCYXIsIG51bGwsIGNvbmZpZywgd29ya3NwYWNlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBub3RoaW5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KHN0YXR1cy5nZXRUZXh0KCkpLnRvLmVxKCcnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gc29mdCB0YWJzIGlzIGZhbHNlJywgZnVuY3Rpb24gKCkge1xuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgc3RhdHVzID0gbmV3IEluZGVudGF0aW9uU3RhdHVzKHN0YXR1c0JhciwgbnVsbCwgY29uZmlnLCB3b3Jrc3BhY2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIFwiVGFiczozXCInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qoc3RhdHVzLmdldFRleHQoKSkudG8uZXEoJ1RhYnM6MycpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBzb2Z0IHRhYnMgaXMgdHJ1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGVkaXRvciA9IG5ldyBNb2NrRWRpdG9yKHRydWUpXG4gICAgICB3b3Jrc3BhY2UgPSBuZXcgTW9ja1dvcmtzcGFjZShlZGl0b3IpXG5cbiAgICAgIHN0YXR1cyA9IG5ldyBJbmRlbnRhdGlvblN0YXR1cyhzdGF0dXNCYXIsIG51bGwsIGNvbmZpZywgd29ya3NwYWNlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBcIlNwYWNlczozXCInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qoc3RhdHVzLmdldFRleHQoKSkudG8uZXEoJ1NwYWNlczozJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHNwYWNlIGFmdGVyIGNvbG9uIGlzIHRydWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY29uZmlnTWFwID0ge1xuICAgICAgICAnaW5kZW50YXRpb24taW5kaWNhdG9yLnNwYWNlQWZ0ZXJDb2xvbic6IHRydWUsXG4gICAgICAgICdpbmRlbnRhdGlvbi1pbmRpY2F0b3IuaW5kaWNhdG9yUG9zaXRpb24nOiAnbGVmdCdcbiAgICAgIH1cblxuICAgICAgY29uZmlnID0gbmV3IE1vY2tDb25maWcoY29uZmlnTWFwKVxuXG4gICAgICBzdGF0dXMgPSBuZXcgSW5kZW50YXRpb25TdGF0dXMoc3RhdHVzQmFyLCBudWxsLCBjb25maWcsIHdvcmtzcGFjZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgXCJUYWJzOiAzXCInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qoc3RhdHVzLmdldFRleHQoKSkudG8uZXEoJ1RhYnM6IDMnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gaW5kaWNhdG9yUG9zaXRpb24gaXMgcmlnaHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25maWdNYXAgPSB7XG4gICAgICAgICdpbmRlbnRhdGlvbi1pbmRpY2F0b3Iuc3BhY2VBZnRlckNvbG9uJzogZmFsc2UsXG4gICAgICAgICdpbmRlbnRhdGlvbi1pbmRpY2F0b3IuaW5kaWNhdG9yUG9zaXRpb24nOiAncmlnaHQnXG4gICAgICB9XG5cbiAgICAgIGNvbmZpZyA9IG5ldyBNb2NrQ29uZmlnKGNvbmZpZ01hcClcbiAgICAgIHN0YXR1c0JhciA9IG5ldyBNb2NrU3RhdHVzQmFyKClcblxuICAgICAgc3RhdHVzID0gbmV3IEluZGVudGF0aW9uU3RhdHVzKHN0YXR1c0JhciwgbnVsbCwgY29uZmlnLCB3b3Jrc3BhY2UpXG4gICAgfSlcblxuICAgIGl0KCdkaXNwbGF5cyBvbiB0aGUgcmlnaHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qoc3RhdHVzQmFyLnBvc2l0aW9uKS50by5lcSgncmlnaHQnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/spec/indentation-status.spec.js
