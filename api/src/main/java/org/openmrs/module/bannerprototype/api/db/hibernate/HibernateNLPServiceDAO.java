package org.openmrs.module.bannerprototype.api.db.hibernate;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.DateType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.openmrs.Concept;
import org.openmrs.ConceptName;
import org.openmrs.Encounter;
import org.openmrs.Obs;
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
import org.openmrs.module.bannerprototype.wordcloud.Word;
import org.openmrs.module.bannerprototype.wordcloud.WordCloud;

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
		
		// SofaDocument sofaDocument = (SofaDocument)
		// session.get(SofaDocument.class, sofaDocumentId);
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
		
		sb.append("select stm.uuid as mentionUuid, stm.mention_text as mentionText,");
		sb.append(" stm.mention_type as mentionType, sd.uuid as dateUuid, sd.patient_id as patientId,");
		sb.append(" sd.date_created as dateCreated,");
		sb.append(" p.name as provider, l.name as location, cn.name as diagnosis");
		sb.append(" from sofatext_mention stm");
		sb.append(" INNER JOIN sofatext st");
		sb.append(" ON stm.sofatext_id = st.sofatext_id");
		sb.append(" INNER JOIN sofa_document sd");
		sb.append(" ON st.sofa_document_id = sd.sofa_document_id");
		sb.append(" INNER JOIN encounter e");
		sb.append(" ON sd.encounter_id = e.encounter_id");
		sb.append(" INNER JOIN encounter_provider ep");
		sb.append(" ON e.encounter_id = ep.encounter_id");
		sb.append(" INNER JOIN provider p");
		sb.append(" ON ep.provider_id = p.provider_id");
		sb.append(" INNER JOIN location l");
		sb.append(" ON e.location_id = l.location_id");
		sb.append(" INNER JOIN obs o");
		sb.append(" ON e.encounter_id = o.encounter_id");
		sb.append(" INNER JOIN concept_name cn");
		sb.append(" ON o.value_coded = cn.concept_id");
		sb.append(" and o.value_coded_name_id = cn.concept_name_id");
		sb.append(" WHERE stm.uuid = :uuid");
		sb.append(" and o.concept_id = 1284 ");
		
		String query = sb.toString();
		
		Object[] result = (Object[]) sessionFactory.getCurrentSession().createSQLQuery(query)
		        .addScalar("mentionUuid", new StringType()).addScalar("mentionText", new StringType())
		        .addScalar("mentionType", new StringType()).addScalar("dateUuid", new StringType())
		        .addScalar("patientId", new IntegerType()).addScalar("dateCreated", new DateType())
		        .addScalar("provider", new StringType()).addScalar("location", new StringType())
		        .addScalar("diagnosis", new StringType()).setParameter("uuid", uuid).uniqueResult();
		
		String uuidDate = result[3].toString();
		Date dateCr = null;
		try {
			dateCr = new SimpleDateFormat("yyyy-MM-dd").parse(result[5].toString());
		}
		catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		String provider, location, diagnosis;
		if (result[6] != null)
			provider = result[6].toString();
		else
			provider = "";
		if (result[7] != null)
			location = result[7].toString();
		else
			location = "";
		if (result[8] != null)
			diagnosis = result[8].toString();
		else
			diagnosis = "";
		
		SofaDocumentUI sdUI = new SofaDocumentUI(uuidDate, dateCr, provider, location, diagnosis);
		
		List<SofaDocumentUI> dateList = new ArrayList<SofaDocumentUI>();
		dateList.add(sdUI);
		
		String textMention = result[1].toString().toLowerCase();
		String typeMention = result[2].toString();
		SofaTextMentionUI stmUI = new SofaTextMentionUI(textMention, typeMention, dateList);
		
		return stmUI;
		
	}
	
	public SofaDocumentUI getSofaDocumentUIBySofaDocUuid(String sofaDocUuid) {
		
		StringBuffer sb = new StringBuffer();
		
		sb.append("select sd.uuid as dateUuid, sd.patient_id as patientId, ");
		sb.append(" sd.date_created as dateCreated, sd.encounter_id as encounterId");
		sb.append(" from sofa_document sd");
		sb.append(" WHERE sd.uuid = :sofaDocUuid ");
		
		String sqlQuery = sb.toString();
		
		Object[] result = (Object[]) sessionFactory.getCurrentSession().createSQLQuery(sqlQuery)
		        .addScalar("dateUuid", new StringType()).addScalar("patientId", new IntegerType())
		        .addScalar("dateCreated", new DateType()).addScalar("encounterId", new IntegerType())
		        .setParameter("sofaDocUuid", sofaDocUuid).uniqueResult();
		
		SofaDocumentUI sdUI = null;
		
		String uuidDate = result[0].toString();
		SofaDocument sd = getSofaDocumentByUuid(uuidDate);
		
		List<SofaTextMention> problemMentions = sd.getProblemMentions();
		WordCloud problemCloud = new WordCloud();
		for (SofaTextMention m : problemMentions) {
			problemCloud.addWord(m.getMentionText().toLowerCase(), m.getMentionType());
		}
		List<Word> problemWordList = problemCloud.getAllWords();
		
		List<SofaTextMention> treatmentMentions = sd.getTreatmentMentions();
		WordCloud treatmentCloud = new WordCloud();
		for (SofaTextMention m : treatmentMentions) {
			treatmentCloud.addWord(m.getMentionText().toLowerCase(), m.getMentionType());
		}
		List<Word> treatmentWordList = treatmentCloud.getAllWords();
		
		List<SofaTextMention> testMentions = sd.getTestMentions();
		WordCloud testCloud = new WordCloud();
		for (SofaTextMention m : testMentions) {
			testCloud.addWord(m.getMentionText().toLowerCase(), m.getMentionType());
		}
		List<Word> testWordList = testCloud.getAllWords();
		
		Date dateCr = null;
		try {
			dateCr = new SimpleDateFormat("yyyy-MM-dd").parse(result[2].toString());
		}
		catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String provider = "";
		String location = "";
		String diagnosis = "";
		if (result[3] != null) {
			int encounterID = (Integer) result[3];
			Encounter e = Context.getEncounterService().getEncounter(encounterID);
			provider = e.getProvider().getGivenName() + " " + e.getProvider().getFamilyName();
			location = e.getLocation().getName();
			Set<Obs> obs = e.getAllObs();
			
			Concept c1 = Context.getConceptService().getConcept(1284); //coded diagnosis
			Concept c2 = Context.getConceptService().getConcept(161602); //non coded diagnosis
			
			for (Obs o : obs) {
				Concept obs_concept = o.getConcept();
				
				//if the concept associated with the observation is a diagnosis Concept, proceed
				if ((obs_concept.equals(c2)) && (!o.getValueText().equals(""))) {
					// extract diagnosis
					diagnosis = o.getValueText();
				}
				if (obs_concept.equals(c1)) {
					Concept valueCoded = o.getValueCoded();
					ConceptName valueCodedName = o.getValueCodedName();
					diagnosis = valueCodedName.toString();
				}
			}
		}
		
		sdUI = new SofaDocumentUI(uuidDate, dateCr, provider, location, diagnosis);
		sdUI.setProblemWordList(problemWordList);
		sdUI.setTreatmentWordList(treatmentWordList);
		sdUI.setTestWordList(testWordList);
		
		return sdUI;
	}
	
	public List<SofaTextMentionUI> getSofaTextMentionUIsByConstraints(Patient patient, Date startDate, Date endDate,
	        String[] searchTerms) {
		
		StringBuffer sb = new StringBuffer();
		
		sb.append("select stm.mention_text as mentionText, stm.mention_type as mentionType,");
		sb.append(" sd.uuid as dateUuid, sd.patient_id as patientId, sd.date_created as dateCreated,");
		sb.append(" sd.encounter_id as encounterId");
		sb.append(" from sofatext_mention stm");
		sb.append(" INNER JOIN sofatext st");
		sb.append(" ON stm.sofatext_id = st.sofatext_id");
		sb.append(" INNER JOIN sofa_document sd");
		sb.append(" ON st.sofa_document_id = sd.sofa_document_id");
		sb.append(" WHERE sd.patient_id = :patient ");
		if (startDate != null) {
			sb.append(" and sd.date_created >= :startDate ");
		}
		if (endDate != null) {
			sb.append(" and sd.date_created <= :endDate ");
		}
		sb.append(" and stm.mention_text in :searchTerms");
		sb.append(" ORDER by stm.mention_type, stm.mention_text, sd.date_created");
		
		String sqlQuery = sb.toString();
		
		Query query = sessionFactory.getCurrentSession().createSQLQuery(sqlQuery).addScalar("mentionText", new StringType())
		        .addScalar("mentionType", new StringType()).addScalar("dateUuid", new StringType())
		        .addScalar("patientId", new IntegerType()).addScalar("dateCreated", new DateType())
		        .addScalar("encounterId", new IntegerType()).setParameter("startDate", startDate)
		        .setParameter("endDate", endDate).setParameter("patient", patient);
		
		query.setParameterList("searchTerms", searchTerms);
		
		List results = query.list();
		
		int index = 0;
		SofaTextMentionUI prevStmUI = null;
		List<SofaTextMentionUI> stmUIList = new ArrayList<SofaTextMentionUI>();
		for (Object obj : results) {
			
			Object[] result = (Object[]) obj;
			String textMention = result[0].toString().toLowerCase();
			String typeMention = result[1].toString();
			
			String uuidDate = result[2].toString();
			
			Date dateCr = null;
			try {
				dateCr = new SimpleDateFormat("yyyy-MM-dd").parse(result[4].toString());
			}
			catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			String provider = "";
			String location = "";
			String diagnosis = "";
			if (result[5] != null) {
				int encounterID = (Integer) result[5];
				Encounter e = Context.getEncounterService().getEncounter(encounterID);
				provider = e.getProvider().getGivenName() + " " + e.getProvider().getFamilyName();
				location = e.getLocation().getName();
				
				Set<Obs> obs = e.getAllObs();
				
				Concept c1 = Context.getConceptService().getConcept(1284); //coded diagnosis
				Concept c2 = Context.getConceptService().getConcept(161602); //non coded diagnosis
				
				for (Obs o : obs) {
					Concept obs_concept = o.getConcept();
					
					//if the concept associated with the observation is a diagnosis Concept, proceed
					if ((obs_concept.equals(c2)) && (!o.getValueText().equals(""))) {
						// extract diagnosis
						diagnosis = o.getValueText();
					}
					if (obs_concept.equals(c1)) {
						Concept valueCoded = o.getValueCoded();
						ConceptName valueCodedName = o.getValueCodedName();
						diagnosis = valueCodedName.toString();
					}
				}
			}
			
			SofaDocumentUI sdUI = new SofaDocumentUI(uuidDate, dateCr, provider, location, diagnosis);
			
			if ((index == 0) || !(prevStmUI.getMentionText().equals(textMention))) {
				if (index > 0)
					stmUIList.add(prevStmUI);
				
				List<SofaDocumentUI> dateList = new ArrayList<SofaDocumentUI>();
				dateList.add(sdUI);
				
				SofaTextMentionUI stmUI = new SofaTextMentionUI(textMention, typeMention, dateList);
				prevStmUI = stmUI;
			} else {
				prevStmUI.addDate(sdUI);
			}
			index++;
		}
		stmUIList.add(prevStmUI);
		
		return stmUIList;
	}
	
	public List<SofaDocumentUI> getSofaDocumentUIsByConstraints(Patient patient, Date startDate, Date endDate,
	        String[] searchTerms) {
		
		StringBuffer sb = new StringBuffer();
		
		sb.append("select distinct sd.uuid as dateUuid, sd.patient_id as patientId,");
		sb.append(" sd.date_created as dateCreated, sd.encounter_id as encounterId");
		sb.append(" from sofatext_mention stm");
		sb.append(" INNER JOIN sofatext st");
		sb.append(" ON stm.sofatext_id = st.sofatext_id");
		sb.append(" INNER JOIN sofa_document sd");
		sb.append(" ON st.sofa_document_id = sd.sofa_document_id");
		sb.append(" WHERE sd.patient_id = :patient ");
		if (startDate != null) {
			sb.append(" and sd.date_created >= :startDate ");
		}
		if (endDate != null) {
			sb.append(" and sd.date_created <= :endDate ");
		}
		sb.append(" and stm.mention_text in :searchTerms");
		sb.append(" ORDER by sd.date_created");
		
		String sqlQuery = sb.toString();
		
		Query query = sessionFactory.getCurrentSession().createSQLQuery(sqlQuery).addScalar("dateUuid", new StringType())
		        .addScalar("patientId", new IntegerType()).addScalar("dateCreated", new DateType())
		        .addScalar("encounterId", new IntegerType()).setParameter("startDate", startDate)
		        .setParameter("endDate", endDate).setParameter("patient", patient);
		
		query.setParameterList("searchTerms", searchTerms);
		
		List results = query.list();
		
		List<SofaDocumentUI> dateList = new ArrayList<SofaDocumentUI>();
		
		for (Object obj : results) {
			
			Object[] result = (Object[]) obj;
			
			String uuidDate = result[0].toString();
			SofaDocument sd = getSofaDocumentByUuid(uuidDate);
			
			List<SofaTextMention> problemMentions = sd.getProblemMentions();
			WordCloud problemCloud = new WordCloud();
			for (SofaTextMention m : problemMentions)
				problemCloud.addWord(m.getMentionText().toLowerCase(), m.getMentionType());
			List<Word> problemWordList = problemCloud.getAllWords();
			
			List<SofaTextMention> treatmentMentions = sd.getTreatmentMentions();
			WordCloud treatmentCloud = new WordCloud();
			for (SofaTextMention m : treatmentMentions)
				treatmentCloud.addWord(m.getMentionText().toLowerCase(), m.getMentionType());
			List<Word> treatmentWordList = treatmentCloud.getAllWords();
			
			List<SofaTextMention> testMentions = sd.getTestMentions();
			WordCloud testCloud = new WordCloud();
			for (SofaTextMention m : testMentions)
				testCloud.addWord(m.getMentionText().toLowerCase(), m.getMentionType());
			List<Word> testWordList = testCloud.getAllWords();
			
			Date dateCr = null;
			try {
				dateCr = new SimpleDateFormat("yyyy-MM-dd").parse(result[2].toString());
			}
			catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			String provider = "";
			String location = "";
			String diagnosis = "";
			if (result[3] != null) {
				int encounterID = (Integer) result[3];
				Encounter e = Context.getEncounterService().getEncounter(encounterID);
				provider = e.getProvider().getGivenName() + " " + e.getProvider().getFamilyName();
				location = e.getLocation().getName();
				
				Set<Obs> obs = e.getAllObs();
				
				Concept c1 = Context.getConceptService().getConcept(1284); //coded diagnosis
				Concept c2 = Context.getConceptService().getConcept(161602); //non coded diagnosis
				
				for (Obs o : obs) {
					Concept obs_concept = o.getConcept();
					
					//if the concept associated with the observation is a diagnosis Concept, proceed
					if ((obs_concept.equals(c2)) && (!o.getValueText().equals(""))) {
						// extract diagnosis
						diagnosis = o.getValueText();
					}
					if (obs_concept.equals(c1)) {
						Concept valueCoded = o.getValueCoded();
						ConceptName valueCodedName = o.getValueCodedName();
						diagnosis = valueCodedName.toString();
					}
				}
			}
			
			SofaDocumentUI sdUI = new SofaDocumentUI(uuidDate, dateCr, provider, location, diagnosis);
			sdUI.setProblemWordList(problemWordList);
			sdUI.setTreatmentWordList(treatmentWordList);
			sdUI.setTestWordList(testWordList);
			
			dateList.add(sdUI);
			
		}
		
		return dateList;
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
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(endDate); //endDate shows 00:00:00 so incrementing by a day
		cal.add(Calendar.DATE, 1);
		Date newEndDate = cal.getTime();
		
		crit.add(Restrictions.eq("patient", patient));
		crit.add(Restrictions.ge("dateCreated", startDate));
		crit.add(Restrictions.le("dateCreated", newEndDate));
		
		return (List<SofaDocument>) crit.list();
	}
	
	@Override
	public List<SofaDocument> getSofaDocumentsByConstraints(Patient patient, Date startDate, Date endDate, String searchTerm) {
		
		StringBuffer sb = new StringBuffer();
		
		sb.append("select sd.sofa_document_id as sofaDocumentID");
		sb.append(" from sofatext_mention stm");
		sb.append(" INNER JOIN sofatext st");
		sb.append(" ON stm.sofatext_id = st.sofatext_id");
		sb.append(" INNER JOIN sofa_document sd");
		sb.append(" ON st.sofa_document_id = sd.sofa_document_id");
		sb.append(" WHERE sd.date_created >= :startDate and sd.date_created <= :endDate");
		sb.append(" and sd.patient_id = :patient and ");
		sb.append(" stm.mention_text = :searchTerm");
		
		String sqlQuery = sb.toString();
		
		Query query = sessionFactory.getCurrentSession().createSQLQuery(sqlQuery)
		        .addScalar("sofaDocumentID", new IntegerType()).setParameter("startDate", startDate)
		        .setParameter("endDate", endDate).setParameter("patient", patient).setParameter("searchTerm", searchTerm);
		
		List<SofaDocument> sofadocs = new ArrayList<SofaDocument>();
		
		List results = query.list();
		for (Object obj : results) {
			
			int sdId = (Integer) obj;
			//Object[] result = (Object[]) obj;
			//int sdId = Integer.parseInt(result[0].toString());
			SofaDocument sd = getSofaDocumentById(sdId);
			sofadocs.add(sd);
		}
		return sofadocs;
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
