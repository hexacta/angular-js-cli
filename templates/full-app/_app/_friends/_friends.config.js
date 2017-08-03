(function () {
    'use strict';
    angular.module('app.friends')
        .config(configure);

    configure.$inject = ['popupServiceProvider', 'FriendsMessages'];

    function configure(popupServiceProvider, FriendsMessages) {
        popupServiceProvider.addPopups(FriendsMessages.popups, FriendsMessages.namespace);
    }
})();
