package org.openmrs.module.bannerprototype.extension.html;

import org.openmrs.module.Extension;
import org.openmrs.module.web.extension.PatientDashboardTabExt;

public class NLPPatientDashboardTab extends PatientDashboardTabExt {
	
	public Extension.MEDIA_TYPE getMediaType() {
		return Extension.MEDIA_TYPE.html;
	}
	
	@Override
	public String getPortletUrl() {
		return "nlpPatientNotes";
	}
	
	@Override
	public String getRequiredPrivilege() {
		return "Patient Dashboard - View Notes Section";
	}
	
	@Override
	public String getTabId() {
		return "PatientNotesNLP";
	}
	
	@Override
	public String getTabName() {
		return "NotesNLP";
	}
	
}
