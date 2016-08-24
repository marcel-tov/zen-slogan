(function (angular) {
    'use strict';

    angular
            .module('myApp.zen', ['ngRoute'])
            .config(['$routeProvider', function ($routeProvider) {
                    $routeProvider.when('/zen', {
                        templateUrl: 'components/zen/zen.html',
                    });
                }])
            .controller('ZenController', ZenController);

    ZenController.$inject = ['$scope', 'ZenService'];

    function ZenController($scope, ZenService) {
        console.log('***');
        console.log(ZenService.getPhrase());
    }

})(window.angular);