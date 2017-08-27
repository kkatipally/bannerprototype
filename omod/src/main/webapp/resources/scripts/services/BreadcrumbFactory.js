'use strict';

visitNotesApp.factory('BreadcrumbFactory', function() {

	var data = {
			breadCrumbs : '',
			addNewBreadCrumb : true
	};

	return {
		getBreadCrumbs : function() {
			return data.breadCrumbs;
		},
		setBreadCrumbs : function(breadCrumbs) {
			data.breadCrumbs = breadCrumbs;
		},
		getAddNewBreadCrumb : function() {
            return data.addNewBreadCrumb;
        },
        setAddNewBreadCrumb : function(addNewBreadCrumb) {
            data.addNewBreadCrumb = addNewBreadCrumb;
        }
	};
});