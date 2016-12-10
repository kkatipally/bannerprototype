'use strict';

var visitNotesApp = angular.module('visitNotesApp', [
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap'
])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //$locationProvider.hashPrefix('!');

  $routeProvider.when('/view1', {
    //templateUrl: config.resourceLocation + '/partials/view1.html',
	templateUrl: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/partials/view1.html',
    //css: config.resourceLocation + '/styles/app.css',
	css: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/styles/app.css',
    controller: 'view1Controller'
  })
  $routeProvider.when('/view2', {
    //templateUrl: config.resourceLocation + '/partials/view2.html',
	templateUrl: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/partials/view2.html',
    //css: config.resourceLocation + '/styles/app.css',
	css: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/styles/app.css',
    controller: 'view2Controller'
  })
  $routeProvider.otherwise({redirectTo: '/view1'});
  //$locationProvider.html5Mode(true);
}]);


