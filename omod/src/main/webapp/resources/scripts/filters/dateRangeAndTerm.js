'use strict';

visitNotesApp.filter('dateRangeAndTerm', function(){

    return function(items, fromDate, toDate, matchTerm){
    	
    	var filteredItems = [];
    	if(matchTerm && fromDate && toDate){
    		angular.forEach(items, function(item) {
    			if(item.date >= fromDate && item.date <= toDate){
    			    for (var i = 0; i < item.problemWordList.length; i++) {
    			        if(item.problemWordList[i].word === matchTerm) {
    				        filteredItems.push(item);
    				        break;
    				    }
    				}
    				for (var i = 0; i < item.treatmentWordList.length; i++) {
                        if(item.treatmentWordList[i].word === matchTerm) {
                        	filteredItems.push(item);
                        	break;
                        }
                    }
                    for (var i = 0; i < item.testWordList.length; i++) {
                        if(item.testWordList[i].word === matchTerm) {
                            filteredItems.push(item);
                            break;
                        }
                    }
    			}
    		});
    	}
    	else if (fromDate && toDate){
            angular.forEach(items, function(item) {
                if((item.date >= fromDate) && (item.date <= toDate)) {
                    filteredItems.push(item);
                }
            });
        }
    	else if (!fromDate && !toDate){
    		angular.forEach(items, function(item) {
    			//if((item.date >= fromDate) && (item.date <= toDate)) {
    				filteredItems.push(item);
    			//}
    		});
    	}
    	
        return filteredItems;
    }
});