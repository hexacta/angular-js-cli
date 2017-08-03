/* eslint-env node */
'use strict';

var gulp = require('gulp');
var args = require('yargs').argv;
var inquirer = require('inquirer');
var del = require('del');
var $ = require('gulp-load-plugins')({ lazy: true });

var fullConfig = require('./angular-generators.config')();
var inquires = require('./angular-generators.inquires')();

var config = fullConfig.elements;
var paramsConfiguration = inquires.params;
var destFolder = fullConfig.destFolder;

/**
 * Interactive Angularjs element generator
 * Params:
 *      --generate=element     : (optional)
 *                             element to generate
 *                             options ['module', 'component', 'resource', 'service', 'interceptor']
 */
gulp.task('generate-angular', function (done) {
    var opts = ['module', 'component', 'resource', 'service', 'interceptor'];
    if (args.generate && opts.indexOf(args.generate) !== -1) {
        askForParams(args.generate);
    } else {
        inquirer.prompt(inquires.generateElement(opts), function (option) {
            askForParams(option.operation);
        });
    }
});

/**
 * Interactive Angularjs app generator
 */
gulp.task('angular-app', function (done) {
    inquirer.prompt(inquires.generateApp(config.app.defaultDest, fullConfig.defaultAppName, args.first),
        function (answers) {
            if ((!args.first && !answers.continue) || !answers.path || !answers.name) {
                return;
            }
            args.validated = args.first || answers.continue;
            args.title = answers.name;
            args.path = answers.path;
            args.elements = answers.elements.toString();
            gulp.start('generate-app');
        });
});

/**
 * Creates a new app from templates
 * Params:
 *      --title="Some Name"             : App display title
 *      --elements=module1,module2      : (optional)
 *                                          generate optional modules, [friends,session]
 *      --path=some/path                : (optional)
 *                                          path to module's components' folder, if none set, default is ./src
 */
gulp.task('generate-app', ['clean-app'], function () {
    var files = [config.app.templateSrc];
    var patterns = [];
    var newPath = config.app.defaultDest;

    for (var i = 0; i < config.app.modules.length; i++) {
        var mod = config.app.modules[i];
        if (args.elements.indexOf(config.app.modules[i]) !== -1) {
            files = files.concat(config.app[mod].keepSrc);
            patterns = patterns.concat(config.app[mod].keepRegex);
        } else {
            files = files.concat(config.app[mod].removeSrc);
            patterns = patterns.concat(config.app[mod].removeRegex);
        }
    }

    if (args.path) {
        newPath = args.path;
    }
    patterns.push({ match: /<%=title=%>/g, replacement: args.title });

    return gulp.src(files)
        .pipe($.replaceTask({ patterns: patterns }))
        .pipe($.rename(function (path) {
            path.dirname = path.dirname.substring(1).replace(/\\_/g, '\\');
            path.basename = path.basename.substring(1);
            logFileCreation(path.basename, path.dirname);
        }))
        .pipe(gulp.dest(newPath))
        .pipe($.filter('**/*.js', { restore: true }))
        .pipe($.eslint({ rulePaths: fullConfig.eslintRules, fix: true }))
        .pipe($.eslint.format())
        .pipe($.if(isFixed, gulp.dest(newPath)));
});

/**
 * Deletes the app's files and folder from a given path
 * Params:
 *      --path=some/path                : (optional)
 *                                          path to module's components' folder, if none set, default is ./src
 */
gulp.task('clean-app', function (done) {
    var path;
    if (!args.path) {
        path = config.app.defaultDest;
    } else {
        path = args.path;
    }
    if (!args.validated) {
        inquirer.prompt(inquires.confirmClean(path), function (answers) {
            if (answers.continue) {
                del(config.app.cleanFiles, { root: path }, done);
            } else {
                done();
            }
        });
    } else {
        del(config.app.cleanFiles, { root: path }, done);
    }
});

/**
 * Creates a new module from templates
 * Params:
 *      --name=somename       : sets the module and folder name
 *      --path=some/path      : (optional)
 *                              path to module's components' folder, if none set, default is app/modulename/components
 */
gulp.task('generate-module', function () {
    var name, nameNoPrefix;
    if (!validateParams('module')) {
        return;
    }
    nameNoPrefix = args.moduleName.replace(/^app\./g, '');
    name = generateNames(nameNoPrefix);
    createFiles(config.module, name, args.moduleName, nameNoPrefix.replace(/\./g, '/'));

    $.util.log($.util.colors.yellow(
        'Remember to add the new module to the app root module\'s dependencies'
    ));
});

