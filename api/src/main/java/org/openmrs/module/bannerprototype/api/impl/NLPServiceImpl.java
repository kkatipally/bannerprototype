package org.openmrs.module.bannerprototype.api.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.Arrays;
import java.util.Calendar;

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
	public SofaDocumentUI getSofaDocumentUIBySofaDocUuid(String sofaDocUuid) {
		return dao.getSofaDocumentUIBySofaDocUuid(sofaDocUuid);
	}
	
	@Override
	@Transactional
	public List<SofaTextMentionUI> getSofaTextMentionUIsByConstraints(Patient patient, Date startDate, Date endDate,
	        String[] searchTerms) {
		
		List<SofaTextMentionUI> stmUIAll = new ArrayList<SofaTextMentionUI>();
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(endDate); //endDate shows 00:00:00 PDT so incrementing by a day
		cal.add(Calendar.DATE, 1);
		Date newEndDate = cal.getTime();
		
		if (searchTerms.length > 3) {
			
			stmUIAll = dao.getSofaTextMentionUIsByConstraints(patient, startDate, newEndDate, searchTerms);
			
		} else {
			for (String term : searchTerms) {
				
				List<SofaDocument> sofaDocs = getSofaDocumentsByConstraints(patient, startDate, newEndDate, term);
				
				WordCloud problemCloud = new WordCloud();
				WordCloud treatmentCloud = new WordCloud();
				WordCloud testCloud = new WordCloud();
				
				for (SofaDocument sd : sofaDocs) {
					addToCloud(problemCloud, sd.getProblemMentions());
					addToCloud(treatmentCloud, sd.getTreatmentMentions());
					addToCloud(testCloud, sd.getTestMentions());
				}
				
				List<String> allTopTerms = new ArrayList<String>();
				allTopTerms.add(term);
				
				List<Word> problemTopWords = problemCloud.getTopWordsShuffled(5);
				List<Word> treatmentTopWords = treatmentCloud.getTopWordsShuffled(5);
				List<Word> testTopWords = testCloud.getTopWordsShuffled(5);
				
				for (Word word : problemTopWords) {
					allTopTerms.add(word.getWord());
				}
				
				for (Word word : treatmentTopWords) {
					allTopTerms.add(word.getWord());
				}
				
				for (Word word : testTopWords) {
					allTopTerms.add(word.getWord());
				}
				
				String[] allTopTermsArr = new String[allTopTerms.size()];
				allTopTermsArr = allTopTerms.toArray(allTopTermsArr);
				
				List<SofaTextMentionUI> stmUIList = dao.getSofaTextMentionUIsByConstraints(patient, startDate, newEndDate,
				    allTopTermsArr);
				
				List<SofaTextMentionUI> relatedstmUIList = new ArrayList<SofaTextMentionUI>();
				for (SofaTextMentionUI stmUI : stmUIList) {
					if (stmUI != null) { //fixes bug - no error when some search terms return no data
						if (!(stmUI.getMentionText().equals(term))) {
							stmUI.setRelatedTo(term);
							relatedstmUIList.add(stmUI);
						} else {
							stmUIAll.add(stmUI);
						}
					}
				}
				
				for (SofaTextMentionUI relStmUI : relatedstmUIList) {
					stmUIAll.add(relStmUI);
				}
				
			}
		}
		return stmUIAll;
	}
	
	@Override
	@Transactional
	public List<SofaDocumentUI> getSofaDocumentUIsByConstraints(Patient patient, Date startDate, Date endDate,
	        String[] searchTerms) {
		
		List<SofaDocumentUI> dateList = new ArrayList<SofaDocumentUI>();
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(endDate); //endDate shows 00:00:00 PDT so incrementing by a day
		cal.add(Calendar.DATE, 1);
		Date newEndDate = cal.getTime();
		
		if (searchTerms.length > 3) {
			
			dateList = dao.getSofaDocumentUIsByConstraints(patient, startDate, newEndDate, searchTerms);
			
		} else {
			
			List<String> allTopTerms = new ArrayList<String>();
			
			for (String term : searchTerms) {
				
				List<SofaDocument> sofaDocs = getSofaDocumentsByConstraints(patient, startDate, newEndDate, term);
				
				WordCloud problemCloud = new WordCloud();
				WordCloud treatmentCloud = new WordCloud();
				WordCloud testCloud = new WordCloud();
				
				for (SofaDocument sd : sofaDocs) {
					addToCloud(problemCloud, sd.getProblemMentions());
					addToCloud(treatmentCloud, sd.getTreatmentMentions());
					addToCloud(testCloud, sd.getTestMentions());
				}
				
				allTopTerms.add(term);
				
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
				
			}
			
			String[] allTopTermsArr = new String[allTopTerms.size()];
			allTopTermsArr = allTopTerms.toArray(allTopTermsArr);
			
			dateList = dao.getSofaDocumentUIsByConstraints(patient, startDate, newEndDate, allTopTermsArr);
		}
		
		return dateList;
	}
	
	private void addToCloud(WordCloud wordcloud, List<SofaTextMention> mentions) {
		
		for (SofaTextMention m : mentions)
			wordcloud.addWord(m.getMentionText().toLowerCase(), m.getMentionType());
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
