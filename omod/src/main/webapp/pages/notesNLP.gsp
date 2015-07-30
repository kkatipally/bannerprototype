<%
 ui.decorateWith("appui", "standardEmrPage")

ui.includeJavascript("uicommons", "datatables/jquery.dataTables.min.js")
ui.includeCss("uicommons", "datatables/dataTables_jui.css")
%>

 <%= ui.resourceLinks() %>

<%
ui.includeJavascript("uicommons", "datetimepicker/bootstrap-datetimepicker.min.js")
ui.includeJavascript("bannerprototype", "i2ui.js")
ui.includeJavascript("bannerprototype","main.js")

ui.includeCss("uicommons", "datetimepicker.css")
ui.includeCss("bannerprototype", "main.css")

def dateStringFormat
def dateISOFormatted
dateStringFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
dateISOFormatted = new java.text.SimpleDateFormat("yyyy-MM-dd")
%>

<head>
<script type="text/javascript" src="/openmrs/dwr/interface/DWRNLPService.js">
<script src="/openmrs/dwr/engine.js" type="text/javascript" ></script>
<!--
<script type="text/javascript" src="http://i2ui.com/Scripts/Downloads/i2ui-1.0.0.js"></script>
-->
</head>
<style>


</style>



${ ui.includeFragment("uicommons", "fieldErrors", [ fieldName: "startDate" ]) }


<script type="text/javascript">
            //var OPENMRS_CONTEXT_PATH = 'openmrs';
            window.sessionContext = window.sessionContext || {
                locale: "en_GB"
            };
            window.translations = window.translations || {};
</script>

