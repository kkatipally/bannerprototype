package org.openmrs.module.bannerprototype.fragment.controller;

import org.openmrs.api.EncounterService;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.ui.framework.SimpleObject;
import org.openmrs.ui.framework.UiUtils;
import org.openmrs.ui.framework.annotation.FragmentParam;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.fragment.FragmentActionUiUtils;
import org.openmrs.ui.framework.fragment.FragmentModel;
import org.springframework.web.bind.annotation.RequestParam;



public class DocumentViewerFragmentController {

	
	
	public void controller(FragmentModel model, 
			@FragmentParam(value="docId", required=false) Integer docId) {
        
		String html = "";
		String docDate = "";
		if(docId != null)
		{	
			SofaDocument d = Context.getService(NLPService.class).getSofaDocumentById(docId);
			html=d.getAnnotatedHTML();
			
		}

        model.addAttribute("annotatedHTML", html);
        model.addAttribute("docDate",docDate );
    }
	
	/**
	 * returns HTML for a given docID, this HTML has span elements around all mentions
	 * @param docId
	 * @param ui
	 * @return
	 */
	public String getHTML(@RequestParam(value="docId", required=false) Integer docId, FragmentActionUiUtils ui) {
			
			//Context.logout();
		
		    if(!Context.isAuthenticated())
		    {
		    	return "Not Authenticated";
		    }
		    
			SofaDocument sd = Context.getService(NLPService.class).getSofaDocumentById(docId);
			
			String html= sd.getAnnotatedHTML();
			
			return html;
			}
	
	/**
	 * returns date created field for a given docId
	 * @param docId
	 * @param ui
	 * @return
	 */
	public String getDate(@RequestParam(value="docId", required=false) Integer docId, FragmentActionUiUtils ui)
	{
		
		String out = Context.getService(NLPService.class).getSofaDocumentById(docId).getDateCreated().toString();
		
		return out;
	}
}
