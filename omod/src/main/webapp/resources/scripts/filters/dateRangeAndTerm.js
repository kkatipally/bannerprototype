'use strict';

visitNotesApp.filter('dateRangeAndTerm', function(){

    return function(items, fromDate, toDate, matchTerm){
    	
    	var filteredItems = [];
    	if(matchTerm !== ""){
    		angular.forEach(items, function(item) {
    			if((item.date >= fromDate) && (item.date <= toDate) && (item.term.equals(matchTerm))) {
    				filteredItems.push(item);
    			}
    		});
    	}
    	else {
    		angular.forEach(items, function(item) {
    			if((item.date >= fromDate) && (item.date <= toDate)) {
    				filteredItems.push(item);
    			}
    		});
    	}
        return filteredItems;
    }
});