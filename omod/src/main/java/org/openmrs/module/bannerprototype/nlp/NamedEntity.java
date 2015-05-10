package org.openmrs.module.bannerprototype.nlp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.openmrs.Concept;
import org.openmrs.ConceptName;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;

import banner.tagging.Mention;

public class NamedEntity {
	private Mention mention;
	private Set<Concept> conceptMatches;
	private Map<Integer,String> conceptIdToName = new HashMap<Integer,String>();
	
	
	public NamedEntity(Mention m,List<Concept> concepts)
	{
		ConceptService cs = Context.getConceptService();
		mention = m;
		conceptMatches = new HashSet<Concept>(concepts);
		
		for(Concept c : conceptMatches)
		{	
			
			Integer id = c.getId();
			ConceptName cName = cs.getConceptName(c.getId());
			String name;
			
			if(cName != null)
				name = cName.getName();
			else
				name = "|unknown|";
					
			conceptIdToName.put(id,name);
			
		}	
	}

	
	public Mention getMention() {
		return mention;
	}


	/**
	 * @return the conceptMatches
	 */
	public List<Concept> getConceptMatches() {
		return new ArrayList<Concept>(conceptMatches);
	}
	
	public String getText()
	{
		return mention.getText();
	}
	
	public Set<Entry<Integer, String>> getConceptEntrySet()
	{
		
		return conceptIdToName.entrySet();
	}
	

	public String getType()
	{
		return mention.getType().toString();
	}

}
