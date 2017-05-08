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
import org.springframework.aop.AfterReturningAdvice;
import org.springframework.aop.MethodBeforeAdvice;

/**
 * VisitNoteAdvice interrupts the EncounterService to run NER over Visit Notes as they arrive
 * 
 * @author ryaneshleman
 */
public class VisitNoteAdvice implements AfterReturningAdvice {
	
	DocumentTagger dt = new DocumentTagger();
	
	Log log = LogFactory.getLog(getClass());
	
	@Override
	public void afterReturning(Object returnValue, Method method, Object[] args, Object arg2) throws Throwable {
		log.info("Tagging Document");
		
		// if "saveEncounter" was called
		if (method != null && method.getName().equals("saveEncounter")) {
			
			//get observations from Encounter object
			Encounter e = (Encounter) returnValue;
			Set<Obs> obs = (e).getAllObs();
			
			//get VisitNote concept
			Concept c = null;
			String noteConceptId = Context.getAdministrationService().getGlobalProperty("bannerprototype.noteConceptId");
			if (noteConceptId != null && !noteConceptId.isEmpty()) {
				c = Context.getConceptService().getConcept(Integer.parseInt(noteConceptId));
			} else {
				c = Context.getConceptService().getConcept("Text of encounter note");
			}
			
			for (Obs o : obs) {
				Concept obs_concept = o.getConcept();
				
				//if the concept associated with the observation is the VisitNote Concept, proceed
				if (obs_concept.equals(c)) {
					// extract VisitNote Text
					String sofa = o.getValueText();
					Patient p = o.getPatient();
					
					SofaDocument sofaDocument = dt.tagDocument(sofa);
					sofaDocument.setPatient(p);
					sofaDocument.setEncounter(e);
					
					Context.getService(NLPService.class).saveSofaDocument(sofaDocument);
				}
			}
		}
	}
}
