/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.openmrs.module.bannerprototype.nlp;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import org.junit.Test;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.test.BaseModuleContextSensitiveTest;

/**
 * @author kavya
 */
public class DocumentTaggerTest extends BaseModuleContextSensitiveTest {
	
	@Test
	public void testsplitSentences() throws IOException {
		
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
		br.close();
		
		DocumentTagger dt = new DocumentTagger();
		ArrayList<SofaText> sofaTexts = dt.splitSentences(document);
		
		for (SofaText st : sofaTexts) {
			System.out.println(st.getText());
		}
		
	}
}
