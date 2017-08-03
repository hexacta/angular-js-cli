/*
    Service used to create a $resource
    - Avoids using $http
    - Easy configuration
    - Can define the api and configure custom calls
*/
(function () {
    'use strict';

    angular.module('app.friends')
        .factory('Friend', Friend);

    Friend.$inject = ['$resource', 'APIBase'];

    function Friend($resource, APIBase) {
        var baseUri = 'friend'; // Friend base uri
        var idParam = '/:id'; // Friend uri id identifier

        var methods = {
            get: {
                url: APIBase + baseUri + idParam,
                method: 'GET',
                transformResponse: transformGet
            },
            query: {
                url: APIBase + baseUri,
                isArray: true,
                transformResponse: transformQuery,
                method: 'GET'
            },
            update: { method: 'PUT' }
        };

        // creates a $resource with the defined methods
        var Friend = $resource(APIBase + baseUri + idParam, { id: '@id' }, angular.copy(methods));

        // In this block, calculated properties for the prototype Friend can be added
        angular.extend(Friend.prototype, { getFirstName: getFirstName });

        return Friend;

        function getLastName(name) {
            var names = name.split(" ");
            return names[names.length - 1];
        }

        function getFirstName() {
            var names = this.name.split(" ");
            return names[0];
        }

        function transformGet(data) {
            var friend = angular.fromJson(data);
            if (friend instanceof Friend) {
                friend.lastName = getLastName(friend.name);
            }

            return friend;
        }

        function transformQuery(data) {
            var parsed = angular.fromJson(data);
            if (parsed instanceof Array) {
                angular.forEach(parsed, function (friend) {
                    friend.lastName = getLastName(friend.name);
                });
            }

            return parsed;
        }
    }
})();
