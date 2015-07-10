package org.openmrs.module.bannerprototype.nlp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;

public class DocumentTagger implements Serializable {
	private String document;
	private List<SofaText> sofaTexts;
	private NERTagger tagger;
	private ConceptClassTagger testClassTagger;
	private ConceptClassTagger problemClassTagger;
	private ConceptClassTagger treatmentClassTagger;
	private boolean initialized = false;
	
	public DocumentTagger()
	{
		
	}
	
	private void initialize(){
		
		this.tagger = new NERTagger();
		
		
		ArrayList<String> problemClasses = new ArrayList<String>();
		String problems[] =  Context.getAdministrationService()
									.getGlobalProperty("bannerprototype.conceptClassMappingProblem")
									.split(",");
		for(String s : problems)
			problemClasses.add(s);
		
		
		ArrayList<String> testClasses = new ArrayList<String>();
		String tests[] =  Context.getAdministrationService()
									.getGlobalProperty("bannerprototype.conceptClassMappingTest")
									.split(",");
		for(String s : tests)
			testClasses.add(s);
		
		ArrayList<String> treatmentClasses = new ArrayList<String>();
		String treatments[] =  Context.getAdministrationService()
									.getGlobalProperty("bannerprototype.conceptClassMappingTreatment")
									.split(",");
		for(String s : treatments)
			treatmentClasses.add(s);
		
		this.testClassTagger = new ConceptClassTagger(testClasses,"test");
		this.problemClassTagger = new ConceptClassTagger(problemClasses,"problem");
		this.treatmentClassTagger = new ConceptClassTagger(treatmentClasses,"treatment");
		initialized = true;
		
	}
	
	public SofaDocument tagDocument(String document)
	{
		if(!initialized)
			initialize();
		
		sofaTexts = splitSentences(document);
		List<NamedEntity> namedEntities;
		SofaDocument sofaDocument = new SofaDocument();
		sofaDocument.setText(document);
		
		
		for(SofaText st : sofaTexts)
		{	
			namedEntities = new ArrayList<NamedEntity>();
			namedEntities.addAll(tagger.tag(st.getText()));
			namedEntities.addAll(testClassTagger.tag(st.getText()));
			namedEntities.addAll(problemClassTagger.tag(st.getText()));
			namedEntities.addAll(treatmentClassTagger.tag(st.getText()));
			
			for(NamedEntity ne : namedEntities)
    			st.addMentionAndConcepts(ne.getMention(), ne.getConceptMatches());
			
			st.setSofaDocument(sofaDocument);
			sofaDocument.addSofaText(st);
		}
		
		return sofaDocument;
	}

	private ArrayList<SofaText> splitSentences(String document) {
		int prevPeriod = -1;
		int nextPeriod = document.indexOf('.');
		SofaText sofa;
		ArrayList<SofaText> sofaTexts = new ArrayList<SofaText>();
		while(nextPeriod != -1)
		{
			sofa = new SofaText(document.substring(prevPeriod+1, nextPeriod+1),prevPeriod+1,nextPeriod+1);
			sofaTexts.add(sofa);
			prevPeriod = nextPeriod;
			nextPeriod = document.indexOf('.',prevPeriod+1);
		}
		
		return sofaTexts;
	}
}
