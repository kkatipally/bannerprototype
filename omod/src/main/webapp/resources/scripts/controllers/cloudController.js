'use strict';

visitNotesApp.controller('cloudController',
    function cloudController($scope, $location){

        $scope.cloudTerms = [{"id": 0, "name": "fever"}, {"id": 1, "name": "chills"}, {"id": 2, "name": "tuberculosis"},
            {"id": 3, "name": "hepatitis"}, {"id": 4, "name": "hypothyroidism"}];

        $scope.searchInput = "";

        $scope.addToSearch = function(name){
            console.log("Added to search: " + name);
            $scope.searchInput = $scope.searchInput + " " + name;
        };

        $scope.page1Submit = function(searchInput){
            console.log("Page 1 submitted with: " + searchInput);
            //$location.path('/view2');
            $location.url('/view2');
        };

});