package org.openmrs.module.bannerprototype.page.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

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
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestParam;

import banner.tokenization.Tokenizer;

/**
 * @author Eshleman
 */
public class NotesNLPPageController {
	
	List<SofaDocument> allSofaDocuments;
	
	protected final Log log = LogFactory.getLog(getClass());
	
	public void get(PageModel pageModel, @RequestParam(value = "patientId", required = false) Patient patient,
	        @RequestParam(value = "returnUrl", required = false) String returnUrl,
	        @RequestParam(value = "entityType", required = false) String entityType,
	        @RequestParam(value = "numTerms", required = false) String numTerms/*,
	                                                                               @RequestParam(value = "until", required = false) String until*/)
	        throws IOException, ClassNotFoundException {
		
		System.out.println("entityType, numTerms, patientId: " + entityType + ' ' +  numTerms + ' ' + patient);
		
		if (patient == null) // user redirected after time out.  need to work around
		{
			patient = Context.getPatientService().getAllPatients().get(0);
			
			pageModel.addAttribute("patient", patient);
			pageModel.addAttribute("returnUrl", returnUrl);
			pageModel.addAttribute("user", -1);
			pageModel.put("allSofaDocuments", new ArrayList<SofaDocument>());
			pageModel.addAttribute("tagCloudWords", new ArrayList<Word>());
			pageModel.addAttribute("patientMRN", "NONE");
			pageModel.addAttribute("adminEmail", "NONE");
			pageModel.addAttribute("patientId", -1);
			pageModel.addAttribute("entityType", entityType);
			pageModel.addAttribute("numTerms", numTerms);
			
			return;
			
		}
		
		// No data and no error for initial loading
		if (!StringUtils.hasText(returnUrl) && !StringUtils.hasText(entityType) && !StringUtils.hasText(numTerms)) {
			return;
		}
		
		String patientMRN = patient.getPatientIdentifier().getIdentifier();
		
		WordCloud wordcloud = new WordCloud();
		
		//allSofaDocuments = Context.getService(NLPService.class).getSofaDocumentsByPatient(patient);
		Date oneYearAgo = new Date(System.currentTimeMillis() - (365 * 24 * 60 * 60 * 1000));
		Date today = new Date(System.currentTimeMillis());
		
		allSofaDocuments = Context.getService(NLPService.class).getSofaDocumentsByPatientAndDateRange(patient, oneYearAgo,
		    today);
		
		if (entityType.equals("Problems")) {
			for (SofaDocument sd : allSofaDocuments) {
				addToCloud(wordcloud, sd.getProblemMentions());
			}
		} else if (entityType.equals("Treatments")) {
			for (SofaDocument sd : allSofaDocuments) {
				addToCloud(wordcloud, sd.getTreatmentMentions());
			}
		} else if (entityType.equals("Tests")) {
			for (SofaDocument sd : allSofaDocuments) {
				addToCloud(wordcloud, sd.getTestMentions());
			}
		} else {
			for (SofaDocument sd : allSofaDocuments) {
				addToCloud(wordcloud, sd.getProblemMentions());
			}
		}
		
		String adminEmail = Context.getAdministrationService().getGlobalProperty("bannerprototype.adminEmail");
		
		int numofTerms = 1;
		if(StringUtils.hasText(numTerms)){
			numofTerms = (int) Integer.parseInt(numTerms);
			System.out.println("numTerms, int numofTerms: " + numTerms + ' ' +  numofTerms);
		}
		
		pageModel.addAttribute("returnUrl", returnUrl);
		pageModel.addAttribute("user", Context.getAuthenticatedUser());
		pageModel.put("allSofaDocuments", allSofaDocuments);
		pageModel.addAttribute("tagCloudWords", wordcloud.getTopWordsShuffled(numofTerms));
		pageModel.addAttribute("patientMRN", patientMRN);
		pageModel.addAttribute("adminEmail", adminEmail);
		pageModel.addAttribute("patientId", patient.getId());
		pageModel.addAttribute("entityType", entityType);
		pageModel.addAttribute("numTerms", numTerms);
		
	}
	
	private void addToCloud(WordCloud wordcloud, List<SofaTextMention> mentions) {
		
		for (SofaTextMention m : mentions)
			wordcloud.addWord(m.getMentionText(), m.getMentionType());
	}
	
}
