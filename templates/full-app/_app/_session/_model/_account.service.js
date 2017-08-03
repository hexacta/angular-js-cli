(function () {
    'use strict';

    angular.module('app.session')
        .factory('Account', Account);

    Account.$inject = ['$resource', 'APIBase'];

    function Account($resource, APIBase) {
        var baseUri = 'account/';
        var methods = {
            login: {
                url: APIBase + baseUri + 'login',
                method: 'POST'
            },
            changePassword: {
                url: APIBase + baseUri + 'changePassword',
                method: 'POST'
            },
            logout: {
                url: APIBase + baseUri + 'logout',
                method: 'POST'
            },
            keepAlive: {
                url: APIBase + baseUri + 'keepAlive',
                method: 'GET'
            }
        };

        var Account = $resource(baseUri, null, angular.copy(methods));

        return Account;
    }
})();
