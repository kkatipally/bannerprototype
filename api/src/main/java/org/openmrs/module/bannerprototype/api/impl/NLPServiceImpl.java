package org.openmrs.module.bannerprototype.api.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Arrays;

import org.hibernate.SessionFactory;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaDocumentUI;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.module.bannerprototype.SofaTextMentionUI;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.api.db.NLPServiceDAO;
import org.openmrs.module.bannerprototype.wordcloud.Word;
import org.openmrs.module.bannerprototype.wordcloud.WordCloud;
import org.springframework.transaction.annotation.Transactional;

public class NLPServiceImpl extends BaseOpenmrsService implements NLPService {
	
	private NLPServiceDAO dao;
	
	/**
	 * @param dao the dao to set
	 */
	public void setDao(NLPServiceDAO dao) {
		this.dao = dao;
	}
	
	/**
	 * @return the dao
	 */
	public NLPServiceDAO getDao() {
		return dao;
	}
	
	@Override
	public SofaText saveSofaText(SofaText sofaText) {
		dao.saveSofaText(sofaText);
		return sofaText;
	}
	
	@Override
	public SofaTextMention saveSofaTextMention(SofaTextMention sofaTextMention) {
		dao.saveSofaTextMention(sofaTextMention);
		return sofaTextMention;
	}
	
	@Override
	@Transactional(readOnly = true)
	public SofaText getSofaText(int sofaTextId) {
		return dao.getSofaText(sofaTextId);
	}
	
	@Transactional(readOnly = true)
	public Set<SofaText> getSofaTextsByEncounter(Encounter encounter) {
		return dao.getSofaTextsByEncounter(encounter);
	}
	
	@Override
	public SofaDocument saveSofaDocument(SofaDocument sofaDocument) {
		return dao.saveSofaDocument(sofaDocument);
	}
	
	@Override
	public Set<SofaText> getSofaTextByDocument(SofaDocument sofaDocument) {
		return dao.getSofaTextByDocument(sofaDocument);
	}
	
	@Override
	public List<SofaDocument> getAllSofaDocuments() {
		return dao.getAllSofaDocuments();
	}
	
	@Override
	@Transactional
	public SofaDocument getSofaDocumentById(int sofaDocumentId) {
		return dao.getSofaDocumentById(sofaDocumentId);
	}
	
	@Override
	@Transactional
	public SofaDocument getSofaDocumentByUuid(String uuid) {
		return dao.getSofaDocumentByUuid(uuid);
	}
	
	@Override
	@Transactional
	public SofaTextMention getSofaTextMentionByUuid(String uuid) {
		return dao.getSofaTextMentionByUuid(uuid);
	}
	
	@Override
	@Transactional
	public SofaTextMentionUI getSofaTextMentionUIByUuid(String uuid) {
		return dao.getSofaTextMentionUIByUuid(uuid);
	}
	
	@Override
	@Transactional
	public List<SofaDocument> getSofaDocumentsByPatient(Patient patient) {
		return dao.getSofaDocumentsByPatient(patient);
	}
	
	@Override
	@Transactional
	public List<SofaDocument> getSofaDocumentsByPatientAndDateRange(Patient patient, Date startDate, Date endDate) {
		return dao.getSofaDocumentsByPatientAndDateRange(patient, startDate, endDate);
	}
	
	@Override
	@Transactional
	public List<SofaDocument> getSofaDocumentsByConstraints(Patient patient, Date startDate, Date endDate, String searchTerm) {
		return dao.getSofaDocumentsByConstraints(patient, startDate, endDate, searchTerm);
	}
	
	@Override
	@Transactional
	public Set<SofaTextMentionUI> getSofaTextMentionUIByConstraints(Patient patient, Date startDate, Date endDate,
	        String[] searchTerms) {
		
		Set<SofaTextMentionUI> stmUIAll = new HashSet<SofaTextMentionUI>();
		
		if (searchTerms.length > 3) {
			stmUIAll = dao.getSofaTextMentionUIByConstraints(patient, startDate, endDate, searchTerms);
		} else {
			for (String term : searchTerms) {
				
				List<SofaDocument> sofaDocs = getSofaDocumentsByConstraints(patient, startDate, endDate, term);
				
				WordCloud problemCloud = new WordCloud();
				WordCloud treatmentCloud = new WordCloud();
				WordCloud testCloud = new WordCloud();
				
				for (SofaDocument sd : sofaDocs) {
					addToCloud(problemCloud, sd.getProblemMentions());
					addToCloud(treatmentCloud, sd.getTreatmentMentions());
					addToCloud(testCloud, sd.getTestMentions());
				}
				
				List<String> allTopTerms = new ArrayList<String>();
				List<Word> problemTopWords = problemCloud.getTopWordsShuffled(5);
				List<Word> treatmentTopWords = treatmentCloud.getTopWordsShuffled(5);
				List<Word> testTopWords = testCloud.getTopWordsShuffled(5);
				
				for (Word word : problemTopWords) {
					if (!(Arrays.asList(searchTerms).contains(word.getWord())))
						allTopTerms.add(word.getWord());
				}
				
				for (Word word : treatmentTopWords) {
					if (!(Arrays.asList(searchTerms).contains(word.getWord())))
						allTopTerms.add(word.getWord());
				}
				
				for (Word word : testTopWords) {
					if (!(Arrays.asList(searchTerms).contains(word.getWord())))
						allTopTerms.add(word.getWord());
				}
				
				allTopTerms.add(term);
				
				String[] allTopTermsArr = new String[allTopTerms.size()];
				allTopTermsArr = allTopTerms.toArray(allTopTermsArr);
				
				Set<SofaTextMentionUI> stmUIList = dao.getSofaTextMentionUIByConstraints(patient, startDate, endDate,
				    allTopTermsArr);
				
				for (SofaTextMentionUI stmUI : stmUIList) {
					if (!(stmUI.getMentionText().equals(term))) {
						stmUI.setRelatedTo(term);
					}
					stmUIAll.add(stmUI);
				}
				
			}
		}
		return stmUIAll;
	}
	
	private void addToCloud(WordCloud wordcloud, List<SofaTextMention> mentions) {
		
		for (SofaTextMention m : mentions)
			wordcloud.addWord(m.getMentionText(), m.getMentionType());
	}
	
	public SessionFactory getSessionFactory() {
		return dao.getSessionFactory();
	}
	
	@Override
	public void truncateNLPtables() {
		dao.truncateNLPTables();
		return;
		
	}
	
}
