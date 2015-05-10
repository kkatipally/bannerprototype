package org.openmrs.module.bannerprototype.nlp;

import java.util.ArrayList;

import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;

public class DocumentTagger {
	private String document;
	private ArrayList<SofaText> sofaTexts;
	private NERTagger tagger;
	
	public DocumentTagger()
	{
		this.tagger = new NERTagger();
	}
	
	public SofaDocument tagDocument(String document)
	{
		sofaTexts = splitSentences(document);
		ArrayList<NamedEntity> namedEntities;
		SofaDocument sofaDocument = new SofaDocument();
		sofaDocument.setText(document);
		
		for(SofaText st : sofaTexts)
		{	
    		namedEntities = tagger.tag(st.getText());
			for(NamedEntity ne : namedEntities)
    			st.addMentionAndConcepts(ne.getMention(), ne.getConceptMatches());
			
			st.setSofaDocument(sofaDocument);
			sofaDocument.addSofaText(st);
		}
		
		return sofaDocument;
	}

	private ArrayList<SofaText> splitSentences(String document) {
		int prevPeriod = 0;
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
