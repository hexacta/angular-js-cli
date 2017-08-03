(function () {
    'use strict';
    angular.module('app.friends')
        .component('friendListItem', {
            templateUrl: 'app/friends/components/friends-list/friend-list-item.template.html',
            bindings: {
                friend: '<',
                removeFriend: '&',
                editFriend: '&'
            }
        });
})();

