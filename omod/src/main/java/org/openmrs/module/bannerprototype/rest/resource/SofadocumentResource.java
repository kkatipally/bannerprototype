package org.openmrs.module.bannerprototype.rest.resource;

import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.api.NLPService;
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

@Resource(name = RestConstants.VERSION_1 + "/bannerprototype/sofadocument", supportedClass = SofaDocument.class, supportedOpenmrsVersions = {
        "1.9.*", "1.10.*", "1.11.*", "1.12.*", "2.0.*" })
public class SofadocumentResource extends DataDelegatingCrudResource<SofaDocument> {
	
	@Override
	public DelegatingResourceDescription getRepresentationDescription(Representation representation) {
		if (representation instanceof DefaultRepresentation) {
			DelegatingResourceDescription description = new DelegatingResourceDescription();
			description.addProperty("uuid");
			description.addProperty("display");
			description.addProperty("dateCreated");
			description.addProperty("text");
			description.addSelfLink();
			description.addLink("full", ".?v=" + RestConstants.REPRESENTATION_FULL);
			return description;
		} else if (representation instanceof FullRepresentation) {
			DelegatingResourceDescription description = new DelegatingResourceDescription();
			description.addProperty("uuid");
			description.addProperty("display");
			description.addProperty("dateCreated");
			description.addProperty("text");
			description.addProperty("annotatedHTML");
			description.addSelfLink();
			return description;
		}
		
		return null;
	}
	
	@Override
	public SofaDocument newDelegate() {
		return new SofaDocument();
	}
	
	@Override
	public SofaDocument save(SofaDocument sofadocument) {
		return Context.getService(NLPService.class).saveSofaDocument(sofadocument);
	}
	
	@Override
	protected void delete(SofaDocument arg0, String arg1, RequestContext arg2) throws ResponseException {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public SofaDocument getByUniqueId(String uuid) {
		return Context.getService(NLPService.class).getSofaDocumentByUuid(uuid);
	}
	
	@Override
	public void purge(SofaDocument arg0, RequestContext arg1) throws ResponseException {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	protected PageableResult doGetAll(RequestContext context) throws ResponseException {
		
		NLPService service = Context.getService(NLPService.class);
		return new NeedsPaging<SofaDocument>(service.getAllSofaDocuments(), context);
	}
	
	@Override
	protected PageableResult doSearch(RequestContext context) {
		
		Patient patient = context.getParameter("patient") != null ? Context.getPatientService().getPatientByUuid(
		    context.getParameter("patient")) : null;
		
		return new NeedsPaging<SofaDocument>(Context.getService(NLPService.class).getSofaDocumentsByPatient(patient),
		        context);
		
	}
	
	/**
	 * Returns a display string
	 * 
	 * @param visit
	 * @return the display string
	 */
	@PropertyGetter("display")
	public String getDisplayString(SofaDocument sofadocument) {
		return sofadocument.getDateCreated().toString();
	}
	
}
