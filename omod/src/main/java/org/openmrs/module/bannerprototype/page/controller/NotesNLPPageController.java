package org.openmrs.module.bannerprototype.page.controller;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openmrs.Concept;
import org.openmrs.ConceptSet;
import org.openmrs.Encounter;
import org.openmrs.EncounterRole;
import org.openmrs.Form;
import org.openmrs.Obs;
import org.openmrs.Order;
import org.openmrs.Patient;
import org.openmrs.Provider;
import org.openmrs.TestOrder;
import org.openmrs.User;
import org.openmrs.api.ConceptService;
import org.openmrs.api.FormService;
import org.openmrs.api.ObsService;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.bannerprototype;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.nlp.NERTagger;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import banner.tokenization.Tokenizer;

/**
*
* @author Eshleman
*/
public class NotesNLPPageController {
	
	String loadModelFileName;
	
	Tokenizer tokenizer;
	NERTagger tagger;
	
	SofaDocument sofaDocument = new SofaDocument();
	List<SofaDocument> allSofaDocuments;
	int sofaDocumentId=0;
	
	boolean reloadDocuments = true;
	
	//protected final Log log = LogFactory.getLog(getClass());
	String sofa = "";

   // public void get(PageModel pageModel) {
   public void controller(@RequestParam("patientId") Patient patient,
           PageModel pageModel,
           @RequestParam(value = "returnUrl", required = false) String returnUrl,
           @RequestParam(value = "docId", required = false, defaultValue = "-1") int docId) throws IOException, ClassNotFoundException{
	   
	   	Integer patientId = patient.getId();
		
		//System.out.println("loading AllSofaDocuments");
		//System.out.println(docId);
		
		FormService fs = Context.getFormService();
		ConceptService cs = Context.getConceptService();
		ObsService os = Context.getObsService();
		
		Concept c = cs.getConceptByName("Text of encounter note");
		List<Obs> obs = os.getObservationsByPersonAndConcept(patient, c);
		
		
		

		
		
		
		
		
		allSofaDocuments = Context.getService(NLPService.class).getSofaDocumentsByPatient(patient);
		
		if(docId == -1 && allSofaDocuments.size() != 0)
			sofaDocument = allSofaDocuments.get(0);
		else
		for(SofaDocument sd : allSofaDocuments)
			if(sd.getSofaDocumentId() == docId)
			{	
				sofaDocument = sd;
				break;
			}
		
		
		//System.out.println(allSofaDocuments.size());
		reloadDocuments = true; // if not redirected from POST, reload documents
		//sofaDocument = allSofaDocuments.get(0);
		if(sofaDocument != null)
		{
			pageModel.addAttribute("docHtml",sofaDocument.getAnnotatedHTML());
		}
		else
			pageModel.addAttribute("docHtml","");
		
		//User u = Context.getAuthenticatedUser();
		//u.getId()
		
		pageModel.addAttribute("user", Context.getAuthenticatedUser());
		pageModel.addAttribute("sofaDocument",sofaDocument);
		pageModel.put("allSofaDocuments",allSofaDocuments);
		pageModel.addAttribute("sofaDocumentId", sofaDocumentId);
		pageModel.addAttribute("bannerprototype",new bannerprototype());
		pageModel.addAttribute("sofa",sofa);
		String modelFiles[] = new ClassPathResource("taggers/").getFile().list();
		
		//return new ModelAndView("/module/bannerprototype/portlets/nlpPatientNotes", model);
		

   }
   
   public String post(@RequestParam(value = "docId", required = false) int docId,
           @RequestParam(value = "returnUrl", required = false) String returnUrl,
           @RequestParam("patientId") Patient patient) {
	   
	   		
	   
	   		//System.out.println("***************in post**********************");
	   		//System.out.println(allSofaDocuments.size());
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


