package org.openmrs.module.bannerprototype.page.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.nlp.NERTagger;
import org.openmrs.module.bannerprototype.web.wordcloud.Word;
import org.openmrs.module.bannerprototype.web.wordcloud.WordCloud;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

import banner.tokenization.Tokenizer;

/**
*
* @author Eshleman
*/
public class NotesNLPPageController {

	List<SofaDocument> allSofaDocuments;

	protected final Log log = LogFactory.getLog(getClass());



   public void controller(@RequestParam(value="patientId",required=false) Patient patient,
           PageModel pageModel,
           @RequestParam(value = "returnUrl", required = false) String returnUrl) throws IOException, ClassNotFoundException{
	   
	   
	    if(patient == null) // user redirected after time out.  need to work around
	    {
	    	patient = Context.getPatientService().getAllPatients().get(1);
	    	
	    	pageModel.addAttribute("patient",patient);
	    	pageModel.addAttribute("returnUrl", returnUrl);
			pageModel.addAttribute("user", -1);
			pageModel.put("allSofaDocuments",new ArrayList<SofaDocument>());
			pageModel.addAttribute("tagCloudWords", new ArrayList<Word>());
			pageModel.addAttribute("patientMRN", "NONE");
			pageModel.addAttribute("adminEmail","NONE");
			pageModel.addAttribute("patientId",-1);
			
			return;
	    	
	    }
	    
	    
	   	String patientMRN = patient.getPatientIdentifier().getIdentifier();

		WordCloud wordcloud = new WordCloud();
		
		allSofaDocuments = Context.getService(NLPService.class).getSofaDocumentsByPatient(patient);

		for(SofaDocument sd : allSofaDocuments)
			addToCloud(wordcloud, sd.getAllMentions());


		String adminEmail = Context.getAdministrationService().getGlobalProperty("bannerprototype.adminEmail");
		
		pageModel.addAttribute("returnUrl", returnUrl);
		pageModel.addAttribute("user", Context.getAuthenticatedUser());
		pageModel.put("allSofaDocuments",allSofaDocuments);
		pageModel.addAttribute("tagCloudWords", wordcloud.getTopWordsShuffled(30));
		pageModel.addAttribute("patientMRN", patientMRN);
		pageModel.addAttribute("adminEmail",adminEmail);
		pageModel.addAttribute("patientId",patient.getId());

   }
   
   

   private void addToCloud(WordCloud wordcloud, List<SofaTextMention> mentions) {
	
	   for(SofaTextMention m : mentions)
		   wordcloud.addWord(m.getMentionText(),m.getMentionType());
   }

}


