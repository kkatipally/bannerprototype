package org.openmrs.module.bannerprototype.nlp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;

/**
 * This class exposes the Named Entity Recognition functionality of the module.
 * <p>
 * This class contains four internal Named Entity Recognizers, three ConceptClassTagger objects<br>
 * <br>
 * Each ConceptClassTagger is initialized to recognize entities in text based on the concept class
 * mappings <br>
 * set in the Manage Visit Notes Analysis page accessible through the OpenMRS Administration page. <br>
 * These mappings are stored and read via global properties.<br>
 * <br>
 * The fourth tagger is an NERTagger object which uses the BANNER CRF library and model specified in
 * the Manager Visit Notes Analysis page.
 */
public class DocumentTagger implements Serializable {
	
	private List<SofaText> sofaTexts;
	
	private NERTagger tagger;
	
	private ConceptClassTagger testClassTagger;
	
	private ConceptClassTagger problemClassTagger;
	
	private ConceptClassTagger treatmentClassTagger;
	
	private boolean initialized = false;
	
	private static final Log log = LogFactory.getLog(DocumentTagger.class);
	
	public DocumentTagger() {
		
	}
	
	private void initialize() {
		//get the BANNER CRF tagger
		this.tagger = new NERTagger();
		log.debug("Initializing class taggers");
		
		ArrayList<String> problemClasses = new ArrayList<String>();
		
		//get OpenMRS problem concept classes from global properties
		String problems[] = Context.getAdministrationService()
		        .getGlobalProperty("bannerprototype.conceptClassMappingProblem").split(",");
		for (String s : problems) {
			problemClasses.add(s);
		}
		
		//tests
		ArrayList<String> testClasses = new ArrayList<String>();
		String tests[] = Context.getAdministrationService().getGlobalProperty("bannerprototype.conceptClassMappingTest")
		        .split(",");
		for (String s : tests) {
			testClasses.add(s);
		}
		
		//treatment
		ArrayList<String> treatmentClasses = new ArrayList<String>();
		String treatments[] = Context.getAdministrationService()
		        .getGlobalProperty("bannerprototype.conceptClassMappingTreatment").split(",");
		for (String s : treatments) {
			treatmentClasses.add(s);
		}
		
		//initialize ConceptClassTagger objects
		this.testClassTagger = new ConceptClassTagger(testClasses, "test");
		this.problemClassTagger = new ConceptClassTagger(problemClasses, "problem");
		this.treatmentClassTagger = new ConceptClassTagger(treatmentClasses, "treatment");
		initialized = true;
		
	}
	
	/**
	 * This method executes the NER algorithm to find mentions of medical entities within the input
	 * text. Input is a simple String object. Output is a populated SofaDocument including all
	 * children in the SofaDocument data hierarchy.
	 * 
	 * @param document Text to be tagged
	 * @return SofaDocument fully initialized with text and Named Entities recognized
	 */
	public SofaDocument tagDocument(String document) {
		if (!initialized)
			initialize();
		
		sofaTexts = splitSentences(document);
		List<NamedEntity> namedEntities;
		SofaDocument sofaDocument = new SofaDocument();
		sofaDocument.setText(document);
		
		// iterate over sofaTexts and tag
		for (SofaText st : sofaTexts) {
			namedEntities = new ArrayList<NamedEntity>();
			
			//tag text with ConceptClassTaggers first
			namedEntities.addAll(testClassTagger.tag(st.getText()));
			namedEntities.addAll(problemClassTagger.tag(st.getText()));
			namedEntities.addAll(treatmentClassTagger.tag(st.getText()));
			
			//Add all entities found with String Matching
			for (NamedEntity ne : namedEntities)
				st.addMentionAndConcepts(ne.getMention(), ne.getConceptMatches());
			
			//Add entities from BANNER, with low precedence
			for (NamedEntity ne : tagger.tag(st.getText()))
				st.addBannerMention(ne.getMention());
			
			st.setSofaDocument(sofaDocument);
			sofaDocument.addSofaText(st);
		}
		
		return sofaDocument;
	}
	
	/**
	 * naively split sentences on periods
	 * 
	 * @param document
	 * @return
	 */
	private ArrayList<SofaText> splitSentences(String document) {
		int prevPeriod = -1;
		int nextPeriod = document.indexOf('.');
		SofaText sofa;
		ArrayList<SofaText> sofaTexts = new ArrayList<SofaText>();
		while (nextPeriod != -1) {
			sofa = new SofaText(document.substring(prevPeriod + 1, nextPeriod + 1), prevPeriod + 1, nextPeriod + 1);
			sofaTexts.add(sofa);
			prevPeriod = nextPeriod;
			nextPeriod = document.indexOf('.', prevPeriod + 1);
		}
		
		return sofaTexts;
	}
}
