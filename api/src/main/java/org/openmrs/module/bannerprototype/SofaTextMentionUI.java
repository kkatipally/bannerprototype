package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.Set;

import org.openmrs.BaseOpenmrsData;

public class SofaTextMentionUI extends BaseOpenmrsData implements Serializable {
	
	private String uuid;
	
	private String mentionText;
	
	private String mentionType;
	
	private String relatedTo;
	
	//private HashMap<String, SofaDocumentUI> dateList;
	//private List<SofaDocumentUI> dateList;
	private Set<SofaDocumentUI> dateList;
	
	/**
	 * Default constructor
	 */
	public SofaTextMentionUI(SofaTextMention sofaTextMention) {
		setUuid(sofaTextMention.getUuid());
		setMentionText(sofaTextMention.getMentionText());
		setMentionType(sofaTextMention.getMentionType());
	}
	
	public SofaTextMentionUI(String uuid, String mentionText, String mentionType, Set<SofaDocumentUI> dateList) {
		this.uuid = uuid;
		this.mentionText = mentionText;
		this.mentionType = mentionType;
		this.dateList = dateList;
	}
	
	public void addDate(SofaDocument sofadocument) {
		/*if(dateList.containsKey(sofadocument.getUuid())){
			dateList.get(sofadocument.getUuid()).incrementCount();
		}
		else {
			dateList.put(sofadocument.getUuid(), new SofaDocumentUI(sofadocument));
		}*/
		
		boolean found = false;
		for (SofaDocumentUI date : dateList) {
			if (date.getUuid().equals(sofadocument.getUuid())) {
				//date.incrementCount();
				found = true;
			}
		}
		if (found == false) {
			dateList.add(new SofaDocumentUI(sofadocument));
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
	
	public Set<SofaDocumentUI> getDateList() {
		return dateList;
	}
	
	public void setDateList(Set<SofaDocumentUI> dateList) {
		this.dateList = dateList;
	}
	
}
