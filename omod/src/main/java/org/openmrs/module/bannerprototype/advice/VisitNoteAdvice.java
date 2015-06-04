package org.openmrs.module.bannerprototype.advice;

import java.lang.reflect.Method;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.nlp.DocumentTagger;
import org.openmrs.module.bannerprototype.nlp.NERTagger;
import org.openmrs.module.bannerprototype.nlp.TaggerFactory;
import org.springframework.aop.MethodBeforeAdvice;
 

public class VisitNoteAdvice implements MethodBeforeAdvice {
 
//DocumentTagger dt = new DocumentTagger();

	@Override
	public void before(Method method, Object[] args, Object arg2) throws Throwable {
        System.out.println("obs class");
		// if not calling saveObs method, return
        
        if(method != null)
        	System.out.println(method.getName());
        
		if (method != null && method.getName().equals("saveObs"))
		{    
            		
			System.out.println("saveObs");
			Concept c = Context.getConceptService().getConceptByName("Text of encounter note");
			Obs obs = (Obs)args[0];
        
			// if not encounter note, return
			if(!obs.getConcept().equals(c))
			{
        
				System.out.println("patient Note!");
        
				String sofa = obs.getValueText();
				Patient p = obs.getPatient();
            
       // SofaDocument sofaDocument = dt.tagDocument(sofa);
		//sofaDocument.setPatient(p);
		
		//Context.getService(NLPService.class).saveSofaDocument(sofaDocument);
			}
		}
    }

 


}