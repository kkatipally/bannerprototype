package org.openmrs.module.bannerprototype.advice;

import java.lang.reflect.Method;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.Encounter;
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
 
    DocumentTagger dt = new DocumentTagger();
    Log log = LogFactory.getLog(getClass());

	@Override
	public void before(Method method, Object[] args, Object arg2) throws Throwable {
        log.info("Tagging Document");
		if (method != null && method.getName().equals("saveEncounter"))
		{    
            		
			
			//System.out.println("saveEncounter Entered");
			Set<Obs> obs = ((Encounter)args[0]).getAllObs();
			
			Concept c = Context.getConceptService().getConceptByName("Text of encounter note");
			
			for(Obs o : obs)
			{	
				Concept obs_concept = o.getConcept();
				//System.out.println(obs_concept.getName().getName());
				// if not encounter note, return
				if(obs_concept.equals(c))
				{
        
					//System.out.println("Visit Note!");
        
					String sofa = o.getValueText();
					Patient p = o.getPatient();
            
					//System.out.println(sofa);
					
					SofaDocument sofaDocument = dt.tagDocument(sofa);
					sofaDocument.setPatient(p);
		
					Context.getService(NLPService.class).saveSofaDocument(sofaDocument);
				}
			}
		}
    }

 


}