package org.openmrs.module.bannerprototype.nlp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.openmrs.Concept;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;

import banner.Sentence;
import banner.tagging.CRFTagger;
import banner.tokenization.Tokenizer;
import banner.tagging.Mention;

public class NERTagger implements Serializable {
	CRFTagger tagger;
	Tokenizer tokenizer;
	ArrayList<Mention> mentions;
	ArrayList<NamedEntity> namedEntities;
	//ConceptService conceptService;
	
	
	public NERTagger()
	{
		tagger = TaggerFactory.getTagger();
		tokenizer = TaggerFactory.getTokenizer();
		
		mentions = new ArrayList<Mention>();
		namedEntities = new ArrayList<NamedEntity>();
		
		
	}
	
	public ArrayList<NamedEntity> tag(String sofa)
	{
		namedEntities.clear();
		//conceptService = Context.getConceptService();
		List<Concept> matchedConcepts = new ArrayList<Concept>();
		String mentionText;
		
		mentions.clear();
		Sentence sentence = new Sentence(sofa);
		tokenizer.tokenize(sentence);
		tagger.tag(sentence);
		
		
		mentions.addAll(sentence.getMentions());
		
		
		for(Mention m : mentions)
		{
			mentionText = m.getText();
			mentionText = cleanText(mentionText);
			//System.out.println(mentionText);
			//matchedConcepts = conceptService.getConceptsByName(mentionText);
			namedEntities.add(new NamedEntity(m,matchedConcepts));
		}
		
		return namedEntities;
		
	}
	
	public String cleanText(String text)
	{
		if(text.endsWith("s"))
			text = text.substring(0,text.lastIndexOf("s"));
		
		return text;
		
	}
}
