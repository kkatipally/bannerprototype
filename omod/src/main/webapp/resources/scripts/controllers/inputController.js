'use strict';

visitNotesApp.controller('inputController',
    function inputController($scope){

        $scope.entityTypes = [{"id": 0, "name": "Problems"}, {"id": 1, "name": "Treatments"}, {"id": 2, "name": "Tests"}];
        $scope.displayNumTerms = [{"id": 0, "name": "View 5"}, {"id": 1, "name": "View 10"}, {"id": 2, "name": "View 20"}, {"id": 2, "name": "View 30"}];

        $scope.selectEntityType = function(name){
            console.log("Entity type selected: " + name);
        };

        $scope.selectDisplayNumTerms = function(name){
            console.log("Number of terms selected: " + name);
        };

    });