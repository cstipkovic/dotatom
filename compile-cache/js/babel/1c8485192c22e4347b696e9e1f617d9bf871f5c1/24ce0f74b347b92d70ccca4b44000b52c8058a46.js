Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _editorconfig = require('editorconfig');

var _editorconfig2 = _interopRequireDefault(_editorconfig);

'use babel';

function init(editor) {
	if (!editor) {
		return;
	}

	var file = editor.getURI();

	if (!file) {
		return;
	}

	_editorconfig2['default'].parse(file).then(function (config) {
		if (Object.keys(config).length === 0) {
			return;
		}

		if (config.indent_style === 'tab') {
			editor.setSoftTabs(false);

			if (config.tab_width) {
				editor.setTabLength(config.tab_width);
			}
		} else if (config.indent_style === 'space') {
			editor.setSoftTabs(true);

			if (config.indent_size) {
				editor.setTabLength(config.indent_size);
			}
		}

		if (config.charset) {
			// EditorConfig charset names matches iconv charset names.
			// Which is used by Atom. So no charset name convertion is needed.
			editor.setEncoding(config.charset);
		}
	});
}

var activate = function activate() {
	atom.workspace.observeTextEditors(init);
};
exports.activate = activate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs0QkFDeUIsY0FBYzs7OztBQUR2QyxXQUFXLENBQUM7O0FBR1osU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JCLEtBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWixTQUFPO0VBQ1A7O0FBRUQsS0FBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUU3QixLQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1YsU0FBTztFQUNQOztBQUVELDJCQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDdkMsTUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckMsVUFBTztHQUNQOztBQUVELE1BQUksTUFBTSxDQUFDLFlBQVksS0FBSyxLQUFLLEVBQUU7QUFDbEMsU0FBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFMUIsT0FBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3JCLFVBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RDO0dBQ0QsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLEtBQUssT0FBTyxFQUFFO0FBQzNDLFNBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpCLE9BQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUN2QixVQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN4QztHQUNEOztBQUVELE1BQUksTUFBTSxDQUFDLE9BQU8sRUFBRTs7O0FBR25CLFNBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ25DO0VBQ0QsQ0FBQyxDQUFDO0NBQ0g7O0FBRU0sSUFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDM0IsS0FBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN4QyxDQUFDO1FBRlMsUUFBUSxHQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbmltcG9ydCBlZGl0b3Jjb25maWcgZnJvbSAnZWRpdG9yY29uZmlnJztcblxuZnVuY3Rpb24gaW5pdChlZGl0b3IpIHtcblx0aWYgKCFlZGl0b3IpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBmaWxlID0gZWRpdG9yLmdldFVSSSgpO1xuXG5cdGlmICghZmlsZSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGVkaXRvcmNvbmZpZy5wYXJzZShmaWxlKS50aGVuKGNvbmZpZyA9PiB7XG5cdFx0aWYgKE9iamVjdC5rZXlzKGNvbmZpZykubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZy5pbmRlbnRfc3R5bGUgPT09ICd0YWInKSB7XG5cdFx0XHRlZGl0b3Iuc2V0U29mdFRhYnMoZmFsc2UpO1xuXG5cdFx0XHRpZiAoY29uZmlnLnRhYl93aWR0aCkge1xuXHRcdFx0XHRlZGl0b3Iuc2V0VGFiTGVuZ3RoKGNvbmZpZy50YWJfd2lkdGgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoY29uZmlnLmluZGVudF9zdHlsZSA9PT0gJ3NwYWNlJykge1xuXHRcdFx0ZWRpdG9yLnNldFNvZnRUYWJzKHRydWUpO1xuXG5cdFx0XHRpZiAoY29uZmlnLmluZGVudF9zaXplKSB7XG5cdFx0XHRcdGVkaXRvci5zZXRUYWJMZW5ndGgoY29uZmlnLmluZGVudF9zaXplKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLmNoYXJzZXQpIHtcblx0XHRcdC8vIEVkaXRvckNvbmZpZyBjaGFyc2V0IG5hbWVzIG1hdGNoZXMgaWNvbnYgY2hhcnNldCBuYW1lcy5cblx0XHRcdC8vIFdoaWNoIGlzIHVzZWQgYnkgQXRvbS4gU28gbm8gY2hhcnNldCBuYW1lIGNvbnZlcnRpb24gaXMgbmVlZGVkLlxuXHRcdFx0ZWRpdG9yLnNldEVuY29kaW5nKGNvbmZpZy5jaGFyc2V0KTtcblx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgbGV0IGFjdGl2YXRlID0gKCkgPT4ge1xuXHRhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoaW5pdCk7XG59O1xuIl19