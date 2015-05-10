package org.openmrs.module.bannerprototype.web.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.bannerprototype;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.nlp.DocumentTagger;
import org.openmrs.module.bannerprototype.nlp.NERTagger;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import banner.tokenization.Tokenizer;

public class NLPPatientNotesPortletController {
	
	String loadModelFileName;
	
	Tokenizer tokenizer;
	NERTagger tagger;
	
	SofaDocument sofaDocument = new SofaDocument();
	List<SofaDocument> allSofaDocuments;
	int sofaDocumentId=0;
	
	boolean reloadDocuments = true;
	
	//protected final Log log = LogFactory.getLog(getClass());
	String sofa = "";
	
	public NLPPatientNotesPortletController(){
		tagger = new NERTagger();
		
	}
	
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView banner(HttpServletRequest request, HttpServletResponse response,ModelMap model) {
		
		Integer patientId = Integer.valueOf(request.getParameter("patientId"));
		Patient patient = Context.getPatientService().getPatient(patientId);
		System.out.println("loading AllSofaDocuments");
		
		if(reloadDocuments)
			allSofaDocuments = Context.getService(NLPService.class).getSofaDocumentsByPatient(patient);

		reloadDocuments = true; // if not redirected from POST, reload documents
		if(sofaDocument != null)
		{
			model.addAttribute("docHtml",sofaDocument.getAnnotatedHTML());
		}
		else
			model.addAttribute("docHtml","");
		
		
		model.addAttribute("user", Context.getAuthenticatedUser());
		model.addAttribute("sofaDocument",sofaDocument);
		model.addAttribute("allSofaDocuments",allSofaDocuments);
		model.addAttribute("sofaDocumentId", sofaDocumentId);
		model.addAttribute("bannerprototype",new bannerprototype());
		model.addAttribute("sofa",sofa);
		return new ModelAndView("/module/bannerprototype/portlets/nlpPatientNotes", model);
	}
	

	@RequestMapping(method = RequestMethod.POST)
    public String updateDocument(HttpServletRequest request,HttpServletResponse response,ModelMap model)
    {
        Integer docId = Integer.valueOf(request.getParameter("docId"));
        for(SofaDocument sd : allSofaDocuments)
			if(sd.getSofaDocumentId() == docId)
			{	
				sofaDocument = Context.getService(NLPService.class).getSofaDocumentById(docId);
				break;
			}
        
        reloadDocuments=false;
        return "OK";
        
    }
	

}
