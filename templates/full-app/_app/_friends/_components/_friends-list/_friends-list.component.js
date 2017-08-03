(function () {
    'use strict';
    angular.module('app.friends')
        .component('friendsList', {
            templateUrl: 'app/friends/components/friends-list/friends-list.template.html',
            controller: FriendsListComponentCtrl,
            bindings: { friends: '<' }
        });

    FriendsListComponentCtrl.$inject = [
        '$uibModal', 'popupService', 'friendsService', 'groupsService', 'loadingService'
    ];

    function FriendsListComponentCtrl(
        $uibModal, popupService, friendsService, groupsService, loadingService
    ) {
        var ctrl = this;

        ctrl.openModal = openModal;
        ctrl.removeFriend = removeFriend;

        function openModal(friend) {
            var modalInstance = $uibModal.open({
                component: 'friendFormModal',
                resolve: {
                    friend: angular.copy(friend) || friendsService.newFriend,
                    groups: groupsService.getAll
                }
            });

            modalInstance.result
                .then(saveFriend)
                .then(reloadFriends);
        }

        function reloadFriends() {
            ctrl.friends = friendsService.getAll();
        }

        function removeFriend(friend) {
            return popupService.getPopup('friends.removeFriend', null, [friend.name])
                .then(loadingService.show)
                .then(friendsService.remove.bind(null, friend))
                .then(loadingService.hide)
                .then(reloadFriends);
        }

        function saveFriend(friend) {
            loadingService.show();

            return friendsService.save(friend)
                .then(loadingService.hide);
        }
    }
})();

