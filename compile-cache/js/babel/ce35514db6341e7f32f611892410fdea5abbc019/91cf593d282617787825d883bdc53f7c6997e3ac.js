Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _eventKit = require('event-kit');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lazyReq = require('lazy-req');

var _lazyReq2 = _interopRequireDefault(_lazyReq);

var lazyReq = (0, _lazyReq2['default'])(require);
var lodash = lazyReq('lodash');
var jshint = lazyReq('jshint');
var jsxhint = lazyReq('jshint-jsx');
var cli = lazyReq('jshint/src/cli');
var loadConfig = lazyReq('./load-config');
var markersByEditorId = {};
var errorsByEditorId = {};

var subscriptionTooltips = new _eventKit.CompositeDisposable();
var subscriptionEvents = new _eventKit.CompositeDisposable();

var _ = undefined;
var statusBar = undefined;

var SUPPORTED_GRAMMARS = ['source.js', 'source.jsx', 'source.js.jsx'];

var currentLine = undefined;
var currentChar = undefined;

var goToError = function goToError() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor || !currentLine || !currentChar) {
		return;
	}

	editor.setCursorBufferPosition([currentLine - 1, currentChar - 1]);
};

var jsHintStatusBar = document.createElement('a');
jsHintStatusBar.setAttribute('id', 'jshint-statusbar');
jsHintStatusBar.classList.add('inline-block');
jsHintStatusBar.addEventListener('click', goToError);

var updateStatusText = function updateStatusText(line, character, reason) {
	jsHintStatusBar.textContent = line && character && reason ? 'JSHint ' + line + ':' + character + ' ' + reason : '';
	currentLine = line;
	currentChar = character;
};

var getMarkersForEditor = function getMarkersForEditor(editor) {
	if (editor && markersByEditorId[editor.id]) {
		return markersByEditorId[editor.id];
	}

	return {};
};

var getErrorsForEditor = function getErrorsForEditor(editor) {
	if (errorsByEditorId[editor.id]) {
		return errorsByEditorId[editor.id];
	}

	return [];
};

var destroyMarkerAtRow = function destroyMarkerAtRow(editor, row) {
	if (markersByEditorId[editor.id] && markersByEditorId[editor.id][row]) {
		markersByEditorId[editor.id][row].destroy();
		delete markersByEditorId[editor.id][row];
	}
};

var getRowForError = function getRowForError(error) {
	// JSHint reports `line: 0` when config error
	var line = error[0].line || 1;

	var row = line - 1;

	return row;
};

var clearOldMarkers = function clearOldMarkers(editor, errors) {
	subscriptionTooltips.dispose();
	subscriptionTooltips = new _eventKit.CompositeDisposable();

	var rows = _.map(errors, function (error) {
		return getRowForError(error);
	});

	var oldMarkers = getMarkersForEditor(editor);
	_.each(_.keys(oldMarkers), function (row) {
		if (!_.contains(rows, row)) {
			destroyMarkerAtRow(editor, row);
		}
	});
};

var saveMarker = function saveMarker(editor, marker, row) {
	if (!markersByEditorId[editor.id]) {
		markersByEditorId[editor.id] = {};
	}

	markersByEditorId[editor.id][row] = marker;
};

var getMarkerAtRow = function getMarkerAtRow(editor, row) {
	if (!markersByEditorId[editor.id]) {
		return null;
	}

	return markersByEditorId[editor.id][row];
};

var updateStatusbar = function updateStatusbar() {
	if (!statusBar) {
		return;
	}

	if (!jsHintStatusBar.parentNode) {
		statusBar.addLeftTile({ item: jsHintStatusBar });
	}

	var editor = atom.workspace.getActiveTextEditor();

	if (!editor || !errorsByEditorId[editor.id]) {
		updateStatusText();
		return;
	}

	var line = editor.getCursorBufferPosition().row + 1;
	var error = errorsByEditorId[editor.id][line] || _.first(_.compact(errorsByEditorId[editor.id]));
	error = Array.isArray(error) ? error[0] : {};

	updateStatusText(error.line, error.character, error.reason);
};

var goToNextError = function goToNextError() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor || !markersByEditorId[editor.id] || !errorsByEditorId[editor.id]) {
		return;
	}

	var cursorRow = editor.getCursorBufferPosition().row;

	var markerRows = _.sortBy(_.map(_.keys(getMarkersForEditor(editor)), function (x) {
		return Number(x);
	}));
	var nextRow = _.find(markerRows, function (x) {
		return x > cursorRow;
	});
	if (!nextRow) {
		nextRow = _.first(markerRows);
	}
	if (!nextRow) {
		return;
	}

	var errors = errorsByEditorId[editor.id][nextRow + 1];
	if (errors) {
		editor.setCursorBufferPosition([nextRow, errors[0].character - 1]);
	}
};

var getReasonsForError = function getReasonsForError(err) {
	return _.map(err, function (el) {
		return el.character + ': ' + el.reason + ' (' + el.code + ')';
	});
};

var addReasons = function addReasons(editor, marker, error) {
	var row = getRowForError(error);
	var editorElement = atom.views.getView(editor);
	var reasons = '<div class="jshint-errors">' + getReasonsForError(error).join('<br>') + '</div>';
	var target = editorElement.shadowRoot.querySelector('.line-number[data-buffer-row="' + row + '"]');

	if (!target) {
		return;
	}

	var tooltip = atom.tooltips.add(target, {
		title: reasons,
		placement: 'bottom',
		delay: { show: 200 }
	});

	subscriptionTooltips.add(tooltip);
};

