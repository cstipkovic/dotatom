function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/* This file contains all specs to ensure the base-functionality of
this plugin. */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var projectRoot = _path2['default'].join(__dirname, 'fixtures');
var filePath = _path2['default'].join(projectRoot, 'base.txt');

describe('editorconfig', function () {
	var textEditor = null;

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.workspace.open(filePath)]).then(function (results) {
				textEditor = results[1];
			});
		});
	});

	it('should provide the EditorConfig:generate-config command', function () {
		var isAvailable = false;
		atom.commands.findCommands({ target: atom.views.getView(atom.workspace) }).forEach(function (command) {
			if (command.name === 'EditorConfig:generate-config') {
				isAvailable = true;
			}
		});
		expect(isAvailable).toBeTruthy();
	});

	it('should have set the indent_style to "space"', function () {
		expect(textEditor.getSoftTabs()).toBeTruthy();
	});

	it('should have set the indent_size to 4 characters', function () {
		expect(textEditor.getTabLength()).toEqual(4);
	});

	it('should have set the end_of_line-character to "lf"', function () {
		expect(textEditor.getBuffer().getPreferredLineEnding()).toMatch("\n");
	});

	it('should have set the charset of the document to "utf8"', function () {
		expect(textEditor.getEncoding()).toMatch('utf8');
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvYmFzZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQU1pQixNQUFNOzs7O0FBRXZCLElBQU0sV0FBVyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckQsSUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFcEQsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFNO0FBQzlCLEtBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdEIsV0FBVSxDQUFDLFlBQU07QUFDaEIsaUJBQWUsQ0FBQztVQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FDWCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsRUFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDbEIsY0FBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixDQUFDO0dBQUEsQ0FDRixDQUFDO0VBQ0YsQ0FBQyxDQUFDOztBQUVILEdBQUUsQ0FBQyx5REFBeUQsRUFBRSxZQUFNO0FBQ25FLE1BQUksV0FBVyxHQUFHLEtBQUssQ0FBQztBQUN4QixNQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUMsQ0FBQyxDQUN0RSxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDbkIsT0FBSSxPQUFPLENBQUMsSUFBSSxLQUFLLDhCQUE4QixFQUFFO0FBQ3BELGVBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkI7R0FDRCxDQUFDLENBQUM7QUFDSixRQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7RUFDakMsQ0FBQyxDQUFDOztBQUVILEdBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxZQUFNO0FBQ3ZELFFBQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztFQUM5QyxDQUFDLENBQUM7O0FBRUgsR0FBRSxDQUFDLGlEQUFpRCxFQUFFLFlBQU07QUFDM0QsUUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM3QyxDQUFDLENBQUM7O0FBRUgsR0FBRSxDQUFDLG1EQUFtRCxFQUFFLFlBQU07QUFDN0QsUUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3RFLENBQUMsQ0FBQzs7QUFFSCxHQUFFLENBQUMsdURBQXVELEVBQUUsWUFBTTtBQUNqRSxRQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2pELENBQUMsQ0FBQztDQUNILENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9zcGVjL2Jhc2Utc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qIGVzbGludC1lbnYgamFzbWluZSwgYXRvbXRlc3QgKi9cblxuLyogVGhpcyBmaWxlIGNvbnRhaW5zIGFsbCBzcGVjcyB0byBlbnN1cmUgdGhlIGJhc2UtZnVuY3Rpb25hbGl0eSBvZlxudGhpcyBwbHVnaW4uICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFJvb3QsICdiYXNlLnR4dCcpO1xuXG5kZXNjcmliZSgnZWRpdG9yY29uZmlnJywgKCkgPT4ge1xuXHRsZXQgdGV4dEVkaXRvciA9IG51bGw7XG5cblx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0d2FpdHNGb3JQcm9taXNlKCgpID0+XG5cdFx0XHRQcm9taXNlLmFsbChbXG5cdFx0XHRcdGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdlZGl0b3Jjb25maWcnKSxcblx0XHRcdFx0YXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcblx0XHRcdF0pLnRoZW4ocmVzdWx0cyA9PiB7XG5cdFx0XHRcdHRleHRFZGl0b3IgPSByZXN1bHRzWzFdO1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9KTtcblxuXHRpdCgnc2hvdWxkIHByb3ZpZGUgdGhlIEVkaXRvckNvbmZpZzpnZW5lcmF0ZS1jb25maWcgY29tbWFuZCcsICgpID0+IHtcblx0XHRsZXQgaXNBdmFpbGFibGUgPSBmYWxzZTtcblx0XHRhdG9tLmNvbW1hbmRzLmZpbmRDb21tYW5kcyh7dGFyZ2V0OiBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpfSlcblx0XHRcdC5mb3JFYWNoKGNvbW1hbmQgPT4ge1xuXHRcdFx0XHRpZiAoY29tbWFuZC5uYW1lID09PSAnRWRpdG9yQ29uZmlnOmdlbmVyYXRlLWNvbmZpZycpIHtcblx0XHRcdFx0XHRpc0F2YWlsYWJsZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdGV4cGVjdChpc0F2YWlsYWJsZSkudG9CZVRydXRoeSgpO1xuXHR9KTtcblxuXHRpdCgnc2hvdWxkIGhhdmUgc2V0IHRoZSBpbmRlbnRfc3R5bGUgdG8gXCJzcGFjZVwiJywgKCkgPT4ge1xuXHRcdGV4cGVjdCh0ZXh0RWRpdG9yLmdldFNvZnRUYWJzKCkpLnRvQmVUcnV0aHkoKTtcblx0fSk7XG5cblx0aXQoJ3Nob3VsZCBoYXZlIHNldCB0aGUgaW5kZW50X3NpemUgdG8gNCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuXHRcdGV4cGVjdCh0ZXh0RWRpdG9yLmdldFRhYkxlbmd0aCgpKS50b0VxdWFsKDQpO1xuXHR9KTtcblxuXHRpdCgnc2hvdWxkIGhhdmUgc2V0IHRoZSBlbmRfb2ZfbGluZS1jaGFyYWN0ZXIgdG8gXCJsZlwiJywgKCkgPT4ge1xuXHRcdGV4cGVjdCh0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmdldFByZWZlcnJlZExpbmVFbmRpbmcoKSkudG9NYXRjaChcIlxcblwiKTtcblx0fSk7XG5cblx0aXQoJ3Nob3VsZCBoYXZlIHNldCB0aGUgY2hhcnNldCBvZiB0aGUgZG9jdW1lbnQgdG8gXCJ1dGY4XCInLCAoKSA9PiB7XG5cdFx0ZXhwZWN0KHRleHRFZGl0b3IuZ2V0RW5jb2RpbmcoKSkudG9NYXRjaCgndXRmOCcpO1xuXHR9KTtcbn0pO1xuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/editorconfig/spec/base-spec.js
