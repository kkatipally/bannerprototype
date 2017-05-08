package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.List;
import java.util.Set;
import java.util.Objects;

import org.openmrs.BaseOpenmrsData;

public class SofaTextMentionUI extends BaseOpenmrsData implements Serializable {
	
	private String mentionText;
	
	private String mentionType;
	
	private String relatedTo;
	
	private List<SofaDocumentUI> dateList;
	
	public SofaTextMentionUI(String mentionText, String mentionType, List<SofaDocumentUI> dateList) {
		this.mentionText = mentionText;
		this.mentionType = mentionType;
		this.dateList = dateList;
	}
	
	public void addDate(SofaDocumentUI sofaDocumentUI) {
		
		boolean found = false;
		for (SofaDocumentUI date : dateList) {
			if (date.getUuid().equals(sofaDocumentUI.getUuid())) {
				date.incrementCount();
				found = true;
			}
		}
		if (found == false) {
			dateList.add(sofaDocumentUI);
		}
		
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
	
	public List<SofaDocumentUI> getDateList() {
		return dateList;
	}
	
	public void setDateList(List<SofaDocumentUI> dateList) {
		this.dateList = dateList;
	}
	
	/**
	 * @return the relatedTo
	 */
	public String getRelatedTo() {
		return relatedTo;
	}
	
	/**
	 * @param relatedTo the relatedTo to set
	 */
	public void setRelatedTo(String relatedTo) {
		this.relatedTo = relatedTo;
	}
	
	@Override
	public boolean equals(Object o) {
		
		if (o == this)
			return true;
		if (!(o instanceof SofaTextMentionUI)) {
			return false;
		}
		
		SofaTextMentionUI other = (SofaTextMentionUI) o;
		return this.mentionText.toLowerCase().equals(other.mentionText.toLowerCase());
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(mentionText);
	}
	
}
