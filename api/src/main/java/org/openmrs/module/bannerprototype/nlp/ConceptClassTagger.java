package org.openmrs.module.bannerprototype.nlp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openmrs.Concept;
import org.openmrs.ConceptClass;
import org.openmrs.ConceptName;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;

import banner.Sentence;
import banner.tagging.Mention;
import banner.tagging.MentionType;
import banner.tokenization.Tokenizer;
import banner.tokenization.WhitespaceTokenizer;

/**
 * this Class implements the Concept Dictionary class string matching
 * 
 * @author ryaneshleman
 */
public class ConceptClassTagger implements Serializable {
	
	private List<Concept> concepts;
	
	private String mention_class;
	
	private Tokenizer tokenizer;
	
	private Map<Concept, ArrayList<String>> nameMap = new HashMap<Concept, ArrayList<String>>();
	
	/**
	 * constructor is passed a list of OpenMRS concept classes and a mention class. it reads all
	 * concepts for each concept class and builds a list of concept names to map to mention-class
	 * 
	 * @param conceptClassStrs
	 * @param mention_class
	 */
	public ConceptClassTagger(ArrayList<String> conceptClassStrs, String mention_class) {
		
		this.concepts = getConceptsByClass(conceptClassStrs);
		this.mention_class = mention_class;
		this.tokenizer = new WhitespaceTokenizer();
		populateNameMap();
		
	}
	
	private void populateNameMap() {
		for (Concept c : concepts) {
			ArrayList<String> names = new ArrayList<String>();
			ArrayList<ConceptName> cNames = new ArrayList<ConceptName>();
			cNames.addAll(c.getNames());
			for (ConceptName cn : cNames)
				names.add(cn.getName());
			
			nameMap.put(c, names);
		}
		
	}
	
	/**
	 * returns a list of all OpenMRS concepts that fall into one of the classes listed in the
	 * conceptClassStrs
	 * 
	 * @param conceptClassStrs list of OpenMRS concept classes
	 * @return
	 */
	private List<Concept> getConceptsByClass(ArrayList<String> conceptClassStrs) {
		
		ConceptService cs = Context.getConceptService();
		
		List<ConceptClass> cses = cs.getAllConceptClasses();
		
		List<Concept> out = new ArrayList<Concept>();
		
		for (ConceptClass c_class : cses) {
			if (conceptClassStrs.contains(c_class.getName()))
				out.addAll(cs.getConceptsByClass(c_class));
		}
		
		return out;
	}
	
	/**
	 * Takes a string, returns NamedEntity with mentions found within string and corresponding
	 * Concept
	 * 
	 * @param str
	 * @return
	 */
	public List<NamedEntity> tag(String str) {
		String lower_str = str.toLowerCase();
		List<NamedEntity> entities = new ArrayList<NamedEntity>();
		
		for (Concept c : concepts) {
			for (String name : nameMap.get(c)) {
				
				name = name.toLowerCase();
				
				//if(lower_str.contains(" "+name))
				if (lower_str.matches("(.*) " + name + "[\\s,.?!$](.*)")) {
					
					try {
						Mention m = getMention(str, lower_str, name);
						entities.add(new NamedEntity(m, c, name));
					}
					catch (Exception e) {
						System.out.println("MENTION ERROR: " + str + " " + name);
					}
					
				}
				
			}
			
		}
		
		return entities;
		
	}
	
	/**
	 * constructs a mention from the provided arguments
	 * 
	 * @param str
	 * @param lower_str
	 * @param name
	 * @return
	 */
	private Mention getMention(String str, String lower_str, String name) {
		int token_index = 0;
		int string_index = lower_str.indexOf(name);
		int num_tokens = name.split(" ").length;
		
		for (int i = 1; i < string_index + 1; i++)
			if (lower_str.charAt(i) == ' ' && lower_str.charAt(i - 1) != ' ')
				token_index++;
		
		System.out.println(name);
		System.out.println("TOKEN INDEX: " + token_index);
		
		Sentence s = new Sentence(str);
		tokenizer.tokenize(s);
		
		Mention m = new Mention(s, MentionType.getType(mention_class), token_index, token_index + num_tokens);
		return m;
		
	}
	
}
