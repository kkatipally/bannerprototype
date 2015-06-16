<%
 ui.decorateWith("appui", "standardEmrPage")

ui.includeJavascript("uicommons", "datatables/jquery.dataTables.min.js")
ui.includeCss("uicommons", "datatables/dataTables_jui.css")
%>

 <%= ui.resourceLinks() %>

<%
ui.includeJavascript("uicommons", "datetimepicker/bootstrap-datetimepicker.min.js")
ui.includeCss("uicommons", "datetimepicker.css")

def dateStringFormat
def dateISOFormatted
dateStringFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
dateISOFormatted = new java.text.SimpleDateFormat("yyyy-MM-dd")
%>

<head>
<script type="text/javascript" src="/openmrs/dwr/interface/DWRNLPService.js">
<script src="/openmrs/dwr/engine.js" type="text/javascript" ></script>
</head>
<style>

#footer{
	position:fixed;
	bottom:0px;
}

div.doc-viewer {
    width: 48%;
    height: 600px;
    border: 1px solid #ccc;
    padding: 5px;
    overflow-x: hidden;
    float:left;
    background:white;
}

#conceptTypeSections{
    width: 48%;
    height: 1000px;
    border: 1px solid #ccc;
    padding: 5px;
    float:left;
    background:white;
}

#conceptTypeTabs {
  border-bottom: 1px solid #1aac9b;
  font-size: 0.8em;
  margin: 10px auto 7px auto;
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 2px;
  border-bottom: 1px solid navy;
  width: 99%;
}
#conceptTypeTabs ul, conceptTypeTabs li {
  display: inline;
  list-style-type: none;
  padding: 0px 0px 0px 0px;
}

#conceptTypeTabs a:link, #conceptTypeTabs a:visited {
  border: 1px solid navy;
  font-size: small;
  font-weight: bold;
  margin-right: 8px;
  padding: 2px 10px 2px 10px;
  text-decoration: none;
  color: navy;
  background: #E0E0F0;
}

.concept-table :hover{
	background-color:lightgray;
}

span.mention-type-problem {
  margin: 5px;
  margin-left:0px;
  font-family: "arial";
  font-size: 20px;
  color: rgb(190, 53, 90)
}


span.mention-type-test {
	margin: 5px;
	margin-left:0px;
  font-family: "arial";
  font-size: 20px;
  color: rgb(17, 76, 126)
}

span.mention-type-treatment {
  margin: 5px;
  margin-left:0px;
  font-family: "arial";
  font-size: 20px;
  color: rgb(33, 119, 67)
}

.table-mention:hover {
	text-shadow:0px 0px 1px gray;
	cursor: pointer; 
	cursor: hand; 
}

.table-date:hover {
	text-shadow:0px 0px 1px gray;
	cursor: pointer; 
	cursor: hand; 
}


table.datatable {
  width: 100%;
  margin: 0 auto;
  clear: both;
  border-collapse: separate;
  border-spacing: 0;
}
table.dataTable.hover tbody tr:hover{
	background-color:yellow;
}

tr.even {
	background-color:lightblue;
}


div.doc-key {
	text-align: right;
}

#doc-table {
	width=100%;
}

span.not-colored{
	color:grey;
}

div.search-history {
	text-align: left;
	float:left;
}

#search--items span {
	color:navy;
	font-size:14px;
}

#search-history-items span {
	color:navy;
	font-size:14px;
}

#search-history-items span:hover {
	text-shadow:0px 0px 1px lightgray;
	cursor: pointer; 
	cursor: hand; 
}

#history-and-key button{
	margin-bottom:5px;
}

#doc-date {
	color:navy;
	font-size:16px;
}


#conceptTabs{
    width: 48%;
    height: 500px;
    border: 1px solid #ccc;
    padding: 5px;
    float:left;
    background:white;
}

table th, table td {
  padding: 0px 0px;
  font-size: 12px;
  }

</style>



${ ui.includeFragment("uicommons", "fieldErrors", [ fieldName: "startDate" ]) }


<script type="text/javascript">
            //var OPENMRS_CONTEXT_PATH = 'openmrs';
            window.sessionContext = window.sessionContext || {
                locale: "en_GB"
            };
            window.translations = window.translations || {};
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
</div>
<br/>

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

</div>
<span id=doc-date>DATE</span>
<div id=doc-viewer class="doc-viewer">${sofaDocument.getAnnotatedHTML()}</div>

<script type="text/javascript">

var userId = ${user.getId()}

