(function() {
    'use strict';

    angular
        .module('omegaApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('demo', {
            parent: 'entity',
            url: '/demo',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Demos'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/demo/demos.html',
                    controller: 'DemoController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('demoSingle', {
            parent: 'entity',
            url: '/demoSingle',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Demo Single'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/demo/demoSingle.html',
                    controller : 'DemoSingleController'
                }
            }
        })
        .state('demo-detail', {
            parent: 'demo',
            url: '/demo/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Demo'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/demo/demo-detail.html',
                    controller: 'DemoDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Demo', function($stateParams, Demo) {
                    return Demo.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'demo',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('demo-detail.edit', {
            parent: 'demo-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/demo/demo-dialog.html',
                    controller: 'DemoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Demo', function(Demo) {
                            return Demo.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('demo.new', {
            parent: 'demo',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/demo/demo-dialog.html',
                    controller: 'DemoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('demo', null, { reload: 'demo' });
                }, function() {
                    $state.go('demo');
                });
            }]
        })
        .state('demo.edit', {
            parent: 'demo',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/demo/demo-dialog.html',
                    controller: 'DemoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Demo', function(Demo) {
                            return Demo.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('demo', null, { reload: 'demo' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('demo.delete', {
            parent: 'demo',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/demo/demo-delete-dialog.html',
                    controller: 'DemoDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Demo', function(Demo) {
                            return Demo.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('demo', null, { reload: 'demo' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
