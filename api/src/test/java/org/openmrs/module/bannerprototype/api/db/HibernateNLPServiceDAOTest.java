package org.openmrs.module.bannerprototype.api.db;

import static org.junit.Assert.*;

import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.openmrs.Patient;
import org.openmrs.module.bannerprototype.SofaDocument;
import org.openmrs.module.bannerprototype.SofaTextMention;
import org.openmrs.test.BaseModuleContextSensitiveTest;

import junit.framework.Assert;

import org.openmrs.module.bannerprototype.api.NLPService;
import org.openmrs.module.bannerprototype.api.db.NLPServiceDAO;

public class HibernateNLPServiceDAOTest extends BaseModuleContextSensitiveTest {
	
	NLPServiceDAO dao = null;
	
	@Before
	public void runBeforeEachTest() throws Exception {
		//dao = (NLPServiceDAO) applicationContext.getBean("NLPServiceDAO");
	}
	
	@Test
	public void getSofaDocumentsByPatientAndDateRange() {
		
		/*Patient patient1 = new Patient(107);
		Date oneYearAgo = new Date(System.currentTimeMillis() - (365 * 24 * 60 * 60 * 1000));
		Date today = new Date(System.currentTimeMillis());
		
		List<SofaDocument> allSofaDocuments = dao.getSofaDocumentsByPatientAndDateRange(patient1, oneYearAgo, today);
		System.out.println("---------------------SofaDocumentsByPatientAndDateRange-----------------------");
		Assert.assertEquals(1, allSofaDocuments.size());
		
		/*for (SofaDocument sd : allSofaDocuments){
			List<SofaTextMention> allMentions = sd.getAllMentions();
			for (SofaTextMention mention : allMentions)
		        System.out.println(String.format("%14d", mention));
		}*/
		
	}
	
}
