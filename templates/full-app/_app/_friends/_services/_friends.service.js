(function () {
    'use strict';
    angular.module('app.friends')
        .factory('friendsService', friendsService);

    friendsService.$inject = ['$state', 'Friend'];

    function friendsService($state, Friend) {

        var service = {
            get: get,
            getAll: getAll,
            newFriend: newFriend,
            remove: remove,
            save: save
        };

        return service;

        function get(id) {
            return Friend.get({ id: id });
        }

        function getAll() {
            return Friend.query();
        }

        function newFriend() {
            var friend = { name: '', group: 'Club' };

            return new Friend(friend);
        }

        function remove(friend) {
            return friend.$delete();
        }

        function save(friend) {
            if (friend.hasOwnProperty('id')) {
                return friend.$update();
            }

            return friend.$save();
        }

    }
})();
