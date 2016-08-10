(function() {
  var ShowTodoView, path;

  path = require('path');

  ShowTodoView = require('../lib/show-todo-view');

  describe('ShowTodoView fetching logic and data handling', function() {
    var defaultLookup, defaultRegexes, showTodoView, _ref;
    _ref = [], showTodoView = _ref[0], defaultRegexes = _ref[1], defaultLookup = _ref[2];
    beforeEach(function() {
      defaultRegexes = ['FIXMEs', '/\\bFIXME:?\\d*($|\\s.*$)/g', 'TODOs', '/\\bTODO:?\\d*($|\\s.*$)/g'];
      defaultLookup = {
        title: defaultRegexes[2],
        regex: defaultRegexes[3]
      };
      showTodoView = new ShowTodoView('dummyPath');
      return atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
    });
    describe('buildRegexLookups(regexes)', function() {
      it('returns an array of lookup objects when passed an array of regexes', function() {
        var lookups1, lookups2;
        lookups1 = showTodoView.buildRegexLookups(defaultRegexes);
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
        atom.notifications.onDidAddNotification(notificationSpy = jasmine.createSpy());
        regexes = ['TODO'];
        lookups = showTodoView.buildRegexLookups(regexes);
        expect(lookups).toHaveLength(0);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.getType()).toBe('error');
      });
    });
    describe('makeRegexObj(regexStr)', function() {
      it('returns a RegExp obj when passed a regex literal (string)', function() {
        var regexObj, regexStr;
        regexStr = defaultLookup.regex;
        regexObj = showTodoView.makeRegexObj(regexStr);
        expect(typeof regexObj.test).toBe('function');
        return expect(typeof regexObj.exec).toBe('function');
      });
      it('returns false and shows notification on invalid input', function() {
        var notification, notificationSpy, regexObj, regexStr;
        atom.notifications.onDidAddNotification(notificationSpy = jasmine.createSpy());
        regexStr = 'arstastTODO:.+$)/g';
        regexObj = showTodoView.makeRegexObj(regexStr);
        expect(regexObj).toBe(false);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.getType()).toBe('error');
      });
      return it('handles empty input', function() {
        var regexObj;
        regexObj = showTodoView.makeRegexObj();
        return expect(regexObj).toBe(false);
      });
    });
    describe('handleScanMatch(match, regex)', function() {
      var match, regex, _ref1;
      _ref1 = [], match = _ref1.match, regex = _ref1.regex;
      beforeEach(function() {
        regex = /\b@?TODO:?\d*($|\s.*$)/g;
        return match = {
          path: "" + (atom.project.getPaths()[0]) + "/sample.c",
          matchText: ' TODO: Comment in C ',
          range: [[0, 1], [0, 20]]
        };
      });
      it('should handle results from workspace scan (also tested in fetchRegexItem)', function() {
        var output;
        output = showTodoView.handleScanMatch(match);
        return expect(output.matchText).toEqual('TODO: Comment in C');
      });
      it('should remove regex part', function() {
        var output;
        output = showTodoView.handleScanMatch(match, regex);
        return expect(output.matchText).toEqual('Comment in C');
      });
      return it('should serialize range and relativize path', function() {
        var output;
        output = showTodoView.handleScanMatch(match, regex);
        expect(output.relativePath).toEqual('sample.c');
        return expect(output.rangeString).toEqual('0,1,0,20');
      });
    });
    describe('fetchRegexItem(lookupObj)', function() {
      it('should scan the workspace for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(3);
          expect(showTodoView.matches[0].matchText).toBe('Comment in C');
          expect(showTodoView.matches[1].matchText).toBe('This is the first todo');
          return expect(showTodoView.matches[2].matchText).toBe('This is the second todo');
        });
      });
      it('should handle other regexes', function() {
        var lookup;
        lookup = {
          title: 'Includes',
          regex: '/#include(.+)/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        var lookup;
        lookup = {
          title: 'Todos',
          regex: '/ This is the (?:first|second) todo/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].matchText).toBe('This is the first todo');
          return expect(showTodoView.matches[1].matchText).toBe('This is the second todo');
        });
      });
      it('should handle regex without capture group', function() {
        var lookup;
        lookup = {
          title: 'This is Code',
          regex: '/[\\w\\s]+code[\\w\\s]*/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+).{3}DEBUG\\s*$/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+?(?=.{3}DEBUG\\s*$))/'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate matches longer than the defined max length of 120', function() {
        var lookup;
        lookup = {
          title: 'Long Annotation',
          regex: '/LOONG:?(.+$)/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          var matchText, matchText2;
          matchText = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          matchText += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          matchText2 = '_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSum';
          matchText2 += 'tJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF...';
          expect(showTodoView.matches[0].matchText).toHaveLength(120);
          expect(showTodoView.matches[0].matchText).toBe(matchText);
          expect(showTodoView.matches[1].matchText).toHaveLength(120);
          return expect(showTodoView.matches[1].matchText).toBe(matchText2);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures/sample2')]);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(6);
          expect(showTodoView.matches[0].matchText).toBe('C block comment');
          expect(showTodoView.matches[1].matchText).toBe('HTML comment');
          expect(showTodoView.matches[2].matchText).toBe('PowerShell comment');
          expect(showTodoView.matches[3].matchText).toBe('Haskell comment');
          expect(showTodoView.matches[4].matchText).toBe('Lua comment');
          return expect(showTodoView.matches[5].matchText).toBe('PHP comment');
        });
      });
    });
    describe('ignore path rules', function() {
      it('works with no paths added', function() {
        atom.config.set('todo-show.ignoreThesePaths', []);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches).toHaveLength(3);
        });
      });
      it('must be an array', function() {
        var notificationSpy;
        atom.notifications.onDidAddNotification(notificationSpy = jasmine.createSpy());
        atom.config.set('todo-show.ignoreThesePaths', '123');
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          var notification;
          expect(showTodoView.matches).toHaveLength(3);
          notification = notificationSpy.mostRecentCall.args[0];
          expect(notificationSpy).toHaveBeenCalled();
          return expect(notification.getType()).toBe('error');
        });
      });
      it('respects ignored files', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('Comment in C');
        });
      });
      it('respects ignored directories and filetypes', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['sample1', '*.md']);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(6);
          return expect(showTodoView.matches[0].matchText).toBe('C block comment');
        });
      });
      it('respects ignored wildcard directories', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['**/sample.js', '**/sample.txt', '*.md']);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('Comment in C');
        });
      });
      return it('respects more advanced ignores', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['output(-grouped)?\\.*', '*1/**']);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(6);
          return expect(showTodoView.matches[0].matchText).toBe('C block comment');
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
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          expect(showTodoView.matches.length).toBe(1);
          return expect(showTodoView.matches[0].matchText).toBe('Comment in C');
        });
      });
      it('works with files outside of workspace', function() {
        waitsForPromise(function() {
          return atom.workspace.open('../sample2/sample.txt');
        });
        return runs(function() {
          waitsForPromise(function() {
            return showTodoView.fetchOpenRegexItem(defaultLookup);
          });
          return runs(function() {
            expect(showTodoView.matches).toHaveLength(7);
            expect(showTodoView.matches[0].matchText).toBe('Comment in C');
            expect(showTodoView.matches[1].matchText).toBe('C block comment');
            return expect(showTodoView.matches[6].matchText).toBe('PHP comment');
          });
        });
      });
      it('handles unsaved documents', function() {
        editor.setText('TODO: New todo');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          expect(showTodoView.matches[0].title).toBe('TODOs');
          return expect(showTodoView.matches[0].matchText).toBe('New todo');
        });
      });
      it('respects imdone syntax (https://github.com/imdone/imdone-atom)', function() {
        editor.setText('TODO:10 todo1\nTODO:0 todo2');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].title).toBe('TODOs');
          expect(showTodoView.matches[0].matchText).toBe('todo1');
          return expect(showTodoView.matches[1].matchText).toBe('todo2');
        });
      });
      it('handles number in todo (as long as its not without space)', function() {
        editor.setText("Line 1 //TODO: 1 2 3\nLine 1 // TODO:1 2 3");
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].matchText).toBe('1 2 3');
          return expect(showTodoView.matches[1].matchText).toBe('2 3');
        });
      });
      it('handles empty todos', function() {
        editor.setText("Line 1 // TODO\nLine 2 //TODO");
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].matchText).toBe('No details');
          return expect(showTodoView.matches[1].matchText).toBe('No details');
        });
      });
      it('handles empty block todos', function() {
        editor.setText("/* TODO */\nLine 2 /* TODO */");
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].matchText).toBe('No details');
          return expect(showTodoView.matches[1].matchText).toBe('No details');
        });
      });
      it('handles todos with @ in front', function() {
        editor.setText("Line 1 //@TODO: text\nLine 2 //@TODO: text\nLine 3 @TODO: text");
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(3);
          expect(showTodoView.matches[0].matchText).toBe('text');
          expect(showTodoView.matches[1].matchText).toBe('text');
          return expect(showTodoView.matches[2].matchText).toBe('text');
        });
      });
      it('handles tabs in todos', function() {
        editor.setText('Line //TODO:\ttext');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches[0].matchText).toBe('text');
        });
      });
      it('handles todo without semicolon', function() {
        editor.setText('A line // TODO text');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches[0].matchText).toBe('text');
        });
      });
      it('ignores todos without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches).toHaveLength(0);
        });
      });
      it('ignores todo if unwanted chars are present', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches).toHaveLength(0);
        });
      });
      return it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches).toHaveLength(0);
        });
      });
    });
    return describe('getMarkdown()', function() {
      var matches;
      matches = [];
      beforeEach(function() {
        atom.config.set('todo-show.findTheseRegexes', defaultRegexes);
        return matches = [
          {
            matchText: 'fixme #1',
            relativePath: 'file1.txt',
            title: 'FIXMEs',
            range: [[3, 6], [3, 10]]
          }, {
            matchText: 'todo #1',
            relativePath: 'file1.txt',
            title: 'TODOs',
            range: [[4, 5], [4, 9]]
          }, {
            matchText: 'fixme #2',
            relativePath: 'file2.txt',
            title: 'FIXMEs',
            range: [[5, 7], [5, 11]]
          }
        ];
      });
      it('creates a markdown string from regexes', function() {
        var markdown;
        markdown = '\n## FIXMEs\n\n- fixme #1 `file1.txt` `:4`\n- fixme #2 `file2.txt` `:6`\n';
        markdown += '\n## TODOs\n\n- todo #1 `file1.txt` `:5`\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
      it('creates markdown with file grouping', function() {
        var markdown;
        atom.config.set('todo-show.groupMatchesBy', 'file');
        markdown = '\n## file1.txt\n\n- fixme #1 `FIXMEs`\n- todo #1 `TODOs`\n';
        markdown += '\n## file2.txt\n\n- fixme #2 `FIXMEs`\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
      it('creates markdown with non grouping', function() {
        var markdown;
        atom.config.set('todo-show.groupMatchesBy', 'none');
        markdown = '\n## All Matches\n\n- fixme #1 _(FIXMEs)_ `file1.txt` `:4`';
        markdown += '\n- fixme #2 _(FIXMEs)_ `file2.txt` `:6`\n- todo #1 _(TODOs)_ `file1.txt` `:5`\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        matches = [
          {
            matchText: 'fixme #1',
            title: 'FIXMEs'
          }
        ];
        markdown = '\n## FIXMEs\n\n- fixme #1\n';
        expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
        atom.config.set('todo-show.groupMatchesBy', 'file');
        markdown = '\n## Unknown File\n\n- fixme #1 `FIXMEs`\n';
        expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
        atom.config.set('todo-show.groupMatchesBy', 'none');
        markdown = '\n## All Matches\n\n- fixme #1 _(FIXMEs)_\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
      return it('accepts missing title in regexes', function() {
        var markdown;
        matches = [
          {
            matchText: 'fixme #1',
            relativePath: 'file1.txt'
          }
        ];
        markdown = '\n## No Title\n\n- fixme #1 `file1.txt`\n';
        expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
        atom.config.set('todo-show.groupMatchesBy', 'file');
        markdown = '\n## file1.txt\n\n- fixme #1\n';
        expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
        atom.config.set('todo-show.groupMatchesBy', 'none');
        markdown = '\n## All Matches\n\n- fixme #1 `file1.txt`\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
    });
  });

}).call(this);
