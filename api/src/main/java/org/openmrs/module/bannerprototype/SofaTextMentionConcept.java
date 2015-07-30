package org.openmrs.module.bannerprototype;

import java.io.Serializable;

import org.openmrs.BaseOpenmrsObject;
import org.openmrs.Concept;
import org.openmrs.ConceptName;
import org.openmrs.api.context.Context;

public class SofaTextMentionConcept extends BaseOpenmrsObject implements
		Serializable {
	private int sofaTextMentionConceptId;
	private SofaTextMention sofaTextMention;
	private int conceptId;
	private Concept concept;
	private String conceptName = "uninitialized";
	private String uuid;

	public SofaTextMentionConcept()
	{
		//Default Constructor
	}
	
	public SofaTextMentionConcept(SofaTextMention sofaTextMention, Concept c) {
		this.sofaTextMention = sofaTextMention;
		
		setConcept(c);
		
		
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
	 * @return the sofaTextMentionConceptId
	 */
	public int getSofaTextMentionConceptId() {
		return sofaTextMentionConceptId;
	}

	/**
	 * @param sofaTextMentionConceptId the sofaTextMentionConceptId to set
	 */
	public void setSofaTextMentionConceptId(int sofaTextMentionConceptId) {
		this.sofaTextMentionConceptId = sofaTextMentionConceptId;
	}


	/**
	 * @return the conceptId
	 */
	public int getConceptId() {
		return conceptId;
	}

	/**
	 * @param conceptId the conceptId to set
	 */
	public void setConceptId(int conceptId) {
		this.conceptId = conceptId;
	}


	/**
	 * @return the concept
	 */
	public Concept getConcept() {
		return concept;
	}

	/**
	 * @param concept the concept to set
	 */
	public void setConcept(Concept concept) {
		this.concept = concept;
		
		ConceptName cn = Context.getConceptService().getConceptName(concept.getId());
		
		if(cn != null)
			setConceptName(cn.getName());
		else
			setConceptName("|unknown|");
	}

	/**
	 * @return the sofaTextMention
	 */
	public SofaTextMention getSofaTextMention() {
		return sofaTextMention;
	}

	/**
	 * @param sofaTextMention the sofaTextMention to set
	 */
	public void setSofaTextMention(SofaTextMention sofaTextMention) {
		this.sofaTextMention = sofaTextMention;
	}

	/**
	 * @return the conceptName
	 */
	public String getConceptName() {
		return conceptName;
	}

	/**
	 * @param conceptName the conceptName to set
	 */
	public void setConceptName(String conceptName) {
		this.conceptName = conceptName;
	}

}
