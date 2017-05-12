package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.Patient;
import org.openmrs.module.bannerprototype.wordcloud.Word;

/**
 * This class has been created for the new REST web services. <br/>
 * A SofaDocumentUI corresponds to one SofaDocument. Each SofaDocumentUI object has details such as
 * diagnosis, provider, location, as well as problems, treatments and tests. These details are
 * populated from the corresponding SofaDocument object. <br/>
 * Each SofaDocumentUI object populates a single vertical bar on the heat map and a single row in
 * the visit note list on the UI.
 * 
 * @author kavyakatipally
 */
public class SofaDocumentUI extends BaseOpenmrsData implements Serializable {
	
	private String uuid;
	
	private Patient patient;
	
	private Date dateCreated;
	
	private int mentionCount;
	
	private String diagnosis;
	
	private String provider;
	
	private String location;
	
	private List<Word> problemWordList;
	
	private List<Word> treatmentWordList;
	
	private List<Word> testWordList;
	
	/**
	 * A SofaDocumentUI object is instantiated with the uuid, date, provider, location, diagnosis
	 * details from the corresponding SofaDocument. Each SofaDocumentUI object is associated with a
	 * SofaTextMentionUI on the heat map. It stores the frequency of the SofaTextMentionUI object in
	 * mentionCount.
	 * 
	 * @param uuid
	 * @param dateCreated
	 * @param provider
	 * @param location
	 * @param diagnosis
	 */
	public SofaDocumentUI(String uuid, Date dateCreated, String provider, String location, String diagnosis) {
		this.uuid = uuid;
		this.dateCreated = dateCreated;
		this.provider = provider;
		this.location = location;
		this.diagnosis = diagnosis;
		this.setMentionCount(1);
	}
	
	/**
	 * This method is required to implement BaseOpenmrsObject
	 */
	@Override
	public Integer getId() {
		
		return null;
	}
	
	@Override
	public void setId(Integer arg0) {
		
	}
	
	/**
	 * returns the uuid associated with the SofaDocumentUI
	 * 
	 * @return the uuid
	 */
	public String getUuid() {
		return uuid;
	}
	
	/**
	 * sets the uuid for the SofaDocumentUI
	 * 
	 * @param uuid data retrieved from corresponding SofaDocument
	 */
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	/**
	 * returns the dateCreated associated with the SofaDocumentUI
	 * 
	 * @return the dateCreated
	 */
	public Date getDateCreated() {
		return dateCreated;
	}
	
	/**
	 * sets the dateCreated for the SofaDocumentUI
	 * 
	 * @param dateCreated data retrieved from corresponding SofaDocument
	 */
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
	
	/**
	 * returns the patient associated with the SofaDocumentUI
	 * 
	 * @return the patient
	 */
	public Patient getPatient() {
		return patient;
	}
	
	/**
	 * sets the patient for the SofaDocumentUI
	 * 
	 * @param patient data retrieved from corresponding SofaDocument
	 */
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	
	/**
	 * returns mentionCount which is the frequency of the associated SofaTextMentionUI object in the
	 * SofaDocumentUI
	 * 
	 * @return the mentionCount
	 */
	public int getMentionCount() {
		return mentionCount;
	}
	
	/**
	 * sets mentionCount which is the frequency of the associated SofaTextMentionUI object in the
	 * SofaDocumentUI
	 * 
	 * @param mentionCount frequency of the associated SofaTextMentionUI object in the
	 *            SofaDocumentUI
	 */
	public void setMentionCount(int mentionCount) {
		this.mentionCount = mentionCount;
	}
	
	/**
	 * Each SofaDocumentUI object is associated with a SofaTextMentionUI on the heat map. It stores
	 * the frequency of the SofaTextMentionUI object in mentionCount.
	 */
	public void incrementCount() {
		this.setMentionCount(this.getMentionCount() + 1);
	}
	
	/**
	 * returns the Diagnosis associated with the SofaDocumentUI
	 * 
	 * @return
	 */
	public String getDiagnosis() {
		return diagnosis;
	}
	
	/**
	 * sets the Diagnosis for the SofaDocumentUI
	 * 
	 * @param diagnosis data retrieved from corresponding SofaDocument
	 */
	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}
	
	/**
	 * returns the Provider associated with the SofaDocumentUI
	 * 
	 * @return
	 */
	public String getProvider() {
		return provider;
	}
	
	/**
	 * sets the Provider for the SofaDocumentUI
	 * 
	 * @param provider data retrieved from corresponding SofaDocument
	 */
	public void setProvider(String provider) {
		this.provider = provider;
	}
	
	/**
	 * returns the Location associated with the SofaDocumentUI
	 * 
	 * @return
	 */
	public String getLocation() {
		return location;
	}
	
	/**
	 * sets the Location for the SofaDocumentUI
	 * 
	 * @param location data retrieved from corresponding SofaDocument
	 */
	public void setLocation(String location) {
		this.location = location;
	}
	
	/**
	 * Added to handle ERROR - BaseRestController.handleException(106) Could not write JSON:
	 * Conflicting getter definitions for property "voided"
	 */
	@Override
	public Boolean isVoided() {
		return super.isVoided();
	}
	
	/**
	 * returns the problemWordList associated with the SofaDocumentUI
	 * 
	 * @return
	 */
	public List<Word> getProblemWordList() {
		return problemWordList;
	}
	
	/**
	 * sets the problemWordList for the SofaDocumentUI
	 * 
	 * @param problemWordList data retrieved from corresponding SofaDocument
	 */
	public void setProblemWordList(List<Word> problemWordList) {
		this.problemWordList = problemWordList;
	}
	
	/**
	 * returns the treatmentWordList associated with the SofaDocumentUI
	 * 
	 * @return
	 */
	public List<Word> getTreatmentWordList() {
		return treatmentWordList;
	}
	
	/**
	 * sets the treatmentWordList for the SofaDocumentUI
	 * 
	 * @param treatmentWordList data retrieved from corresponding SofaDocument
	 */
	public void setTreatmentWordList(List<Word> treatmentWordList) {
		this.treatmentWordList = treatmentWordList;
	}
	
	/**
	 * returns the testWordList associated with the SofaDocumentUI
	 * 
	 * @return
	 */
	public List<Word> getTestWordList() {
		return testWordList;
	}
	
	/**
	 * sets the testWordList for the SofaDocumentUI
	 * 
	 * @param testWordList data retrieved from corresponding SofaDocument
	 */
	public void setTestWordList(List<Word> testWordList) {
		this.testWordList = testWordList;
	}
}
