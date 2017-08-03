(function () {
    'use strict';

    var sessionMessages = {
        namespace: 'session',
        popups: {
            'extendSession': {
                title: 'Account About to Expire',
                body: 'Account will expire in less than 30 seconds.' +
                ' Click Continue to reset session\'s timer.',
                type: 'confirm',
                okButtonText: 'Continue',
                okButtonClass: 'btn-success',
                cancelButtonText: 'Logout',
                cancelButtonClass: 'btn-info'
            },
            'invalidCredentialsError': {
                title: 'Invalid Credentials',
                body: 'Invalid User ID/Password combination'
            },
            'invalidDataError': {
                title: 'Invalid Data',
                body: 'Highlighted fields have invalid data; please update and try again.'
            },
            'noAuthorization': {
                title: 'Invalid Account',
                body: 'Your session has expired. Login again to continue.'
            },
            'passwordPolicyError': {
                title: 'Password Policy Error',
                body: 'The password must be a minimum of 8 characters and ' +
                'include at least one capital letter, number, special character.'
            },
            'noRolesError': {
                title: 'Invalid roles',
                body: 'User does not have permissions to enter the site.'
            }
        },
        loading: {
            'changingPassword': 'Changing password',
            'loggingIn': 'Logging In',
            'logginOut': 'Logging Out'
        }
    };

    angular
        .module('app.session')
        .constant('SessionMessages', sessionMessages);
})();
