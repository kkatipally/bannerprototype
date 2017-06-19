package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.BaseOpenmrsObject;
import org.openmrs.Concept;
import org.openmrs.Encounter;

import banner.tagging.Mention;

/**
 * This class holds sentence level annotations contained in the SofaDocument
 * 
 * @author ryaneshleman
 */
public class SofaText extends BaseOpenmrsData implements Serializable, Comparable {
	
	private int sofaTextId;
	
	private Encounter encounter;
	
	private SofaDocument sofaDocument;
	
	private int textStart;
	
	private int textEnd;
	
	private String text;
	
	private String uuid;
	
	private Set<SofaTextMention> sofaTextMention = Collections.synchronizedSet(new HashSet<SofaTextMention>());
	
	/**
	 * Default Constructor
	 */
	public SofaText() {
	}
	
	public SofaText(String text) {
		this.text = text;
	}
	
	public SofaText(String text, int textStart, int textEnd) {
		this.text = text;
		this.textStart = textStart;
		this.textEnd = textEnd;
	}
	
	/**
	 * This method adds a new Mention and associated concepts to a SofaText, there can be overlap
	 * between concept names and multiple concepts can match a string, instead of choosing one
	 * concept, we record them all.
	 * 
	 * @param m
	 * @param concepts
	 */
	public void addMentionAndConcepts(Mention m, List<Concept> concepts) {
		//System.out.println("Mention Text: " + m.getText());
		ArrayList<SofaTextMention> toRemove = new ArrayList<SofaTextMention>();
		
		//check all SofaTextMentions
		for (SofaTextMention stm : sofaTextMention) {
			
			//if new mention is subsumed by existing mention, add associated concepts to subsuming mention
			//and then return
			
			//test for overlap
			if (isOverlapping(stm, m)) {// there is overlap, keep the larger of the two mentions
			
				if (stm.getMentionEnd() - stm.getMentionStart() < m.getEnd() - m.getStart())// mention is larger
				{
					System.out.println("1");
					concepts.addAll(stm.getConcepts());
					toRemove.add(stm);
				} else {
					System.out.println("2");
					stm.addConcepts(concepts);
					return;
				}
				
			}
			
		}
		// remove mentions from remove list
		sofaTextMention.removeAll(toRemove);
		// add new mention to sofatext
		sofaTextMention.add(new SofaTextMention(this, m, concepts));
		
	}
	
	private boolean isOverlapping(SofaTextMention stm, Mention m) {
		if (stm.getMentionStart() == m.getStart() //same start token
		        || stm.getMentionEnd() == m.getEnd() //same end token
		        || (stm.getMentionStart() <= m.getStart() && stm.getMentionEnd() >= m.getStart())
		        || (stm.getMentionStart() >= m.getStart() && stm.getMentionStart() <= m.getEnd())) {
			return true;
			
		}
		return false;
		
	}
	
	/**
	 * BANNER mentions have a lower priority so use this method to add a mention made by BANNER to a
	 * SofaText, it will not be added if the mention subsumes or is subsumed by a current mention
	 * 
	 * @param m
	 */
	public boolean addBannerMention(Mention m) {
		for (SofaTextMention stm : sofaTextMention) {
			if (isOverlapping(stm, m)) {
				return false;
			}
			
		}
		//add mention to SofaText
		sofaTextMention.add(new SofaTextMention(this, m, new ArrayList<Concept>()));
		return true;
		
	}
	
	/**
	 * returns the text string for this SofaText obj
	 * 
	 * @return the text
	 */
	public String getText() {
		return text;
	}
	
	/**
	 * sets teh text string for this SofaText obj
	 * 
	 * @param text the text to set
	 */
	public void setText(String text) {
		this.text = text;
	}
	
	/**
	 * returns the unique identifier for this SofaText object
	 * 
	 * @return the sofaTextId
	 */
	public int getSofaTextId() {
		return sofaTextId;
	}
	
	/**
	 * @param sofaTextId the sofaTextId to set
	 */
	public void setSofaTextId(int sofaTextId) {
		this.sofaTextId = sofaTextId;
	}
	
	/**
	 * Visit Notes are saved via the EncounterService.saveEncounter() method, the encounter field
	 * records the associated encounter.
	 * 
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
	 * returns the mentions found in this SofaText, there can be overlap between concept names and
	 * multiple concepts match a string, instead of choosing one, we record them all.
	 * 
	 * @return the sofaTextMention
	 */
	public Set<SofaTextMention> getSofaTextMention() {
		return sofaTextMention;
	}
	
	/**
	 * @param sofaTextMention the sofaTextMention to set
	 */
	public void setSofaTextMention(Set<SofaTextMention> sofaTextMention) {
		this.sofaTextMention = sofaTextMention;
	}
	
