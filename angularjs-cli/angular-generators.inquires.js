/* eslint-env node */
'use strict';

module.exports = function () {

  var paramsConfiguration = {
    moduleName: {
      name: 'moduleName',
      required: true,
      type: 'input',
      message: 'Please type a name for the module (i.e: module, app.module, app.root.module): '
    },
    name: {
      name: 'name',
      required: true,
      type: 'input',
      message: 'Please type a name for the @type# (camelCase without suffix): '
    },
    module: {
      name: 'module',
      required: true,
      type: 'input',
      message: 'Please type the @type#\'s module\'s name (i.e: app.module): '
    },
    path: {
      name: 'path',
      required: false,
      type: 'input',
      message: 'Please type a path: '
    }
  };

  var inquires = {
    params: paramsConfiguration,
    generateElement: function (options) {
      return {
        type: 'list',
        name: 'operation',
        message: 'What type of element would you like to generate?',
        choices: options
      };
    },
    generateResource: function (name) {
      return {
        type: 'checkbox',
        name: 'files',
        message: 'What elements do you want to generate for the ' + name + ' resource?',
        choices: [{
          name: 'Resource',
          checked: true
        }, {
          name: 'Service',
          checked: true
        }, {
          name: 'Mock',
          checked: true
        }]
      };
    },
    confirmClean: function (path) {
      return {
        type: 'confirm',
        name: 'continue',
        default: false,
        message: function () {
          return 'This will delete any app already created in the ' + path + ' directory. Do you wish to continue?';
        }
      };
    },
    generateApp: function (defaultDest, defaultAppName, isFirstTime) {
      return [{
        type: 'input',
        name: 'path',
        default: defaultDest,
        message: 'Please select the directory for the app:'
      }, {
        type: 'confirm',
        name: 'continue',
        default: false,
        when: !isFirstTime,
        message: function (res) {
          return 'This will delete any app already created in the ' + res.path + ' directory. Do you wish to continue?';
        }
      }, {
        type: 'input',
        name: 'name',
        when: function (res) {
          return isFirstTime || res.continue;
        },
        default: defaultAppName,
        message: 'Please select the display name for the app:'
      }, {
        type: 'checkbox',
        name: 'elements',
        when: function (res) {
          return isFirstTime || res.continue;
        },
        message: function (res) {
          return 'Which template modules do you want to generate for the ' + res.name + ' app?';
        },
        choices: [
          {
            name: 'app.session - This module has predefined components and services to handle a common login, ' +
                  'change password and session timeout',
            value: 'session',
            checked: true
          },
          {
            name: 'app.friends - This module can be used as an example to generate your own modules',
            value: 'friends',
            checked: true
          }]
      }];
    }

  };

  return inquires;
};
