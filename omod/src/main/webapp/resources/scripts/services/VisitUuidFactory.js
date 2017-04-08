'use strict';

visitNotesApp.factory('VisitUuidFactory', function() {

	var data = {
		visitDateUuid : ''
	};

	return {
		getVisitDateUuid : function() {
			// console.log("visitDateUuid in getter: " + data.visitDateUuid);
			return data.visitDateUuid;
		},
		setVisitDateUuid : function(visitDateUuid) {
			data.visitDateUuid = visitDateUuid;
			// console.log("visitDateUuid in setter: " + data.visitDateUuid);
		}
	};
});