	/**
	 * returns the parent SofaDocument object for this SofaText
	 * 
	 * @return the sofaDocument
	 */
	public SofaDocument getSofaDocument() {
		return sofaDocument;
	}
	
	/**
	 * @param sofaDocument the sofaDocument to set
	 */
	public void setSofaDocument(SofaDocument sofaDocument) {
		this.sofaDocument = sofaDocument;
	}
	
	/**
	 * returns the index into the parent SofaDocument that the SofaText begins at
	 * 
	 * @return the textStart
	 */
	public int getTextStart() {
		return textStart;
	}
	
	/**
	 * @param textStart the textStart to set
	 */
	public void setTextStart(int textStart) {
		this.textStart = textStart;
	}
	
	/**
	 * returns the index into the parent SofaDocument that the SofaTExt ends at
	 * 
	 * @return the textEnd
	 */
	public int getTextEnd() {
		return textEnd;
	}
	
	/**
	 * @param textEnd the textEnd to set
	 */
	public void setTextEnd(int textEnd) {
		this.textEnd = textEnd;
	}
	
	/**
	 * Helper method to generate HTML. The html contains the text of the SofaText object with each
	 * mention wrapped in a span tag. Each mention in the SofaDocument is given a unique ID.
	 * startIndex is the ID for the first mention in this SofaText.
	 * 
	 * @param startIndex ID for the first mention in this SofaText
	 * @return
	 */
	public String getAnnotatedHTML(int startIndex) {
		String html = new String(text);
		String tagged;
		List<SofaTextMention> sofaTextMentionList = new ArrayList<SofaTextMention>();
		sofaTextMentionList.addAll(sofaTextMention);
		Collections.sort(sofaTextMentionList);
		
		for (SofaTextMention m : sofaTextMentionList) {
			tagged = wrapInMentionTypeTag(m.getMentionText(), m.getMentionType(), startIndex);
			
			if (!m.getSofaTextMentionConcept().isEmpty()) {
				tagged = wrapInConceptTag(tagged, m);
			}
			
			html = html.replace(m.getMentionText(), tagged);
			startIndex++;
		}
		return html;
	}
	
	private String wrapInConceptTag(String tagged, SofaTextMention m) {
		SofaTextMentionConcept c = (SofaTextMentionConcept) m.getSofaTextMentionConcept().toArray()[0];
		return String.format("<a href=/OPENMRS_CONTEXT_PATH/dictionary/concept.htm?conceptId=%d>%s</a>", c.getConcept()
		        .getConceptId(), tagged);
	}
	
	private String wrapInMentionTypeTag(String mentionText, String mentionType, int startIndex) {
		return String.format("<span id=\"visit-note-span-%d\" class=\"mention-type-%s\">%s</span>", startIndex, mentionType,
		    mentionText);
	}
	
	/**
	 * returns 0 if two SofaText objects start at the same index, otherwise returns the distance in
	 * characters between the start index of the two SofaTexts being compared. + if current SofaText
	 * is before text being compared
	 */
	@Override
	public int compareTo(Object st) {
		return this.textStart - ((SofaText) st).getTextStart();
	}
	
	/**
	 * returns all SofaTextMention objects with type "problem" in this SofaText object
	 * 
	 * @return
	 */
	public Collection<? extends SofaTextMention> getProblems() {
		List<SofaTextMention> problems = new ArrayList<SofaTextMention>();
		
		for (SofaTextMention stm : sofaTextMention) {
			if (stm.getMentionType().equals("problem"))
				problems.add(stm);
		}
		
		return problems;
	}
	
	/**
	 * returns all SofaTextMention objects with type "test" in this SofaText object
	 * 
	 * @return
	 */
	public Collection<? extends SofaTextMention> getTests() {
		List<SofaTextMention> tests = new ArrayList<SofaTextMention>();
		
		for (SofaTextMention stm : sofaTextMention) {
			if (stm.getMentionType().equals("test"))
				tests.add(stm);
		}
		
		return tests;
	}
	
	/**
	 * returns all SofaTextMention objects with type "treatment" in this SofaText object
	 * 
	 * @return
	 */
	public Collection<? extends SofaTextMention> getTreatments() {
		List<SofaTextMention> treatments = new ArrayList<SofaTextMention>();
		
		for (SofaTextMention stm : sofaTextMention) {
			if (stm.getMentionType().equals("treatment"))
				treatments.add(stm);
		}
		
		return treatments;
	}
	
	/**
	 * returns sofaTextId value, this method is required to implement BaseOpenmrsObject
	 */
	@Override
	public Integer getId() {
		return sofaTextId;
	}
	
	@Override
	public void setId(Integer id) {
		// TODO Auto-generated method stub
		
	}
	
}
