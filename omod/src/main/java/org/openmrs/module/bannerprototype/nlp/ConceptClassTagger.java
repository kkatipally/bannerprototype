package org.openmrs.module.bannerprototype.nlp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openmrs.Concept;
import org.openmrs.ConceptClass;
import org.openmrs.ConceptName;
import org.openmrs.annotation.Authorized;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;

import banner.Sentence;
import banner.tagging.Mention;
import banner.tagging.MentionType;
import banner.tokenization.Tokenizer;
import banner.tokenization.WhitespaceTokenizer;


public class ConceptClassTagger implements Serializable {
	
	private List<Concept> concepts;
	private String mention_class;
	private Tokenizer tokenizer;
	private Map<Concept,ArrayList<String>> nameMap = new HashMap<Concept,ArrayList<String>>();
	
	public ConceptClassTagger(ArrayList<String> conceptClassStrs,String mention_class){

		this.concepts = getConceptsByClass(conceptClassStrs);
		this.mention_class = mention_class;
		this.tokenizer = new WhitespaceTokenizer();
		populateNameMap();
		
	}


	private void populateNameMap() {
		for(Concept c : concepts)
		{
			ArrayList<String> names = new ArrayList<String>();
			ArrayList<ConceptName> cNames = new ArrayList<ConceptName>();
			cNames.addAll(c.getNames()); 
			for(ConceptName cn : cNames)
				names.add(cn.getName());
			
			nameMap.put(c, names);
		}
		
	}


	private List<Concept> getConceptsByClass(ArrayList<String> conceptClassStrs) {
		//System.out.println("1");
		ConceptService cs = Context.getConceptService();
		//System.out.println("2");
		List<ConceptClass> cses =  cs.getAllConceptClasses();
		//System.out.println("ConceptClasses: "+cses.size());
		
		List<Concept> out = new ArrayList<Concept>();
		
		for(ConceptClass c_class : cses)
		{
			//System.out.println(c_class.getName());
			if(conceptClassStrs.contains(c_class.getName()))
				out.addAll(cs.getConceptsByClass(c_class));
		}
		
		return out;
	}
	
	/**
	 * Takes a string, returns NamedEntity with mentions found within string and corresponding Concept 
	 * @param str
	 * @return
	 */
	public List<NamedEntity> tag(String str)
	{
		String lower_str = str.toLowerCase();
		List<NamedEntity> entities = new ArrayList<NamedEntity>();
		
		for(Concept c : concepts)
		{
			for(String name : nameMap.get(c))
			{
				//System.out.println(cn.getName());
				name = name.toLowerCase();
				//this is a hack and needs to be cleaned up
				if(lower_str.contains(" "+name+" "))
				{
					try{
					Mention m = getMention(str,lower_str,name);
					entities.add(new NamedEntity(m,c,name));
					}catch(Exception e)
					{
						System.out.println("MENTION ERROR: " +  str + " " + name);
					}
					
				}
				else
					continue;
				
			}	
			
		}
		
		return entities;
		
	}


	private Mention getMention(String str, String lower_str, String name) {
		int token_index = 0;
		int string_index = lower_str.indexOf(name);
		int num_tokens = name.split(" ").length;
		
		for(int i=0; i<string_index + 1; i++)
			if(lower_str.charAt(i) ==' ')
				token_index++;
		
		//System.out.println(token_index);
		//System.out.println(str);
		//System.out.println(name);
		//System.out.println(num_tokens);
		Sentence s = new Sentence(str);
		tokenizer.tokenize(s);
		
		Mention m = new Mention(s,MentionType.getType(mention_class),token_index,token_index+num_tokens);
		return m;
		
	}

}
