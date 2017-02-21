package org.openmrs.module.bannerprototype.rest.resource;

import java.util.Date;
import java.util.List;

import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.module.bannerprototype.SofaTextMentionUI;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.web.wordcloud.WordCloud;
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

@Resource(name = RestConstants.VERSION_1 + "/bannerprototype/sofatextmentionui", supportedClass = SofaTextMentionUI.class, supportedOpenmrsVersions = {
        "1.9.*", "1.10.*", "1.11.*", "1.12.*", "2.0.*" })
public class SofatextmentionUIResource extends DataDelegatingCrudResource<SofaTextMentionUI> {
	
	@Override
	public DelegatingResourceDescription getRepresentationDescription(Representation representation) {
		if (representation instanceof DefaultRepresentation) {
			DelegatingResourceDescription description = new DelegatingResourceDescription();
			description.addProperty("uuid");
			description.addProperty("display");
			description.addProperty("mentionText");
			description.addProperty("mentionType");
			description.addProperty("dateList", Representation.REF);
			description.addSelfLink();
			description.addLink("full", ".?v=" + RestConstants.REPRESENTATION_FULL);
			return description;
		} else if (representation instanceof FullRepresentation) {
			DelegatingResourceDescription description = new DelegatingResourceDescription();
			description.addProperty("uuid");
			description.addProperty("display");
			description.addProperty("mentionText");
			description.addProperty("mentionType");
			description.addProperty("dateList", Representation.REF);
			description.addSelfLink();
			return description;
		}
		
		return null;
	}
	
	@Override
	public SofaTextMentionUI newDelegate() {
		return null;
	}
	
	@Override
	public SofaTextMentionUI save(SofaTextMentionUI sofaTextMentionUI) {
		
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	protected void delete(SofaTextMentionUI arg0, String arg1, RequestContext arg2) throws ResponseException {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public SofaTextMentionUI getByUniqueId(String uuid) {
		return Context.getService(NLPService.class).getSofaTextMentionUIByUuid(uuid);
		
	}
	
	@Override
	public void purge(SofaTextMentionUI arg0, RequestContext arg1) throws ResponseException {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	protected PageableResult doGetAll(RequestContext context) throws ResponseException {
		
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	protected PageableResult doSearch(RequestContext context) {
		
		/*Patient patient = context.getParameter("patient") != null ? Context.getPatientService().getPatientByUuid(
		    context.getParameter("patient")) : null;
		
		Date startDate = context.getParameter("startDate") != null ? (Date) ConversionUtil.convert(
		    context.getParameter("startDate"), Date.class) : null;
		
		Date endDate = context.getParameter("endDate") != null ? (Date) ConversionUtil.convert(
		    context.getParameter("endDate"), Date.class) : null;
		
		String entityType = context.getParameter("entityType");
		
		ArrayList<SofaTextMention> mentionList = new ArrayList<SofaTextMention>();
		
		List<SofaDocument> allSofaDocuments = Context.getService(NLPService.class).getSofaDocumentsByPatientAndDateRange(
		    patient, startDate, endDate);
		
		if (entityType.equals("Problems")) {
			for (SofaDocument sd : allSofaDocuments) {
				mentionList.addAll(sd.getProblemMentions());
			}
		} else if (entityType.equals("Treatments")) {
			for (SofaDocument sd : allSofaDocuments) {
				mentionList.addAll(sd.getTreatmentMentions());
			}
		} else if (entityType.equals("Tests")) {
			for (SofaDocument sd : allSofaDocuments) {
				mentionList.addAll(sd.getTestMentions());
			}
		} else {
			for (SofaDocument sd : allSofaDocuments) {
				mentionList.addAll(sd.getAllMentions());
			}
		}
		
		return new NeedsPaging<SofaTextMention>(mentionList, context);*/
		return null;
	}
	
	/*private void addToCloud(WordCloud wordcloud, List<SofaTextMention> mentions) {
		
		for (SofaTextMention m : mentions)
			wordcloud.addWord(m.getMentionText(), m.getMentionType());
	}*/
	
	/**
	 * Returns a display string
	 * 
	 * @param visit
	 * @return the display string
	 */
	@PropertyGetter("display")
	public String getDisplayString(SofaTextMentionUI sofaTextMentionUI) {
		return sofaTextMentionUI.getMentionText() + "/" + sofaTextMentionUI.getMentionType();
	}
}
