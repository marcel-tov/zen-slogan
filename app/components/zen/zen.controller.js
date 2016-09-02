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

    /**
     * 
     * @param {type} $scope
     * @param {type} ZenService
     * @returns {undefined}
     */
    function ZenController($scope, ZenService) {

        /**
         * 
         * @TODO load words only once
         */
        $scope.loadPhrase = function () {
            ZenService.getWords().then(function (response) {
                $scope.words = ZenService.words;
                console.log($scope.words);
                $scope.phrase = ZenService.getPhrase(10);
            });
        };
    }

})(window.angular);