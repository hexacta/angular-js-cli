(function () {
    'use strict';

    angular.module('blocks.mocks')
        .factory('mocksHelper', mocksHelper);

    mocksHelper.$inject = ['$filter', '$httpBackend'];

    function mocksHelper($filter, $httpBackend) {
        var queryRegExp = /(\?{0}|\?{1}.+)$/.toString().slice(1, -1);
        var defaultMethods = {
            get: get,
            getAll: getAll,
            query: query,
            remove: remove,
            save: save,
            update: update
        };

        var service = {
            addMocks: addMocks,
            defaultMethods: defaultMethods,
            queryRegExp: queryRegExp,
            regEsc: regEsc
        };

        return service;

        function get(mocks, method, url, data, headers) {
            var rawId = url.replace(/:\d+/, '').match(new RegExp(mocks.IdRegExp))[0];
            var id = mocks.parseId ? mocks.parseId(rawId) : Number(rawId);
            var obj = getByProperty(mocks.data, mocks.idName, id);
            if (!obj) {
                return [404, error('Not found'), headers || {/* headers*/ }];
            }

            return [200, obj, headers || {/* headers*/ }];
        }

        function getAll(mocks, method, url, data, headers) {
            return [200, mocks.data || null, headers || {/* headers*/ }];
        }

        function query(mocks, method, url, data, headers) {
            var params = url.match(/[^&?]*?=[^&?]*/g);
            if (!params || !params.length) {
                return getAll(mocks, method, url, data, headers);
            }

            var filter = {};
            angular.forEach(params, function (param) {
                filter[param.split('=')[0]] = param.split('=')[1].replace(/\+/g, ' ');
            });
            var hits = $filter('filter')(mocks.data, filter);
            if (hits.length) {
                return [200, hits || null, headers || {/* headers*/ }];
            }

            return [404, error('None found'), headers || {/* headers*/ }];

        }

        function remove(mocks, method, url, data, headers) {
            var rawId = url.replace(/:\d+/, '').match(new RegExp(mocks.IdRegExp))[0];
            var id = mocks.parseId ? mocks.parseId(rawId) : Number(rawId);
            var obj = getByProperty(mocks.data, mocks.idName, id);
            if (obj) {
                mocks.data.splice(mocks.data.indexOf(obj), 1);

                return [200, obj, headers || {/* headers*/ }];
            }

            return [404, error('Not found'), headers || {/* headers*/ }];
        }

        function save(mocks, newId, method, url, data, headers) {
            var parsedObj = angular.fromJson(data);
            if (parsedObj.hasOwnProperty(mocks.idName)) {
                return [400, error('Object already has id'), headers || {/* headers*/ }];
            }
            parsedObj[mocks.idName] = newId;
            mocks.data.push(parsedObj);

            return [200, mocks.data[mocks.data.length - 1], headers || {/* headers*/ }];
        }

        function update(mocks, method, url, data, headers) {
            var parsedObj = angular.fromJson(data);
            var obj = getByProperty(mocks.data, mocks.idName, parsedObj[mocks.idName]);
            if (obj) {
                var index = mocks.data.indexOf(obj);
                mocks.data[index] = angular.copy(parsedObj);

                return [200, mocks.data[index] || null, headers || {/* headers*/ }];
            }

            return [404, error('Not found'), headers || {/* headers*/ }];
        }

        // ////////////////////////////////////////////

        function addMocks(mockApiMethods) {
            angular.forEach(mockApiMethods, function (method) {
                $httpBackend.when(method.method, method.url)
                    .respond(method.response);
            });
        }

        function error(message) {
            return { error: message };
        }

        function getByProperty(data, key, value) {
            var filter = {};
            filter[key] = value;
            var objs = $filter('filter')(data, filter);
            if (objs.length) {
                return objs[0];
            }

            return false;

        }

        function regEsc(str) {
            // eslint-disable-next-line no-useless-escape
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        }
    }
})();
