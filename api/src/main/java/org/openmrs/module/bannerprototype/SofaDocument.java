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

public class SofaDocument extends BaseOpenmrsObject implements Serializable {
	private int sofaDocumentId;
	private Encounter encounter;
	private Patient patient;
	private Date dateCreated;
	private String text;
	private String annotatedHTML;
	private String uuid;
	private Set<SofaText> sofaText = new HashSet<SofaText>();
	
	public SofaDocument()
	{
		setDateCreated(new Date());
	}
	
	@Override
	public Integer getId() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setId(Integer arg0) {
		// TODO Auto-generated method stub

	}

	/**
	 * @return the sofaDocumentId
	 */
	public int getSofaDocumentId() {
		return sofaDocumentId;
	}
	
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

	public List<SofaTextMention> getProblems()
	{
		List<SofaTextMention> problems = new ArrayList<SofaTextMention>();
		
		for(SofaText st : sofaText)
		{
			problems.addAll(st.getProblems());
		}
		
		return problems;
				
	}
	public List<SofaTextMention> getTests()
	{
		List<SofaTextMention> tests = new ArrayList<SofaTextMention>();
		
		for(SofaText st : sofaText)
		{
			tests.addAll(st.getTests());
		}
		
		return tests;
	}
	public List<SofaTextMention> getTreatments()
	{
		List<SofaTextMention> treatments = new ArrayList<SofaTextMention>();
		
		for(SofaText st : sofaText)
		{
			treatments.addAll(st.getTreatments());
		}
		
		return treatments;
	}

}
