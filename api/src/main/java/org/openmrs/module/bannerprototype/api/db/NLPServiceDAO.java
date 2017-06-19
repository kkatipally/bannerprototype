package org.openmrs.module.bannerprototype.api.db;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.hibernate.SessionFactory;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaDocumentUI;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.module.bannerprototype.SofaTextMentionConcept;
import org.openmrs.module.bannerprototype.SofaTextMentionUI;

public interface NLPServiceDAO {
	
	public SofaDocument saveSofaDocument(SofaDocument sofaDocument);
	
	public List<SofaDocument> getAllSofaDocuments();
	
	public List<SofaDocument> getSofaDocumentsByPatient(Patient patient);
	
	public List<SofaDocument> getSofaDocumentsByPatientAndDateRange(Patient patient, Date startDate, Date endDate);
	
	public List<SofaDocument> getSofaDocumentsByConstraints(Patient patient, Date startDate, Date endDate, String searchTerm);
	
	public SofaText saveSofaText(SofaText sofaText);
	
	public SofaTextMention saveSofaTextMention(SofaTextMention sofaTextMention);
	
	public SofaTextMentionConcept saveSofaTextMentionConcept(SofaTextMentionConcept sofaTextMentionConcept);
	
	public SofaText getSofaText(int sofaTextId);
	
	public Set<SofaText> getSofaTextsByEncounter(Encounter encounter);
	
	public Set<SofaText> getSofaTextByDocument(SofaDocument sofaDocument);
	
	public SofaDocument getSofaDocumentById(int SofaDocumentId);
	
	public SofaDocument getSofaDocumentByUuid(String uuid);
	
	public SofaTextMention getSofaTextMentionByUuid(String uuid);
	
	public SofaTextMentionUI getSofaTextMentionUIByUuid(String uuid);
	
	public SofaDocumentUI getSofaDocumentUIBySofaDocUuid(String sofaDocUuid);
	
	public List<SofaTextMentionUI> getSofaTextMentionUIsByConstraints(Patient patient, Date startDate, Date endDate,
	        String[] searchTerms);
	
	public List<SofaDocumentUI> getSofaDocumentUIsByConstraints(Patient patient, Date startDate, Date endDate,
	        String[] searchTerms);
	
	public SessionFactory getSessionFactory();
	
	public void truncateNLPTables();
}
