'use strict';

visitNotesApp.filter('uniqueNotes', function(){

    return function(items){
    	
    	var filteredItems = [];
    	var unique = {};
    	angular.forEach(items, function(item) {
    		if(!(item.uuid in unique)){
    			filteredItems.push(item);
    			unique[item.uuid] = item;
    		}
    	});
        return filteredItems;
    }
});