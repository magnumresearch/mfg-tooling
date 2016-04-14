'use strict';

describe('Controller Tests', function() {

    describe('ComputerController Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockComputerController, MockProcessStep;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockComputerController = jasmine.createSpy('MockComputerController');
            MockProcessStep = jasmine.createSpy('MockProcessStep');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'ComputerController': MockComputerController,
                'ProcessStep': MockProcessStep
            };
            createController = function() {
                $injector.get('$controller')("ComputerControllerDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'mfgtoolingApp:computerControllerUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
