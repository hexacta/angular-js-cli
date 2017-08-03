/* eslint-env node */
'use strict';
var wiredep = require('wiredep');
var jsonBower = require('./bower.json');

module.exports = function () {
  var client = './src/';
  var server = './src/server/';
  var angularTemplates = './templates/';
  var clientApp = client + 'app/';
  var mockedApp = client + 'app-mock/';
  var report = './reports/';
  var root = './';
  var specRunnerFile = 'specs.html';
  var clientCss = client + 'css/';
  var bowerFiles = wiredep({ devDependencies: true }).js;
  var bower = {
    json: jsonBower,
    directory: client + 'bower_components/',
    ignorePath: '../..'
  };
  var nodeModules = 'node_modules';
  var eslintRules = ['./eslint-rules/'];

  var config = {
    /**
     * File paths
     */
    // all javascript that we want to vet
    alljs: [
      clientApp + '**/*.js',
      mockedApp + '**/*.js'
    ],
    eslintRules: eslintRules,
    build: './build/',
    client: client,
    angularTemplates: angularTemplates,
    css: clientCss + 'app.styles.css',
    clientCss: clientCss,
    fonts: bower.directory + '**/*.{ttf,woff,woff2,eof,svg}',
    html: clientApp + '**/*.html',
    htmltemplates: clientApp + '**/*.template.html',
    images: client + 'img/**/*.*',
    index: client + 'index.html',
    // app js, with no specs
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js',
      clientApp + '**/*.json',
      '!' + clientApp + '**/*.test.js',
      '!' + clientApp + '**/*.spec.js',
      '!' + clientApp + '**/*.po.js',
      '!' + clientApp + '**/*.e2e.js'
    ],
    jsOrder: [
      '**/app.module.js',
      '**/*.module.js',
      '**/*.js'
    ],
    sass: clientApp + 'app.styles.scss',
    report: report,
    root: root,
    server: server,
    source: 'src/',
    mockjs: [
      mockedApp + '**/*.js'
    ],

    /**
     * optimized files
     */
    optimized: {
      app: 'app.js',
      lib: 'lib.js'
    },

    /**
     * plato
     */
    plato: { js: clientApp + '**/*.js' },

    /**
     * browser sync
     */
    browserReloadDelay: 1000,

    /**
     * Bower and NPM files
     */
    bower: bower,
    packages: [
      './package.json',
      './bower.json'
    ],

    /**
     * specs.html, our HTML spec runner
     */
    specRunner: client + specRunnerFile,
    specRunnerFile: specRunnerFile,

    /**
     * The sequence of the injections into specs.html:
     *  1 testlibraries
     *  2 bower
     *  3 js
     *  4 spechelpers
     *  5 specs
     */
    testlibraries: [
      nodeModules + '/jasmine/bin/jasmine.js',
      nodeModules + '/karma/bin/karma.js',
      nodeModules + '/karma-jasmine/bin/index.js'
    ],
    specHelpers: [client + 'test-helpers/*.js'],
    specs: [clientApp + '**/*.spec.js'],
    serverIntegrationSpecs: [clientApp + '**/*.po.js', clientApp + '**/*.e2e.js'],

    /**
     * E2E protractor settings
     */
    suites: { session: 'src/app/session/**/*.e2e.js' },
    scenarios: clientApp + '**/*.e2e.js',
    po: clientApp + '**/*.po.js',

    /**
     * Node settings
     */
    nodeServer: server + 'app.js',
    defaultPort: '8001'
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = function () {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };

    return options;
  };

  /**
   * karma settings
   */
  config.karma = getKarmaOptions();

  return config;

  // //////////////

  function getKarmaOptions() {
    var options = {
      browsers: ['Chrome', 'IE'],
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        mockedApp + '**/*.module.js',
        clientApp + '**/*.module.js',
        mockedApp + '**/*.js',
        clientApp + '**/*.js'
      ),
      exclude: config.serverIntegrationSpecs,
      coverage: {
        dir: report + 'unit-coverage',
        reporters: [
          // reporters not supporting the `file` property
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' },
          { type: 'text-summary' }
        ],
        check: {
          global: {
            statements: 90,
            branches: 90,
            functions: 90,
            lines: 90
          }
        }
      },
      preprocessors: { 'src/app/!(blocks)/**/!(*.spec|*.e2e).js': 'coverage' }
    };

    return options;
  }
};
