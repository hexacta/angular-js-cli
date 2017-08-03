/*
    Service used to create a $resource
    - Avoids using $http
    - Easy configuration
    - Can define the api and configure custom calls
*/
(function () {
    'use strict';

    angular.module('app.friends')
        .factory('Group', Group);

    Group.$inject = ['$resource', 'APIBase'];

    function Group($resource, APIBase) {
        var baseUri = 'group'; // Group base uri
        var idParam = '/:id'; // Group uri id identifier

        // creates a $resource with the defined methods
        var Group = $resource(APIBase + baseUri + idParam);

        return Group;
    }
})();
