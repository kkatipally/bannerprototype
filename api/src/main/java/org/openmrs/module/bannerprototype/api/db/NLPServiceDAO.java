package org.openmrs.module.bannerprototype.api.db;

import java.util.List;
import java.util.Set;

import org.hibernate.SessionFactory;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.module.bannerprototype.SofaTextMentionConcept;

public interface NLPServiceDAO {
	
	public SofaDocument saveSofaDocument(SofaDocument sofaDocument);
	public List<SofaDocument> getAllSofaDocuments();
	
	public List<SofaDocument> getSofaDocumentsByPatient(Patient patient);
	
	public SofaText saveSofaText(SofaText sofaText);
	public SofaTextMention saveSofaTextMention(SofaTextMention sofaTextMention);
	public SofaTextMentionConcept saveSofaTextMentionConcept(SofaTextMentionConcept sofaTextMentionConcept);
	public SofaText getSofaText(int sofaTextId);
	public Set<SofaText> getSofaTextsByEncounter(Encounter encounter);
	public Set<SofaText> getSofaTextByDocument(SofaDocument sofaDocument);
	public SofaDocument getSofaDocumentById(int SofaDocumentId);
	public SessionFactory getSessionFactory();
	public void truncateNLPTables();
}
