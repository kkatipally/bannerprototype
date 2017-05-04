'use strict';

visitNotesApp.directive('renderNote', function($compile){

    return {
        restrict: 'E',
        //templateUrl: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/partials/render.html',
        scope: {
        	display: '=display'
        },
        link: function(scope, element, attrs, controller) {
        	
        	scope.$watch('display',
                    function(newVal, oldVal) {
        		
        		/*if (!newVal) {
                    return;
                }*/

        	   element.html(newVal);
               //element.html(newVal).show();
               //$compile(element.contents())(scope);

        	   /*var container = $('.renderData');

               container.html(newVal);
        	   scope.$broadcast('rebuild:me');*/
        	});
        }
    }
});