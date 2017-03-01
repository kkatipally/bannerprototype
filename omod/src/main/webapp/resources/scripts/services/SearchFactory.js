visitNotesApp.factory('SearchFactory', function() {

	var data = {
		searchTerms : ''
	};

	return {
		getSearchTerms : function() {
			// console.log("searchTerms in getter: " + data.searchTerms);
			return data.searchTerms;
		},
		setSearchTerms : function(searchTerms) {
			data.searchTerms = searchTerms;
			// console.log("searchTerms in setter: " + data.searchTerms);
		}
	};
});