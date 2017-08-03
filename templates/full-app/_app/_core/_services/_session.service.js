(function () {
    'use strict';
    angular.module('app.core')
        .factory('sessionService', sessionService);

    sessionService.$inject = [
        '$state', '$q', 'storageService', 'popupService'];

    function sessionService($state, $q, storageService, popupService) {

        var userData = { user: { username: 'Guest' }, token: null };
        var storageName = 'sessionMock';

        storageService.save(storageName, userData.user);

        var service = {
            getSessionParam: getSessionParam,
            getUserData: getUserData,
            handleTimeout: handleTimeout,
            isLoggedIn: isLoggedIn,
            logOut: logOut,
            setSessionParam: setSessionParam
        };

        return service;

        function getSessionParam(paramName) {
            var data = userData[paramName];
            if (!data) {
                return false;
            }

            return data;
        }

        function getUserData() {
            userData = storageService.load(storageName);

            return userData;
        }

        function handleTimeout(rejection) {
            if (rejection) {
                return redirectToLogin(rejection);
            }

            return $q.resolve(rejection);
        }

        function isLoggedIn() {
            return (userData !== null && userData.user !== null);
        }

        function logOut() {
            resetSession();
            logOutSuccess();
        }

        function logOutSuccess() {
            popupService.closeAllPopups(true);
            $state.go('login');
        }

        function redirectToLogin(rejection) {
            logOut();

            return $q.reject(rejection);
        }

        function resetSession() {
            storageService.clear(storageName);
            userData = { user: null, token: null };
        }

        function setSessionParam(paramName, value) {
            if (!userData) {
                userData = {};
            }
            userData[paramName] = value;
            storageService.save(storageName, userData);
        }
    }
})();