jq = jQuery;
 jq(function() { 

      jq('#problems-table').dataTable({
            "sPaginationType": "full_numbers",
            "bPaginate": true,
            "bAutoWidth": false,
            "bLengthChange": true,
            "bSort": true,
            "bJQueryUI": true
        });
        jq('#treatments-table').dataTable({
            "sPaginationType": "full_numbers",
            "bPaginate": true,
            "bAutoWidth": false,
            "bLengthChange": true,
            "bSort": true,
            "bJQueryUI": true
        });
        jq('#tests-table').dataTable({
            "sPaginationType": "full_numbers",
            "bPaginate": true,
            "bAutoWidth": false,
            "bLengthChange": true,
            "bSort": true,
            "bJQueryUI": true
        });
        jq('#all-table').dataTable({
            "sPaginationType": "full_numbers",
            "bPaginate": true,
            "bAutoWidth": false,
            "bLengthChange": true,
            "bSort": true,
            "bJQueryUI": true
        });
        
        var c = getConceptTabCookie();
        setConceptTab(c)
		
		
		var searchCookie = getsearchCookie();
		setSearchVals(searchCookie)
		changeConceptTypeTab(c);
		
		var mention = getSelectedMentionCookie();
		highlightSelectedMention(mention)
	
		updateDocumentColors(c);
		
		
		var doc = getSelectedDocumentCookie();
		highlightDocument(doc);
		
		// set keyup event binding for search box
		jq(".dataTables_filter input").keyup(searchKeyUp)
		updateTableStyle();
		refreshSearchBreadCrumb()
               
});

function setConceptTab(c){
	var conMap = {"problem":0,
	              "treatment":1,
	              "test":2,
	              "all":3};
	
	jq( "#conceptTabs" ).tabs({
  	active: conMap[c]
	});
}

function changeConceptTypeTab(cType) {
	
	setConceptTabCookie(cType)
	
	var searchVal = getSearchVal();
	setSearchCookie(searchVal)
	setSearchVals(searchVal);
	
	updateDocumentColors(cType)
	
	updateTableStyle()
    highlightSelectedMention(getSelectedMentionCookie())
    setConceptTabCookie(cType)
    
	//updateKey(cType);
	return false;
}


function doMentionSelected(obj,docId){
	
	var queryString = window.location.href.slice(window.location.href.indexOf('?'))
	var docIndex = queryString.indexOf("&docId")
	if(docIndex != -1)
		queryString =  queryString.substring(0,docIndex)
	
	
	var selectedMention = obj.innerHTML
	setSelectedMentionCookie(selectedMention)
	addSearchBreadCrumb(selectedMention,docId)
	
	var searchVal = getSearchVal();
	setSearchCookie(searchVal)
	
	setSelectedDocumentCookie(docId)
	
	window.location="/openmrs/bannerprototype/notesNLP.page"+queryString+"&docId="+docId;
	
}




function getSearchVal()
{
	var currentCookie = getsearchCookie();

	
	var searchInputs = jq(".dataTables_filter input");
	var allBlank = true;
	
	for(i = 0; i<searchInputs.length; i++)
	{
		if (searchInputs[i].value != "" ){
			allBlank = false;
		}
	}
	
	if(allBlank)
		return "";
	
	for(i = 0; i<searchInputs.length; i++)
	{
		if (searchInputs[i].value != currentCookie){
			return searchInputs[i].value;
		}
	}

	return currentCookie;
	
}


function setSearchVals(text){
	var searchInputs = jq(".dataTables_filter input");
	inputstmp = searchInputs
	//alert(searchInputs)

	for(i = 0; i<searchInputs.length; i++)
	{	
		
		
		searchInputs[i].value = text;
	}
	var e = jq.Event("keyup");
	jq(searchInputs).trigger(e)
}

function highlightSelectedMention(mention){
    var split = mention.split("-")
    mention = split[0]

    if(getConceptTabCookie() != split[1])
    {
        clearMentionHighlights()
        return false
    }
   
	
    var mentionSpans = jq(".doc-viewer span");
    mentionSpans = mentionSpans.add(jq(".table-mention"))
	
	for(i = 0; i < mentionSpans.length; i++)
	{
		if(mentionSpans[i].innerHTML == mention)
			mentionSpans[i].style.backgroundColor = "rgb(157, 198, 245)"; 
			
	}

	
}

function clearMentionHighlights()
{
    var mentionSpans = jq(".doc-viewer span");
    mentionSpans = mentionSpans.add(jq(".table-mention"))
    for(i = 0; i < mentionSpans.length; i++)
    {
        
        mentionSpans[i].style.backgroundColor = ""; 
            
    }

}


function highlightDocument(doc){
	jq(".document-"+doc + " td").css("background-color","rgb(163, 236, 227)")
	var d = jq(".document-"+doc + " td")[0]
	var date = jq(d).html();
	jq("#doc-date").html("DATE: "+date);
	
	
}

function updateDocumentColors(c)
{
	
	var conceptType = c;
	var spans = jq("#doc-viewer span")
	var keySpans = jq(".doc-key span")
	spans = spans.add(keySpans)
	

	if(conceptType == "all")
	{
		for(i = 0; i< spans.length; i++)
			spans[i].classList.remove("not-colored")
			
		return
	}
	
	var conceptClass = "mention-type-"+conceptType;
	
	
	
	for(i = 0; i< spans.length; i++)
		if(!spans[i].classList.contains(conceptClass))
			spans[i].classList.add("not-colored")
		else
			spans[i].classList.remove("not-colored")

			
}

