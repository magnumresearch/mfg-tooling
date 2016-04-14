'use strict';

describe('Controller Tests', function() {

    describe('Attack Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockAttack, MockProcessStep;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockAttack = jasmine.createSpy('MockAttack');
            MockProcessStep = jasmine.createSpy('MockProcessStep');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Attack': MockAttack,
                'ProcessStep': MockProcessStep
            };
            createController = function() {
                $injector.get('$controller')("AttackDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'mfgtoolingApp:attackUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
