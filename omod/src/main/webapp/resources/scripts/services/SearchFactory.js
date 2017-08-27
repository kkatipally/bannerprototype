'use strict';

visitNotesApp.factory('SearchFactory', function() {

	var data = {
		searchInput : ''
	};

	return {
		getSearchInput : function() {
			// console.log("searchInput in getter: " + data.searchInput);
			return data.searchInput;
		},
		setSearchInput : function(searchInput) {
			data.searchInput = searchInput;
			// console.log("searchInput in setter: " + data.searchInput);
		}
	};
});