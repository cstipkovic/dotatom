function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./spec-helpers');

var _libLatex = require('../lib/latex');

var _libLatex2 = _interopRequireDefault(_libLatex);

var _stubs = require('./stubs');

'use babel';

describe('Latex', function () {
  var latex = undefined,
      globalLatex = undefined;

  beforeEach(function () {
    globalLatex = global.latex;
    delete global.latex;
    latex = new _libLatex2['default']();
  });

  afterEach(function () {
    global.latex = globalLatex;
  });

  describe('initialize', function () {
    it('initializes all properties', function () {
      spyOn(latex, 'resolveOpenerImplementation').andReturn(_stubs.NullOpener);

      expect(latex.builder).toBeDefined();
      expect(latex.logger).toBeDefined();
      expect(latex.opener).toBeDefined();
    });
  });

  describe('getDefaultBuilder', function () {
    it('returns an instance of LatexmkBuilder by default', function () {
      spyOn(latex, 'useLatexmk').andReturn(true);
      var defaultBuilder = latex.getDefaultBuilder();
      expect(defaultBuilder.constructor.name).toBe('LatexmkBuilder');
    });

    it('returns an instance of TexifyBuilder when chosen', function () {
      spyOn(latex, 'useLatexmk').andReturn(false);
      var defaultBuilder = latex.getDefaultBuilder();
      expect(defaultBuilder.constructor.name).toBe('TexifyBuilder');
    });
  });

  describe('getDefaultLogger', function () {
    it('returns an instance of ConsoleLogger', function () {
      var defaultLogger = latex.getDefaultLogger();

      expect(defaultLogger.constructor.name).toBe('ConsoleLogger');
    });
  });

  describe('getDefaultOpener', function () {
    it('returns an instance of a resolved implementation of Opener', function () {
      spyOn(latex, 'resolveOpenerImplementation').andReturn(_stubs.NullOpener);
      var defaultOpener = latex.getDefaultOpener();

      expect(defaultOpener.constructor.name).toBe(_stubs.NullOpener.name);
    });
  });

  describe('Logger proxy', function () {
    var logger = undefined;

    beforeEach(function () {
      logger = jasmine.createSpyObj('MockLogger', ['error', 'warning', 'info']);
      latex.setLogger(logger);
      latex.createLogProxy();
    });

    it('correctly proxies error to error', function () {
      var statusCode = 0;
      var result = { foo: 'bar' };
      var builder = { run: function run() {
          return '';
        } };
      latex.log.error(statusCode, result, builder);

      expect(logger.error).toHaveBeenCalledWith(statusCode, result, builder);
    });

    it('correctly proxies warning to warning', function () {
      var message = 'foo';
      latex.log.warning(message);

      expect(logger.warning).toHaveBeenCalledWith(message);
    });

    it('correctly proxies info to info', function () {
      var message = 'foo';
      latex.log.info(message);

      expect(logger.info).toHaveBeenCalledWith(message);
    });
  });

  describe('resolveOpenerImplementation', function () {
    it('returns SkimOpener when installed, and running on OS X', function () {
      spyOn(latex, 'skimExecutableExists').andReturn(true);
      var opener = latex.resolveOpenerImplementation('darwin');

      expect(opener.name).toBe('SkimOpener');
    });

    it('returns PreviewOpener when Skim is not installed, and running on OS X', function () {
      spyOn(latex, 'skimExecutableExists').andReturn(false);
      var opener = latex.resolveOpenerImplementation('darwin');

      expect(opener.name).toBe('PreviewOpener');
    });

    it('returns SumatraOpener when installed, and running on Windows', function () {
      spyOn(latex, 'sumatraExecutableExists').andReturn(true);
      var opener = latex.resolveOpenerImplementation('win32');

      expect(opener.name).toBe('SumatraOpener');
    });

    it('returns AtomPdfOpener as a fallback, if the pdf-view package is installed', function () {
      spyOn(latex, 'hasPdfViewerPackage').andReturn(true);
      var opener = latex.resolveOpenerImplementation('foo');

      expect(opener.name).toBe('AtomPdfOpener');
    });

    it('always returns AtomPdfOpener if alwaysOpenResultInAtom is enabled and pdf-view is installed', function () {
      spyOn(latex, 'hasPdfViewerPackage').andReturn(true);
      spyOn(latex, 'shouldOpenResultInAtom').andReturn(true);
      spyOn(latex, 'skimExecutableExists').andCallThrough();

      var opener = latex.resolveOpenerImplementation('darwin');

      expect(opener.name).toBe('AtomPdfOpener');
      expect(latex.skimExecutableExists).not.toHaveBeenCalled();
    });

    it('responds to changes in configuration', function () {
      spyOn(latex, 'hasPdfViewerPackage').andReturn(true);
      spyOn(latex, 'shouldOpenResultInAtom').andReturn(false);
      spyOn(latex, 'skimExecutableExists').andReturn(true);

      var opener = latex.resolveOpenerImplementation('darwin');
      expect(opener.name).toBe('SkimOpener');

      latex.shouldOpenResultInAtom.andReturn(true);
      opener = latex.resolveOpenerImplementation('darwin');
      expect(opener.name).toBe('AtomPdfOpener');

      latex.shouldOpenResultInAtom.andReturn(false);
      opener = latex.resolveOpenerImplementation('darwin');
      expect(opener.name).toBe('SkimOpener');
    });

    it('does not support GNU/Linux', function () {
      spyOn(latex, 'hasPdfViewerPackage').andReturn(false);
      var opener = latex.resolveOpenerImplementation('linux');

      expect(opener).toBeNull();
    });

    it('does not support unknown operating systems without pdf-view package', function () {
      spyOn(latex, 'hasPdfViewerPackage').andReturn(false);
      var opener = latex.resolveOpenerImplementation('foo');

      expect(opener).toBeNull();
    });

    it('returns CustomOpener when custom viewer exists and alwaysOpenResultInAtom is disabled', function () {
      spyOn(latex, 'viewerExecutableExists').andReturn(true);
      spyOn(latex, 'shouldOpenResultInAtom').andReturn(false);
      var opener = latex.resolveOpenerImplementation('foo');

      expect(opener.name).toBe('CustomOpener');
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9sYXRleC1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBRU8sZ0JBQWdCOzt3QkFDTCxjQUFjOzs7O3FCQUNQLFNBQVM7O0FBSmxDLFdBQVcsQ0FBQTs7QUFNWCxRQUFRLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDdEIsTUFBSSxLQUFLLFlBQUE7TUFBRSxXQUFXLFlBQUEsQ0FBQTs7QUFFdEIsWUFBVSxDQUFDLFlBQU07QUFDZixlQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQTtBQUMxQixXQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUE7QUFDbkIsU0FBSyxHQUFHLDJCQUFXLENBQUE7R0FDcEIsQ0FBQyxDQUFBOztBQUVGLFdBQVMsQ0FBQyxZQUFNO0FBQ2QsVUFBTSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUE7R0FDM0IsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBTTtBQUMzQixNQUFFLENBQUMsNEJBQTRCLEVBQUUsWUFBTTtBQUNyQyxXQUFLLENBQUMsS0FBSyxFQUFFLDZCQUE2QixDQUFDLENBQUMsU0FBUyxtQkFBWSxDQUFBOztBQUVqRSxZQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ25DLFlBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEMsWUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUNuQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQU07QUFDbEMsTUFBRSxDQUFDLGtEQUFrRCxFQUFFLFlBQU07QUFDM0QsV0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDMUMs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TUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7S0FDMUIsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyx1RkFBdUYsRUFBRSxZQUFNO0FBQ2hHLFdBQUssQ0FBQyxLQUFLLEVBQUUsd0JBQXdCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdEQsV0FBSyxDQUFDLEtBQUssRUFBRSx3QkFBd0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN2RCxVQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsMkJBQTJCLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRXZELFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0tBQ3pDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvbGF0ZXgtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAnLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgTGF0ZXggZnJvbSAnLi4vbGliL2xhdGV4J1xuaW1wb3J0IHtOdWxsT3BlbmVyfSBmcm9tICcuL3N0dWJzJ1xuXG5kZXNjcmliZSgnTGF0ZXgnLCAoKSA9PiB7XG4gIGxldCBsYXRleCwgZ2xvYmFsTGF0ZXhcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBnbG9iYWxMYXRleCA9IGdsb2JhbC5sYXRleFxuICAgIGRlbGV0ZSBnbG9iYWwubGF0ZXhcbiAgICBsYXRleCA9IG5ldyBMYXRleCgpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBnbG9iYWwubGF0ZXggPSBnbG9iYWxMYXRleFxuICB9KVxuXG4gIGRlc2NyaWJlKCdpbml0aWFsaXplJywgKCkgPT4ge1xuICAgIGl0KCdpbml0aWFsaXplcyBhbGwgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIHNweU9uKGxhdGV4LCAncmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uJykuYW5kUmV0dXJuKE51bGxPcGVuZXIpXG5cbiAgICAgIGV4cGVjdChsYXRleC5idWlsZGVyKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobGF0ZXgubG9nZ2VyKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobGF0ZXgub3BlbmVyKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0RGVmYXVsdEJ1aWxkZXInLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgYW4gaW5zdGFuY2Ugb2YgTGF0ZXhta0J1aWxkZXIgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIHNweU9uKGxhdGV4LCAndXNlTGF0ZXhtaycpLmFuZFJldHVybih0cnVlKVxuICAgICAgY29uc3QgZGVmYXVsdEJ1aWxkZXIgPSBsYXRleC5nZXREZWZhdWx0QnVpbGRlcigpXG4gICAgICBleHBlY3QoZGVmYXVsdEJ1aWxkZXIuY29uc3RydWN0b3IubmFtZSkudG9CZSgnTGF0ZXhta0J1aWxkZXInKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBhbiBpbnN0YW5jZSBvZiBUZXhpZnlCdWlsZGVyIHdoZW4gY2hvc2VuJywgKCkgPT4ge1xuICAgICAgc3B5T24obGF0ZXgsICd1c2VMYXRleG1rJykuYW5kUmV0dXJuKGZhbHNlKVxuICAgICAgY29uc3QgZGVmYXVsdEJ1aWxkZXIgPSBsYXRleC5nZXREZWZhdWx0QnVpbGRlcigpXG4gICAgICBleHBlY3QoZGVmYXVsdEJ1aWxkZXIuY29uc3RydWN0b3IubmFtZSkudG9CZSgnVGV4aWZ5QnVpbGRlcicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0RGVmYXVsdExvZ2dlcicsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBhbiBpbnN0YW5jZSBvZiBDb25zb2xlTG9nZ2VyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdExvZ2dlciA9IGxhdGV4LmdldERlZmF1bHRMb2dnZXIoKVxuXG4gICAgICBleHBlY3QoZGVmYXVsdExvZ2dlci5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdDb25zb2xlTG9nZ2VyJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXREZWZhdWx0T3BlbmVyJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGFuIGluc3RhbmNlIG9mIGEgcmVzb2x2ZWQgaW1wbGVtZW50YXRpb24gb2YgT3BlbmVyJywgKCkgPT4ge1xuICAgICAgc3B5T24obGF0ZXgsICdyZXNvbHZlT3BlbmVySW1wbGVtZW50YXRpb24nKS5hbmRSZXR1cm4oTnVsbE9wZW5lcilcbiAgICAgIGNvbnN0IGRlZmF1bHRPcGVuZXIgPSBsYXRleC5nZXREZWZhdWx0T3BlbmVyKClcblxuICAgICAgZXhwZWN0KGRlZmF1bHRPcGVuZXIuY29uc3RydWN0b3IubmFtZSkudG9CZShOdWxsT3BlbmVyLm5hbWUpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTG9nZ2VyIHByb3h5JywgKCkgPT4ge1xuICAgIGxldCBsb2dnZXJcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbG9nZ2VyID0gamFzbWluZS5jcmVhdGVTcHlPYmooJ01vY2tMb2dnZXInLCBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbyddKVxuICAgICAgbGF0ZXguc2V0TG9nZ2VyKGxvZ2dlcilcbiAgICAgIGxhdGV4LmNyZWF0ZUxvZ1Byb3h5KClcbiAgICB9KVxuXG4gICAgaXQoJ2NvcnJlY3RseSBwcm94aWVzIGVycm9yIHRvIGVycm9yJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdHVzQ29kZSA9IDBcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHsgZm9vOiAnYmFyJyB9XG4gICAgICBjb25zdCBidWlsZGVyID0geyBydW4gKCkgeyByZXR1cm4gJycgfSB9XG4gICAgICBsYXRleC5sb2cuZXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKVxuXG4gICAgICBleHBlY3QobG9nZ2VyLmVycm9yKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpXG4gICAgfSlcblxuICAgIGl0KCdjb3JyZWN0bHkgcHJveGllcyB3YXJuaW5nIHRvIHdhcm5pbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gJ2ZvbydcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKG1lc3NhZ2UpXG5cbiAgICAgIGV4cGVjdChsb2dnZXIud2FybmluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgobWVzc2FnZSlcbiAgICB9KVxuXG4gICAgaXQoJ2NvcnJlY3RseSBwcm94aWVzIGluZm8gdG8gaW5mbycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnZm9vJ1xuICAgICAgbGF0ZXgubG9nLmluZm8obWVzc2FnZSlcblxuICAgICAgZXhwZWN0KGxvZ2dlci5pbmZvKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtZXNzYWdlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3Jlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbicsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBTa2ltT3BlbmVyIHdoZW4gaW5zdGFsbGVkLCBhbmQgcnVubmluZyBvbiBPUyBYJywgKCkgPT4ge1xuICAgICAgc3B5T24obGF0ZXgsICdza2ltRXhlY3V0YWJsZUV4aXN0cycpLmFuZFJldHVybih0cnVlKVxuICAgICAgY29uc3Qgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKCdkYXJ3aW4nKVxuXG4gICAgICBleHBlY3Qob3BlbmVyLm5hbWUpLnRvQmUoJ1NraW1PcGVuZXInKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBQcmV2aWV3T3BlbmVyIHdoZW4gU2tpbSBpcyBub3QgaW5zdGFsbGVkLCBhbmQgcnVubmluZyBvbiBPUyBYJywgKCkgPT4ge1xuICAgICAgc3B5T24obGF0ZXgsICdza2ltRXhlY3V0YWJsZUV4aXN0cycpLmFuZFJldHVybihmYWxzZSlcbiAgICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbignZGFyd2luJylcblxuICAgICAgZXhwZWN0KG9wZW5lci5uYW1lKS50b0JlKCdQcmV2aWV3T3BlbmVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgU3VtYXRyYU9wZW5lciB3aGVuIGluc3RhbGxlZCwgYW5kIHJ1bm5pbmcgb24gV2luZG93cycsICgpID0+IHtcbiAgICAgIHNweU9uKGxhdGV4LCAnc3VtYXRyYUV4ZWN1dGFibGVFeGlzdHMnKS5hbmRSZXR1cm4odHJ1ZSlcbiAgICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbignd2luMzInKVxuXG4gICAgICBleHBlY3Qob3BlbmVyLm5hbWUpLnRvQmUoJ1N1bWF0cmFPcGVuZXInKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBBdG9tUGRmT3BlbmVyIGFzIGEgZmFsbGJhY2ssIGlmIHRoZSBwZGYtdmlldyBwYWNrYWdlIGlzIGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIHNweU9uKGxhdGV4LCAnaGFzUGRmVmlld2VyUGFja2FnZScpLmFuZFJldHVybih0cnVlKVxuICAgICAgY29uc3Qgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKCdmb28nKVxuXG4gICAgICBleHBlY3Qob3BlbmVyLm5hbWUpLnRvQmUoJ0F0b21QZGZPcGVuZXInKVxuICAgIH0pXG5cbiAgICBpdCgnYWx3YXlzIHJldHVybnMgQXRvbVBkZk9wZW5lciBpZiBhbHdheXNPcGVuUmVzdWx0SW5BdG9tIGlzIGVuYWJsZWQgYW5kIHBkZi12aWV3IGlzIGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIHNweU9uKGxhdGV4LCAnaGFzUGRmVmlld2VyUGFja2FnZScpLmFuZFJldHVybih0cnVlKVxuICAgICAgc3B5T24obGF0ZXgsICdzaG91bGRPcGVuUmVzdWx0SW5BdG9tJykuYW5kUmV0dXJuKHRydWUpXG4gICAgICBzcHlPbihsYXRleCwgJ3NraW1FeGVjdXRhYmxlRXhpc3RzJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICBjb25zdCBvcGVuZXIgPSBsYXRleC5yZXNvbHZlT3BlbmVySW1wbGVtZW50YXRpb24oJ2RhcndpbicpXG5cbiAgICAgIGV4cGVjdChvcGVuZXIubmFtZSkudG9CZSgnQXRvbVBkZk9wZW5lcicpXG4gICAgICBleHBlY3QobGF0ZXguc2tpbUV4ZWN1dGFibGVFeGlzdHMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Jlc3BvbmRzIHRvIGNoYW5nZXMgaW4gY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgIHNweU9uKGxhdGV4LCAnaGFzUGRmVmlld2VyUGFja2FnZScpLmFuZFJldHVybih0cnVlKVxuICAgICAgc3B5T24obGF0ZXgsICdzaG91bGRPcGVuUmVzdWx0SW5BdG9tJykuYW5kUmV0dXJuKGZhbHNlKVxuICAgICAgc3B5T24obGF0ZXgsICdza2ltRXhlY3V0YWJsZUV4aXN0cycpLmFuZFJldHVybih0cnVlKVxuXG4gICAgICBsZXQgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKCdkYXJ3aW4nKVxuICAgICAgZXhwZWN0KG9wZW5lci5uYW1lKS50b0JlKCdTa2ltT3BlbmVyJylcblxuICAgICAgbGF0ZXguc2hvdWxkT3BlblJlc3VsdEluQXRvbS5hbmRSZXR1cm4odHJ1ZSlcbiAgICAgIG9wZW5lciA9IGxhdGV4LnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbignZGFyd2luJylcbiAgICAgIGV4cGVjdChvcGVuZXIubmFtZSkudG9CZSgnQXRvbVBkZk9wZW5lcicpXG5cbiAgICAgIGxhdGV4LnNob3VsZE9wZW5SZXN1bHRJbkF0b20uYW5kUmV0dXJuKGZhbHNlKVxuICAgICAgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKCdkYXJ3aW4nKVxuICAgICAgZXhwZWN0KG9wZW5lci5uYW1lKS50b0JlKCdTa2ltT3BlbmVyJylcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90IHN1cHBvcnQgR05VL0xpbnV4JywgKCkgPT4ge1xuICAgICAgc3B5T24obGF0ZXgsICdoYXNQZGZWaWV3ZXJQYWNrYWdlJykuYW5kUmV0dXJuKGZhbHNlKVxuICAgICAgY29uc3Qgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKCdsaW51eCcpXG5cbiAgICAgIGV4cGVjdChvcGVuZXIpLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90IHN1cHBvcnQgdW5rbm93biBvcGVyYXRpbmcgc3lzdGVtcyB3aXRob3V0IHBkZi12aWV3IHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICBzcHlPbihsYXRleCwgJ2hhc1BkZlZpZXdlclBhY2thZ2UnKS5hbmRSZXR1cm4oZmFsc2UpXG4gICAgICBjb25zdCBvcGVuZXIgPSBsYXRleC5yZXNvbHZlT3BlbmVySW1wbGVtZW50YXRpb24oJ2ZvbycpXG5cbiAgICAgIGV4cGVjdChvcGVuZXIpLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgQ3VzdG9tT3BlbmVyIHdoZW4gY3VzdG9tIHZpZXdlciBleGlzdHMgYW5kIGFsd2F5c09wZW5SZXN1bHRJbkF0b20gaXMgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICBzcHlPbihsYXRleCwgJ3ZpZXdlckV4ZWN1dGFibGVFeGlzdHMnKS5hbmRSZXR1cm4odHJ1ZSlcbiAgICAgIHNweU9uKGxhdGV4LCAnc2hvdWxkT3BlblJlc3VsdEluQXRvbScpLmFuZFJldHVybihmYWxzZSlcbiAgICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbignZm9vJylcblxuICAgICAgZXhwZWN0KG9wZW5lci5uYW1lKS50b0JlKCdDdXN0b21PcGVuZXInKVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/latex-spec.js
