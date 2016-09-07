(function (angular) {
    'use strict';

    angular
            .module('myApp.zen', ['ngRoute'])
            .config(['$routeProvider', function ($routeProvider) {
                    $routeProvider.when('/zen', {
                        templateUrl: 'components/zen/zen.html',
                        controller: 'ZenController'
                    });
                }])
            .controller('ZenController', [
                '$scope',
                'ZenService',
                function ($scope, ZenService) {
                    /**
                     * 
                     * @TODO load words only once
                     */
                    $scope.loadPhrase = function () {
                        ZenService.getWords().then(function (response) {
                            $scope.words = ZenService.words;
                            $scope.phrase = ZenService.getPhrase(10);
                            console.log($scope.phrase);
                        });
                    };
                }]);
})(window.angular);