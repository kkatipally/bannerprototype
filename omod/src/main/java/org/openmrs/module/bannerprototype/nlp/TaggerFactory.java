package org.openmrs.module.bannerprototype.nlp;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.GlobalProperty;
import org.openmrs.api.context.Context;
import org.springframework.core.io.ClassPathResource;

import banner.tagging.CRFTagger;
import banner.tokenization.Tokenizer;
import banner.tokenization.WhitespaceTokenizer;

public class TaggerFactory {
	private static CRFTagger tagger = null;
	//private static Log log = LogFactory.getLog(TaggerFactory.class);
	private static String taggerName;
	private static Tokenizer tokenizer = new WhitespaceTokenizer();

	public static CRFTagger getTagger()
	{
		
		String taggerProp = Context.getAdministrationService().getGlobalProperty("bannerprototype.tagger");

		//If no tagger has been initailized or tagger property has changed, initialize tagger
		if(tagger == null || !taggerName.equals(taggerProp))
			tagger = (CRFTagger)deserialize(taggerProp);
		
		taggerName = taggerProp;
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

