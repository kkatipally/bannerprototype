package org.openmrs.module.bannerprototype.page.controller;

import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class NotesNLPngPageController {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	public void controller(@RequestParam(value = "patientId", required = false) Patient patient, PageModel pageModel,
	        @RequestParam(value = "returnUrl", required = false) String returnUrl) throws IOException,
	        ClassNotFoundException {
		
		if (patient == null) // user redirected after time out.  need to work around
		{
			patient = Context.getPatientService().getAllPatients().get(1);
			
			pageModel.addAttribute("patient", patient);
			pageModel.addAttribute("returnUrl", returnUrl);
			pageModel.addAttribute("user", -1);
			pageModel.addAttribute("patientMRN", "NONE");
			pageModel.addAttribute("adminEmail", "NONE");
			pageModel.addAttribute("patientId", -1);
			
			return;
			
		}
		
		String patientMRN = patient.getPatientIdentifier().getIdentifier();
		
		String adminEmail = Context.getAdministrationService().getGlobalProperty("bannerprototype.adminEmail");
		
		pageModel.addAttribute("returnUrl", returnUrl);
		pageModel.addAttribute("user", Context.getAuthenticatedUser());
		pageModel.addAttribute("patientMRN", patientMRN);
		pageModel.addAttribute("adminEmail", adminEmail);
		pageModel.addAttribute("patientId", patient.getId());
		
	}
	
}
