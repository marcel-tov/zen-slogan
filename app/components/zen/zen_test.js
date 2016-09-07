'use strict';

describe('Testing Routes', function () {
// load the controller's module
    beforeEach(module('myApp'));
    it('should test routes',
            inject(function ($route) {
                expect($route.routes['/zen'].controller).toBe('ZenController');
                expect($route.routes['/zen'].templateUrl).toEqual('components/zen/zen.html');
            }));

});

describe('myApp.zen module', function () {
    beforeEach(module('myApp.zen'));
    describe('zen controller', function () {
        var location, route, rootScope;

        it('should ....', inject(function ($controller, $rootScope) {
            var $scope = $rootScope.$new();
            var ZenService = $rootScope.$new();
            var Ctrl = $controller('ZenController', {$scope: $scope, ZenService: ZenService});
            expect(Ctrl).toBeDefined();
        }));
    });
});