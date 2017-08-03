/* eslint-env node */
'use strict';
var gulpConfig = require('./gulp.config')();
module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // some available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: gulpConfig.karma.files,

    // list of files to exclude
    exclude: gulpConfig.karma.exclude,

    proxies: { '/': 'http://localhost:8888/' },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: gulpConfig.karma.preprocessors,

    // test results reporter to use
    // possible values: 'dots', 'progress', 'coverage'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],

    coverageReporter: {
      dir: gulpConfig.karma.coverage.dir,
      reporters: gulpConfig.karma.coverage.reporters,
      check: gulpConfig.karma.coverage.check
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //        browsers: ['Chrome', 'ChromeCanary', 'FirefoxAurora', 'Safari', 'PhantomJS'],
    browsers: gulpConfig.karma.browsers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
