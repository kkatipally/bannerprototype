/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.bannerprototype.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.openmrs.Concept;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.bannerprototype;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.nlp.ConceptClassTagger;
import org.openmrs.module.bannerprototype.nlp.DocumentTagger;
import org.openmrs.module.bannerprototype.nlp.NERTagger;
import org.openmrs.module.bannerprototype.nlp.NamedEntity;
import org.openmrs.module.bannerprototype.nlp.TaggerFactory;
import org.openmrs.module.bannerprototype.transport.SofaDocumentTransport;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.util.SerializationUtils;

import dragon.nlp.tool.HeppleTagger;
import dragon.nlp.tool.Lemmatiser;
import dragon.nlp.tool.MedPostTagger;
import dragon.nlp.tool.lemmatiser.EngLemmatiser;
import banner.BannerProperties;
import banner.Sentence;
import banner.tagging.CRFTagger;
import banner.tagging.Mention;
import banner.tagging.TaggedToken;
import banner.tokenization.Token;
import banner.tokenization.Tokenizer;
import banner.tokenization.WhitespaceTokenizer;

/**
 * The main controller.
 */
@Controller
public class  bannerprototypeManageController {
	
	String loadModelFileName;
	
	Tokenizer tokenizer;
	
	
	SofaDocument sofaDocument = new SofaDocument();
	List<SofaDocument> allSofaDocuments;
	int sofaDocumentId=0;
	
	//protected final Log log = LogFactory.getLog(getClass());
	String sofa = "";
	
	public bannerprototypeManageController(){

		
		
		
	}

	
	@RequestMapping(value = "/module/bannerprototype/manage", method = RequestMethod.GET)
	public void manage(ModelMap model) {
		model.addAttribute("user", Context.getAuthenticatedUser());
	}
	
	@RequestMapping(value = "/module/bannerprototype/banner", method = RequestMethod.GET)
	public void banner(ModelMap model) {
		System.out.println("loading AllSofaDocuments");
		allSofaDocuments = Context.getService(NLPService.class).getAllSofaDocuments();
		System.out.println("AllSofaDocuments Loaded");
		
		model.addAttribute("user", Context.getAuthenticatedUser());
		model.addAttribute("sofaDocument",sofaDocument);
		model.addAttribute("allSofaDocuments",allSofaDocuments);
		model.addAttribute("sofaDocumentId", sofaDocumentId);
		model.addAttribute("bannerprototype",new bannerprototype());
		model.addAttribute("sofa",sofa);
	}
	
	@RequestMapping(value = "/module/bannerprototype/analyze", method = RequestMethod.POST)
	public ModelAndView bannerpost(HttpServletRequest request,
            @ModelAttribute("bannerprototype") bannerprototype bannerprototype, BindingResult ntErrors)
    {        
           
			int patientID = Integer.parseInt(request.getParameter("patientID"));
			sofa = request.getParameter("text");
			
			
			DocumentTagger dt = new DocumentTagger();
			sofaDocument = dt.tagDocument(sofa);
			sofaDocument.setPatient(Context.getPatientService().getPatientIdentifier(patientID).getPatient());
    		
    		Context.getService(NLPService.class).saveSofaDocument(sofaDocument);


            return new ModelAndView("redirect:/module/bannerprototype/banner.form");
    }
	
	/**
	 * ReST endpoint
	 * @param docId
	 * @return
	 */
	@Transactional
	@RequestMapping(value = "/module/bannerprototype/choose", method = RequestMethod.GET)
	public @ResponseBody String bannerchoosedocument(@RequestParam(value="docId", defaultValue="1") String docId)
    {        
			//System.out.println(request.getParameter("document"));
			int sofaDocumentId = Integer.parseInt(docId);

			
			for(SofaDocument sd : allSofaDocuments)
				if(sd.getSofaDocumentId() == sofaDocumentId)
				{	
					sofaDocument = Context.getService(NLPService.class).getSofaDocumentById(sofaDocumentId);
					break;
				}
            return sofaDocument.getAnnotatedHTML();
    }
	/*
	@Transactional
	@RequestMapping(value = "/module/bannerprototype/dump", method = RequestMethod.GET)
	public @ResponseBody String bannerDataDump(@RequestParam(value="directory") String directory)
    {        
			BannerDataDump bdd = new BannerDataDump();
			
			try {
				bdd.serialize(directory, allSofaDocuments);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return "not ok";
			}
            return "OK";
    }
	*/
	/*
	@Transactional
	@RequestMapping(value = "/module/bannerprototype/classSearch", method = RequestMethod.POST)
	public @ResponseBody String bannerClasSearch(HttpServletRequest request)
    {        
		String className = request.getParameter("class");
		String text = request.getParameter("text");
		String out = "hello";
		System.out.println("in POST"+className+text);
		
		ConceptClassTagger cct = new ConceptClassTagger(className,"test");
		List<NamedEntity> foundConcepts = cct.tag(text);
		
		for(NamedEntity ne : foundConcepts)
		{
			out+=" " + ne.getText();
			
		}
		
		return out;
    }
    */
	
	@RequestMapping(value = "/module/bannerprototype/transport", method = RequestMethod.GET)
	public @ResponseBody String bannerDataDump() throws JsonGenerationException, JsonMappingException, IOException
    {        
			
		
			SofaDocumentTransport[] transports = new SofaDocumentTransport[allSofaDocuments.size()];
			int i = 0;
			for(SofaDocument sd : allSofaDocuments)
			{
				transports[i] = new SofaDocumentTransport(sd);
				i++;
			}

			ObjectMapper mapper = new ObjectMapper();
			
			String out = mapper.writeValueAsString(transports);
			out = "sendJsonData("+out+");";
					
					
			
			return out;
			
			
			
    }
	
}
