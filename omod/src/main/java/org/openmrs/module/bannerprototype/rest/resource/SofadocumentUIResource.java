package org.openmrs.module.bannerprototype.rest.resource;

import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocumentUI;
import org.openmrs.module.bannerprototype.SofaTextMentionUI;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.webservices.rest.web.ConversionUtil;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.annotation.PropertyGetter;
import org.openmrs.module.webservices.rest.web.annotation.Resource;
import org.openmrs.module.webservices.rest.web.representation.DefaultRepresentation;
import org.openmrs.module.webservices.rest.web.representation.FullRepresentation;
import org.openmrs.module.webservices.rest.web.representation.Representation;
import org.openmrs.module.webservices.rest.web.resource.api.PageableResult;
import org.openmrs.module.webservices.rest.web.resource.impl.DataDelegatingCrudResource;
import org.openmrs.module.webservices.rest.web.resource.impl.DelegatingResourceDescription;
import org.openmrs.module.webservices.rest.web.resource.impl.NeedsPaging;
import org.openmrs.module.webservices.rest.web.response.ResponseException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Resource(name = RestConstants.VERSION_1 + "/bannerprototype/sofadocumentui", supportedClass = SofaDocumentUI.class, supportedOpenmrsVersions = {
        "1.9.*", "1.10.*", "1.11.*", "1.12.*", "2.0.*" })
public class SofadocumentUIResource extends DataDelegatingCrudResource<SofaDocumentUI> {
	
	@Override
	public DelegatingResourceDescription getRepresentationDescription(Representation representation) {
		if (representation instanceof DefaultRepresentation) {
			DelegatingResourceDescription description = new DelegatingResourceDescription();
			description.addProperty("uuid");
			description.addProperty("display");
			description.addProperty("dateCreated");
			description.addProperty("mentionCount");
			description.addProperty("diagnosis");
			description.addProperty("provider");
			description.addProperty("location");
			description.addProperty("problemWordList", Representation.REF);
			description.addProperty("treatmentWordList", Representation.REF);
			description.addProperty("testWordList", Representation.REF);
			description.addSelfLink();
			description.addLink("full", ".?v=" + RestConstants.REPRESENTATION_FULL);
			return description;
		} else if (representation instanceof FullRepresentation) {
			DelegatingResourceDescription description = new DelegatingResourceDescription();
			description.addProperty("uuid");
			description.addProperty("display");
			description.addProperty("dateCreated");
			description.addProperty("mentionCount");
			description.addProperty("diagnosis");
			description.addProperty("provider");
			description.addProperty("location");
			description.addProperty("problemWordList", Representation.FULL);
			description.addProperty("treatmentWordList", Representation.FULL);
			description.addProperty("testWordList", Representation.FULL);
			description.addSelfLink();
			return description;
		}
		
		return null;
	}
	
	@Override
	public SofaDocumentUI newDelegate() {
		return null;
	}
	
	@Override
	public SofaDocumentUI save(SofaDocumentUI sofaDocumentUI) {
		
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	protected void delete(SofaDocumentUI arg0, String arg1, RequestContext arg2) throws ResponseException {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public SofaDocumentUI getByUniqueId(String sofaDocUuid) {
		return Context.getService(NLPService.class).getSofaDocumentUIBySofaDocUuid(sofaDocUuid);
		
	}
	
	@Override
	public void purge(SofaDocumentUI arg0, RequestContext arg1) throws ResponseException {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	protected PageableResult doGetAll(RequestContext context) throws ResponseException {
		
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	protected PageableResult doSearch(RequestContext context) {
		
		List<SofaDocumentUI> dateList;
		
		Patient patient = context.getParameter("patient") != null ? Context.getPatientService().getPatientByUuid(
		    context.getParameter("patient")) : null;
		
		Date startDate = context.getParameter("startDate") != null ? (Date) ConversionUtil.convert(
		    context.getParameter("startDate"), Date.class) : null;
		
		Date endDate = context.getParameter("endDate") != null ? (Date) ConversionUtil.convert(
		    context.getParameter("endDate"), Date.class) : null;
		
		String[] searchTerms;
		searchTerms = context.getRequest().getParameterValues("searchTerms");
		
		dateList = Context.getService(NLPService.class).getSofaDocumentUIsByConstraints(patient, startDate, endDate,
		    searchTerms);
		
		return new NeedsPaging<SofaDocumentUI>(dateList, context);
	}
	
	/**
	 * Returns a display string
	 * 
	 * @param sofaDocumentUI
	 * @return the display string
	 */
	@PropertyGetter("display")
	public String getDisplayString(SofaDocumentUI sofaDocumentUI) {
		return sofaDocumentUI.getUuid();
	}
}
