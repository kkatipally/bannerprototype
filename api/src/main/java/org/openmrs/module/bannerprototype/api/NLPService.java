package org.openmrs.module.bannerprototype.api;

import java.util.List;
import java.util.Set;

import org.hibernate.SessionFactory;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.springframework.transaction.annotation.Transactional;

/**
 * This service exposes access to the data persistence layer for saving/retrieving SofaDocument related data. It is a Spring managed bean which is configured in moduleApplicationContext.xml.
 * <p>
 * It can be accessed only via Context:<br>
 * <code>
 * Context.getService(NLPService.class).someMethod();
 * </code>
 * 
 * @see org.openmrs.api.context.Context
 */
@Transactional
public interface NLPService extends OpenmrsService {
	/**
	 * Saves the Hibernate Object Relational Mapped data to the DB, including all children in the data hierarchy
	 * @param sofaDocument
	 * @return
	 */
	public SofaDocument saveSofaDocument(SofaDocument sofaDocument);
	/**
	 * returns all SofaDocument objects from the database
	 * @return
	 */
	public List<SofaDocument> getAllSofaDocuments();
	/**
	 * Saves a SofaText to the database, including all children in the data hierarchy
	 * @param sofaText
	 * @return
	 */
	public SofaText saveSofaText(SofaText sofaText);
	/**
	 * Saves a SofaTextMention to the database, including all children in teh data hierarchy
	 * @param sofaTextMention
	 * @return
	 */
	public SofaTextMention saveSofaTextMention(SofaTextMention sofaTextMention);
	/**
	 * returns a SofaText object by its ID
	 * @param sofaTextId
	 * @return
	 */
	public SofaText getSofaText(int sofaTextId);
	
	/**
	 * returns all SofaText objects whose parent is sofaDocument
	 * @param sofaDocument
	 * @return
	 */
	public Set<SofaText> getSofaTextByDocument(SofaDocument sofaDocument);
	/**
	 * returns the SofaDocument by ID
	 * @param sofaDocumentId
	 * @return
	 */
	public SofaDocument getSofaDocumentById(int sofaDocumentId);
	/**
	 * returns the current SessionFactory
	 * @return
	 */
	public SessionFactory getSessionFactory();
	/**
	 * returns all SofaDocument objects associated with patient
	 * @param patient
	 * @return
	 */
	public List<SofaDocument> getSofaDocumentsByPatient(Patient patient);
	/**
	 * deletes all data relating to SofaDocuments, SofaTextMention etc.
	 * This is called when re-analyzing the Visit Note set, ie when a new model is provided.
	 */
	public void truncateNLPtables();
	
}
