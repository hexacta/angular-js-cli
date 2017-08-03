(function () {
    'use strict';
    angular.module('<%=module=%>')
        .factory('<%=name=%>sService', <%=name=%>sService);

    <%=name=%>sService.$inject = ['$state', '<%=Name=%>'];

    function <%=name=%>sService($state, <%=Name=%>) {

        var service = {
            get: get,
            getAll: getAll,
            new<%=Name=%>: new<%=Name=%>,
            remove: remove,
            save: save
        };

        return service;

        function get(id) {
            return <%=Name=%>.get({ id: id });
        }

        function getAll() {
            return <%=Name=%>.query();
        }

        function new<%=Name=%>() {
            var <%=name=%> = { name: '', group: 'group1' };

            return new <%=Name=%>(<%=name=%>);
        }

        function remove(<%=name=%>) {
            return <%=name=%>.$delete();
        }

        function save(<%=name=%>) {
            if (<%=name=%>.hasOwnProperty('id')) {
                return <%=name=%>.$update();
            }

            return <%=name=%>.$save();
        }

    }
})();
