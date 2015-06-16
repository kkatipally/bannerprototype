package org.openmrs.module.bannerprototype.web;

import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.api.NLPService;

public class DWRNLPService {
	
	public SofaDocument getSofaDocument(int docId) {
	    return Context.getService(NLPService.class).getSofaDocumentById(docId);
	}

}
