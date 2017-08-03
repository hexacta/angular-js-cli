(function () {
    'use strict';

    var friendsMessages = {
        namespace: 'friends',
        popups: {
            'removeFriend': {
                title: 'Delete Friend',
                body: 'Are you sure you want to remove friend ?1?',
                type: 'confirm',
                okButtonText: 'Remove',
                okButtonClass: 'btn-danger',
                cancelButtonClass: 'btn-default'
            },
            'newFriendSuccessful': {
                title: 'Friend Added',
                body: 'The friend ?1 was addded successfully'
            }
        },
        loading: {
            'changingPassword': 'Changing password',
            'loggingIn': 'Logging In',
            'logginOut': 'Logging Out'
        }
    };

    angular
        .module('app.friends')
        .constant('FriendsMessages', friendsMessages);
})();
