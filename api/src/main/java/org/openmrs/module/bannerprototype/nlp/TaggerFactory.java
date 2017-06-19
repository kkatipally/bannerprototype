package org.openmrs.module.bannerprototype.nlp;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;

import org.openmrs.api.context.Context;
import org.springframework.core.io.ClassPathResource;

import banner.tokenization.Tokenizer;
import banner.tokenization.WhitespaceTokenizer;
import com.sfsu.bannertrain.train.CRFTagger;

/**
 * This class is used to instantiate the BANNER CRFTagger object.
 * 
 * @author ryaneshleman
 */
public class TaggerFactory {
	
	private static CRFTagger tagger = null;
	
	private static String taggerName;
	
	private static Tokenizer tokenizer = new WhitespaceTokenizer();
	
	/**
	 * Instantiates and returns the BANNER CRFTagger
	 * 
	 * @return
	 */
	public static CRFTagger getTagger() {
		
		String taggerProp = "taggers" + File.separatorChar
		        + Context.getAdministrationService().getGlobalProperty("bannerprototype.tagger");
		
		tagger = (CRFTagger) deserialize(taggerProp);
		taggerName = taggerProp;
		return tagger;
	}
	
	public static Tokenizer getTokenizer() {
		return tokenizer;
	}
	
	/**
	 * checks if the name of the current tagger matches the the global property.
	 * 
	 * @param tagger_name
	 * @return
	 */
	public static boolean isNewtaggerRequired(String tagger_name) {
		String taggerProp = "taggers" + File.separatorChar
		        + Context.getAdministrationService().getGlobalProperty("bannerprototype.tagger");
		return !tagger_name.equals(taggerProp);
	}
	
	/**
	 * deserializes an object with the given file name, finds the file name in the ClassPathResource
	 * class.
	 * 
	 * @param file_name
	 * @return
	 */
	private static Object deserialize(String file_name) {
		
		File f = null;
		try {
			//hack because ClassPathResource() doesnt find
			// newly uploaded files, must find manually
			ClassPathResource cpr = new ClassPathResource("taggers");
			for (File fi : cpr.getFile().listFiles()) {
				if (fi.getPath().contains(file_name)) {
					f = fi;
					break;
				}
			}
			if (f == null)
				throw new IOException();
			
			FileInputStream fio = new FileInputStream(f);
			InputStream buffer = new BufferedInputStream(fio);
			ObjectInputStream ois = new ObjectInputStream(buffer);
			Object o = ois.readObject();
			ois.close();
			return o;
			
		}
		catch (IOException e1) {
			
			System.out.println(("could not find serialized tagger"));
			e1.printStackTrace();
		}
		catch (ClassNotFoundException e) {
			System.out.println("could not deserialized tagger/n ");
			e.printStackTrace();
		}
		return null;
		
	}
	
	public static String getTaggerName() {
		return taggerName;
	}
}
