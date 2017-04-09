'use strict';

visitNotesApp.directive('renderNote', function($compile){

    return {
        restrict: 'E',
        templateUrl: '/' + OPENMRS_CONTEXT_PATH + '/ms/uiframework/resource/bannerprototype/partials/render.html',
        scope: {
        	noteRendering: '=noteRendering'
        },
        link: function(scope, element, attrs, controller) {
        	
        	scope.$watch('noteRendering',
                    function(newVal, oldVal) {
        		
        		if (!newVal) {
                    return;
                }
        	   var container = $('.renderData');
            
        		container.html(newVal);
        	   
        		//element.html(newVal);
               //element.html(newVal).show();
               //$compile(element.contents())(scope);
        	   
        	   scope.$broadcast('rebuild:me');
        	});
        }
    }
});