package org.openmrs.module.bannerprototype;

import java.io.Serializable;
import java.util.Date;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.Encounter;
import org.openmrs.Patient;

public class SofaDocumentUI extends BaseOpenmrsData implements Serializable {
	
	private String uuid;
	
	private Patient patient;
	
	private Date dateCreated;
	
	//	private int mentionCount;
	//	
	//	private String diagnosis;
	//	
	//	private String provider;
	//	
	//	private String location;
	
	/**
	 * Default constructor
	 */
	public SofaDocumentUI(SofaDocument sofadocument) {
		setUuid(sofadocument.getUuid());
		setDateCreated(sofadocument.getDateCreated());
		setPatient(sofadocument.getPatient());
		//this.mentionCount = 1;
	}
	
	public SofaDocumentUI(String uuid, Date dateCreated) {
		this.uuid = uuid;
		this.dateCreated = dateCreated;
		//this.mentionCount = 1;
	}
	
	//	public void incrementCount() {
	//		this.mentionCount++;
	//	}
	
	@Override
	public Integer getId() {
		
		return null;
	}
	
	@Override
	public void setId(Integer arg0) {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * uuid is a unique identifier for the SofaDocument
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
	 * @return the dateCreated
	 */
	public Date getDateCreated() {
		return dateCreated;
	}
	
	/**
	 * @param dateCreated the dateCreated to set
	 */
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
	
	/**
	 * @return the patient
	 */
	public Patient getPatient() {
		return patient;
	}
	
	/**
	 * @param patient the patient to set
	 */
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	
	/**
	 * Added to handle ERROR - BaseRestController.handleException(106) Could not write JSON: Conflicting getter definitions for property "voided"
	 */
	@Override
	public Boolean isVoided() {
		return super.isVoided();
	}
	
}
