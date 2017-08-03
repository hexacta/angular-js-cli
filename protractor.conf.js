/* eslint-env node, jasmine, protractor */
/* eslint-disable global-require */
'use strict';
var gulpConfig = require('./gulp.config')();
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:' + gulpConfig.defaultPort,

  multiCapabilities: [
    // {
    //   'browserName': 'internet explorer',
    //   'platform': 'ANY',
    //   'version': '11',
    //   'nativeEvents': false
    // },
    { 'browserName': 'chrome' }
  ],
  specs: gulpConfig.scenarios,
  suites: {
    session: 'src/app/session/**/*.e2e.js',
    friends: 'src/app/friends/**/*.e2e.js'
  },

  jasmineNodeOpts: {
    showColors: true,
    // eslint-disable-next-line no-empty-function
    print: function () { }
  },
  onPrepare: function () {
    // Your other stuff.
    require('protractor-uisref-locator')(protractor);
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

    return browser.getProcessedConfig().then(function (config) {
      var capabilities = config.capabilities;
      var browserString = capabilities.browserName.replace(/\s/g, '_');
      if (capabilities.version) {
        browserString = browserString + capabilities.version;
      }
      jasmine.getEnv().addReporter(
        new Jasmine2HtmlReporter({
          savePath: 'reports/e2e/' + browserString,
          takeScreenshots: true,
          takeScreenshotsOnlyOnFailures: true,
          filePrefix: browserString,
          consolidateAll: true
        })
      );
    });
  }
};