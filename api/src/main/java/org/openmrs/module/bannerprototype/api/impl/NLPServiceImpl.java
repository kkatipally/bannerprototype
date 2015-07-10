package org.openmrs.module.bannerprototype.api.impl;

import java.util.List;
import java.util.Set;

import org.hibernate.SessionFactory;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.api.db.NLPServiceDAO;
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

	@Override
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
	public List<SofaDocument> getSofaDocumentsByPatient(Patient patient) {
		return dao.getSofaDocumentsByPatient(patient);
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
