package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openmrs.BaseOpenmrsObject;
import org.openmrs.Concept;
import org.openmrs.Encounter;

import banner.tagging.Mention;

public class SofaText extends BaseOpenmrsObject implements Serializable,Comparable {
	private int sofaTextId;
	private Encounter encounter;
	private SofaDocument sofaDocument;
	private int textStart;
	private int textEnd;
	private String text;
	private String uuid;
	private Set<SofaTextMention> sofaTextMention = Collections.synchronizedSet(new HashSet<SofaTextMention>());

	
	public SofaText()
	{
	}
	
	public SofaText(String text)
	{
		this.text = text;
	}
	public SofaText(String text, int textStart, int textEnd)
	{
		this.text = text;
		this.textStart = textStart;
		this.textEnd = textEnd;
	}
	
	public void addMentionAndConcepts(Mention m, List<Concept> concepts)
	{
		//System.out.println("Mention Text: " + m.getText());
		ArrayList<SofaTextMention> toRemove = new ArrayList<SofaTextMention>();
		for(SofaTextMention stm : sofaTextMention)
		{
			//System.out.println("STM: " + stm.getMentionText());
			
			if(stm.getMentionText().toLowerCase().indexOf(m.getText().toLowerCase()) != -1)
			{	
				stm.addConcepts(concepts);
				return;
			}
			if(m.getText().toLowerCase().indexOf(stm.getMentionText().toLowerCase()) != -1)
			{	
				concepts.addAll(stm.getConcepts());
				//sofaTextMention.remove(stm);
				toRemove.add(stm);
				//System.out.println("removed");
			}
			
			
		}
		sofaTextMention.removeAll(toRemove);
		sofaTextMention.add(new SofaTextMention(this,m,concepts));
	}
	
	public void addBannerMention(Mention m) {
		for(SofaTextMention stm : sofaTextMention)
		{
			if(stm.getMentionText().toLowerCase().indexOf(m.getText().toLowerCase()) != -1)
			{	
				return;
			}

		}
		sofaTextMention.add(new SofaTextMention(this,m,new ArrayList<Concept>()));
		
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

	public String getAnnotatedHTML() {
		String html = new String(text);
		String tagged;
		for(SofaTextMention m : sofaTextMention)
		{
			tagged = wrapInMentionTypeTag(m.getMentionText(),m.getMentionType());
			
			if(!m.getSofaTextMentionConcept().isEmpty())
				tagged = wrapInConceptTag(tagged,m);
			
			html = html.replace(m.getMentionText(), tagged);
			html = html.replaceAll("\\n", "<br/>");
		}
		return html;
	}

	private String wrapInConceptTag(String tagged, SofaTextMention m) {
		SofaTextMentionConcept c = (SofaTextMentionConcept)m.getSofaTextMentionConcept().toArray()[0];
		return String.format("<a href=/openmrs/dictionary/concept.htm?conceptId=%d>%s</a>",c.getConcept().getConceptId(),tagged);
	}

	private String wrapInMentionTypeTag(String mentionText, String mentionType ) {
		
		return String.format("<span class=\"mention-type-%s\">%s</span>",mentionType,mentionText);
		
		
	}

	//should probably use generics here
	@Override
	public int compareTo(Object st) {
		return this.textStart - ((SofaText)st).getTextStart();
	}

	public Collection<? extends SofaTextMention> getProblems() {
		List<SofaTextMention> problems = new ArrayList<SofaTextMention>();
		
		for(SofaTextMention stm : sofaTextMention)
		{
			if(stm.getMentionType().equals("problem"))
				problems.add(stm);
		}
		
		return problems;
	}

	public Collection<? extends SofaTextMention> getTests() {
		List<SofaTextMention> tests = new ArrayList<SofaTextMention>();
		
		for(SofaTextMention stm : sofaTextMention)
		{
			if(stm.getMentionType().equals("test"))
				tests.add(stm);
		}
		
		return tests;
	}

	public Collection<? extends SofaTextMention> getTreatments() {
		List<SofaTextMention> treatments = new ArrayList<SofaTextMention>();
		
		for(SofaTextMention stm : sofaTextMention)
		{
			if(stm.getMentionType().equals("treatment"))
				treatments.add(stm);
		}
		
		return treatments;
	}

	

}
