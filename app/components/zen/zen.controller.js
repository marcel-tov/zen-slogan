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
        $scope.words = ZenService.words;
        console.log($scope.words);
        console.log($scope.words['adj']);
        $scope.phrase = ZenService.getPhrase(10);
    }

})(window.angular);