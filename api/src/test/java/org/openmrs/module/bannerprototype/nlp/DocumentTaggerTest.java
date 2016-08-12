/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.openmrs.module.bannerprototype.nlp;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.test.BaseContextSensitiveTest;
import org.openmrs.test.BaseModuleContextSensitiveTest;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @author kk
 */
public class DocumentTaggerTest extends BaseModuleContextSensitiveTest {
	
	@Test
	public void testsplitSentences() throws IOException {
		
		System.out.println("splitSentences");
		BufferedReader br = new BufferedReader(new FileReader(this.getClass().getClassLoader().getResource("visitnote.txt")
		        .getFile()));
		StringBuilder sb = new StringBuilder();
		String line = br.readLine();
		
		while (line != null) {
			sb.append(line);
			sb.append(System.lineSeparator());
			line = br.readLine();
		}
		
		String document = sb.toString();
		
		int prevPeriod = -1;
		int nextPeriod = document.indexOf('.');
		SofaText sofa;
		ArrayList<SofaText> sofaTexts = new ArrayList<SofaText>();
		
		//not working - String openNLPmodel = Context.getAdministrationService().getGlobalProperty("bannerprototype.sentenceDetectorModel");
		//A1ClassPathXmlApplicationContext appContext = new ClassPathXmlApplicationContext();
		//A2File f = appContext.getResource("classpath:en-sent.bin").getFile();
		String openNLPmodel = this.getClass().getClassLoader().getResource("en-sent.bin").getFile();
		InputStream is = new FileInputStream(openNLPmodel);
		SentenceModel model = new SentenceModel(is);
		SentenceDetectorME sdetector = new SentenceDetectorME(model);
		
		long startTime = System.nanoTime();
		
		String sentences[] = sdetector.sentDetect(document);
		
		for (String sentence : sentences) {
			System.out.println(sentence);
			sofa = new SofaText(sentence);
			sofaTexts.add(sofa);
		}
		
		/*while (nextPeriod != -1) {
			sofa = new SofaText(document.substring(prevPeriod + 1, nextPeriod + 1), prevPeriod + 1, nextPeriod + 1);
			sofaTexts.add(sofa);
			prevPeriod = nextPeriod;
			nextPeriod = document.indexOf('.', prevPeriod + 1);
		}*/
		
		long timeTaken = System.nanoTime() - startTime;
		System.out.println("Time taken: " + timeTaken);
	}
}
