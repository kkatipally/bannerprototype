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
	 * returns a map of <mentionString,Frequency> values
	 * 
	 */
	private Map<String,Integer> getEntityFrequencies()
	{
		Map<String,Integer> entityFrequency = new HashMap<String,Integer>();
		Integer tmp;
		String entry = "";
		
		for(SofaDocument sd : documents)
		{
			for(SofaTextMention stm : sd.getAllMentions())
			{
				entry = String.format("%s&&%s",stm.getMentionText(),stm.getMentionType());
				
				// if entry in map, increment counter
				if(entityFrequency.containsKey(entry))
				{
					tmp = entityFrequency.get(entry);
					entityFrequency.put(entry,tmp + 1);
				}
				// if entry not in map, place in map, set counter to 1
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
		
		//report header
		out.append("patientID,DocID,date,entities&&types\n");
		
		for(SofaDocument sd : documents)
		{
			//append document info
			out.append(String.format("%d,%d,%s,",sd.getPatient().getPatientId(),
					                            sd.getSofaDocumentId(),
					                            sd.getDateCreated().toString()));
			
			//append mentions info
			for(SofaTextMention stm : sd.getAllMentions())
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
		
		str.append("Entity,Type,Frequency\n");
		
		for(Entry<String, Integer> entry : entityFrequency.entrySet())
			str.append(String.format("%s,%d\n", entry.getKey().replace("&&", ","),entry.getValue()));
		
		return str.toString();
	}
	
	
	
}