/**
 * Creates a new component from templates
 * Params:
 *      --module=modulename   : component's module's name
 *      --name=someName       : component name in camelCase
 *      --path=some/path      : (optional)
 *                              path to module's components' folder, if none set, default is app/modulename/components
 */
gulp.task('generate-component', function (done) {
    var name, moduleName, newPath;
    if (!validateParams('component')) {
        return;
    }
    name = generateNames(args.name);
    moduleName = args.module;
    if (!args.path) {
        newPath = moduleName + '/components/' + name.dashed;
    } else {
        newPath = args.path;
    }
    createFiles(config.component, name, moduleName, newPath);

    $.util.log($.util.colors.yellow(
        'Remember override default template\'s behavior'
    ));
});

/**
 * Creates a new interceptor from templates
 * Params:
 *      --module=modulename   : interceptor's module's name
 *      --name=someName       : interceptor name in camelCase
 *      --path=some/path      : (optional)
 *                              path to module's interceptor' folder, if none set, default is app/modulename
 */
gulp.task('generate-interceptor', function () {
    var name, moduleName, newPath;
    if (!validateParams('interceptor')) {
        return;
    }
    name = generateNames(args.name);
    moduleName = args.module;
    if (!args.path) {
        newPath = moduleName;
    } else {
        newPath = args.path;
    }
    createFiles(config.interceptor, name, moduleName, newPath);

    $.util.log($.util.colors.yellow(
        'Remember override default template\'s behavior and inject the interceptor in the module\'s run function'
    ));
});

/**
 * Creates a new service from templates
 * Params:
 *      --module=modulename   : service's module's name
 *      --name=someName       : service name in camelCase
 *      --path=some/path      : (optional)
 *                              path to module's service' folder, if none set, default is app/services
 */
gulp.task('generate-service', function () {
    var name, moduleName, newPath;
    if (!validateParams('service')) {
        return;
    }
    name = generateNames(args.name);
    moduleName = args.module;
    if (!args.path) {
        newPath = moduleName + '/services';
    } else {
        newPath = args.path;
    }
    createFiles(config.service, name, moduleName, newPath);

    $.util.log($.util.colors.yellow(
        'Remember override default template\'s behavior and inject the interceptor in the module\'s run function'
    ));
});

/**
 * Creates a new resource from templates
 * Params:
 *      --module=modulename   : resource's module's name
 *      --name=someName       : resource name in camelCase
 *      --path=some/path      : (optional)
 *                              path to module's resource' folder, if none set, default is app/modulename/model/resourceName
 */
gulp.task('generate-resource', function (done) {
    var name, moduleName, newPath;
    if (!validateParams('resource')) {
        return;
    }
    var resourceConfig = config.resource;
    name = generateNames(args.name);
    moduleName = args.module;
    if (!args.path) {
        newPath = moduleName + '/model/' + name.dashed;
    } else {
        newPath = args.path;
    }
    inquirer.prompt(inquires.generateResource(name.camelCase), function (answers) {
        if (answers.files.indexOf('Resource') !== -1) {
            createFiles(resourceConfig.model, name, moduleName, newPath);
        }
        if (answers.files.indexOf('Service') !== -1) {
            var servicePath = resourceConfig.service.buildPath(moduleName, name.dashed);
            createFiles(resourceConfig.service, name, moduleName, servicePath);
        }
        if (answers.files.indexOf('Mock') !== -1) {
            var mockPath = resourceConfig.mock.buildPath(moduleName, name.dashed);
            createFiles(resourceConfig.mock, name, moduleName, mockPath);
            $.util.log($.util.colors.yellow(
                'Remember to add the mocks on the appMock run block'
            ));
        }

        $.util.log($.util.colors.yellow(
            'Remember override default template\'s behavior and modify the resource\'s test'
        ));
        done();
    });
});

/**
 * Asks for the element's parameters' values using inquirer.
 * @param  {string} operation - Type of the element to generate
 * @returns {Stream} The inquirer stream
 */
