'use strict';

describe('Controller Tests', function() {

    describe('ProcessStep Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockProcessStep, MockPartFacet;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockProcessStep = jasmine.createSpy('MockProcessStep');
            MockPartFacet = jasmine.createSpy('MockPartFacet');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'ProcessStep': MockProcessStep,
                'PartFacet': MockPartFacet
            };
            createController = function() {
                $injector.get('$controller')("ProcessStepDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'mfgtoolingApp:processStepUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
