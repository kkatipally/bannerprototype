package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openmrs.BaseOpenmrsObject;
import org.openmrs.Encounter;
import org.openmrs.Patient;

/**
 * This Class is the root of the SofaDocument data hierarchy.  This is the main data structure for the
 * NER analysis carried out by this module.  The hierarchy contains all text, sentences, annotations and concepts
 * for a tagged document.
 * 
 * Refer to the Developer's guide for more details on the data model.
 * @author ryaneshleman
 *
 */
public class SofaDocument extends BaseOpenmrsObject implements Serializable {
	private int sofaDocumentId;
	private Encounter encounter;
	private Patient patient;
	private Date dateCreated;
	private String text;
	private String annotatedHTML;
	private String uuid;
	private Set<SofaText> sofaText = new HashSet<SofaText>();
	
	/**
	 * Default constructor
	 */
	public SofaDocument()
	{
		setDateCreated(new Date());
	}
	/**
	 * This method is required to implement BaseOpenmrsObject, it returns the sofaDocumentId value
	 */
	@Override
	public Integer getId() {
		
		return sofaDocumentId;
	}

	@Override
	public void setId(Integer arg0) {
		// TODO Auto-generated method stub

	}

	/**
	 * sofaDocumentId is a unique identifier for the SofaDocument
	 * @return the sofaDocumentId
	 */
	public int getSofaDocumentId() {
		return sofaDocumentId;
	}
	
	/**
	 * add a SofaText object to the set of SofaText objects for this SofaDocument
	 * @param sofaText
	 * @return
	 */
	public SofaText addSofaText(SofaText sofaText)
	{
		this.sofaText.add(sofaText);
		return sofaText;
	}

	/**
	 * @param sofaDocumentId the sofaDocumentId to set
	 */
	public void setSofaDocumentId(int sofaDocumentId) {
		this.sofaDocumentId = sofaDocumentId;
	}

	/**
	 * Visit Notes are saved via the EncounterService.saveEncounter() method, the encounter field records the associated encounter. 
	 * @return the encounter
	 */
	public Encounter getEncounter() {
		return encounter;
	}

	/**
	 * @param encounter the encounter to set
	 */
	public void setEncounter(Encounter encounter) {
		this.encounter = encounter;
	}

	/**
	 * Get the text of the SofaDocument.
	 * @return the text
	 */
	public String getText() {
		return text;
	}

	/**
	 * @param text the text to set
	 */
	public void setText(String text) {
		this.text = text;
	}

	/**
	 * @return the sofaText
	 */
	public Set<SofaText> getSofaText() {
		return sofaText;
	}

	/**
	 * @param sofaText the sofaText to set
	 */
	public void setSofaText(Set<SofaText> sofaText) {
		this.sofaText = sofaText;
	}

	/**
	 * @return the dateCreated
	 */
	public Date getDateCreated() {
		return dateCreated;
	}

	/**
	 * @param dateCreated the dateCreated to set
	 */
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	/**
	 * Helper method to generate HTML for controller.  This method will be moved to the controller class in the
	 * @return the annotatedHTML
	 */
	public String getAnnotatedHTML() {
		return generateAnnotatedHTML();
	}
	
	private String generateAnnotatedHTML() {
		StringBuffer out = new StringBuffer();
		
		List<SofaText> sortedSofaTexts = new ArrayList<SofaText>(sofaText);
		Collections.sort(sortedSofaTexts);
		
		for(SofaText st : sortedSofaTexts)
		{	
			
			out.append(st.getAnnotatedHTML());
		}	
	
	return new String(out);
	}

	/**
	 * @return the patient
	 */
	public Patient getPatient() {
		return patient;
	}

	/**
	 * @param patient the patient to set
	 */
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	
	/**
	 * Returns all of the SofaTextMention objects with type 'problem' found in all the SofaText objects
	 * for this SofaDocument
	 * @return
	 */
	public List<SofaTextMention> getProblemMentions()
	{
		List<SofaTextMention> problems = new ArrayList<SofaTextMention>();
		
		for(SofaText st : sofaText)
		{
			problems.addAll(st.getProblems());
		}
		
		return problems;
				
	}
	/**
	 * Returns all of the SofaTextMention objects with type 'test' found in all the SofaText objects
	 * for this SofaDocument
	 * @return
	 */
	public List<SofaTextMention> getTestMentions()
	{
		List<SofaTextMention> tests = new ArrayList<SofaTextMention>();
		
		for(SofaText st : sofaText)
		{
			tests.addAll(st.getTests());
		}
		
		return tests;
	}
	/**
	 * Returns all of the SofaTextMention objects with type 'treatment' found in all the SofaText objects
	 * for this SofaDocument
	 * @return
	 */
	public List<SofaTextMention> getTreatmentMentions()
	{
		List<SofaTextMention> treatments = new ArrayList<SofaTextMention>();
		
		for(SofaText st : sofaText)
		{
			treatments.addAll(st.getTreatments());
		}
		
		return treatments;
	}
	/**
	 * Returns all of the SofaTextMention objects found in all the SofaText objects
	 * for this SofaDocument
	 * @return
	 */
	public List<SofaTextMention> getAllMentions() {
		List<SofaTextMention> mentions = new ArrayList<SofaTextMention>();
		
		mentions.addAll(getTreatmentMentions());
		mentions.addAll(getTestMentions());
		mentions.addAll(getProblemMentions());
		return mentions;
	}

}
