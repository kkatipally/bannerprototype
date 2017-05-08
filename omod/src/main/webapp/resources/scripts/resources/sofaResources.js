
visitNotesApp.config(function ($httpProvider) {
    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
});

visitNotesApp.factory('SofaDocumentResource', function($resource) {
	return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/sofadocument/:uuid");
});

visitNotesApp.factory('SofaDocumentResources', function($resource) {
    return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/sofadocument", {},
			{
		displayAllDates : {
			method : 'GET',
			params : {
				'patient' : "@patient"
			}
		}
	});
});

visitNotesApp.factory('SofaDocumentUIResource', function($resource) {
	return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/sofadocumentui/:uuid");
});

visitNotesApp.factory('SofaDocumentUIResources', function($resource) {
    return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/sofadocumentui", {},
		{
			displayNoteList : {
				method : 'GET',
				params : {
					'patient' : "@patient",
					'startDate' : "@startDate",
					'endDate' : "@endDate",
					'searchTerms' : "@searchTerms"
				}
			}
		});
});

visitNotesApp.factory('WordResources', function($resource) {
	    return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/word", {},
			{
				displayCloud : {
					method : 'GET',
					params : {
						'patient' : "@patient",
						'startDate' : "@startDate",
						'endDate' : "@endDate",
						'entityType' : "@entityType",
						'numTerms': "@numTerms"
					}
				}
			});
});

visitNotesApp.factory('SofaTextMentionUIResources', function($resource) {
    return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/sofatextmentionui", {},
		{
			displayHeatMap : {
				method : 'GET',
				params : {
					'patient' : "@patient",
					'startDate' : "@startDate",
					'endDate' : "@endDate",
					'searchTerms' : "@searchTerms"
				}
			}
		});
});

