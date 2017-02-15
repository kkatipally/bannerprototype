
visitNotesApp.config(function ($httpProvider) {
    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
});

visitNotesApp.factory('SofaDocumentResource', function($resource) {
    //return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/sofadocument/1d840527-cef9-4a90-9f98-0ea9bffffe2f",{
    return $resource("/openmrs/ws/rest/v1/bannerprototype/sofadocument/1d840527-cef9-4a90-9f98-0ea9bffffe2f");
});

visitNotesApp.factory('SofaDocumentResources', function($resource) {
    return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/sofadocument/");
});

visitNotesApp.factory('SofaTextMentionResource', function($resource) {
    //return $resource("/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/v1/bannerprototype/sofadocument/1d840527-cef9-4a90-9f98-0ea9bffffe2f",{
    return $resource("/openmrs/ws/rest/v1/bannerprototype/sofatextmention/71ef216f-75bb-4106-841f-e3405ba086eb");
});

visitNotesApp.factory('SofaTextMentionResources', function($resource) {
	    return $resource("/openmrs/ws/rest/v1/bannerprototype/sofatextmention", {},
			{
				displayCloud : {
					method : 'GET',
					params : {
						'patient' : "@patient",
						'startDate' : "@startDate",
						'endDate' : "@endDate",
						'entityType' : "@entityType"
					}
				}
			});
});