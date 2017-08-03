(function () {
    'use strict';

    angular
        .module('app.friends')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            // Add module states

            // Example of state without menu link
            {
                state: 'app.simple-state',
                config: {
                    url: '/simple-state',
                    component: 'friendsList',
                    title: 'Simple State'
                }
            },

            // Example of state with menu link
            {
                state: 'app.friends',
                config: {
                    url: '/friends',
                    component: 'friendsList',
                    resolve: { friends: fetchFriends },
                    title: 'Friends',
                    internalName: 'FriendsList', // unique for menu items
                    settings: {
                        nav: 1, // menu position
                        icon: 'fa-users' // menu icon
                    }
                }
            },
            {
                state: 'app.friend-form',
                config: {
                    url: '/friend-form',
                    component: 'friendForm',
                    resolve: { groups: fetchGroups },
                    title: 'Friend Form',
                    internalName: 'FriendForm', // unique for menu items
                    settings: {
                        nav: 2, // menu position
                        icon: 'fa-plus' // menu icon
                    }
                }
            }
        ];
    }

    fetchFriends.$inject = ['friendsService'];
    function fetchFriends(friendsService) {
        return friendsService.getAll();
    }

    fetchGroups.$inject = ['groupsService'];
    function fetchGroups(groupsService) {
        return groupsService.getAll();
    }
})();
