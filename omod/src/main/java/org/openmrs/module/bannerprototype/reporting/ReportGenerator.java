package org.openmrs.module.bannerprototype.reporting;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.SofaTextMention;

public class ReportGenerator {
	private List<SofaDocument> documents;
	
	public ReportGenerator(List<SofaDocument> documents)
	{
		this.documents = documents;
	}
	
	/**
	 * returns a hashmap of <mentionString,Frequency> values
	 * 
	 */
	private Map<String,Integer> getEntityFrequencies()
	{
		Map<String,Integer> entityFrequency = new HashMap<String,Integer>();
		Integer tmp;
		String entry = "";
		
		for(SofaDocument sd : documents)
		{
			for(SofaTextMention stm : getMentions(sd))
			{
				entry = String.format("%s&&%s",stm.getMentionText(),stm.getMentionType());
				if(entityFrequency.containsKey(entry))
				{
					tmp = entityFrequency.get(entry);
					entityFrequency.put(entry,tmp + 1);
				}
				else
				{
					entityFrequency.put(entry,1);
				}	
			}
		}
		
		return entityFrequency;
		
	}
	
	public String generateAllNoteAndEntityReport()
	{
		StringBuilder out = new StringBuilder();
		out.append("patientID,DocID,date,entities&&types\n");
		
		for(SofaDocument sd : documents)
		{
			out.append(String.format("%d,%d,%s,",sd.getPatient().getPatientId(),
					                            sd.getSofaDocumentId(),
					                            sd.getDateCreated().toString()));
			
			for(SofaTextMention stm : getMentions(sd))
				out.append(String.format("%s&&%s|", stm.getMentionText(),stm.getMentionType()));
			
			out.deleteCharAt(out.length()-1);  // delete trailing |
			out.append("\n");
				
		}
		
		return out.toString();
	}
	
	public String generateEntityFrequencyReport()
	{
		Map<String,Integer> entityFrequency;
		entityFrequency = getEntityFrequencies();
		
		StringBuilder str = new StringBuilder();
		
		str.append("Entity&&Type,Frequency\n");
		
		for(Entry<String, Integer> entry : entityFrequency.entrySet())
		{
			str.append(String.format("%s,%d\n", entry.getKey(),entry.getValue()));
		}
		
		return str.toString();
	}
	
	private List<SofaTextMention> getMentions(SofaDocument sd)
	{
		List<SofaTextMention> mentions = new ArrayList<SofaTextMention>();
		for(SofaText st : sd.getSofaText())
		{
			mentions.addAll(st.getSofaTextMention());
		}
		return mentions;
	}
	
	
}
