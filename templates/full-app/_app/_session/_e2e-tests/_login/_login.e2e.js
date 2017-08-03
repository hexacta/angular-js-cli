/* eslint-env node, jasmine, protractor */
'use strict';
var LoginPage = require('./login.po.js');

describe('Login', function () {
    var loginPage, user;

    beforeEach(function () {
        user = {};
        loginPage = new LoginPage();
        loginPage.get();
    });

    it('should load login page', function () {
        expect(loginPage.isCurrentView()).toEqual(true);
        expect(loginPage.getTitle()).toEqual('Login');
    });

    it('should login and show name user on hover', function () {
        user = {
            username: 'guest-e2e',
            password: 'guest'
        };
        loginPage.setUsername(user.username);
        loginPage.setPassword(user.password);

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

    it('should show an error popup when typing invalid credentials', function () {
        user = {
            username: 'guest123',
            password: 'guest'
        };
        loginPage.setUsername(user.username);
        loginPage.setPassword(user.password);

        loginPage.doLogin();
        expect(loginPage.isPopupShown()).toEqual(true);

        loginPage.closePopup();
        expect(loginPage.isPopupShown()).toEqual(false);
    });
});
