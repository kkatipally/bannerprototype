'use strict';

visitNotesApp.controller('heatmapController', function ($scope) {

    $scope.dateSelOptions = [{"datename": "All Dates", "datevalue": 14}, {"datename": "Last Year", "datevalue": 12}, {"datename": "Last 6 mo", "datevalue": 6}, {"datename": "Last 3 mo", "datevalue": 3}];
    $scope.termSelOptions = [{"termname": "Only search terms", "termvalue": "Search"}, {"termname": "All terms", "termvalue": "All"}, {"termname": "Use toggle below", "termvalue": "Toggle"}];

    $scope.$watch('dateSel', function() {
        console.log("dateSel has changed: " + angular.toJson($scope.dateSel));
    });

    $scope.$watch('termSel', function() {
        console.log("termSel has changed: " + angular.toJson($scope.termSel));
    });

    $scope.dateSel = $scope.dateSelOptions[0];
    $scope.termSel = $scope.termSelOptions[0];

    $scope.selectDateSel = function(date){
        //console.log("Date for chart selected: " + date.value);
        $scope.dateSel = date;
    };

    $scope.selectTermSel = function(term){
        //console.log("Terms for chart selected: " + term.value);
        $scope.termSel = term;
    };

    $scope.resetHeatMap = function() {

    };



    //d3.json("/moduleResources/bannerprototype/d3data.json", function(error, data) {
    d3.json('/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/d3data.json', function(error, data) {
    
        //check if the file loaded properly
        if (error) {
            console.log(error);
        } else {
            //console.log(JSON.stringify(data));
            $scope.val=data;
        }

        });

   });
