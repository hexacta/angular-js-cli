/* eslint-env node */
'use strict';

var args = require('yargs').argv;
var notifier = require('node-notifier');
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var pkg = require('./package.json');

var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var wiredep = require('wiredep').stream;

var CLIEngine = require('eslint').CLIEngine;
var plato = require('plato');
var Karma = require('karma').Server;

var requireDir = require('require-dir');
requireDir('./angularjs-cli');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({ lazy: true });

var colors = $.util.colors;
var port = config.defaultPort;

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --mocked  : Servers will start/deploy in mock mode
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * vet the code and create coverage report
 * Params:
 *      --fix    : if set, fixes and replaces files
 * @return {Stream}
 */
gulp.task('vet', function () {
  log('Analyzing source with ESLint');
  var eslintOptions = { rulePaths: config.eslintRules };
  if (args.fix) {
    eslintOptions.fix = true;
  }

  return gulp
    .src(config.alljs, { base: config.client })
    .pipe($.if(args.verbose, $.print()))
    .pipe($.eslint(eslintOptions))
    .pipe($.eslint.format())
    .pipe($.if(eslintOptions.fix === true, gulp.dest(config.client)));
});

/**
 * Create a visualizer report
 */
gulp.task('plato', function (done) {
  log('Analyzing source with Plato');
  log('Browse to /report/plato/index.html to see Plato results');

  startPlatoVisualizer(done);
});

