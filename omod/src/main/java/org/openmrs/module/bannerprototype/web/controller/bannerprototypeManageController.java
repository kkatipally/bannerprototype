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

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.openmrs.Concept;
import org.openmrs.GlobalProperty;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaText;
import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.nlp.ConceptClassTagger;
import org.openmrs.module.bannerprototype.nlp.DocumentTagger;
import org.openmrs.module.bannerprototype.nlp.NERTagger;
import org.openmrs.module.bannerprototype.nlp.NamedEntity;
import org.openmrs.module.bannerprototype.nlp.TaggerFactory;
import org.openmrs.module.bannerprototype.reporting.ReportGenerator;
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
import org.springframework.web.multipart.MultipartFile;
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
	
	String sofa = "";
	
	public bannerprototypeManageController(){

	}

	
	@RequestMapping(value = "/module/bannerprototype/manage", method = RequestMethod.GET)
	public void manage(ModelMap model) {
		
		String modelFiles[] = null;
		String curModel = Context.getAdministrationService().getGlobalProperty("bannerprototype.tagger");
		
		try {
			modelFiles = new ClassPathResource("taggers/").getFile().list();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//set curModel as first element in array
		for(int i = 0; i<modelFiles.length; i++)
			if(modelFiles[i].equals(curModel))
			{
				modelFiles[i] = modelFiles[0];
				modelFiles[0] = curModel;
				break;
			}
		
		model.addAttribute("modelFiles",modelFiles);
		model.addAttribute("user", Context.getAuthenticatedUser());
	}
	
	@RequestMapping(value = "/module/bannerprototype/manage", method = RequestMethod.POST)
	public void setProperties(HttpServletRequest request) {
		
		String model 	= request.getParameter("model");
		String test 	= request.getParameter("test");
		String problem 	= request.getParameter("problem");
		String treatment= request.getParameter("treatment");
		String adminEmail= request.getParameter("adminEmail");
		
		
		Context.getAdministrationService().setGlobalProperty("bannerprototype.tagger",model);
		Context.getAdministrationService().setGlobalProperty("bannerprototype.conceptClassMappingProblem",problem);
		Context.getAdministrationService().setGlobalProperty("bannerprototype.conceptClassMappingTreatment",treatment);
		Context.getAdministrationService().setGlobalProperty("bannerprototype.conceptClassMappingTest",test);
		Context.getAdministrationService().setGlobalProperty("bannerprototype.adminEmail",adminEmail);
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

		model.addAttribute("sofa",sofa);
	}

    
	@RequestMapping(value = "/module/bannerprototype/upload", method = RequestMethod.POST)
    public @ResponseBody String handleFileUpload(@RequestParam("name") String name,
            @RequestParam("file") MultipartFile file) throws IOException{
        //System.out.println("in upload");
        //System.out.println(name);
        String path = new ClassPathResource("taggers/").getURL().getPath();
        if (!file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                BufferedOutputStream stream =
                        new BufferedOutputStream(new FileOutputStream(new File(path+name)));
                stream.write(bytes);
                stream.close();
                //System.out.println("uploaded!");
                return "You successfully uploaded " + name + "!\n<a href=manage.form>back</a>";
            }   catch(FileNotFoundException ex)
            {
            	ex.printStackTrace();
            	return "ERROR:  Please name your file";
            	
            }	catch (Exception e) {
                e.printStackTrace();
                return "You failed to upload " + name + " => " + e.getMessage();
            }
        } else {
            return "You failed to upload " + name + " because the file was empty.";
        }
        
        
    }
	
	@RequestMapping(value = "/module/bannerprototype/reanalyze", method = RequestMethod.POST)
    public @ResponseBody String handleReanalyzeCorpus() throws IOException{

        runReanalysis();
        
		return "Analysis Complete!";

    }
	
	
	private void runReanalysis() {

		   DocumentTagger dt = new DocumentTagger();

		   List<Concept> concepts = new ArrayList<Concept>();

		   concepts.add(Context.getConceptService().getConceptByName("Text of encounter note"));
		   
		   //this deletes all current SofaDocument and related objects
		   Context.getService(NLPService.class).truncateNLPtables();

		   
		   System.out.println("Running Analysis");
		   
		   //get observations that represent Visit Notes
		   List<Obs> obs =  Context.getObsService().getObservations(null, null, concepts,null, null, null, null, null, null, null, null, false);

		   for(Obs o : obs)
		   {   
			   SofaDocument sd = dt.tagDocument(o.getValueText());
			   sd.setPatient((Patient) o.getPerson());
			   sd.setDateCreated(o.getDateCreated());
			   Context.getService(NLPService.class).saveSofaDocument(sd);
			   
		   }
	}
	
	 
	@RequestMapping(value = "/module/bannerprototype/report-entity-freq", method = RequestMethod.GET)
	public void getEntityFreqReport(
	    HttpServletResponse response) {
		List<SofaDocument> documents = Context.getService(NLPService.class).getAllSofaDocuments();
	    ReportGenerator rg = new ReportGenerator(documents);
	    String report = rg.generateEntityFrequencyReport();
		
		try {
	      // get your file as InputStream
	      InputStream is = new ByteArrayInputStream(report.getBytes());
	      // copy it to response's OutputStream
	      org.apache.commons.io.IOUtils.copy(is, response.getOutputStream());
	      response.flushBuffer();
	    } catch (IOException ex) {
	      
	      throw new RuntimeException("IOError writing file to output stream");
	    }

	}
	
	@RequestMapping(value = "/module/bannerprototype/report-all-notes", method = RequestMethod.GET)
	public void getAllNotesReport(
	    HttpServletResponse response) {
		List<SofaDocument> documents = Context.getService(NLPService.class).getAllSofaDocuments();
	    ReportGenerator rg = new ReportGenerator(documents);
	    String report = rg.generateAllNoteAndEntityReport();
		
		try {
	      // get your file as InputStream
	      InputStream is = new ByteArrayInputStream(report.getBytes());
	      // copy it to response's OutputStream
	      org.apache.commons.io.IOUtils.copy(is, response.getOutputStream());
	      response.flushBuffer();
	    } catch (IOException ex) {
	      
	      throw new RuntimeException("IOError writing file to output stream");
	    }

	}
	
	
	/**
	 * this URL is used to send data from OpenMRS to the Training application
	 */
	@RequestMapping(value = "/module/bannerprototype/transport", method = RequestMethod.GET)
	public @ResponseBody String bannerDataDump() throws JsonGenerationException, JsonMappingException, IOException
    {        
			
			allSofaDocuments = Context.getService(NLPService.class).getAllSofaDocuments();
			SofaDocumentTransport[] transports = new SofaDocumentTransport[allSofaDocuments.size()];
			int i = 0;
			for(SofaDocument sd : allSofaDocuments)
			{
				transports[i] = new SofaDocumentTransport(sd);
				i++;
			}

			ObjectMapper mapper = new ObjectMapper();
			
			//translate Java objects to JSON objects for transport
			String out = mapper.writeValueAsString(transports);
			
			//per jsonp protocol, must wrap in callback function call.
			out = "sendJsonData("+out+");";
					
			return out;
			
    }
	
}
