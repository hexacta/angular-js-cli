(function () {
    'use strict';
    angular.module('app.friends')
        .component('friendForm', {
            templateUrl: 'app/friends/components/friend-form/friend-form.template.html',
            controller: FriendFormComponentCtrl,
            bindings: {
                friend: '<?',
                groups: '<'
            }
        });

    FriendFormComponentCtrl.$inject = ['popupService', 'loadingService', 'friendsService'];

    function FriendFormComponentCtrl(popupService, loadingService, friendsService) {
        var ctrl = this;

        ctrl.saveFriend = saveFriend;

        ctrl.$onInit = activate;

        function activate() {
            if (!ctrl.friend) {
                ctrl.friend = friendsService.newFriend();
            }
        }

        function saveFriend() {
            loadingService.show();
            friendsService.save(ctrl.friend)
                .then(popupService.getPopup.bind(null, 'friends.newFriendSuccessful', null, [ctrl.friend.name]))
                .catch(popupService.getPopup.bind(null, 'generalError'))
                .finally(loadingService.hide);
        }
    }
})();