function updateTableStyle(){
	jq("#conceptTabs tbody td").css("background-color","rgb(245, 242, 242)");
	jq("#conceptTabs table").css("background-color","rgb(200, 200, 200)");
	
	var doc = getSelectedDocumentCookie();
	highlightDocument(doc);
	
}

function doDocumentSelected(docId){
	var queryString = window.location.href.slice(window.location.href.indexOf('?'))
	var searchVal = getSearchVal();
	setSearchCookie(searchVal)
	
	setSelectedDocumentCookie(docId)
	
	jq.post("/openmrs/patientDashboard.form"+ queryString,
			{"docId":docId},
			function(result){
				window.location.reload()
			}
			)
	
	
}

function searchKeyUp(event){
	
	var searchVal = getSearchVal();
	
	//if enter, do breadcrumbs
	if (event.which == 13 || event.keyCode == 13) {
		addSearchBreadCrumb(searchVal)        

        return
    }

	
	var concepts = jq(".table-mention")
	
	if(searchVal == "")
	{
		for(i = 0; i < concepts.length; i++)
		{
			concepts[i].removeAttribute("style"); 
		}
	}
	else
	{	
		for(i = 0; i < concepts.length; i++)
		{
			var innerhtml = concepts[i].innerHTML.toLowerCase()
			if(innerhtml.indexOf(searchVal) != -1)
				concepts[i].style.backgroundColor = "rgb(157, 198, 245)";
			else
				concepts[i].removeAttribute("style"); 
		}
	}
	
	updateTableStyle()
	//setSearchCookie(searchVal)
	
}

function addSearchBreadCrumb(searchVal,docId)
{
	var newCrumb = searchVal+"-"+docId+"-"+getConceptTabCookie();

    var crumb = getBreadCrumbCookie();
	if(crumb == "")
		crumb=newCrumb;
	else
		crumb = crumb +"&"+ newCrumb;
	
	setBreadCrumbCookie(crumb);
	refreshSearchBreadCrumb()
	
}


function refreshSearchBreadCrumb()
{
	var crumbs = getBreadCrumbCookie().split("&");
	var crumbHTML = "";
	
	for(i=0; i < crumbs.length; i++)
		crumbHTML += "<span onCLick=doBreadCrumbClicked(\""+escape(crumbs[i])+"\")> > "+crumbs[i].split("-")[0]+"</span>";
		
	jq("#search-history-items").html(crumbHTML)
	
}

function doBreadCrumbClicked(crumb)
{
	crumb_vals = unescape(crumb).split("-")
    setSearchVals(crumb_vals[0])
    setSelectedMentionCookie(crumb_vals[0])
    setConceptTab(crumb_vals[2])


}

function clearSearchHistory()
{
	setBreadCrumbCookie("");
	refreshSearchBreadCrumb();
}


// ****************** COOKIE MANAGEMENT FUNCTIONS ****************************

function getBreadCrumbCookie() {
    var cookies = document.cookie.match('searchBreadCrumb-' + userId + '=(.*?)(;|\$)');
    if (cookies) {
        return unescape(cookies[1]);
    }
    return "";
}

function setBreadCrumbCookie(crumb){
    document.cookie = "searchBreadCrumb-" + userId + "="+escape(crumb);
}


function setSelectedDocumentCookie(docId){
    document.cookie = "doc-" + userId + "="+escape(docId);
}


function getSelectedDocumentCookie() {
    var cookies = document.cookie.match('doc-' + userId + '=(.*?)(;|\$)');
    if (cookies) {
        return unescape(cookies[1]);
    }
    return "";
}

function setSelectedMentionCookie(text){
    document.cookie = "mention-"+ userId + "="+escape(text+"-"+getConceptTabCookie());
}

function getSelectedMentionCookie() {
    var cookies = document.cookie.match('mention-' + userId + '=(.*?)(;|\$)');
    if (cookies) {
        return unescape(cookies[1]);
    }
    return "";
}


function setSearchCookie(searchVal) {
    document.cookie = "search-" + userId + "="+escape(searchVal);
}

function getsearchCookie() {
    var cookies = document.cookie.match('search-' + userId + '=(.*?)(;|\$)');
    if (cookies) {
        return unescape(cookies[1]);
    }
    return "";
}


function setConceptTabCookie(tabType) {
    document.cookie = "conceptTab-" + userId + "="+escape(tabType);
}


function getConceptTabCookie() {
    var cookies = document.cookie.match('conceptTab-' + userId + '=(.*?)(;|\$)');
    if (cookies) {
        return unescape(cookies[1]);
    }
    return null;
}

</script>



