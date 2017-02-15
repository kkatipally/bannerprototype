package org.openmrs.module.bannerprototype;

import java.io.Serializable;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.BaseOpenmrsObject;
import org.openmrs.Concept;
import org.openmrs.ConceptName;
import org.openmrs.api.context.Context;

/**
 * Class references an OpenMRS concept that is associated with a SofaTextMention
 * 
 * @author ryaneshleman
 */
public class SofaTextMentionConcept extends BaseOpenmrsData implements Serializable {
	
	private int sofaTextMentionConceptId;
	
	private SofaTextMention sofaTextMention;
	
	private int conceptId;
	
	private Concept concept;
	
	private String conceptName = "uninitialized";
	
	private String uuid;
	
	public SofaTextMentionConcept() {
		//Default Constructor
	}
	
	/**
	 * @param sofaTextMention parent in data hierarchy
	 * @param c
	 */
	public SofaTextMentionConcept(SofaTextMention sofaTextMention, Concept c) {
		this.sofaTextMention = sofaTextMention;
		
		setConcept(c);
		
	}
	
	/**
	 * returns sofaTExtMentionConceptId value, required to implement BaseOpenmrsObject
	 */
	@Override
	public Integer getId() {
		// TODO Auto-generated method stub
		return sofaTextMentionConceptId;
	}
	
	@Override
	public void setId(Integer arg0) {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * unique identifier for this object
	 * 
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
	 * returns the id associated with the OpenMRS Concept contained in this object
	 * 
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
	 * returns the OpenMRS concept associated with this object
	 * 
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
		
		//DocumentTagger performs NER and returns a populated SofaDocument obj
		
		ConceptName cn = Context.getConceptService().getConceptName(concept.getId());
		
		if (cn != null)
			setConceptName(cn.getName());
		else
			setConceptName("|unknown|");
	}
	
	/**
	 * get the parent SofaTextMention
	 * 
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
	 * get the name of the concept, for example "tuberculosis"
	 * 
	 * @return the conceptName
	 */
	public String getConceptName() {
		return conceptName;
	}
	
	/**
	 * set the concept Name
	 * 
	 * @param conceptName the conceptName to set
	 */
	public void setConceptName(String conceptName) {
		this.conceptName = conceptName;
	}
	
}
