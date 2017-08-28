#! /usr/bin/env node --harmony
const program = require('commander');
const gulp = require('gulp');
const shell = require('gulp-shell')
const fullConfig = require('../angularjs-cli/angular-generators.config')();
const config = fullConfig.elements;
require('../gulpfile');

program
  .version('0.1.0')
  .option('-d, --directory <path>', `The directory name to create the app in. Default ${config.app.defaultDest}`)
  .parse(process.argv);

var name = program.args[0];
if (!name) name = fullConfig.defaultAppName;

var optionalParams = '';

if (program.directory) {
  optionalParams += ` --path="${program.directory}"`;
};

const cmd = `gulp angular-app --title="${name}" ${optionalParams}`;

console.log(cmd);
gulp.task('ngjs-new', shell.task([
  cmd
]))
gulp.start('ngjs-new');