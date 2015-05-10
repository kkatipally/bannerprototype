package org.openmrs.module.bannerprototype.nlp;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.ClassPathResource;

import banner.tagging.CRFTagger;
import banner.tokenization.Tokenizer;
import banner.tokenization.WhitespaceTokenizer;

public class TaggerFactory {
	private static CRFTagger tagger = null;
	//private static Log log = LogFactory.getLog(TaggerFactory.class);
	private static String defaultTagger = "tagger.ser";
	private static Tokenizer tokenizer = new WhitespaceTokenizer();

	public static CRFTagger getTagger()
	{
		//log.debug("TaggerFactory.getTagger()");
		if(tagger == null)
			tagger = (CRFTagger)deserialize(defaultTagger);
		
		return tagger;
	}
	
	public static Tokenizer getTokenizer()
	{
		return tokenizer;
	}
	
	
	private static Object deserialize(String file)
	{
			//log.debug("Trying to deserialize resource: " + file);
			File f;
			try {
				f = new ClassPathResource(file).getFile();
				FileInputStream fio = new FileInputStream(f);
				InputStream buffer = new BufferedInputStream(fio);
				ObjectInputStream ois = new ObjectInputStream (buffer);
				return ois.readObject();
				
				
			} catch (IOException e1) {
				
				//log.debug("could not find serialized tagger",e1);
			} catch (ClassNotFoundException e) {
				//log.debug("could not deserialized tagger",e);
			}
			return null;

	}
}

