(function () {
    'use strict';

    angular.module('app.core')
        .factory('APIBase', APIBase);

    APIBase.$inject = ['CoreConfig'];
    function APIBase(CoreConfig) {
        if (CoreConfig.API.relative) {
            return CoreConfig.API.path + '/';
        }

        return (CoreConfig.API.protocol + '://' + CoreConfig.API.host + ':' + CoreConfig.API.port +
            '/' + CoreConfig.API.path + '/');
    }
})();