var displayError = function displayError(editor, err) {
	var row = getRowForError(err);

	if (getMarkerAtRow(editor, row)) {
		return;
	}

	var marker = editor.markBufferRange([[row, 0], [row, 1]]);
	editor.decorateMarker(marker, { type: 'line', 'class': 'jshint-line' });
	editor.decorateMarker(marker, { type: 'line-number', 'class': 'jshint-line-number' });
	saveMarker(editor, marker, row);
	addReasons(editor, marker, err);
};

var displayErrors = function displayErrors(editor) {
	var errors = _.compact(getErrorsForEditor(editor));
	clearOldMarkers(editor, errors);
	updateStatusbar();
	_.each(errors, function (err) {
		return displayError(editor, err);
	});
};

var removeMarkersForEditorId = function removeMarkersForEditorId(id) {
	if (markersByEditorId[id]) {
		delete markersByEditorId[id];
	}
};

var removeErrorsForEditorId = function removeErrorsForEditorId(id) {
	if (errorsByEditorId[id]) {
		delete errorsByEditorId[id];
	}
};

var lint = function lint() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	if (SUPPORTED_GRAMMARS.indexOf(editor.getGrammar().scopeName) === -1) {
		return;
	}

	var file = editor.getURI();

	// Hack to make JSHint look for .jshintignore in the correct dir
	// Because JSHint doesn't use its `cwd` option
	process.chdir(_path2['default'].dirname(file));

	// Remove errors and don't lint if file is ignored in .jshintignore
	if (file && cli().gather({ args: [file] }).length === 0) {
		removeErrorsForEditorId(editor.id);
		displayErrors(editor);
		removeMarkersForEditorId(editor.id);
		return;
	}

	var config = file ? loadConfig()(file) : {};
	var linter = atom.config.get('jshint.supportLintingJsx') || atom.config.get('jshint.transformJsx') ? jsxhint().JSXHINT : jshint().JSHINT;

	if (Object.keys(config).length === 0 && atom.config.get('jshint.onlyConfig')) {
		return;
	}

	try {
		linter(editor.getText(), config, config.globals);
	} catch (err) {}

	removeErrorsForEditorId(editor.id);

	// workaround the errors array sometimes containing `null`
	var errors = _.compact(linter.errors);

	if (errors.length > 0) {
		(function () {
			// aggregate same-line errors
			var ret = [];
			_.each(errors, function (el) {
				var l = el.line;

				if (Array.isArray(ret[l])) {
					ret[l].push(el);

					ret[l] = _.sortBy(ret[l], function (el) {
						return el.character;
					});
				} else {
					ret[l] = [el];
				}
			});

			errorsByEditorId[editor.id] = ret;
		})();
	}

	displayErrors(editor);
};

var debouncedLint = null;
var debouncedDisplayErrors = null;
var debouncedUpdateStatusbar = null;

var registerEvents = function registerEvents() {
	subscriptionEvents.dispose();
	subscriptionEvents = new _eventKit.CompositeDisposable();

	updateStatusbar();

	var editor = atom.workspace.getActiveTextEditor();
	if (!editor) {
		return;
	}

	displayErrors(editor);

	if (!atom.config.get('jshint.validateOnlyOnSave')) {
		subscriptionEvents.add(editor.onDidChange(debouncedLint));
		debouncedLint();
	}

	subscriptionEvents.add(editor.onDidSave(debouncedLint));
	subscriptionEvents.add(editor.onDidChangeScrollTop(function () {
		return debouncedDisplayErrors(editor);
	}));
	subscriptionEvents.add(editor.onDidChangeCursorPosition(debouncedUpdateStatusbar));

	subscriptionEvents.add(editor.onDidDestroy(function () {
		removeErrorsForEditorId(editor.id);
		displayErrors(editor);
		removeMarkersForEditorId(editor.id);
	}));
};

var config = {
	onlyConfig: {
		type: 'boolean',
		'default': false,
		description: 'Disable linter if there is no config file found for the linter.'
	},
	validateOnlyOnSave: {
		type: 'boolean',
		'default': false
	},
	supportLintingJsx: {
		type: 'boolean',
		'default': false,
		title: 'Support Linting JSX'
	}
};

exports.config = config;
var subscriptionMain = null;

var activate = function activate() {
	_ = lodash();
	debouncedLint = _.debounce(lint, 200);
	debouncedDisplayErrors = _.debounce(displayErrors, 200);
	debouncedUpdateStatusbar = _.debounce(updateStatusbar, 100);

	subscriptionMain = new _eventKit.CompositeDisposable();
	subscriptionMain.add(atom.workspace.observeActivePaneItem(registerEvents));
	subscriptionMain.add(atom.config.observe('jshint.validateOnlyOnSave', registerEvents));
	subscriptionMain.add(atom.commands.add('atom-workspace', 'jshint:lint', lint));
	subscriptionMain.add(atom.commands.add('atom-workspace', 'jshint:go-to-error', goToError));
	subscriptionMain.add(atom.commands.add('atom-workspace', 'jshint:go-to-next-error', goToNextError));
};

exports.activate = activate;
var deactivate = function deactivate() {
	subscriptionTooltips.dispose();
	subscriptionEvents.dispose();
	subscriptionMain.dispose();
};

