/* Help configure the state-base ui.router */
(function () {
    'use strict';

    angular
      .module('blocks.router')
      .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', '$windowProvider'];

    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider, $windowProvider) {
        /* jshint validthis:true */
        var config = {
            docTitle: undefined,
            resolveAlways: {}
        };

        if (!($windowProvider.$get().history && $windowProvider.$get().history.pushState)) {
            $windowProvider.$get().location.hash = '/';
        }

        // $locationProvider.html5Mode(true);

        this.configure = function (cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;
        RouterHelper.$inject = ['$location', '$rootScope', '$state', '$filter', 'logger'];

        function RouterHelper($location, $rootScope, $state, $filter, logger) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                getStatesBy: getStatesBy,
                stateCounts: stateCounts,
                updateTitles: updateTitles
            };

            init();

            return service;

            // /////////////

            function configureStates(states, otherwisePath) {
                states.forEach(function (state) {
                    state.config.resolve =
                      angular.extend(state.config.resolve || {}, config.resolveAlways);
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                  function (event, toState, toParams, fromState, fromParams, error) {
                    if (handlingStateChangeError) {
                        return;
                    }
                    stateCounts.errors++;
                    handlingStateChangeError = true;
                    var destination = (toState &&
                      (toState.title || toState.name || toState.loadedTemplateUrl)) ||
                      'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' +
                      (error.data || '') + '. <br/>' + (error.statusText || '') +
                      ': ' + (error.status || '');
                    logger.warning(msg, [toState]);
                    $location.path('/');
                }
                );
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function getStatesBy(property, value, one) {
                var filter = {};
                filter[property] = value;
                var defaultScreenName = $filter('filter')(getStates(), filter);
                if (defaultScreenName.length) {
                    return one ? defaultScreenName[0] : defaultScreenName;
                }

                return false;
            }

            function getStates() {
                return $state.get();
            }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                  function (event, toState) {
                    stateCounts.changes++;
                    handlingStateChangeError = false;
                    var title = config.docTitle + ' ' + (toState.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
                );
            }

            function updateTitles(params) {
                var states = getStates();
                for (var i = 0; i < states.length; i++) {
                    if (states[i].settings && states[i].settings.titleParams &&
                        params.hasOwnProperty(states[i].settings.titleParams)) {
                        states[i].title = states[i].title.replace('?' + states[i].settings.titleParams,
                            params[states[i].settings.titleParams]);
                    }
                }
            }
        }
    }
})();
