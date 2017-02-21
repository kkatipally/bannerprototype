package org.openmrs.module.bannerprototype.api.db.hibernate;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.DateType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.openmrs.Encounter;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaDocumentUI;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.module.bannerprototype.SofaTextMentionConcept;
import org.openmrs.module.bannerprototype.SofaTextMentionUI;
import org.openmrs.module.bannerprototype.api.NLPService;
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
	
	/**
	 * save SofaDocument as well as all children in the data hierarchy
	 */
	public SofaDocument saveSofaDocument(SofaDocument sofaDocument) {
		sessionFactory.getCurrentSession().flush();
		sessionFactory.getCurrentSession().saveOrUpdate(sofaDocument);
		for (SofaText st : sofaDocument.getSofaText())
			saveSofaText(st);
		
		return sofaDocument;
	}
	
	/**
	 * Save SofaText as well as all children SofaTextMention objects
	 */
	@Override
	public SofaText saveSofaText(SofaText sofaText) {
		
		Session s = sessionFactory.getCurrentSession();
		s.saveOrUpdate(sofaText);
		
		for (SofaTextMention stm : sofaText.getSofaTextMention()) {
			saveSofaTextMention(stm);
			
		}
		
		return sofaText;
	}
	
	@Override
	public SofaTextMention saveSofaTextMention(SofaTextMention sofaTextMention) {
		sessionFactory.getCurrentSession().saveOrUpdate(sofaTextMention);
		for (SofaTextMentionConcept stmc : sofaTextMention.getSofaTextMentionConcept()) {
			saveSofaTextMentionConcept(stmc);
		}
		
		return sofaTextMention;
	}
	
	@Override
	public SofaText getSofaText(int sofaTextId) {
		return (SofaText) sessionFactory.getCurrentSession().get(SofaText.class, sofaTextId);
		
	}
	
	@Override
	public Set<SofaText> getSofaTextsByEncounter(Encounter encounter) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaText.class);
		crit.add(Restrictions.eq("encounter", encounter));
		return (Set<SofaText>) crit.list();
	}
	
	@Override
	public SofaTextMentionConcept saveSofaTextMentionConcept(SofaTextMentionConcept sofaTextMentionConcept) {
		
		sessionFactory.getCurrentSession().saveOrUpdate(sofaTextMentionConcept);
		return sofaTextMentionConcept;
	}
	
	@Override
	public Set<SofaText> getSofaTextByDocument(SofaDocument sofaDocument) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaText.class);
		crit.add(Restrictions.eq("sofaDocument", sofaDocument));
		return new HashSet<SofaText>(crit.list());
	}
	
	@Override
	public List<SofaDocument> getAllSofaDocuments() {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaDocument.class);
		
		return (List<SofaDocument>) crit.list();
	}
	
	/**
	 * this method is a hack because I couldn't quickly figure out how to get hibernate to do this
	 * for me. it eagerly queries all fields required to fully populate a SofaDocument.
	 */
	public SofaDocument getSofaDocumentById(int sofaDocumentId) {
		
		//SofaDocument sofaDocument = (SofaDocument) session.get(SofaDocument.class, sofaDocumentId);
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaDocument.class);
		crit.add(Restrictions.eq("sofaDocumentId", sofaDocumentId));
		SofaDocument sofaDocument = (SofaDocument) crit.uniqueResult();
		
		Hibernate.initialize(sofaDocument);
		
		return sofaDocument;
	}
	
	/**
	 * this method is a hack because I couldn't quickly figure out how to get hibernate to do this
	 * for me. it eagerly queries all fields required to fully populate a SofaDocument.
	 */
	public SofaDocument getSofaDocumentByUuid(String uuid) {
		
		//SofaDocument sofaDocument = (SofaDocument) session.get(SofaDocument.class, sofaDocumentId);
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaDocument.class);
		crit.add(Restrictions.eq("uuid", uuid));
		SofaDocument sofaDocument = (SofaDocument) crit.uniqueResult();
		
		Hibernate.initialize(sofaDocument);
		
		return sofaDocument;
	}
	
	/**
	 * this method is a hack because I couldn't quickly figure out how to get hibernate to do this
	 * for me. it eagerly queries all fields required to fully populate a SofaDocument.
	 */
	public SofaTextMention getSofaTextMentionByUuid(String uuid) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaTextMention.class);
		crit.add(Restrictions.eq("uuid", uuid));
		
		SofaTextMention sofaTextMention = (SofaTextMention) crit.uniqueResult();
		
		Hibernate.initialize(sofaTextMention);
		
		return sofaTextMention;
	}
	
	public SofaTextMentionUI getSofaTextMentionUIByUuid(String uuid) {
		
		StringBuffer sb = new StringBuffer();
		
		/*sb.append("select uuid as mentionUuid, mention_text as mentionText");
		sb.append(" from sofatext_mention ");
		sb.append(" WHERE uuid = :uuid");*/
		
		sb.append("select stm.uuid as mentionUuid, stm.mention_text as mentionText,");
		sb.append(" stm.mention_type as mentionType, sd.uuid as dateUuid, sd.patient_id as patientId,");
		sb.append(" sd.date_created as dateCreated");
		sb.append(" from sofatext_mention stm");
		sb.append(" INNER JOIN sofatext st");
		sb.append(" ON stm.sofatext_id = st.sofatext_id");
		sb.append(" INNER JOIN sofa_document sd");
		sb.append(" ON st.sofa_document_id = sd.sofa_document_id");
		sb.append(" WHERE stm.uuid = :uuid");
		
		String query = sb.toString();
		
		Object[] result = (Object[]) sessionFactory.getCurrentSession().createSQLQuery(query)
		        .addScalar("mentionUuid", new StringType()).addScalar("mentionText", new StringType())
		        .addScalar("mentionType", new StringType()).addScalar("dateUuid", new StringType())
		        .addScalar("patientId", new IntegerType()).addScalar("dateCreated", new DateType())
		        .setParameter("uuid", uuid).uniqueResult();
		
		String uuidDate = result[3].toString();
		Date dateCr = null;
		try {
			dateCr = new SimpleDateFormat("yyyy-MM-dd").parse(result[5].toString());
		}
		catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		SofaDocumentUI sdUI = new SofaDocumentUI(uuidDate, dateCr);
		
		Set<SofaDocumentUI> dateList = new HashSet<SofaDocumentUI>();
		dateList.add(sdUI);
		
		String uuidMention = result[0].toString();
		String textMention = result[1].toString();
		String typeMention = result[2].toString();
		SofaTextMentionUI stmUI = new SofaTextMentionUI(uuidMention, textMention, typeMention, dateList);
		
		return stmUI;
		
	}
	
	private Set<SofaTextMention> getSofaTextMentionsBySofaText(SofaText sofaText) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaTextMention.class);
		crit.add(Restrictions.eq("sofaText", sofaText));
		
		return new HashSet<SofaTextMention>(crit.list());
	}
	
	private Set<SofaTextMentionConcept> getSofaTextMentionConceptsByMention(SofaTextMention sofaTextMention) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaTextMentionConcept.class);
		crit.add(Restrictions.eq("sofaTextMention", sofaTextMention));
		
		return new HashSet<SofaTextMentionConcept>(crit.list());
	}
	
	@Override
	public List<SofaDocument> getSofaDocumentsByPatient(Patient patient) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaDocument.class);
		crit.add(Restrictions.eq("patient", patient));
		
		return (List<SofaDocument>) crit.list();
	}
	
	@Override
	public List<SofaDocument> getSofaDocumentsByPatientAndDateRange(Patient patient, Date startDate, Date endDate) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(SofaDocument.class);
		crit.add(Restrictions.eq("patient", patient));
		crit.add(Restrictions.gt("dateCreated", startDate));
		crit.add(Restrictions.lt("dateCreated", endDate));
		
		return (List<SofaDocument>) crit.list();
	}
	
	@Override
	public void truncateNLPTables() {
		Session s = sessionFactory.getCurrentSession();
		
		List<SofaDocument> sds = getAllSofaDocuments();
		
		for (SofaDocument sd : sds)
			s.delete(sd);
		
		return;
	}
	
}
