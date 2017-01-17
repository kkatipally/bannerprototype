'use strict';

visitNotesApp.controller('sliderController',
    function cloudController($scope, DateFactory){

        $scope.sliderMinDate = '';
        $scope.sliderMaxDate = '';

        $scope.$watch('sliderMinDate', function (newValue, oldValue) {
            //if (newValue !== oldValue) {
            	DateFactory.setSliderMinDate(newValue);
            	//console.log("Slider min in sliderController: " + newValue);
            //}
        });
        
        $scope.$watch('sliderMaxDate', function (newValue, oldValue) {
            //if (newValue !== oldValue) {
            	DateFactory.setSliderMaxDate(newValue);
            	//console.log("Slider max in sliderController: " + newValue);
            //}
        });
        
});