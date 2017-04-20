'use strict';

visitNotesApp.factory('BreadcrumbFactory', function() {

	var data = {
			breadCrumbs : ''
	};

	return {
		getBreadCrumbs : function() {
			// console.log("searchTerms in getter: " + data.searchTerms);
			return data.breadCrumbs;
		},
		setBreadCrumbs : function(breadCrumbs) {
			data.breadCrumbs = breadCrumbs;
			// console.log("searchTerms in setter: " + data.searchTerms);
		}
	};
});