package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.BaseOpenmrsObject;
import org.openmrs.Concept;

import banner.tagging.Mention;

/**
 * This class carries information about annotations for specific SofaText objects
 * 
 * @author ryaneshleman
 */
public class SofaTextMention extends BaseOpenmrsData implements Serializable, Comparable {
	
	private int sofaTextMentionId;
	
	private SofaText sofaText;
	
	private String mentionText;
	
	private int mentionStart;
	
	private int mentionEnd;
	
	private String mentionType;
	
	private String uuid;
	
	private Set<SofaTextMentionConcept> sofaTextMentionConcept = new HashSet<SofaTextMentionConcept>();
	
	public SofaTextMention() {
		//Default Constructor
	}
	
	/**
	 * constructor,the provided list of OpenMRS concepts will be converted to a list of
	 * SofaTextMentionConcept objects, There may be several OpenMRS concepts associated with one
	 * mention due to overlapping concept names, instead of forcing the the algorithm to choose one
	 * concept we record them all , Note: banner.tagging.mention m is an object returned from the
	 * BANNER tagging library after tagging a text
	 * 
	 * @param sofaText
	 * @param m
	 * @param concepts
	 */
	public SofaTextMention(SofaText sofaText, Mention m, List<Concept> concepts) {
		this.sofaText = sofaText;
		this.mentionText = m.getText();
		this.mentionStart = m.getStart();
		this.mentionEnd = m.getEnd();
		this.mentionType = m.getType().getText();
		
		for (Concept c : concepts) {
			sofaTextMentionConcept.add(new SofaTextMentionConcept(this, c));
		}
		
	}
	
	/**
	 * unique identifier for this SofaTextMention object
	 * 
	 * @return the sofaTextMentionId
	 */
	public int getSofaTextMentionId() {
		return sofaTextMentionId;
	}
	
	/**
	 * @param sofaTextMentionId the sofaTextMentionId to set
	 */
	public void setSofaTextMentionId(int sofaTextMentionId) {
		this.sofaTextMentionId = sofaTextMentionId;
	}
	
	/**
	 * return the text string associated with this mention, for example 'cirrhosis'
	 * 
	 * @return the mentionText
	 */
	public String getMentionText() {
		return mentionText;
	}
	
	/**
	 * @param mentionText the mentionText to set
	 */
	public void setMentionText(String mentionText) {
		this.mentionText = mentionText;
	}
	
	/**
	 * returns the index into the SofaText where the mention starts index of start of mention within
	 * SofaText
	 * 
	 * @return the mentionStart
	 */
	public int getMentionStart() {
		return mentionStart;
	}
	
	/**
	 * set start index of mention
	 * 
	 * @param mentionStart the mentionStart to set
	 */
	public void setMentionStart(int mentionStart) {
		this.mentionStart = mentionStart;
	}
	
	/**
	 * returns the index into the SofaTExt where the mentions ends
	 * 
	 * @return the mentionEnd
	 */
	public int getMentionEnd() {
		return mentionEnd;
	}
	
	/**
	 * @param mentionEnd the mentionEnd to set
	 */
	public void setMentionEnd(int mentionEnd) {
		this.mentionEnd = mentionEnd;
	}
	
	/**
	 * returns the mention type as a string, for example "problem"
	 * 
	 * @return the mentionType
	 */
	public String getMentionType() {
		return mentionType;
	}
	
	/**
	 * @param mentionType the mentionType to set
	 */
	public void setMentionType(String mentionType) {
		this.mentionType = mentionType;
	}
	
	/**
	 * returns the children SofaTextMentionConcept objects associated with the SofaTextMention
	 * object, it may be an empty set.
	 * 
	 * @return the sofaTextMentionConcept
	 */
	public Set<SofaTextMentionConcept> getSofaTextMentionConcept() {
		return sofaTextMentionConcept;
	}
	
	/**
	 * @param sofaTextMentionConcept the sofaTextMentionConcept to set
	 */
	public void setSofaTextMentionConcept(Set<SofaTextMentionConcept> sofaTextMentionConcept) {
		this.sofaTextMentionConcept = sofaTextMentionConcept;
	}
	
	/**
	 * returns the parent SofaText for this object
	 * 
	 * @return the sofaText
	 */
	public SofaText getSofaText() {
		return sofaText;
	}
	
	/**
	 * @param sofaText the sofaText to set
	 */
	public void setSofaText(SofaText sofaText) {
		this.sofaText = sofaText;
	}
	
	/**
	 * helper method that returns the OpenMRS Concept objects associated with this SofaTextMention
	 * by extracting them from the SofaTextMentionConcept objects, Concepts are identified during
	 * the first String matching phase of the NER algorithm in DocumentTagger.tag()
	 * 
	 * @return
	 */
	public List<Concept> getConcepts() {
		List<Concept> concepts = new ArrayList<Concept>();
		for (SofaTextMentionConcept c : sofaTextMentionConcept)
			concepts.add(c.getConcept());
		
		return concepts;
	}
	
	/**
	 * Add list of associated OpenMRS Concept objects associated with this SofaTextMention, these
	 * Concepts are identified during the first String matching phase of the NER algorithm in
	 * DocumentTagger.tag()
	 * 
	 * @param concepts
	 */
	public void addConcepts(List<Concept> concepts) {
		for (Concept c : concepts) {
			
			sofaTextMentionConcept.add(new SofaTextMentionConcept(this, c));
		}
	}
	
	/**
	 * returns sofaTextMentionId value, this method is required to implement BaseOpenmrsObject
	 */
	@Override
	public Integer getId() {
		// TODO Auto-generated method stub
		return sofaTextMentionId;
	}
	
	@Override
	public void setId(Integer id) {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public int compareTo(Object stm) {
		return this.getMentionStart() - ((SofaTextMention) stm).getMentionStart();
	}
	
	/**
	 * uuid is a unique identifier for the SofaTextMention
	 * 
	 * @return the uuid
	 */
	public String getUuid() {
		return uuid;
	}
	
	/**
	 * @param uuid the uuid to set
	 */
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
}
