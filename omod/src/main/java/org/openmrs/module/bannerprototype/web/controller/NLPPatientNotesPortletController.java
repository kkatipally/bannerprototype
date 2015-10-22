package org.openmrs.module.bannerprototype.web.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;

import org.openmrs.module.bannerprototype.api.NLPService;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import banner.tokenization.Tokenizer;

public class NLPPatientNotesPortletController {
	
	String loadModelFileName;
	
	Tokenizer tokenizer;
	
	SofaDocument sofaDocument = new SofaDocument();
	
	List<SofaDocument> allSofaDocuments;
	
	int sofaDocumentId = 0;
	
	boolean reloadDocuments = true;
	
	//protected final Log log = LogFactory.getLog(getClass());
	String sofa = "";
	
	public NLPPatientNotesPortletController() {
		
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView banner(HttpServletRequest request, HttpServletResponse response, ModelMap model) {
		
		Integer patientId = Integer.valueOf(request.getParameter("patientId"));
		Patient patient = Context.getPatientService().getPatient(patientId);
		System.out.println("loading AllSofaDocuments");
		
		if (reloadDocuments)
			allSofaDocuments = Context.getService(NLPService.class).getSofaDocumentsByPatient(patient);
		
		reloadDocuments = true; // if not redirected from POST, reload documents
		if (sofaDocument != null) {
			model.addAttribute("docHtml", sofaDocument.getAnnotatedHTML());
		} else
			model.addAttribute("docHtml", "");
		
		model.addAttribute("user", Context.getAuthenticatedUser());
		model.addAttribute("sofaDocument", sofaDocument);
		model.addAttribute("allSofaDocuments", allSofaDocuments);
		model.addAttribute("sofaDocumentId", sofaDocumentId);
		
		return new ModelAndView("/module/bannerprototype/portlets/nlpPatientNotes", model);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public String updateDocument(HttpServletRequest request, HttpServletResponse response, ModelMap model) {
		Integer docId = Integer.valueOf(request.getParameter("docId"));
		for (SofaDocument sd : allSofaDocuments)
			if (sd.getSofaDocumentId() == docId) {
				sofaDocument = Context.getService(NLPService.class).getSofaDocumentById(docId);
				break;
			}
		
		reloadDocuments = false;
		return "OK";
		
	}
	
}
