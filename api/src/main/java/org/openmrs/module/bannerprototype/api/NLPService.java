package org.openmrs.module.bannerprototype.api;

import java.util.List;
import java.util.Set;

import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.springframework.transaction.annotation.Transactional;

/**
 * This service exposes module's core functionality. It is a Spring managed bean which is configured in moduleApplicationContext.xml.
 * <p>
 * It can be accessed only via Context:<br>
 * <code>
 * Context.getService(bannerprototypeService.class).someMethod();
 * </code>
 * 
 * @see org.openmrs.api.context.Context
 */
@Transactional
public interface NLPService extends OpenmrsService {

	public SofaDocument saveSofaDocument(SofaDocument sofaDocument);
	public List<SofaDocument> getAllSofaDocuments();
	public SofaText saveSofaText(SofaText sofaText);
	public SofaTextMention saveSofaTextMention(SofaTextMention sofaTextMention);
	public SofaText getSofaText(int sofaTextId);
	public Set<SofaText> getSofaTextsByEncounter(Encounter encounter);
	public Set<SofaText> getSofaTextByDocument(SofaDocument sofaDocument);
	public SofaDocument getSofaDocumentById(int sofaDocumentId);
	
	
	public List<SofaDocument> getSofaDocumentsByPatient(Patient patient);
}