exports.deactivate = deactivate;
var consumeStatusBar = function consumeStatusBar(instance) {
	statusBar = instance;
};
exports.consumeStatusBar = consumeStatusBar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvanNoaW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3dCQUNrQyxXQUFXOztvQkFDNUIsTUFBTTs7Ozt1QkFDQyxVQUFVOzs7O0FBRWxDLElBQU0sT0FBTyxHQUFHLDBCQUFZLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM1QyxJQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM3QixJQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsSUFBSSxvQkFBb0IsR0FBRyxtQ0FBeUIsQ0FBQztBQUNyRCxJQUFJLGtCQUFrQixHQUFHLG1DQUF5QixDQUFDOztBQUVuRCxJQUFJLENBQUMsWUFBQSxDQUFDO0FBQ04sSUFBSSxTQUFTLFlBQUEsQ0FBQzs7QUFFZCxJQUFNLGtCQUFrQixHQUFHLENBQzFCLFdBQVcsRUFDWCxZQUFZLEVBQ1osZUFBZSxDQUNmLENBQUM7O0FBRUYsSUFBSSxXQUFXLFlBQUEsQ0FBQztBQUNoQixJQUFJLFdBQVcsWUFBQSxDQUFDOztBQUVoQixJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsR0FBUztBQUN2QixLQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRXBELEtBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDNUMsU0FBTztFQUNQOztBQUVELE9BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDbkUsQ0FBQzs7QUFFRixJQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BELGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDdkQsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFckQsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBSztBQUNyRCxnQkFBZSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksU0FBUyxJQUFJLE1BQU0sZUFBYSxJQUFJLFNBQUksU0FBUyxTQUFJLE1BQU0sR0FBSyxFQUFFLENBQUM7QUFDekcsWUFBVyxHQUFHLElBQUksQ0FBQztBQUNuQixZQUFXLEdBQUcsU0FBUyxDQUFDO0NBQ3hCLENBQUM7O0FBRUYsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBRyxNQUFNLEVBQUk7QUFDckMsS0FBSSxNQUFNLElBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzNDLFNBQU8saUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3BDOztBQUVELFFBQU8sRUFBRSxDQUFDO0NBQ1YsQ0FBQzs7QUFFRixJQUFNLGtCQUFrQixHQUFHLFNBQXJCLGtCQUFrQixDQUFHLE1BQU0sRUFBSTtBQUNwQyxLQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxTQUFPLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNuQzs7QUFFRCxRQUFPLEVBQUUsQ0FBQztDQUNWLENBQUM7O0FBRUYsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsQ0FBSSxNQUFNLEVBQUUsR0FBRyxFQUFLO0FBQzNDLEtBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN0RSxtQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUMsU0FBTyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDekM7Q0FDRCxDQUFDOztBQUVGLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBRyxLQUFLLEVBQUk7O0FBRS9CLEtBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDOztBQUVoQyxLQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDOztBQUVyQixRQUFPLEdBQUcsQ0FBQztDQUNYLENBQUM7O0FBRUYsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLE1BQU0sRUFBRSxNQUFNLEVBQUs7QUFDM0MscUJBQW9CLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IscUJBQW9CLEdBQUcsbUNBQXlCLENBQUM7O0FBRWpELEtBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQUEsS0FBSztTQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUM7RUFBQSxDQUFDLENBQUM7O0FBRTNELEtBQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFBLEdBQUcsRUFBSTtBQUNqQyxNQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDM0IscUJBQWtCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQ2hDO0VBQ0QsQ0FBQyxDQUFDO0NBQ0gsQ0FBQzs7QUFFRixJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBSztBQUMzQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2xDLG1CQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7RUFDbEM7O0FBRUQsa0JBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztDQUMzQyxDQUFDOztBQUVGLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBSSxNQUFNLEVBQUUsR0FBRyxFQUFLO0FBQ3ZDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbEMsU0FBTyxJQUFJLENBQUM7RUFDWjs7QUFFRCxRQUFPLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUN6QyxDQUFDOztBQUVGLElBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsR0FBUztBQUM3QixLQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2YsU0FBTztFQUNQOztBQUVELEtBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFO0FBQ2hDLFdBQVMsQ0FBQyxXQUFXLENBQUMsRUFBQyxJQUFJLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQztFQUMvQzs7QUFFRCxLQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRXBELEtBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDNUMsa0JBQWdCLEVBQUUsQ0FBQztBQUNuQixTQUFPO0VBQ1A7O0FBRUQsS0FBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN0RCxLQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakcsTUFBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFN0MsaUJBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUM1RCxDQUFDOztBQUVGLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsR0FBUztBQUMzQixLQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRXBELEtBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDN0UsU0FBTztFQUNQOztBQUVELEtBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLEdBQUcsQ0FBQzs7QUFFdkQsS0FBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxVQUFBLENBQUM7U0FBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO0VBQUEsQ0FBQyxDQUFDLENBQUM7QUFDeEYsS0FBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQSxDQUFDO1NBQUksQ0FBQyxHQUFHLFNBQVM7RUFBQSxDQUFDLENBQUM7QUFDckQsS0FBSSxDQUFDLE9BQU8sRUFBRTtBQUNiLFNBQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQzlCO0FBQ0QsS0FBSSxDQUFDLE9BQU8sRUFBRTtBQUNiLFNBQU87RUFDUDs7QUFFRCxLQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hELEtBQUksTUFBTSxFQUFFO0FBQ1gsUUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNuRTtDQUNELENBQUM7O0FBRUYsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsQ0FBRyxHQUFHO1FBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBQSxFQUFFO1NBQU8sRUFBRSxDQUFDLFNBQVMsVUFBSyxFQUFFLENBQUMsTUFBTSxVQUFLLEVBQUUsQ0FBQyxJQUFJO0VBQUcsQ0FBQztDQUFBLENBQUM7O0FBRWpHLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFLO0FBQzdDLEtBQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxLQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRCxLQUFNLE9BQU8sbUNBQWlDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBUSxDQUFDO0FBQzdGLEtBQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsYUFBYSxvQ0FBa0MsR0FBRyxRQUFLLENBQUM7O0FBRWhHLEtBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWixTQUFPO0VBQ1A7O0FBRUQsS0FBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ3pDLE9BQUssRUFBRSxPQUFPO0FBQ2QsV0FBUyxFQUFFLFFBQVE7QUFDbkIsT0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQztFQUNsQixDQUFDLENBQUM7O0FBRUgscUJBQW9CLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ2xDLENBQUM7O0FBRUYsSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksTUFBTSxFQUFFLEdBQUcsRUFBSztBQUNyQyxLQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWhDLEtBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtBQUNoQyxTQUFPO0VBQ1A7O0FBRUQsS0FBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxPQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBTyxhQUFhLEVBQUMsQ0FBQyxDQUFDO0FBQ3BFLE9BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxTQUFPLG9CQUFvQixFQUFDLENBQUMsQ0FBQztBQUNsRixXQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoQyxXQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztDQUNoQyxDQUFDOztBQUVGLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBRyxNQUFNLEVBQUk7QUFDL0IsS0FBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3JELGdCQUFlLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLGdCQUFlLEVBQUUsQ0FBQztBQUNsQixFQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFBLEdBQUc7U0FBSSxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztFQUFBLENBQUMsQ0FBQztDQUNqRCxDQUFDOztBQUVGLElBQU0sd0JBQXdCLEdBQUcsU0FBM0Isd0JBQXdCLENBQUcsRUFBRSxFQUFJO0FBQ3RDLEtBQUksaUJBQWlCLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsU0FBTyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUM3QjtDQUNELENBQUM7O0FBRUYsSUFBTSx1QkFBdUIsR0FBRyxTQUExQix1QkFBdUIsQ0FBRyxFQUFFLEVBQUk7QUFDckMsS0FBSSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN6QixTQUFPLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQzVCO0NBQ0QsQ0FBQzs7QUFFRixJQUFNLElBQUksR0FBRyxTQUFQLElBQUksR0FBUztBQUNsQixLQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRXBELEtBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWixTQUFPO0VBQ1A7O0FBRUQsS0FBSSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3JFLFNBQU87RUFDUDs7QUFFRCxLQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7Ozs7QUFJN0IsUUFBTyxDQUFDLEtBQUssQ0FBQyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O0FBR2xDLEtBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3RELHlCQUF1QixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQyxlQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsMEJBQXdCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLFNBQU87RUFDUDs7QUFFRCxLQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzlDLEtBQU0sTUFBTSxHQUFHLEFBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFJLE9BQU8sRUFBRSxDQUFDLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUM7O0FBRTdJLEtBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7QUFDN0UsU0FBTztFQUNQOztBQUVELEtBQUk7QUFDSCxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDakQsQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFOztBQUVoQix3QkFBdUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7OztBQUduQyxLQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEMsS0FBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7O0FBRXRCLE9BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNmLElBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUEsRUFBRSxFQUFJO0FBQ3BCLFFBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7O0FBRWxCLFFBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMxQixRQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVoQixRQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBQSxFQUFFO2FBQUksRUFBRSxDQUFDLFNBQVM7TUFBQSxDQUFDLENBQUM7S0FDOUMsTUFBTTtBQUNOLFFBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7SUFDRCxDQUFDLENBQUM7O0FBRUgsbUJBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7RUFDbEM7O0FBRUQsY0FBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQ3RCLENBQUM7O0FBRUYsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLElBQUksc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDOztBQUVwQyxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLEdBQVM7QUFDNUIsbUJBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsbUJBQWtCLEdBQUcsbUNBQXlCLENBQUM7O0FBRS9DLGdCQUFlLEVBQUUsQ0FBQzs7QUFFbEIsS0FBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQ3BELEtBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWixTQUFPO0VBQ1A7O0FBRUQsY0FBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV0QixLQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsRUFBRTtBQUNsRCxvQkFBa0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQzFELGVBQWEsRUFBRSxDQUFDO0VBQ2hCOztBQUVELG1CQUFrQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDeEQsbUJBQWtCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztTQUFNLHNCQUFzQixDQUFDLE1BQU0sQ0FBQztFQUFBLENBQUMsQ0FBQyxDQUFDO0FBQzFGLG1CQUFrQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDOztBQUVuRixtQkFBa0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQ2hELHlCQUF1QixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQyxlQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsMEJBQXdCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3BDLENBQUMsQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7QUFFSyxJQUFNLE1BQU0sR0FBRztBQUNyQixXQUFVLEVBQUU7QUFDWCxNQUFJLEVBQUUsU0FBUztBQUNmLGFBQVMsS0FBSztBQUNkLGFBQVcsRUFBRSxpRUFBaUU7RUFDOUU7QUFDRCxtQkFBa0IsRUFBRTtBQUNuQixNQUFJLEVBQUUsU0FBUztBQUNmLGFBQVMsS0FBSztFQUNkO0FBQ0Qsa0JBQWlCLEVBQUU7QUFDbEIsTUFBSSxFQUFFLFNBQVM7QUFDZixhQUFTLEtBQUs7QUFDZCxPQUFLLEVBQUUscUJBQXFCO0VBQzVCO0NBQ0QsQ0FBQzs7O0FBRUYsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7O0FBRXJCLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxHQUFTO0FBQzdCLEVBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUNiLGNBQWEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0Qyx1QkFBc0IsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4RCx5QkFBd0IsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFNUQsaUJBQWdCLEdBQUcsbUNBQXlCLENBQUM7QUFDN0MsaUJBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUMzRSxpQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUN2RixpQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDL0UsaUJBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDM0YsaUJBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHlCQUF5QixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7Q0FDcEcsQ0FBQzs7O0FBRUssSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLEdBQVM7QUFDL0IscUJBQW9CLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IsbUJBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsaUJBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7Q0FDM0IsQ0FBQzs7O0FBRUssSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBRyxRQUFRLEVBQUk7QUFDM0MsVUFBUyxHQUFHLFFBQVEsQ0FBQztDQUNyQixDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvanNoaW50L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbGF6eVJlcXVpcmUgZnJvbSAnbGF6eS1yZXEnO1xuXG5jb25zdCBsYXp5UmVxID0gbGF6eVJlcXVpcmUocmVxdWlyZSk7XG5jb25zdCBsb2Rhc2ggPSBsYXp5UmVxKCdsb2Rhc2gnKTtcbmNvbnN0IGpzaGludCA9IGxhenlSZXEoJ2pzaGludCcpO1xuY29uc3QganN4aGludCA9IGxhenlSZXEoJ2pzaGludC1qc3gnKTtcbmNvbnN0IGNsaSA9IGxhenlSZXEoJ2pzaGludC9zcmMvY2xpJyk7XG5jb25zdCBsb2FkQ29uZmlnID0gbGF6eVJlcSgnLi9sb2FkLWNvbmZpZycpO1xuY29uc3QgbWFya2Vyc0J5RWRpdG9ySWQgPSB7fTtcbmNvbnN0IGVycm9yc0J5RWRpdG9ySWQgPSB7fTtcblxubGV0IHN1YnNjcmlwdGlvblRvb2x0aXBzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbmxldCBzdWJzY3JpcHRpb25FdmVudHMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG5sZXQgXztcbmxldCBzdGF0dXNCYXI7XG5cbmNvbnN0IFNVUFBPUlRFRF9HUkFNTUFSUyA9IFtcblx0J3NvdXJjZS5qcycsXG5cdCdzb3VyY2UuanN4Jyxcblx0J3NvdXJjZS5qcy5qc3gnXG5dO1xuXG5sZXQgY3VycmVudExpbmU7XG5sZXQgY3VycmVudENoYXI7XG5cbmNvbnN0IGdvVG9FcnJvciA9ICgpID0+IHtcblx0Y29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG5cdGlmICghZWRpdG9yIHx8ICFjdXJyZW50TGluZSB8fCAhY3VycmVudENoYXIpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oW2N1cnJlbnRMaW5lIC0gMSwgY3VycmVudENoYXIgLSAxXSk7XG59O1xuXG5jb25zdCBqc0hpbnRTdGF0dXNCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5qc0hpbnRTdGF0dXNCYXIuc2V0QXR0cmlidXRlKCdpZCcsICdqc2hpbnQtc3RhdHVzYmFyJyk7XG5qc0hpbnRTdGF0dXNCYXIuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG5qc0hpbnRTdGF0dXNCYXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnb1RvRXJyb3IpO1xuXG5jb25zdCB1cGRhdGVTdGF0dXNUZXh0ID0gKGxpbmUsIGNoYXJhY3RlciwgcmVhc29uKSA9PiB7XG5cdGpzSGludFN0YXR1c0Jhci50ZXh0Q29udGVudCA9IGxpbmUgJiYgY2hhcmFjdGVyICYmIHJlYXNvbiA/IGBKU0hpbnQgJHtsaW5lfToke2NoYXJhY3Rlcn0gJHtyZWFzb259YCA6ICcnO1xuXHRjdXJyZW50TGluZSA9IGxpbmU7XG5cdGN1cnJlbnRDaGFyID0gY2hhcmFjdGVyO1xufTtcblxuY29uc3QgZ2V0TWFya2Vyc0ZvckVkaXRvciA9IGVkaXRvciA9PiB7XG5cdGlmIChlZGl0b3IgJiYgbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdHJldHVybiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdO1xuXHR9XG5cblx0cmV0dXJuIHt9O1xufTtcblxuY29uc3QgZ2V0RXJyb3JzRm9yRWRpdG9yID0gZWRpdG9yID0+IHtcblx0aWYgKGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdHJldHVybiBlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF07XG5cdH1cblxuXHRyZXR1cm4gW107XG59O1xuXG5jb25zdCBkZXN0cm95TWFya2VyQXRSb3cgPSAoZWRpdG9yLCByb3cpID0+IHtcblx0aWYgKG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0gJiYgbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVtyb3ddKSB7XG5cdFx0bWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVtyb3ddLmRlc3Ryb3koKTtcblx0XHRkZWxldGUgbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVtyb3ddO1xuXHR9XG59O1xuXG5jb25zdCBnZXRSb3dGb3JFcnJvciA9IGVycm9yID0+IHtcblx0Ly8gSlNIaW50IHJlcG9ydHMgYGxpbmU6IDBgIHdoZW4gY29uZmlnIGVycm9yXG5cdGNvbnN0IGxpbmUgPSBlcnJvclswXS5saW5lIHx8IDE7XG5cblx0Y29uc3Qgcm93ID0gbGluZSAtIDE7XG5cblx0cmV0dXJuIHJvdztcbn07XG5cbmNvbnN0IGNsZWFyT2xkTWFya2VycyA9IChlZGl0b3IsIGVycm9ycykgPT4ge1xuXHRzdWJzY3JpcHRpb25Ub29sdGlwcy5kaXNwb3NlKCk7XG5cdHN1YnNjcmlwdGlvblRvb2x0aXBzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuXHRjb25zdCByb3dzID0gXy5tYXAoZXJyb3JzLCBlcnJvciA9PiBnZXRSb3dGb3JFcnJvcihlcnJvcikpO1xuXG5cdGNvbnN0IG9sZE1hcmtlcnMgPSBnZXRNYXJrZXJzRm9yRWRpdG9yKGVkaXRvcik7XG5cdF8uZWFjaChfLmtleXMob2xkTWFya2VycyksIHJvdyA9PiB7XG5cdFx0aWYgKCFfLmNvbnRhaW5zKHJvd3MsIHJvdykpIHtcblx0XHRcdGRlc3Ryb3lNYXJrZXJBdFJvdyhlZGl0b3IsIHJvdyk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbmNvbnN0IHNhdmVNYXJrZXIgPSAoZWRpdG9yLCBtYXJrZXIsIHJvdykgPT4ge1xuXHRpZiAoIW1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdID0ge307XG5cdH1cblxuXHRtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd10gPSBtYXJrZXI7XG59O1xuXG5jb25zdCBnZXRNYXJrZXJBdFJvdyA9IChlZGl0b3IsIHJvdykgPT4ge1xuXHRpZiAoIW1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJldHVybiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd107XG59O1xuXG5jb25zdCB1cGRhdGVTdGF0dXNiYXIgPSAoKSA9PiB7XG5cdGlmICghc3RhdHVzQmFyKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCFqc0hpbnRTdGF0dXNCYXIucGFyZW50Tm9kZSkge1xuXHRcdHN0YXR1c0Jhci5hZGRMZWZ0VGlsZSh7aXRlbToganNIaW50U3RhdHVzQmFyfSk7XG5cdH1cblxuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKCFlZGl0b3IgfHwgIWVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdHVwZGF0ZVN0YXR1c1RleHQoKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBsaW5lID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMTtcblx0bGV0IGVycm9yID0gZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW2xpbmVdIHx8IF8uZmlyc3QoXy5jb21wYWN0KGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkpO1xuXHRlcnJvciA9IEFycmF5LmlzQXJyYXkoZXJyb3IpID8gZXJyb3JbMF0gOiB7fTtcblxuXHR1cGRhdGVTdGF0dXNUZXh0KGVycm9yLmxpbmUsIGVycm9yLmNoYXJhY3RlciwgZXJyb3IucmVhc29uKTtcbn07XG5cbmNvbnN0IGdvVG9OZXh0RXJyb3IgPSAoKSA9PiB7XG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoIWVkaXRvciB8fCAhbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSB8fCAhZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgY3Vyc29yUm93ID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93O1xuXG5cdGNvbnN0IG1hcmtlclJvd3MgPSBfLnNvcnRCeShfLm1hcChfLmtleXMoZ2V0TWFya2Vyc0ZvckVkaXRvcihlZGl0b3IpKSwgeCA9PiBOdW1iZXIoeCkpKTtcblx0bGV0IG5leHRSb3cgPSBfLmZpbmQobWFya2VyUm93cywgeCA9PiB4ID4gY3Vyc29yUm93KTtcblx0aWYgKCFuZXh0Um93KSB7XG5cdFx0bmV4dFJvdyA9IF8uZmlyc3QobWFya2VyUm93cyk7XG5cdH1cblx0aWYgKCFuZXh0Um93KSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgZXJyb3JzID0gZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW25leHRSb3cgKyAxXTtcblx0aWYgKGVycm9ycykge1xuXHRcdGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbbmV4dFJvdywgZXJyb3JzWzBdLmNoYXJhY3RlciAtIDFdKTtcblx0fVxufTtcblxuY29uc3QgZ2V0UmVhc29uc0ZvckVycm9yID0gZXJyID0+IF8ubWFwKGVyciwgZWwgPT4gYCR7ZWwuY2hhcmFjdGVyfTogJHtlbC5yZWFzb259ICgke2VsLmNvZGV9KWApO1xuXG5jb25zdCBhZGRSZWFzb25zID0gKGVkaXRvciwgbWFya2VyLCBlcnJvcikgPT4ge1xuXHRjb25zdCByb3cgPSBnZXRSb3dGb3JFcnJvcihlcnJvcik7XG5cdGNvbnN0IGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKTtcblx0Y29uc3QgcmVhc29ucyA9IGA8ZGl2IGNsYXNzPVwianNoaW50LWVycm9yc1wiPiR7Z2V0UmVhc29uc0ZvckVycm9yKGVycm9yKS5qb2luKCc8YnI+Jyl9PC9kaXY+YDtcblx0Y29uc3QgdGFyZ2V0ID0gZWRpdG9yRWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoYC5saW5lLW51bWJlcltkYXRhLWJ1ZmZlci1yb3c9XCIke3Jvd31cIl1gKTtcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IHRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0YXJnZXQsIHtcblx0XHR0aXRsZTogcmVhc29ucyxcblx0XHRwbGFjZW1lbnQ6ICdib3R0b20nLFxuXHRcdGRlbGF5OiB7c2hvdzogMjAwfVxuXHR9KTtcblxuXHRzdWJzY3JpcHRpb25Ub29sdGlwcy5hZGQodG9vbHRpcCk7XG59O1xuXG5jb25zdCBkaXNwbGF5RXJyb3IgPSAoZWRpdG9yLCBlcnIpID0+IHtcblx0Y29uc3Qgcm93ID0gZ2V0Um93Rm9yRXJyb3IoZXJyKTtcblxuXHRpZiAoZ2V0TWFya2VyQXRSb3coZWRpdG9yLCByb3cpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbW3JvdywgMF0sIFtyb3csIDFdXSk7XG5cdGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZScsIGNsYXNzOiAnanNoaW50LWxpbmUnfSk7XG5cdGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZS1udW1iZXInLCBjbGFzczogJ2pzaGludC1saW5lLW51bWJlcid9KTtcblx0c2F2ZU1hcmtlcihlZGl0b3IsIG1hcmtlciwgcm93KTtcblx0YWRkUmVhc29ucyhlZGl0b3IsIG1hcmtlciwgZXJyKTtcbn07XG5cbmNvbnN0IGRpc3BsYXlFcnJvcnMgPSBlZGl0b3IgPT4ge1xuXHRjb25zdCBlcnJvcnMgPSBfLmNvbXBhY3QoZ2V0RXJyb3JzRm9yRWRpdG9yKGVkaXRvcikpO1xuXHRjbGVhck9sZE1hcmtlcnMoZWRpdG9yLCBlcnJvcnMpO1xuXHR1cGRhdGVTdGF0dXNiYXIoKTtcblx0Xy5lYWNoKGVycm9ycywgZXJyID0+IGRpc3BsYXlFcnJvcihlZGl0b3IsIGVycikpO1xufTtcblxuY29uc3QgcmVtb3ZlTWFya2Vyc0ZvckVkaXRvcklkID0gaWQgPT4ge1xuXHRpZiAobWFya2Vyc0J5RWRpdG9ySWRbaWRdKSB7XG5cdFx0ZGVsZXRlIG1hcmtlcnNCeUVkaXRvcklkW2lkXTtcblx0fVxufTtcblxuY29uc3QgcmVtb3ZlRXJyb3JzRm9yRWRpdG9ySWQgPSBpZCA9PiB7XG5cdGlmIChlcnJvcnNCeUVkaXRvcklkW2lkXSkge1xuXHRcdGRlbGV0ZSBlcnJvcnNCeUVkaXRvcklkW2lkXTtcblx0fVxufTtcblxuY29uc3QgbGludCA9ICgpID0+IHtcblx0Y29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG5cdGlmICghZWRpdG9yKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKFNVUFBPUlRFRF9HUkFNTUFSUy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSA9PT0gLTEpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBmaWxlID0gZWRpdG9yLmdldFVSSSgpO1xuXG5cdC8vIEhhY2sgdG8gbWFrZSBKU0hpbnQgbG9vayBmb3IgLmpzaGludGlnbm9yZSBpbiB0aGUgY29ycmVjdCBkaXJcblx0Ly8gQmVjYXVzZSBKU0hpbnQgZG9lc24ndCB1c2UgaXRzIGBjd2RgIG9wdGlvblxuXHRwcm9jZXNzLmNoZGlyKHBhdGguZGlybmFtZShmaWxlKSk7XG5cblx0Ly8gUmVtb3ZlIGVycm9ycyBhbmQgZG9uJ3QgbGludCBpZiBmaWxlIGlzIGlnbm9yZWQgaW4gLmpzaGludGlnbm9yZVxuXHRpZiAoZmlsZSAmJiBjbGkoKS5nYXRoZXIoe2FyZ3M6IFtmaWxlXX0pLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGVkaXRvci5pZCk7XG5cdFx0ZGlzcGxheUVycm9ycyhlZGl0b3IpO1xuXHRcdHJlbW92ZU1hcmtlcnNGb3JFZGl0b3JJZChlZGl0b3IuaWQpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGNvbmZpZyA9IGZpbGUgPyBsb2FkQ29uZmlnKCkoZmlsZSkgOiB7fTtcblx0Y29uc3QgbGludGVyID0gKGF0b20uY29uZmlnLmdldCgnanNoaW50LnN1cHBvcnRMaW50aW5nSnN4JykgfHwgYXRvbS5jb25maWcuZ2V0KCdqc2hpbnQudHJhbnNmb3JtSnN4JykpID8ganN4aGludCgpLkpTWEhJTlQgOiBqc2hpbnQoKS5KU0hJTlQ7XG5cblx0aWYgKE9iamVjdC5rZXlzKGNvbmZpZykubGVuZ3RoID09PSAwICYmIGF0b20uY29uZmlnLmdldCgnanNoaW50Lm9ubHlDb25maWcnKSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRyeSB7XG5cdFx0bGludGVyKGVkaXRvci5nZXRUZXh0KCksIGNvbmZpZywgY29uZmlnLmdsb2JhbHMpO1xuXHR9IGNhdGNoIChlcnIpIHt9XG5cblx0cmVtb3ZlRXJyb3JzRm9yRWRpdG9ySWQoZWRpdG9yLmlkKTtcblxuXHQvLyB3b3JrYXJvdW5kIHRoZSBlcnJvcnMgYXJyYXkgc29tZXRpbWVzIGNvbnRhaW5pbmcgYG51bGxgXG5cdGNvbnN0IGVycm9ycyA9IF8uY29tcGFjdChsaW50ZXIuZXJyb3JzKTtcblxuXHRpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcblx0XHQvLyBhZ2dyZWdhdGUgc2FtZS1saW5lIGVycm9yc1xuXHRcdGNvbnN0IHJldCA9IFtdO1xuXHRcdF8uZWFjaChlcnJvcnMsIGVsID0+IHtcblx0XHRcdGNvbnN0IGwgPSBlbC5saW5lO1xuXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXRbbF0pKSB7XG5cdFx0XHRcdHJldFtsXS5wdXNoKGVsKTtcblxuXHRcdFx0XHRyZXRbbF0gPSBfLnNvcnRCeShyZXRbbF0sIGVsID0+IGVsLmNoYXJhY3Rlcik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXRbbF0gPSBbZWxdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdID0gcmV0O1xuXHR9XG5cblx0ZGlzcGxheUVycm9ycyhlZGl0b3IpO1xufTtcblxubGV0IGRlYm91bmNlZExpbnQgPSBudWxsO1xubGV0IGRlYm91bmNlZERpc3BsYXlFcnJvcnMgPSBudWxsO1xubGV0IGRlYm91bmNlZFVwZGF0ZVN0YXR1c2JhciA9IG51bGw7XG5cbmNvbnN0IHJlZ2lzdGVyRXZlbnRzID0gKCkgPT4ge1xuXHRzdWJzY3JpcHRpb25FdmVudHMuZGlzcG9zZSgpO1xuXHRzdWJzY3JpcHRpb25FdmVudHMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG5cdHVwZGF0ZVN0YXR1c2JhcigpO1xuXG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblx0aWYgKCFlZGl0b3IpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRkaXNwbGF5RXJyb3JzKGVkaXRvcik7XG5cblx0aWYgKCFhdG9tLmNvbmZpZy5nZXQoJ2pzaGludC52YWxpZGF0ZU9ubHlPblNhdmUnKSkge1xuXHRcdHN1YnNjcmlwdGlvbkV2ZW50cy5hZGQoZWRpdG9yLm9uRGlkQ2hhbmdlKGRlYm91bmNlZExpbnQpKTtcblx0XHRkZWJvdW5jZWRMaW50KCk7XG5cdH1cblxuXHRzdWJzY3JpcHRpb25FdmVudHMuYWRkKGVkaXRvci5vbkRpZFNhdmUoZGVib3VuY2VkTGludCkpO1xuXHRzdWJzY3JpcHRpb25FdmVudHMuYWRkKGVkaXRvci5vbkRpZENoYW5nZVNjcm9sbFRvcCgoKSA9PiBkZWJvdW5jZWREaXNwbGF5RXJyb3JzKGVkaXRvcikpKTtcblx0c3Vic2NyaXB0aW9uRXZlbnRzLmFkZChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihkZWJvdW5jZWRVcGRhdGVTdGF0dXNiYXIpKTtcblxuXHRzdWJzY3JpcHRpb25FdmVudHMuYWRkKGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuXHRcdHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGVkaXRvci5pZCk7XG5cdFx0ZGlzcGxheUVycm9ycyhlZGl0b3IpO1xuXHRcdHJlbW92ZU1hcmtlcnNGb3JFZGl0b3JJZChlZGl0b3IuaWQpO1xuXHR9KSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuXHRvbmx5Q29uZmlnOiB7XG5cdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGZpbGUgZm91bmQgZm9yIHRoZSBsaW50ZXIuJ1xuXHR9LFxuXHR2YWxpZGF0ZU9ubHlPblNhdmU6IHtcblx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0ZGVmYXVsdDogZmFsc2Vcblx0fSxcblx0c3VwcG9ydExpbnRpbmdKc3g6IHtcblx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0ZGVmYXVsdDogZmFsc2UsXG5cdFx0dGl0bGU6ICdTdXBwb3J0IExpbnRpbmcgSlNYJ1xuXHR9XG59O1xuXG5sZXQgc3Vic2NyaXB0aW9uTWFpbiA9IG51bGw7XG5cbmV4cG9ydCBjb25zdCBhY3RpdmF0ZSA9ICgpID0+IHtcblx0XyA9IGxvZGFzaCgpO1xuXHRkZWJvdW5jZWRMaW50ID0gXy5kZWJvdW5jZShsaW50LCAyMDApO1xuXHRkZWJvdW5jZWREaXNwbGF5RXJyb3JzID0gXy5kZWJvdW5jZShkaXNwbGF5RXJyb3JzLCAyMDApO1xuXHRkZWJvdW5jZWRVcGRhdGVTdGF0dXNiYXIgPSBfLmRlYm91bmNlKHVwZGF0ZVN0YXR1c2JhciwgMTAwKTtcblxuXHRzdWJzY3JpcHRpb25NYWluID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0c3Vic2NyaXB0aW9uTWFpbi5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKHJlZ2lzdGVyRXZlbnRzKSk7XG5cdHN1YnNjcmlwdGlvbk1haW4uYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2pzaGludC52YWxpZGF0ZU9ubHlPblNhdmUnLCByZWdpc3RlckV2ZW50cykpO1xuXHRzdWJzY3JpcHRpb25NYWluLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnanNoaW50OmxpbnQnLCBsaW50KSk7XG5cdHN1YnNjcmlwdGlvbk1haW4uYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdqc2hpbnQ6Z28tdG8tZXJyb3InLCBnb1RvRXJyb3IpKTtcblx0c3Vic2NyaXB0aW9uTWFpbi5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2pzaGludDpnby10by1uZXh0LWVycm9yJywgZ29Ub05leHRFcnJvcikpO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlYWN0aXZhdGUgPSAoKSA9PiB7XG5cdHN1YnNjcmlwdGlvblRvb2x0aXBzLmRpc3Bvc2UoKTtcblx0c3Vic2NyaXB0aW9uRXZlbnRzLmRpc3Bvc2UoKTtcblx0c3Vic2NyaXB0aW9uTWFpbi5kaXNwb3NlKCk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3VtZVN0YXR1c0JhciA9IGluc3RhbmNlID0+IHtcblx0c3RhdHVzQmFyID0gaW5zdGFuY2U7XG59O1xuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/jshint/index.js
