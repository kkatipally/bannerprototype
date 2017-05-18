'use strict';

visitNotesApp.directive('renderNote', function($compile){

    return {
        restrict: 'E',
        scope: {
        	display: '=display'
        },
        link: function(scope, element, attrs, controller) {
        	
        	scope.$watch('display',
                    function(newVal, oldVal) {
        		
        	   element.html(newVal);
        	   var path = OPENMRS_CONTEXT_PATH;
        	   element.html(element.html().replace(/OPENMRS_CONTEXT_PATH/g, path));
        	});
        }
    }
});