function askForParams(operation) {
    if (!operation || Object.keys(config).indexOf(operation) === -1) {
        return;
    }
    var paramsQuestions = generatePromptParams(operation);

    return inquirer.prompt(paramsQuestions, function (answers) {
        args = answers;
        if (config[operation].buildPath) {
            var pathQuestion = paramsConfiguration.path;
            pathQuestion.default = config[operation].buildPath(
                decapitalizeFirstLetter(args.module),
                camelCaseToDash(args.name || args.moduleName));

            inquirer.prompt(pathQuestion, function (res) {
                args.path = res.path;
                gulp.start('generate-' + operation);
            });
        } else {
            gulp.start('generate-' + operation);
        }
    });
}

/**
 * Creates the files from templates and includes it on the app.
 * @param  {Array} src - Array of files or globs where the templates are
 * @param  {Object} name - Object with the service's name in camelCase, UpperCamelCase and dashed-name
 * @param  {string} moduleName - Name of the service's module
 * @param  {string} servicePath - The service's path
 * @param  {string} nameReplace - string template to replace in the template's filename
 * @returns {Stream} The build stream
 */
function createFiles(configuration, name, moduleName, newPath) {
    var patterns = [];
    if (moduleName) {
        patterns.push(getReplacement(/<%=module=%>/g, moduleName));
        patterns.push(getReplacement(/<%=Module=%>/g, moduleInCamel(moduleName)));
    }
    if (name.hasOwnProperty('camelCase')) {
        patterns.push(getReplacement(/<%=name=%>/g, name.camelCase));
    }
    if (name.hasOwnProperty('upperCamelCase')) {
        patterns.push(getReplacement(/<%=Name=%>/g, name.upperCamelCase));
    }
    if (name.hasOwnProperty('dashed')) {
        patterns.push(getReplacement(/<%=-name=%>/g, name.dashed));
        patterns.push(getReplacement(/<%=path-to=%>/g, configuration.appPath + newPath + '/' + name.dashed));
    }

    return gulp.src(configuration.templateSrc)
        .pipe($.replaceTask({ patterns: patterns }))
        .pipe($.rename(function (path) {
            path.dirname = configuration.appPath + newPath;
            path.basename = path.basename.replace(configuration.nameReplace, name.dashed);
            logFileCreation(path.basename, path.dirname);
        }))
        .pipe(gulp.dest(destFolder));
}

// /////////////////////////////////
/* Utils */

function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') {
        return false;
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
}

function camelCaseToDash(string) {
    if (typeof string !== 'string') {
        return false;
    }

    return removeDots(string).replace(/([A-Z])/g, function (g) {
        return '-' + g[0].toLowerCase();
    });
}

function decapitalizeFirstLetter(string) {
    if (typeof string !== 'string') {
        return false;
    }

    return string.charAt(0).toLowerCase() + string.slice(1);
}

function generateNames(name) {
    if (typeof name !== 'string') {
        return false;
    }
    var decapitalizedName = decapitalizeFirstLetter(name);

    return {
        camelCase: removeDots(decapitalizedName),
        upperCamelCase: removeDots(capitalizeFirstLetter(name)),
        dashed: camelCaseToDash(decapitalizedName)
    };
}

function generatePromptParams(type) {
    var questions = [];
    var params = config[type].params;
    for (var i = 0; i < params.length; i++) {
        if (params[i] !== 'path') {
            var param = paramsConfiguration[params[i]];
            param.message = param.message.replace('@type#', type);
            questions.push(param);
        }
    }

    return questions;
}

function getReplacement(match, replacement) {
    return {
        match: match,
        replacement: replacement
    };
}

function isFixed(file) {
    // Has ESLint fixed the file contents?
    return file.eslint !== null && file.eslint.fixed;
}

function logFileCreation(basename, dirname) {
    $.util.log($.util.colors.blue('--- File:'),
        $.util.colors.bgBlue(basename),
        $.util.colors.blue('created in'),
        $.util.colors.bgBlue(dirname));
}

function moduleInCamel(moduleName) {
    return capitalizeFirstLetter(removeDots(moduleName.replace(/^app[.-]/g, '')));
}

function removeDots(string) {
    if (typeof string !== 'string') {
        return false;
    }

    return string.replace(/\.[A-Za-z]/g, function (g) {
        return g[1].toUpperCase();
    });
}

function validateParams(type) {
    var valid = true;
    var params = config[type].params;
    for (var i = 0; i < params.length; i++) {
        if (paramsConfiguration[params[i]].required && !args[params[i]]) {
            $.util.log($.util.colors.red('Please set a ' + params[i] + ' with param'),
                $.util.colors.bgRed('--' + params[i] + '='));
            valid = false;
        }
    }

    return valid;
}