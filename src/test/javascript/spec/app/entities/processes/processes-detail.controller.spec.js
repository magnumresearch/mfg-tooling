'use strict';

describe('Controller Tests', function() {

    describe('Processes Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockProcesses, MockProcessStep;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockProcesses = jasmine.createSpy('MockProcesses');
            MockProcessStep = jasmine.createSpy('MockProcessStep');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Processes': MockProcesses,
                'ProcessStep': MockProcessStep
            };
            createController = function() {
                $injector.get('$controller')("ProcessesDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'mfgtoolingApp:processesUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
