'use strict';

visitNotesApp.controller('datepickerController', function ($scope) {

    $scope.startDate = {"name": new Date(2016, 8, 1)};

    $scope.dateOptions1 = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(2016, 0, 1),
        startingDay: 0
    };

    $scope.dateOptions2 = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: $scope.startDate.name,
        startingDay: 0
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

});