'use strict';

describe('Controller Tests', function() {

    describe('QualityControlStep Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockQualityControlStep, MockProcessStep;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockQualityControlStep = jasmine.createSpy('MockQualityControlStep');
            MockProcessStep = jasmine.createSpy('MockProcessStep');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'QualityControlStep': MockQualityControlStep,
                'ProcessStep': MockProcessStep
            };
            createController = function() {
                $injector.get('$controller')("QualityControlStepDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'mfgtoolingApp:qualityControlStepUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
