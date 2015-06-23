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

import com.sfsu.bannertrain.train.CRFTagger;
import banner.tokenization.Tokenizer;
import banner.tokenization.WhitespaceTokenizer;

public class TaggerFactory {
	private static CRFTagger tagger = null;
	//private static Log log = LogFactory.getLog(TaggerFactory.class);
	private static String taggerName;
	private static Tokenizer tokenizer = new WhitespaceTokenizer();

	public static CRFTagger getTagger()
	{
		
		String taggerProp ="taggers/"+ Context.getAdministrationService().getGlobalProperty("bannerprototype.tagger");

		//If no tagger has been initailized or tagger property has changed, initialize tagger
		
		tagger = (CRFTagger)deserialize(taggerProp);
		
		taggerName = taggerProp;
		return tagger;
	}
	
	public static Tokenizer getTokenizer()
	{
		return tokenizer;
	}
	
	public static boolean isNewtaggerRequired(String tagger_name)
	{
		String taggerProp ="taggers/"+ Context.getAdministrationService().getGlobalProperty("bannerprototype.tagger");
		return !tagger_name.equals(taggerProp);
	}
	
	
	
	private static Object deserialize(String file_name)
	{
			
			File f = null;
			try {
				//hack because ClassPathResource() doesnt find 
				// newly uploaded files, must find manually
				ClassPathResource cpr = new ClassPathResource("taggers/");
				for(File fi : cpr.getFile().listFiles())
					if(fi.getPath().contains(file_name))
					{	
						f = fi;
						break;
					}
				
				if(f==null)
					throw new IOException();
				
				FileInputStream fio = new FileInputStream(f);
				InputStream buffer = new BufferedInputStream(fio);
				ObjectInputStream ois = new ObjectInputStream (buffer);
				return ois.readObject();
				
				
			} catch (IOException e1) {
				
				System.out.println(("could not find serialized tagger"));
				e1.printStackTrace();
			} catch (ClassNotFoundException e) {
				System.out.println("could not deserialized tagger/n ");
				e.printStackTrace();
			}
			return null;

	}

	public static String getTaggerName() {
		// TODO Auto-generated method stub
		return taggerName;
	}
}

