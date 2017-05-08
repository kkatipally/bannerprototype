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
        	});
        }
    }
});