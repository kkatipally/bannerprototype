package org.openmrs.module.bannerprototype.api.db.hibernate;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.module.bannerprototype.SofaTextMentionConcept;
import org.openmrs.module.bannerprototype.api.db.NLPServiceDAO;

public class HibernateNLPServiceDAO implements NLPServiceDAO {

	
	private SessionFactory sessionFactory;

    /**
     * @param sessionFactory the sessionFactory to set
     */
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }
    
    /**
     * @return the sessionFactory
     */
    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }
	
    public SofaDocument saveSofaDocument(SofaDocument sofaDocument)
    {
    	sessionFactory.getCurrentSession().flush();
    	sessionFactory.getCurrentSession().saveOrUpdate(sofaDocument);
    	for(SofaText st : sofaDocument.getSofaText())
    		saveSofaText(st);
    	
    	return sofaDocument;
    }
    
	@Override
	public SofaText saveSofaText(SofaText sofaText) {
		
		Session s = sessionFactory.getCurrentSession();
		s.saveOrUpdate(sofaText);
		
		for(SofaTextMention stm : sofaText.getSofaTextMention())
		{	
			s.saveOrUpdate(stm);
			for(SofaTextMentionConcept stmc : stm.getSofaTextMentionConcept())
				s.saveOrUpdate(stmc);
		}
		
		return sofaText;
	}

	@Override
	public SofaTextMention saveSofaTextMention(SofaTextMention sofaTextMention) {
		sessionFactory.getCurrentSession().saveOrUpdate(sofaTextMention);
        return sofaTextMention;
	}

	@Override
	public SofaText getSofaText(int sofaTextId) {
		 return (SofaText) sessionFactory.getCurrentSession().get(SofaText.class, sofaTextId);

	}

	@Override
	public Set<SofaText> getSofaTextsByEncounter(Encounter encounter) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(
                SofaText.class);
        crit.add(Restrictions.eq("encounter", encounter));
        return (Set<SofaText>) crit.list();
	}

	@Override
	public SofaTextMentionConcept saveSofaTextMentionConcept(
			SofaTextMentionConcept sofaTextMentionConcept) {
		
		sessionFactory.getCurrentSession().saveOrUpdate(sofaTextMentionConcept);
		return sofaTextMentionConcept;
	}


	@Override
	public Set<SofaText> getSofaTextByDocument(SofaDocument sofaDocument) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(
                SofaText.class);
        crit.add(Restrictions.eq("sofaDocument", sofaDocument));
        return new HashSet<SofaText>(crit.list());
	}

	@Override
	public List<SofaDocument> getAllSofaDocuments() {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(
                SofaDocument.class);
		
		return (List<SofaDocument>) crit.list();
	}
	
	/**
	 * this method is a hack because I couldn't quickly figure out how to get hibernate to do this for me.  it eagerly queries all
	 * fields required to fully populate a SofaDocument.
	 */
	public SofaDocument getSofaDocumentById(int sofaDocumentId)
	{
		Session session = sessionFactory.openSession();
		SofaDocument sofaDocument = (SofaDocument) session.get(SofaDocument.class, sofaDocumentId);
		Hibernate.initialize(sofaDocument);


		return sofaDocument;
	}
	
	private Set<SofaTextMention> getSofaTextMentionsBySofaText(SofaText sofaText)
	{
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(
                SofaTextMention.class);
        crit.add(Restrictions.eq("sofaText", sofaText));
        
        return new HashSet<SofaTextMention>(crit.list());
	}
	
	private Set<SofaTextMentionConcept> getSofaTextMentionConceptsByMention(SofaTextMention sofaTextMention)
	{
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(
                SofaTextMentionConcept.class);
        crit.add(Restrictions.eq("sofaTextMention", sofaTextMention));
        
        return new HashSet<SofaTextMentionConcept>(crit.list());
	}

	@Override
	public List<SofaDocument> getSofaDocumentsByPatient(Patient patient) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(
                SofaDocument.class);
		crit.add(Restrictions.eq("patient", patient));
		
		return (List<SofaDocument>) crit.list();
	}
	
	@Override
	public void truncateNLPTables()
	{
		Session s = sessionFactory.getCurrentSession();
		
		List<SofaDocument> sds = getAllSofaDocuments();
		
		System.out.println("About to Delete");
		//s.delete(sds);
		for(SofaDocument sd : sds)
			s.delete(sd);
		System.out.println("Deleted!");
		/*
		//Truncate Table sometimes hangs, disabling foreign keys momentarily seems to solve this
		s.createSQLQuery("SET FOREIGN_KEY_CHECKS = 0;");
		System.out.println("in Truncate Tables");
		s.createSQLQuery("truncate table sofatext_mention_concept").executeUpdate();
		System.out.println("a");
		s.createSQLQuery("truncate table sofatext_mention").executeUpdate();
		s.createSQLQuery("truncate table sofatext").executeUpdate();
		System.out.println("b");
		s.createSQLQuery("truncate table sofa_document").executeUpdate();
		System.out.println("c");
		s.createSQLQuery("SET FOREIGN_KEY_CHECKS = 1;");
		s.flush();
		*/
		return;
	}

}