<script type="text/javascript">
   var breadcrumbs = [
        { icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
        { label: "${ ui.escapeJs(patient.familyName + ', ' + patient.givenName ) }" , link: '${ui.escapeJs(returnUrl)}'},
        { label: "Visit Notes Analysis"}
    ];
var ret = "${returnUrl}";
var x = 1;
</script>


<script id="breadcrumb-template" type="text/template">
    <li>
        {{ if (!first) { }}
        <i class="icon-chevron-right link"></i>
        {{ } }}
        {{ if (!last && breadcrumb.link) { }}
        <a href="{{= breadcrumb.link }}">
        {{ } }}
        {{ if (breadcrumb.icon) { }}
        <i class="{{= breadcrumb.icon }} small"></i>
        {{ } }}
        {{ if (breadcrumb.label) { }}
        {{= breadcrumb.label }}
        {{ } }}
        {{ if (!last && breadcrumb.link) { }}
        </a>
        {{ } }}
    </li>
</script>

<script>
var userId = ${user}



  jq(function() {
    jq( "#conceptTabs" ).tabs();
  });
  
</script>
<div id="tag-cloud" class="box">
<div data-i2="css:[{fontSize:'12px',color:'#888888'},{fontSize:'30px',color:'#000000'}]">

    <% tagCloudWords.each { word -> %>
    <span onCLick=doWordCloudMentionSelected(this) class=mention-type-${word.getClassName()} data-i2="rate:${word.getCount()}">${word.getWord()}</span>
    
	<% } %> 
    
</div>

</div>

<div id="history-and-key">
	<div class="search-history">
	Search History:
	<span id=search-history-items></span><br>
	<button onClick=clearSearchHistory()>clear history</button>

	</div><br>

	<div class=doc-key>
		KEY:  
		<span class=mention-type-test>test  </span>
		<span class=mention-type-treatment>treatment  </span>
		<span class=mention-type-problem>problem  </span>
	</div>
	<span id=report-problem>Feedback On Results? 
	<A HREF="mailto:$adminEmail?subject=Visit Notes Analysis Module Correction&body=[no document selected]">E-mail the administrator</A>
	</span>
</div>
<br/>
<div id="tabs-and-doc">
<div id="conceptTabs">
	<ul>
		<li>
			<a href="#showProblems" id="showProblemsTab" onclick="return changeConceptTypeTab('problem')" >Problems</a>
		</li>
		<li>
			<a id="showTreatmentsTab" href="#showTreatments" onclick="return changeConceptTypeTab('treatment')">Treatments</a>
		</li>
		<li>
			<a id="showTestsTab" href="#showTests" onclick="return changeConceptTypeTab('test')">Tests</a>
		</li>
		<li>
			<a id="showAllTab" href="#showAll" onclick="return changeConceptTypeTab('all')">All</a>
		</li>
	</ul>

<div id="showProblems" >
		<table id=problems-table>
			<thead>
			<tr>
				<th>Doc Date</th>
				<th>Problems</th>
				
			</tr>	
			</thead>
      <tbody>
	<% allSofaDocuments.each { document -> %>
	<tr class="concept-table document-${document.getSofaDocumentId()}">
	<td class="table-date" onCLick="doDocumentSelected(${document.getSofaDocumentId()})">
	
	${document.getDateCreated().toString().substring(0,10)}
	 
	</td>

	<td>
	<% document.getProblems().each { problem -> %>
	        <span onClick=doMentionSelected(this,${document.getSofaDocumentId()}) class="mention-type-problem table-mention">${problem.getMentionText()}</span>
	    <% } %>    
	</td>

	</tr>
	    <% } %>          
	</tbody> 


	</table>
</div>

<div id="showTreatments" >
		<table id=treatments-table>
			<thead>
			<tr>
				<th>Doc Date</th>
				<th>Treatments</th>
				
			</tr>	
			</thead>
      <tbody>
	<% allSofaDocuments.each { document -> %>
	<tr class="concept-table document-${document.getSofaDocumentId()}">
	<td class="table-date" onCLick="doDocumentSelected(${document.getSofaDocumentId()})">
	
	${document.getDateCreated().toString().substring(0,10)}
	 
	</td>

	<td>
	<% document.getTreatments().each { treatment -> %>
	        <span onClick=doMentionSelected(this,${document.getSofaDocumentId()}) class="mention-type-treatment table-mention">${treatment.getMentionText()}</span>
	    <% } %>    
	</td>

	</tr>
	    <% } %>          
	</tbody> 


	</table>
</div>

<div id="showTests" >
		<table id=tests-table>
			<thead>
			<tr>
				<th>Doc Date</th>
				<th>Tests</th>
				
			</tr>	
			</thead>

      <tbody>
	<% allSofaDocuments.each { document -> %>
	<tr class="concept-table document-${document.getSofaDocumentId()}">
	<td class="table-date" onCLick="doDocumentSelected(${document.getSofaDocumentId()})">
	
	${document.getDateCreated().toString().substring(0,10)}
	 
	</td>

	<td>
	<% document.getTests().each { test -> %>
	        <span onClick=doMentionSelected(this,${document.getSofaDocumentId()}) class="mention-type-test table-mention">${test.getMentionText()}</span>
	    <% } %>    
	</td>

	</tr>
	    <% } %>          
	</tbody> 


	</table>
</div>

<div id="showAll" >
		<table id=all-table>
			<thead>
			<tr>
				<th>Doc Date</th>
				<th>All</th>
				
			</tr>	
			</thead>
		
			
      
      <tbody>
	<% allSofaDocuments.each { document -> %>
	<tr class="concept-table document-${document.getSofaDocumentId()}">
	<td class="table-date" onCLick="doDocumentSelected(${document.getSofaDocumentId()})">
	
	${document.getDateCreated().toString().substring(0,10)}
	 
	</td>

	<td>
	<% document.getProblems().each { problem -> %>
	        <span onClick=doMentionSelected(this,${document.getSofaDocumentId()}) class="mention-type-problem table-mention">${problem.getMentionText()}</span>
	    <% } %>
	<% document.getTests().each { test -> %>
	        <span onClick=doMentionSelected(this,${document.getSofaDocumentId()}) class="mention-type-test table-mention">${test.getMentionText()}</span>
	    <% } %> 
	<% document.getTreatments().each { treatment -> %>
	        <span onClick=doMentionSelected(this,${document.getSofaDocumentId()}) class="mention-type-treatment table-mention">${treatment.getMentionText()}</span>
	    <% } %> 
	
	    
	</td>

	</tr>
	    <% } %>          
	</tbody> 


	</table>
</div>

${ ui.includeFragment("bannerprototype", "documentViewer") }
<script type="text/javascript">
	var patientMRN = "$patientMRN"
	var adminEmail = "$adminEmail"
	
</script>



