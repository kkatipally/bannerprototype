'use strict';

var visitNotesApp = angular.module('visitNotesApp', [
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap'
])

    .config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/view1', {
	templateUrl: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/partials/view1.html',
	css: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/styles/app.css'
  })
  $routeProvider.when('/view2', {
	templateUrl: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/partials/view2.html',
	css: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/styles/app.css'
  })
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);


