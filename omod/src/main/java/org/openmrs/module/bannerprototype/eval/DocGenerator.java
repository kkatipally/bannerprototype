package org.openmrs.module.bannerprototype.eval;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class DocGenerator {

	private ArrayList<String> docsConcat = new ArrayList<String>();
	private int numLinesPerDoc;
	private int numDocs;
	
	public DocGenerator(String docsPath) throws FileNotFoundException
	{
		File f = new File(docsPath);
		Scanner sc;
		for (File fileEntry : f.listFiles())
		{
			//System.out.println(fileEntry.getName());
			sc = new Scanner(fileEntry);
			while(sc.hasNext())
				docsConcat.add(" "+sc.nextLine());
		}
		//System.out.println(docsConcat.size());
		//System.out.println(f.listFiles().length);
		numDocs = docsConcat.size();
		numLinesPerDoc = numDocs / f.listFiles().length;
			
	}
	
	public String generateConcatenatedDoc(int docs)
	{
		StringBuffer out = new StringBuffer();
		for(int i = 0; i<docs; i++)
		{
			for(int j = 0; j<numLinesPerDoc; j++)
				out.append(docsConcat.get((int) (numDocs * Math.random())));
		}
		
		return out.toString();
	}
}
