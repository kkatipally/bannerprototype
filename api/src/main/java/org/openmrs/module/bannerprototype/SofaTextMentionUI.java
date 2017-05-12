package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.List;
import java.util.Set;
import java.util.Objects;

import org.openmrs.BaseOpenmrsData;

/**
 * This class has been created for the new REST web services. <br/>
 * A SofaTextMentionUI corresponds to one mention or entity and populates a single row on the heat
 * map. Each SofaTextMentionUI object has details such as mentionText, mentionType, search term that
 * it is related to, as well as a list of SofaDocumentUIs (each is a vertical bar on the heat map).
 * 
 * @author kavyakatipally
 */
public class SofaTextMentionUI extends BaseOpenmrsData implements Serializable {
	
	private String mentionText;
	
	private String mentionType;
	
	private String relatedTo;
	
	private List<SofaDocumentUI> dateList;
	
	/**
	 * A SofaTextMentionUI object is instantiated with the mentionText, mentionType and a list of
	 * SofaDocumentUIs.
	 * 
	 * @param mentionText mentionText of corresponding mention
	 * @param mentionType mentionType of corresponding mention
	 * @param dateList list of SofaDocumentUIs associated
	 */
	public SofaTextMentionUI(String mentionText, String mentionType, List<SofaDocumentUI> dateList) {
		this.mentionText = mentionText;
		this.mentionType = mentionType;
		this.dateList = dateList;
	}
	
	/**
	 * This method is required to implement BaseOpenmrsObject
	 * 
	 * @return
	 */
	@Override
	public Integer getId() {
		return null;
	}
	
	@Override
	public void setId(Integer arg0) {
		
	}
	
	/**
	 * returns the mentionText associated with the SofaTextMentionUI
	 * 
	 * @return the mentionText
	 */
	public String getMentionText() {
		return mentionText;
	}
	
	/**
	 * sets the mentionText for the SofaTextMentionUI
	 * 
	 * @param mentionText data retrieved from corresponding mention
	 */
	public void setMentionText(String mentionText) {
		this.mentionText = mentionText;
	}
	
	/**
	 * returns the mentionType associated with the SofaTextMentionUI
	 * 
	 * @return the mentionType
	 */
	public String getMentionType() {
		return mentionType;
	}
	
	/**
	 * sets the mentionType for the SofaTextMentionUI
	 * 
	 * @param mentionType data retrieved from corresponding mention
	 */
	public void setMentionType(String mentionType) {
		this.mentionType = mentionType;
	}
	
	/**
	 * returns the search term that the SofaTextMentionUI is related to
	 * 
	 * @return
	 */
	public String getRelatedTo() {
		return relatedTo;
	}
	
	/**
	 * sets the search term that the SofaTextMentionUI is related to
	 * 
	 * @param relatedTo search term that the SofaTextMentionUI is related to
	 */
	public void setRelatedTo(String relatedTo) {
		this.relatedTo = relatedTo;
	}
	
	/**
	 * returns the list of SofaDocumentUIs associated with the SofaTextMentionUI
	 * 
	 * @return
	 */
	public List<SofaDocumentUI> getDateList() {
		return dateList;
	}
	
	/**
	 * sets the list of SofaDocumentUIs for the SofaTextMentionUI
	 * 
	 * @param dateList list of SofaDocumentUIs
	 */
	public void setDateList(List<SofaDocumentUI> dateList) {
		this.dateList = dateList;
	}
	
	/**
	 * Adds a SofaDocumentUI to the List of SofaDocumentUIs associated with this SofaTextMentionUI
	 * if it was not already present. If the SofaDocumentUI was already present, the mentionCount of
	 * the SofaTextMentionUI is incremented.
	 * 
	 * @param sofaDocumentUI
	 */
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
	
	/**
	 * Two SofaTextMentionUIs are considered equal if their mentionTexts are equal
	 * 
	 * @param o
	 * @return
	 */
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
