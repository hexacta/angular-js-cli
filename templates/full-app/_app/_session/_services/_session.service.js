(function () {
    'use strict';
    angular.module('app.session')
        .factory('sessionService', sessionService);

    sessionService.$inject = [
        '$state', '$q', '$timeout', 'Account', 'SessionConfig', 'loadingService', 'storageService',
        'SessionMessages', 'popupService'];

    function sessionService($state, $q, $timeout, Account,
        SessionConfig, loadingService, storageService,
        SessionMessages, popupService) {

        var userData = { user: null, token: null };
        var idleTimer = null;
        var closePopup = null;
        var storageName = SessionConfig.storageName;

        var service = {
            changePassword: changePassword,
            doLogin: doLogin,
            getSessionParam: getSessionParam,
            getUserData: getUserData,
            goToLogin: goToLogin,
            handleTimeout: handleTimeout,
            isLoggedIn: isLoggedIn,
            keepAlive: keepAlive,
            logOut: logOut,
            refreshTimer: refreshTimer,
            setSessionParam: setSessionParam
        };

        return service;

        function changePassword(user) {
            return Account.changePassword(user).$promise;
        }

        function doLogin(user) {
            loadingService.show(SessionMessages.loading.loggingIn, null);

            return Account.login(user, loginSuccess).$promise;
        }

        function extendSessionResponse(res) {
            if (res) {
                return keepAlive();
            }

            return redirectToLogin();
        }

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

        function goToLogin() {
            loadingService.hide();
            popupService.closeAllPopups(true);
            $state.go('login');
        }

        function handleTimeout(rejection) {
            stopTimer(closePopup);
            closePopup = $timeout(redirectToLogin, SessionConfig.popupTimeout);
            loadingService.hide();
            if (rejection) {
                return popupService.getPopup('session.noAuthorization', null)
                    .then(redirectToLogin.bind(null, rejection));
            }

            return popupService.getPopup('session.extendSession', null)
                .then(extendSessionResponse);
        }

        function isLoggedIn() {
            return (userData !== null && userData.user !== null);
        }

        function keepAlive() {
            return Account.keepAlive().$promise
                .catch(redirectToLogin);
        }

        function loginSuccess(response) {
            setUserData(response);
            refreshTimer();
            loadingService.hide();
            $state.go(SessionConfig.loginState);
        }

        function logOut() {
            loadingService.show(SessionMessages.loading.logginOut, null);
            Account.logout(userData).$promise
                .then(logOutSuccess)
                .catch(logOutSuccess);
        }

        function logOutSuccess() {
            resetSession();
            refreshTimer();
            goToLogin();
        }

        function redirectToLogin(rejection) {
            resetSession();
            stopTimer(closePopup);
            logOut();

            return $q.reject(rejection);
        }

        function refreshTimer() {
            stopTimer(idleTimer);
            stopTimer(closePopup);
            var mins = userData && userData.idleTimeoutMinutes;
            if (mins) {
                idleTimer = $timeout(handleTimeout, (mins * 60000) - SessionConfig.timeBeforeExpiring);
            }
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

        function setUserData(data) {
            userData = data || userData;
            storageService.save(storageName, userData);
        }

        function stopTimer(timer) {
            if (timer) {
                $timeout.cancel(timer);
            }
        }
    }
})();
