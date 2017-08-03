(function () {
    'use strict';

    angular.module('modelMocks')
        .factory('accountMockService', accountMockService);

    accountMockService.$inject = ['$filter', 'Account', 'APIBase'];

    function accountMockService($filter, Account, APIBase) {
        var mocks = [
            new Account({
                id: 1,
                username: 'admin',
                password: 'admin',
                defaultScreen: 'Friends',
                idleTimeoutMinutes: 30
            }),
            new Account({
                id: 1,
                username: 'guest',
                password: 'guest',
                defaultScreen: 'Friends',
                idleTimeoutMinutes: 15
            }),
            new Account({
                id: 2,
                username: 'guest-e2e',
                password: 'guest',
                defaultScreen: 'Friends'
            }) // used for e2e tests
        ];
        var accounts = {};

        var baseUri = 'account/';

        var methods = {
            login: {
                url: APIBase + baseUri + 'login',
                method: 'POST',
                response: accountLogin
            },
            changePassword: {
                url: APIBase + baseUri + 'changePassword',
                method: 'POST',
                response: accountChangePassword
            },
            logout: {
                url: APIBase + baseUri + 'logout',
                method: 'POST',
                response: accountLogout
            },
            keepAlive: {
                url: APIBase + baseUri + 'keepAlive',
                method: 'GET',
                response: accountKeepAlive
            }
        };

        accounts.data = mocks;

        var service = {
            accounts: accounts,
            APIMethods: methods
        };

        return service;

        function accountChangePassword(method, url, data /* , headers*/) {
            var user = angular.fromJson(data);
            var index = accounts.data.indexOf(getByUserName(user.username));
            var response;
            if (index > -1) {
                if (accounts.data[index].password === user.oldPassword) {
                    accounts.data[index].password = user.newPassword;
                    response = [200, accounts.data[index] || null, {/* headers*/ }];
                } else {
                    response = [403, { error: 'No allowed' }, {/* headers*/ }];
                }
            } else {
                response = [404, { error: 'No User' }, {/* headers*/ }];
            }

            return response;
        }

        function accountKeepAlive(/* method, url, data, headers*/) {
            return [200, true, {/* headers*/ }];
        }

        function accountLogin(method, url, data /* , headers*/) {
            var login = angular.fromJson(data);
            var user = getByUserName(login.username);
            var response;
            if (user) {
                if (user.password === login.password) {
                    response = [200, user, {/* headers*/ }];
                } else {
                    response = [403, { error: 'No allowed' }, {/* headers*/ }];
                }
            } else {
                response = [404, { error: 'No User' }, {/* headers*/ }];
            }

            return response;
        }

        function accountLogout(/* method, url, data, headers*/) {
            return [200, 'Loggued out', {/* headers*/ }];
        }

        function getByUserName(username) {
            var user = $filter('filter')(accounts.data, { username: username });
            if (user.length) {
                return user[0];
            }

            return false;

        }
    }
})();
