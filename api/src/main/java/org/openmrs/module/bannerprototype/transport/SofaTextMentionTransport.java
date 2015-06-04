package org.openmrs.module.bannerprototype.transport;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openmrs.BaseOpenmrsObject;
import org.openmrs.Concept;
import org.openmrs.module.bannerprototype.SofaTextMention;

import banner.tagging.Mention;

public class SofaTextMentionTransport implements Serializable {
	private int sofaTextMentionId;
	private SofaTextTransport sofaText;
	private String mentionText;
	private int mentionStart;
	private int mentionEnd;
	private String mentionType;
	private boolean mentionReviewed = false;
	private boolean mentionCorrect = false;
	private String uuid;
		
	public SofaTextMentionTransport(SofaTextMention stm)
	{
		this.sofaTextMentionId = stm.getSofaTextMentionId();
		this.mentionText = stm.getMentionText();
		this.mentionStart = stm.getMentionStart();
		this.mentionEnd = stm.getMentionEnd();
		this.mentionType = stm.getMentionType();
		this.uuid = stm.getUuid();
		
	}
	
	public SofaTextMentionTransport(SofaTextTransport sofaText, Mention m, List<Concept> concepts) {
		this.sofaText = sofaText;
		this.mentionText = m.getText();
		this.mentionStart = m.getStart();
		this.mentionEnd = m.getEnd();
		this.mentionType = m.getType().getText();
		
	}

	
	public Integer getId() {
		// TODO Auto-generated method stub
		return null;
	}

	
	public void setId(Integer arg0) {
		// TODO Auto-generated method stub

	}

	/**
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
	 * @return the mentionStart
	 */
	public int getMentionStart() {
		return mentionStart;
	}

	/**
	 * @param mentionStart the mentionStart to set
	 */
	public void setMentionStart(int mentionStart) {
		this.mentionStart = mentionStart;
	}

	/**
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
	 * @return the mentionReviewed
	 */
	public boolean isMentionReviewed() {
		return mentionReviewed;
	}

	/**
	 * @param mentionReviewed the mentionReviewed to set
	 */
	public void setMentionReviewed(boolean mentionReviewed) {
		this.mentionReviewed = mentionReviewed;
	}

	/**
	 * @return the mentionCorrect
	 */
	public boolean isMentionCorrect() {
		return mentionCorrect;
	}

	/**
	 * @param mentionCorrect the mentionCorrect to set
	 */
	public void setMentionCorrect(boolean mentionCorrect) {
		this.mentionCorrect = mentionCorrect;
	}


	/**
	 * @return the sofaText
	 */
	public SofaTextTransport getSofaText() {
		return sofaText;
	}

	/**
	 * @param sofaText the sofaText to set
	 */
	public void setSofaText(SofaTextTransport sofaText) {
		this.sofaText = sofaText;
	}


}