/**
 * Compile sass to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function () {
  log('Compiling Sass --> CSS');

  return gulp
    .src(config.sass)
    .pipe($.plumber()) // exit gracefully if something fails after this
    .pipe($.sass())
    //        .on('error', errorLogger) // more verbose and dupe output. requires emit.
    // .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
    .pipe(gulp.dest(config.clientCss));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], function () {
  log('Copying fonts');

  return gulp
    .src(config.fonts)
    .pipe($.flatten())
    .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function () {
  log('Compressing and copying images');

  return gulp
    .src(config.images)
    .pipe($.imagemin({ optimizationLevel: 4 }))
    .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('sass-watcher', function () {
  var sassFiles = config.client + '**/*.scss';
  gulp.watch([sassFiles], ['styles']);
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function () {
  log('Wiring the bower dependencies into the html');

  var options = config.getWiredepDefaultOptions();

  // Only include stubs if flag is enabled
  var js = args.mocked ? [].concat(config.js, config.mockjs) : config.js;

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe(inject(js, '', config.jsOrder, true))
    .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['clean-code', 'wiredep', 'styles'], function () {
  log('Wire up css into the html, after files are ready');

  var pattern = {
    match: /ng-app="(.*)"/,
    replacement: 'ng-app="app"'
  };

  if (args.mocked) {
    pattern.replacement = 'ng-app="appMock"';
  }

  return gulp
    .src(config.index)
    .pipe(inject(config.css, '', undefined, true))
    .pipe($.replaceTask({ patterns: [pattern] }))
    .pipe(gulp.dest(config.client));
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', ['clean-code'], function (/* done */) {
  log('building the spec runner');

  var options = config.getWiredepDefaultOptions();
  var specs = config.specs;

  if (args.startServers) {
    specs = [].concat(specs, config.serverIntegrationSpecs);
  }
  options.devDependencies = true;

  return gulp
    .src(config.specRunner)
    .pipe(wiredep(options))
    .pipe(inject(config.js, '', config.jsOrder, true))
    .pipe(inject(config.testlibraries, 'testlibraries'))
    .pipe(inject(config.specHelpers, 'spechelpers'))
    .pipe(inject(specs, 'specs', ['**/*'], true))
    .pipe(gulp.dest(config.client));
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', ['optimize', 'images', 'fonts'], function () {
  log('Building everything');

  var msg = {
    title: 'gulp build',
    subtitle: 'Deployed to the build folder',
    message: 'Running `gulp serve-build`'
  };
  log(msg);
  notify(msg);
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject'], function () {
  log('Optimizing the js, css, and html');

  var assets = $.useref.assets({ searchPath: config.client });
  // Filters are named for the gulp-useref path
  var cssFilter = $.filter('**/*.css');
  var jsAppFilter = $.filter('**/' + config.optimized.app);
  var jslibFilter = $.filter('**/' + config.optimized.lib);

  var templatesOptions = { basePath: '.\\src\\', minimize: $.minifyHtml({ empty: true }) };

  return gulp
    .src(config.index)
    .pipe($.plumber())
    .pipe(assets) // Gather all assets from the html with useref
    // Get the css
    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe(cssFilter.restore())
    // Get the custom javascript
    .pipe(jsAppFilter)
    .pipe($.angularEmbedTemplates(templatesOptions))
    .pipe($.uglify())
    .pipe(getHeader())
    .pipe(jsAppFilter.restore())
    // Get the vendor javascript
    .pipe(jslibFilter)
    .pipe($.uglify()) // another option is to override wiredep to use min files
    .pipe(jslibFilter.restore())
    // Take inventory of the file names for future rev numbers
    .pipe($.rev())
    // Apply the concat and file replacement with useref
    .pipe(assets.restore())
    .pipe($.useref())
    // Replace the file names in the html with rev numbers
    .pipe($.revReplace())
    .pipe(gulp.dest(config.build));
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function (done) {
  var delconfig = [].concat(config.build, config.report);
  log('Cleaning: ' + colors.blue(delconfig));
  del(delconfig, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function (done) {
  clean(config.build + 'fonts/**/*.*', done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function (done) {
  clean(config.build + 'img/**/*.*', done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function (done) {
  var files = [].concat(
    config.clientCss + '**/*.css',
    config.build + 'styles/**/*.css'
  );
  clean(files, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function (done) {
  var files = [].concat(
    config.build + 'js/**/*.js',
    config.build + '**/*.html'
  );
  clean(files, done);
});

/**
 * Run specs once and exit
 * @return {Stream}
 */
gulp.task('test', ['vet', 'clean-code'], function (done) {
  startTests(true /* singleRun*/, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 */
gulp.task('autotest', ['vet'], function (done) {
  startTests(false /* singleRun*/, done);
});

/**
 * Runs the e2e specs using protractor.
 */
gulp.task('e2e', ['vet'], function (done) {
  runProtractor(done);
});

/**
 * serve the dev environment
 * --nosync
 * --mocked uses mocked services
 */
gulp.task('serve-dev', ['vet', 'inject'], function () {
  serve(true /* isDev*/);
});

/**
 * serve the build environment
 * --nosync
 */
gulp.task('serve-build', ['build'], function () {
  serve(false /* isDev*/);
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function () {
  var msg = 'Bumping versions';
  var type = args.type;
  var version = args.ver;
  var options = {};
  if (version) {
    options.version = version;
    msg = msg + (' to ' + version);
  } else {
    options.type = type;
    msg = msg + (' for a ' + type);
  }
  log(msg);

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root));
});

/**
 * Optimize the code and re-load browserSync
 */
gulp.task('browserSyncReload', ['optimize'], browserSync.reload);

// //////////////

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
  log('Cleaning: ' + colors.blue(path));
  del(path, done);
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @param   {Boolean} isRelative   should use relative paths
 * @returns {Stream}   The stream
 */
function inject(src, label, order, isRelative) {
  var options = { read: false };
  var injectOptions = {};
  injectOptions.relative = Boolean(isRelative);
  if (label) {
    injectOptions.name = 'inject:' + label;
  }

  return $.inject(orderSrc(src, order, options), injectOptions);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @param   {Object} options   The gulp.src options
 * @returns {Stream} The ordered stream
 */
function orderSrc(src, order, options) {
  // order = order || ['* /'];
  return gulp
    .src(src, options)
    .pipe($.if(order, $.order(order)));
}

/**
 * serve the code
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
  var root = isDev ? './src' : './build';

  gulp.src(root).pipe($.webserver({
    livereload: isDev && !args.nosync,
    port: 8001
  }));

  return startBrowserSync(isDev, specRunner);
}

/**
 * Start e2e tests using Protractor.
 * @param {function} done Callback when protractor has finished its operation.
 * @return {Stream}
 */
function runProtractor(done) {
  log('Running e2e Protractor Specs...');
  var protractorArgs = [
    // '--baseUrl', 'http://localhost:' + config.defaultPort
  ];
  if (args.suite) {
    protractorArgs.push('--suite');
    protractorArgs.push(args.suite);
  }

  return gulp
    .src([config.scenarios], { read: false })
    .pipe($.plumber())
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js',
      args: protractorArgs
    }))
    .on('error', function () {
      log('Protractor Error.');
      done();
    })
    .on('end', function () {
      log('Protractor End.');
      done();
    });
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner) {
  var sassFiles = config.client + '**/*.scss';
  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting BrowserSync on port ' + port);

  // If build: watches the files, builds, and restarts browser-sync.
  // If dev: watches sass, compiles it to css, browser-sync handles reload
  if (isDev) {
    gulp.watch([sassFiles], ['styles'])
      .on('change', changeEvent);
  } else {
    gulp.watch([sassFiles, config.js, config.mockjs, config.html], ['browserSyncReload'])
      .on('change', changeEvent);
  }
  gulp.watch([config.js, config.mockjs, config.specs, config.scenarios, config.po], ['vet']);

  var options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: isDev ? [
      config.client + '**/*.*',
      '!' + config.client + '**/*.*',
      '!' + sassFiles,
      '!' + config.clientCss
    ] : [],
    ghostMode: { // these are the defaults t,f,t,t
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'info',
    logPrefix: 'angularjs-cli',
    notify: true,
    reloadDelay: isDev ? 500 : 1500
  };
  if (specRunner) {
    options.startPath = config.specRunnerFile;
  }

  browserSync(options);
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer(/* done */) {
  log('Running Plato');

  var eslintOptions = { rulePaths: config.eslintRules };
  var eslintConfig = new CLIEngine(eslintOptions);
  var final = eslintConfig.getConfigForFile('.eslintrc.json');

  var files = glob.sync(config.plato.js);
  var excludeFiles = /.*\.(spec|e2e|po)\.js/;
  var options = {
    title: 'Plato Inspections Report',
    eslint: final,
    exclude: excludeFiles
  };
  var outputDir = config.report + '/plato';

  plato.inspect(files, outputDir, options, platoCompleted);

  function platoCompleted(report) {
    var overview = plato.getOverviewReport(report);
    if (args.verbose) {
      log(overview.summary);
    }
    // if (done) { done(); }
  }
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
  var child;
  var excludeFiles = [];
  var serverSpecs = config.serverIntegrationSpecs;

  if (serverSpecs && serverSpecs.length) {
    excludeFiles = serverSpecs;
  }

  new Karma({
    configFile: path.join(__dirname, '/karma.conf.js'),
    exclude: excludeFiles,
    singleRun: Boolean(singleRun)
  }, karmaCompleted).start();

  // //////////////

  function karmaCompleted(karmaResult) {
    log('Karma completed');
    if (child) {
      log('shutting down the child process');
      child.kill();
    }
    if (karmaResult === 1) {
      done('karma: tests failed with code ' + karmaResult);
    } else {
      done();
    }
  }
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
  var template = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @authors <%= pkg.authors %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n');

  return $.header(template, { pkg: pkg });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
  if (typeof (msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log(colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log(colors.blue(msg));
  }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
  var notifyOptions = {
    sound: 'Bottle',
    contentImage: path.join(__dirname, 'gulp.png'),
    icon: path.join(__dirname, 'gulp.png')
  };
  _.assign(notifyOptions, options);
  notifier.notify(notifyOptions);
}

module.exports = gulp;
