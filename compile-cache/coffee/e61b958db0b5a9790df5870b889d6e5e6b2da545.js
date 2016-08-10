(function() {
  var TodosModel, path;

  path = require('path');

  TodosModel = require('../lib/todos-model');

  describe('Todos Model', function() {
    var defaultLookup, defaultRegexes, defaultShowInTable, model, testTodos, _ref;
    _ref = [], model = _ref[0], defaultRegexes = _ref[1], defaultLookup = _ref[2], defaultShowInTable = _ref[3], testTodos = _ref[4];
    beforeEach(function() {
      defaultRegexes = ['FIXMEs', '/\\bFIXME:?\\d*($|\\s.*$)/g', 'TODOs', '/\\bTODO:?\\d*($|\\s.*$)/g'];
      defaultLookup = {
        title: defaultRegexes[2],
        regex: defaultRegexes[3]
      };
      defaultShowInTable = ['Text', 'Type', 'File'];
      testTodos = [
        {
          text: 'fixme #1',
          file: 'file1.txt',
          type: 'FIXMEs',
          range: '3,6,3,10',
          position: [[3, 6], [3, 10]]
        }, {
          text: 'todo #1',
          file: 'file1.txt',
          type: 'TODOs',
          range: '4,5,4,9',
          position: [[4, 5], [4, 9]]
        }, {
          text: 'fixme #2',
          file: 'file2.txt',
          type: 'FIXMEs',
          range: '5,7,5,11',
          position: [[5, 7], [5, 11]]
        }
      ];
      model = new TodosModel;
      return atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
    });
    describe('buildRegexLookups(regexes)', function() {
      it('returns an array of lookup objects when passed an array of regexes', function() {
        var lookups1, lookups2;
        lookups1 = model.buildRegexLookups(defaultRegexes);
        lookups2 = [
          {
            title: defaultRegexes[0],
            regex: defaultRegexes[1]
          }, {
            title: defaultRegexes[2],
            regex: defaultRegexes[3]
          }
        ];
        return expect(lookups1).toEqual(lookups2);
      });
      return it('handles invalid input', function() {
        var lookups, notification, notificationSpy, regexes;
        model.onDidFailSearch(notificationSpy = jasmine.createSpy());
        regexes = ['TODO'];
        lookups = model.buildRegexLookups(regexes);
        expect(lookups).toHaveLength(0);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.indexOf('Invalid')).not.toBe(-1);
      });
    });
    describe('makeRegexObj(regexStr)', function() {
      it('returns a RegExp obj when passed a regex literal (string)', function() {
        var regexObj, regexStr;
        regexStr = defaultLookup.regex;
        regexObj = model.makeRegexObj(regexStr);
        expect(typeof regexObj.test).toBe('function');
        return expect(typeof regexObj.exec).toBe('function');
      });
      it('returns false and notifies on invalid input', function() {
        var notification, notificationSpy, regexObj, regexStr;
        model.onDidFailSearch(notificationSpy = jasmine.createSpy());
        regexStr = 'arstastTODO:.+$)/g';
        regexObj = model.makeRegexObj(regexStr);
        expect(regexObj).toBe(false);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.indexOf('Invalid')).not.toBe(-1);
      });
      return it('handles empty input', function() {
        var regexObj;
        regexObj = model.makeRegexObj();
        return expect(regexObj).toBe(false);
      });
    });
    describe('handleScanMatch(match, regex)', function() {
      var match;
      match = [].match;
      beforeEach(function() {
        return match = {
          path: "" + (atom.project.getPaths()[0]) + "/sample.c",
          all: ' TODO: Comment in C ',
          regexp: /\b@?TODO:?\d*($|\s.*$)/g,
          position: [[0, 1], [0, 20]]
        };
      });
      it('should handle results from workspace scan (also tested in fetchRegexItem)', function() {
        var output;
        delete match.regexp;
        output = model.handleScanMatch(match);
        return expect(output.text).toEqual('TODO: Comment in C');
      });
      it('should remove regex part', function() {
        var output;
        output = model.handleScanMatch(match);
        return expect(output.text).toEqual('Comment in C');
      });
      it('should serialize range and relativize path', function() {
        var output;
        output = model.handleScanMatch(match);
        expect(output.file).toEqual('sample.c');
        return expect(output.range).toEqual('0,1,0,20');
      });
      it('should handle invalid match position', function() {
        var output;
        delete match.position;
        output = model.handleScanMatch(match);
        expect(output.range).toEqual('0,0');
        expect(output.position).toEqual([[0, 0]]);
        match.position = [];
        output = model.handleScanMatch(match);
        expect(output.range).toEqual('0,0');
        expect(output.position).toEqual([[0, 0]]);
        match.position = [[0, 1]];
        output = model.handleScanMatch(match);
        expect(output.range).toEqual('0,1');
        expect(output.position).toEqual([[0, 1]]);
        match.position = [[0, 1], [2, 3]];
        output = model.handleScanMatch(match);
        expect(output.range).toEqual('0,1,2,3');
        return expect(output.position).toEqual([[0, 1], [2, 3]]);
      });
      it('should extract todo tags', function() {
        var output;
        match.text = "test #TODO: 123 #tag1";
        output = model.handleScanMatch(match);
        expect(output.tags).toBe('tag1');
        expect(output.text).toBe('123');
        match.text = "#TODO: 123 #tag1.";
        return expect(model.handleScanMatch(match).tags).toBe('tag1');
      });
      it('should extract multiple todo tags', function() {
        var output;
        match.text = "TODO: 123 #tag1 #tag2 #tag3";
        output = model.handleScanMatch(match);
        expect(output.tags).toBe('tag1, tag2, tag3');
        expect(output.text).toBe('123');
        match.text = "test #TODO: 123 #tag1, #tag2";
        expect(model.handleScanMatch(match).tags).toBe('tag1, tag2');
        match.text = "TODO: #123 #tag1";
        output = model.handleScanMatch(match);
        expect(output.tags).toBe('123, tag1');
        return expect(output.text).toBe('No details');
      });
      return it('should handle invalid tags', function() {
        match.text = "#TODO: 123 #tag1 X";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: 123 #tag1#";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: #tag1 todo";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: #tag.123";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: #tag1 #tag2@";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: #tag1, #tag2$, #tag3";
        return expect(model.handleScanMatch(match).tags).toBe('tag3');
      });
    });
    describe('fetchRegexItem(lookupObj)', function() {
      it('should scan the workspace for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(3);
          expect(model.todos[0].text).toBe('Comment in C');
          expect(model.todos[1].text).toBe('This is the first todo');
          return expect(model.todos[2].text).toBe('This is the second todo');
        });
      });
      it('should handle other regexes', function() {
        var lookup;
        lookup = {
          title: 'Includes',
          regex: '/#include(.+)/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].text).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        var lookup;
        lookup = {
          title: 'Todos',
          regex: '/ This is the (?:first|second) todo/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].text).toBe('This is the first todo');
          return expect(model.todos[1].text).toBe('This is the second todo');
        });
      });
      it('should handle regex without capture group', function() {
        var lookup;
        lookup = {
          title: 'This is Code',
          regex: '/[\\w\\s]+code[\\w\\s]*/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].text).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+).{3}DEBUG\\s*$/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+?(?=.{3}DEBUG\\s*$))/'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate todos longer than the defined max length of 120', function() {
        var lookup;
        lookup = {
          title: 'Long Annotation',
          regex: '/LOONG:?(.+$)/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          var text, text2;
          text = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          text += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          text2 = '_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSum';
          text2 += 'tJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF...';
          expect(model.todos[0].text).toHaveLength(120);
          expect(model.todos[0].text).toBe(text);
          expect(model.todos[1].text).toHaveLength(120);
          return expect(model.todos[1].text).toBe(text2);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures/sample2')]);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(6);
          expect(model.todos[0].text).toBe('C block comment');
          expect(model.todos[1].text).toBe('HTML comment');
          expect(model.todos[2].text).toBe('PowerShell comment');
          expect(model.todos[3].text).toBe('Haskell comment');
          expect(model.todos[4].text).toBe('Lua comment');
          return expect(model.todos[5].text).toBe('PHP comment');
        });
      });
    });
    describe('ignore path rules', function() {
      it('works with no paths added', function() {
        atom.config.set('todo-show.ignoreThesePaths', []);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos).toHaveLength(3);
        });
      });
      it('must be an array', function() {
        var notificationSpy;
        model.onDidFailSearch(notificationSpy = jasmine.createSpy());
        atom.config.set('todo-show.ignoreThesePaths', '123');
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          var notification;
          expect(model.todos).toHaveLength(3);
          notification = notificationSpy.mostRecentCall.args[0];
          expect(notificationSpy).toHaveBeenCalled();
          return expect(notification.indexOf('ignoreThesePaths')).not.toBe(-1);
        });
      });
      it('respects ignored files', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].text).toBe('Comment in C');
        });
      });
      it('respects ignored directories and filetypes', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['sample1', '*.md']);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(6);
          return expect(model.todos[0].text).toBe('C block comment');
        });
      });
      it('respects ignored wildcard directories', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['**/sample.js', '**/sample.txt', '*.md']);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].text).toBe('Comment in C');
        });
      });
      return it('respects more advanced ignores', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['output(-grouped)?\\.*', '*1/**']);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(6);
          return expect(model.todos[0].text).toBe('C block comment');
        });
      });
    });
    describe('fetchOpenRegexItem(lookupObj)', function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it('scans open files for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          expect(model.todos.length).toBe(1);
          return expect(model.todos[0].text).toBe('Comment in C');
        });
      });
      it('works with files outside of workspace', function() {
        waitsForPromise(function() {
          return atom.workspace.open('../sample2/sample.txt');
        });
        return runs(function() {
          waitsForPromise(function() {
            return model.fetchOpenRegexItem(defaultLookup);
          });
          return runs(function() {
            expect(model.todos).toHaveLength(7);
            expect(model.todos[0].text).toBe('Comment in C');
            expect(model.todos[1].text).toBe('C block comment');
            return expect(model.todos[6].text).toBe('PHP comment');
          });
        });
      });
      it('handles unsaved documents', function() {
        editor.setText('TODO: New todo');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          expect(model.todos[0].type).toBe('TODOs');
          return expect(model.todos[0].text).toBe('New todo');
        });
      });
      it('respects imdone syntax (https://github.com/imdone/imdone-atom)', function() {
        editor.setText('TODO:10 todo1\nTODO:0 todo2');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].type).toBe('TODOs');
          expect(model.todos[0].text).toBe('todo1');
          return expect(model.todos[1].text).toBe('todo2');
        });
      });
      it('handles number in todo (as long as its not without space)', function() {
        editor.setText("Line 1 //TODO: 1 2 3\nLine 1 // TODO:1 2 3");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].text).toBe('1 2 3');
          return expect(model.todos[1].text).toBe('2 3');
        });
      });
      it('handles empty todos', function() {
        editor.setText("Line 1 // TODO\nLine 2 //TODO");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].text).toBe('No details');
          return expect(model.todos[1].text).toBe('No details');
        });
      });
      it('handles empty block todos', function() {
        editor.setText("/* TODO */\nLine 2 /* TODO */");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].text).toBe('No details');
          return expect(model.todos[1].text).toBe('No details');
        });
      });
      it('handles todos with @ in front', function() {
        editor.setText("Line 1 //@TODO: text\nLine 2 //@TODO: text\nLine 3 @TODO: text");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(3);
          expect(model.todos[0].text).toBe('text');
          expect(model.todos[1].text).toBe('text');
          return expect(model.todos[2].text).toBe('text');
        });
      });
      it('handles tabs in todos', function() {
        editor.setText('Line //TODO:\ttext');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos[0].text).toBe('text');
        });
      });
      it('handles todo without semicolon', function() {
        editor.setText('A line // TODO text');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos[0].text).toBe('text');
        });
      });
      it('ignores todos without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos).toHaveLength(0);
        });
      });
      it('ignores todo if unwanted chars are present', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos).toHaveLength(0);
        });
      });
      return it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos).toHaveLength(0);
        });
      });
    });
    describe('filterTodos()', function() {
      var filterSpy;
      filterSpy = [].filterSpy;
      beforeEach(function() {
        atom.config.set('todo-show.showInTable', defaultShowInTable);
        model.todos = testTodos;
        filterSpy = jasmine.createSpy();
        return model.onDidFilterTodos(filterSpy);
      });
      it('can filter simple todos', function() {
        model.filterTodos('#2');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(1);
      });
      it('can filter todos with multiple results', function() {
        model.filterTodos('FIXME');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(2);
      });
      it('handles no results', function() {
        model.filterTodos('XYZ');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(0);
      });
      return it('handles empty filter', function() {
        model.filterTodos('');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(3);
      });
    });
    return describe('getMarkdown()', function() {
      beforeEach(function() {
        atom.config.set('todo-show.findTheseRegexes', defaultRegexes);
        atom.config.set('todo-show.showInTable', defaultShowInTable);
        return model.todos = testTodos;
      });
      it('creates a markdown string from regexes', function() {
        return expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__ [file1.txt](file1.txt)\n- todo #1 __TODOs__ [file1.txt](file1.txt)\n- fixme #2 __FIXMEs__ [file2.txt](file2.txt)\n");
      });
      it('creates markdown with sorting', function() {
        model.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        return expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__ [file1.txt](file1.txt)\n- fixme #2 __FIXMEs__ [file2.txt](file2.txt)\n- todo #1 __TODOs__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with inverse sorting', function() {
        model.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        return expect(model.getMarkdown()).toEqual("- todo #1 __TODOs__ [file1.txt](file1.txt)\n- fixme #2 __FIXMEs__ [file2.txt](file2.txt)\n- fixme #1 __FIXMEs__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with different items', function() {
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(model.getMarkdown()).toEqual("- __FIXMEs__ [file1.txt](file1.txt) _:3,6,3,10_\n- __TODOs__ [file1.txt](file1.txt) _:4,5,4,9_\n- __FIXMEs__ [file2.txt](file2.txt) _:5,7,5,11_\n");
      });
      it('creates markdown as table', function() {
        atom.config.set('todo-show.saveOutputAs', 'Table');
        return expect(model.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme #1 | __FIXMEs__ | [file1.txt](file1.txt) |\n| todo #1 | __TODOs__ | [file1.txt](file1.txt) |\n| fixme #2 | __FIXMEs__ | [file2.txt](file2.txt) |\n");
      });
      it('creates markdown as table with different items', function() {
        atom.config.set('todo-show.saveOutputAs', 'Table');
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(model.getMarkdown()).toEqual("| Type | File | Range |\n|---------------------|\n| __FIXMEs__ | [file1.txt](file1.txt) | _:3,6,3,10_ |\n| __TODOs__ | [file1.txt](file1.txt) | _:4,5,4,9_ |\n| __FIXMEs__ | [file2.txt](file2.txt) | _:5,7,5,11_ |\n");
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        model.todos = [
          {
            text: 'fixme #1',
            type: 'FIXMEs'
          }
        ];
        expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__\n");
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range', 'Text']);
        markdown = '\n## Unknown File\n\n- fixme #1 `FIXMEs`\n';
        return expect(model.getMarkdown()).toEqual("- __FIXMEs__ fixme #1\n");
      });
      it('accepts missing title in regexes', function() {
        model.todos = [
          {
            text: 'fixme #1',
            file: 'file1.txt'
          }
        ];
        expect(model.getMarkdown()).toEqual("- fixme #1 [file1.txt](file1.txt)\n");
        atom.config.set('todo-show.showInTable', ['Title']);
        return expect(model.getMarkdown()).toEqual("- No details\n");
      });
      return it('accepts missing items in table output', function() {
        model.todos = [
          {
            text: 'fixme #1',
            type: 'FIXMEs'
          }
        ];
        atom.config.set('todo-show.saveOutputAs', 'Table');
        expect(model.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme #1 | __FIXMEs__ | |\n");
        atom.config.set('todo-show.showInTable', ['Line']);
        return expect(model.getMarkdown()).toEqual("| Line |\n|------|\n| |\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvc3BlYy90b2Rvcy1tb2RlbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG9CQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLHlFQUFBO0FBQUEsSUFBQSxPQUF3RSxFQUF4RSxFQUFDLGVBQUQsRUFBUSx3QkFBUixFQUF3Qix1QkFBeEIsRUFBdUMsNEJBQXZDLEVBQTJELG1CQUEzRCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxjQUFBLEdBQWlCLENBQ2YsUUFEZSxFQUVmLDZCQUZlLEVBR2YsT0FIZSxFQUlmLDRCQUplLENBQWpCLENBQUE7QUFBQSxNQU1BLGFBQUEsR0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGNBQWUsQ0FBQSxDQUFBLENBQXRCO0FBQUEsUUFDQSxLQUFBLEVBQU8sY0FBZSxDQUFBLENBQUEsQ0FEdEI7T0FQRixDQUFBO0FBQUEsTUFTQSxrQkFBQSxHQUFxQixDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE1BQWpCLENBVHJCLENBQUE7QUFBQSxNQVdBLFNBQUEsR0FBWTtRQUNWO0FBQUEsVUFDRSxJQUFBLEVBQU0sVUFEUjtBQUFBLFVBRUUsSUFBQSxFQUFNLFdBRlI7QUFBQSxVQUdFLElBQUEsRUFBTSxRQUhSO0FBQUEsVUFJRSxLQUFBLEVBQU8sVUFKVDtBQUFBLFVBS0UsUUFBQSxFQUFVLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQVEs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

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/spec/todos-model-spec.coffee
