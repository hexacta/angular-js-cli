/* eslint-env node */
/* eslint-disable max-len */
'use strict';

module.exports = function() {

    var destFolder = './src';
    var app = 'app/';
    var appMock = 'app-mock/';
    var defaultAppName = 'AngularJS cli with Frontend StackWeb';
    var defaultDest = './src';
    var eslintRules = ['./eslint-rules/'];

    var config = {
        destFolder: destFolder,
        defaultAppName: defaultAppName,
        eslintRules: eslintRules,
        elements: {
            app: {
                templateSrc: 'templates/full-app/**/*',
                defaultDest: defaultDest,
                cleanFiles: [
                    '/app',
                    '/app-mock',
                    '/img',
                    '/index.html',
                    '/css'
                ],
                modules: ['friends', 'session'],
                friends: {
                    removeSrc: ['!./templates/full-app/**/_friends', '!./templates/full-app/**/_friends/**/*'],
                    keepSrc: [],
                    removeRegex: [{
                        match: /(?:(?:\r\n|\r|\n)\s)(.*)\/\* replace:friends \*\/([\S\s]*?)\/\* endreplace:friends \*\//gm,
                        replacement: ''
                    }, {
                        match: /(?:(?:\r\n|\r|\n)\s)(.*)\/\* replace:friends:state \*\/([\S\s]*?)\/\* endreplace:friends:state \*\//gm,
                        replacement: 'loginState: \'*\','
                    }, {
                        match: /\/\* replace:friends:route \*\/([\S\s]*?)\/\* endreplace:friends:route \*\//gm,
                        replacement: '        defaultState: \'/\','
                    }, {
                        match: /\/\* replace:friends:testRoute \*\/([\S\s]*?)\/\* endreplace:friends:testRoute \*\//gm,
                        replacement: 'expect(actualUrl.split(\'/#/\')[1]).toEqual(\'login\');'
                    }],
                    keepRegex: [{
                        match: /(?:(?:\r\n|\r|\n)\s)(.*)\/\* (.*)replace:friends(.*) \*\//gm,
                        replacement: ''
                    }],
                    appPath: app
                },
                session: {
                    removeSrc: ['!./templates/full-app/**/_session', '!./templates/full-app/**/_session/**/*'],
                    keepSrc: ['!./templates/full-app/**/_core/_services/_session.service*'],
                    removeRegex: [{
                        match: /(?:(?:\r\n|\r|\n)\s)(.*)\/\* replace:session \*\/([\S\s]*?)\/\* endreplace:session \*\//gm,
                        replacement: ''
                    }, {
                        match: /(?:(?:\r\n|\r|\n)\s)(.*)\/\* replace:session:route \*\/([\S\s]*?)\/\* endreplace:session:route \*\//gm,
                        replacement: '/* replace:friends:route */\n        defaultState: \'app/friends\',\n /* endreplace:friends:route */'
                    }, {
                        match: /(?:(?:\r\n|\r|\n)\s)(.*)\/\* (.*)replace:session:remove \*\//gm,
                        replacement: ''
                    }],
                    keepRegex: [{
                        match: /(?:(?:\r\n|\r|\n)\s)(.*)\/\* (.*)replace:session(.*) \*\//gm,
                        replacement: ''
                    }, {
                        match: /(?:(?:\r\n|\r|\n)\s)(.*)\/\* replace:session:remove \*\/([\S\s]*?)\/\* endreplace:session:remove \*\//gm,
                        replacement: ''
                    }],
                    appPath: app
                },
                app: {
                    templateSrc: ['templates/full-app/app/**/*'],
                    appPath: app
                },
                mock: {
                    templateSrc: ['templates/full-app/app-mock/**/*'],
                    appPath: appMock
                },
                img: {
                    templateSrc: ['templates/full-app/img/**/*'],
                    appPath: app
                },
                index: {
                    templateSrc: ['templates/full-app/_index_.html'],
                    appPath: app,
                    nameReplace: '_index_'
                }
            },
            module: {
                templateSrc: ['templates/module/**/*'],
                params: ['moduleName', 'path'],
                buildPath: function(moduleName, name) {
                    return getModulePath(name);
                },
                appPath: app,
                nameReplace: '_moduleName_'
            },
            component: {
                templateSrc: ['templates/component/_componentName_*.*'],
                params: ['name', 'module', 'path'],
                buildPath: function(moduleName, name) {
                    return getModulePath(moduleName) + '/components/' + name;
                },
                appPath: app,
                nameReplace: '_componentName_'
            },
            interceptor: {
                templateSrc: ['templates/services/_interceptorName_*.js'],
                params: ['name', 'module', 'path'],
                buildPath: function(moduleName) {
                    return getModulePath(moduleName) + '/services';
                },
                appPath: app,
                nameReplace: '_interceptorName_'
            },
            service: {
                templateSrc: ['templates/services/_serviceName_*.js'],
                params: ['name', 'module', 'path'],
                buildPath: function(moduleName) {
                    return getModulePath(moduleName) + '/services';
                },
                appPath: app,
                nameReplace: '_serviceName_'
            },
            resource: {
                params: ['name', 'module', 'path'],
                buildPath: function(moduleName, name) {
                    return getModulePath(moduleName) + '/model/' + name;
                },
                model: {
                    templateSrc: ['templates/resource/_resourceName_*.js'],
                    appPath: app,
                    nameReplace: '_resourceName_'
                },
                mock: {
                    templateSrc: ['templates/resource/mock/_resourceName_*.js'],
                    appPath: appMock,
                    buildPath: function(moduleName) {
                        return 'model-mocks/' + getModulePath(moduleName);
                    },
                    nameReplace: '_resourceName_'
                },
                service: {
                    templateSrc: ['templates/resource/service/_resourceName_*.js'],
                    appPath: app,
                    buildPath: function(moduleName) {
                        return getModulePath(moduleName) + '/services';
                    },
                    nameReplace: '_resourceName_'
                }
            }
        }
    };

    return config;

    function getModulePath(moduleName) {
        return moduleName.replace(/^app[.-]/g, '').replace(/[.-]/g, '/');
    }
};
