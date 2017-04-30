'use strict';

visitNotesApp.filter('dateRangeAndTerm', function(){

    return function(items, fromDate, toDate, matchTerm){
    	
    	var filteredItems = [];
    	if((matchTerm !== "") && (fromDate !== null) && (toDate !== null)){
    		angular.forEach(items, function(item) {
    			if((item.date >= fromDate) && (item.date <= toDate) && (item.term === matchTerm)) {
    				filteredItems.push(item);
    			}
    		});
    	}
    	else if((matchTerm !== "") && (fromDate === null) && (toDate === null)){
    		angular.forEach(items, function(item) {
    			if(item.term === matchTerm) {
    				filteredItems.push(item);
    			}
    		});
    	}
    	else if ((fromDate !== null) && (toDate !== null)){
    		angular.forEach(items, function(item) {
    			if((item.date >= fromDate) && (item.date <= toDate)) {
    				filteredItems.push(item);
    			}
    		});
    	}
    	
        return filteredItems;
    }
});