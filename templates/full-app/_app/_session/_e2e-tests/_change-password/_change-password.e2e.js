/* eslint-env node, jasmine, protractor */
'use strict';
var LoginPage = require('../login/login.po.js');
var ChangePasswordPage = require('./change-password.po.js');

describe('Change Password', function () {
    var loginPage, changePasswordPage, user;

    beforeEach(function () {
        user = {};
        loginPage = new LoginPage();
        changePasswordPage = new ChangePasswordPage();
        loginPage.get();
        loginPage.goToChangePassword();
    });

    it('should navigate to Change Password screen', function () {
        expect(loginPage.isCurrentView()).toEqual(false);
        expect(changePasswordPage.isCurrentView()).toEqual(true);
        expect(loginPage.getTitle()).toEqual('Change Password');
    });

    it('should change password and login with new one', function () {
        user = {
            username: 'guest-e2e',
            oldPassword: 'guest',
            newPassword: 'guest1',
            newPasswordRepeat: 'guest1'
        };

        changePasswordPage.doChangePasswordWithUser(user);

        expect(loginPage.isCurrentView()).toEqual(true);
        loginPage.setUsername(user.username);
        loginPage.setPassword(user.newPassword);

        loginPage.doLogin();

        browser.getCurrentUrl().then(
            function (actualUrl) {
                /* replace:friends:testRoute */
                var header = element(by.css('img'));
                expect(header.getAttribute('title')).toEqual(user.username);
                expect(actualUrl.split('/#/')[1]).toEqual('app/friends');
                /* endreplace:friends:testRoute */
            });
    });

    it('should fail to change password and login with invalid data', function () {
        user = {
            username: 'guest-e2e',
            oldPassword: 'guest',
            newPassword: 'guest1',
            newPasswordRepeat: 'guest2'
        };

        changePasswordPage.doChangePasswordWithUser(user);

        expect(changePasswordPage.isPopupShown()).toEqual(true);

        changePasswordPage.closePopup();
        expect(changePasswordPage.isPopupShown()).toEqual(false);

        loginPage.get();
        loginPage.setUsername(user.username);
        loginPage.setPassword(user.newPassword);

        loginPage.doLogin();
        expect(loginPage.isPopupShown()).toEqual(true);
    });
});
