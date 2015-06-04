<%@ include file="/WEB-INF/template/include.jsp"%>

<openmrs:htmlInclude file="/scripts/jquery/jquery-1.3.2.min.js" />
<openmrs:htmlInclude file="/scripts/jquery/dataTables/css/dataTables.css" />
<openmrs:htmlInclude file="/scripts/jquery/dataTables/js/jquery.dataTables.min.js" />


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
  margin: 10px;
  font-family: "arial";
  font-size: 18px;
  color: rgb(190, 53, 90)
}


span.mention-type-test {
	margin: 10px;
  font-family: "arial";
  font-size: 18px;
  color: rgb(17, 76, 126)
}

span.mention-type-treatment {
  margin: 10px;
  font-family: "arial";
  font-size: 18px;
  color: rgb(33, 119, 67)
}

.table-mention:hover {
	text-shadow:0px 0px 1px gray;
	cursor: pointer; 
	cursor: hand; 
}

.table-date:hover {
	text-shadow:0px 0px 1px lightgray;
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

#search-history-items span {
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

</style>

<span class="boxHeader">Texts</span>
<div class="box">
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
<div id="patientTabs">
	<ul>
		<li>
			<a id="showProblemsTab" href="#" onclick="return changeConceptTypeTab(this)"hidefocus="hidefocus">Problems</a>
		</li>
		<li>
			<a id="showTreatmentsTab" href="#" onclick="return changeConceptTypeTab(this)"hidefocus="hidefocus">Treatments</a>
		</li>
		<li>
			<a id="showTestsTab" href="#" onclick="return changeConceptTypeTab(this)"hidefocus="hidefocus">Tests</a>
		</li>
		<li>
			<a id="showAllTab" href="#" onclick="return changeConceptTypeTab(this)"hidefocus="hidefocus">All</a>
		</li>
	</ul>
	
</div>
<div id="conceptTypeSections">
	<div id="showProblems" style="display:none;">
		<table id=problems-table>
			<thead>
			<tr>
				<th>Doc Date</th>
				<th>Problems</th>
				
			</tr>	
			</thead>
		
			<tbody>
      		<c:forEach var="document" items="${allSofaDocuments}">
           	<tr class="concept-table document-${document.sofaDocumentId}">
           		<td class="table-date" onCLick="doDocumentSelected(${document.sofaDocumentId})">${document.dateCreated}</td>
           		<td>
           			<c:forEach var="problem" items="${document.problems}">
           				<span onClick=doMentionSelected(this,${document.sofaDocumentId}) class="mention-type-problem table-mention">${problem.mentionText}</span>
           			</c:forEach>
           		</td>
           	</tr>
      		</c:forEach>
      </tbody>


	</table>
	</div>
	<div id="showTreatments" style="display:none;">
		<table id=treatments-table>
			<thead>
			<tr>
				<th>Doc Date</th>
				<th>Treatments</th>
				
			</tr>	
			</thead>
		
			<tbody>
      		<c:forEach var="document" items="${allSofaDocuments}">
           	<tr class="concept-table document-${document.sofaDocumentId}">
           		<td class="table-date" onCLick="doDocumentSelected(${document.sofaDocumentId})">${document.dateCreated}</td>
           		<td>
           			<c:forEach var="treatment" items="${document.treatments}">
           				<span onClick=doMentionSelected(this,${document.sofaDocumentId})  class="mention-type-treatment table-mention">${treatment.mentionText}</span> 
           			</c:forEach>
           		</td>
           	</tr>
      		</c:forEach>
      		</tbody>


		</table>

	</div>
	<div id="showTests" style="display:none;">
	<table id=tests-table>
			<thead>
			<tr >
				<th>Doc Date</th>
				<th>Tests</th>
				
			</tr>	
			</thead>
		
			<tbody>
      		<c:forEach var="document" items="${allSofaDocuments}">
           	<tr class="concept-table document-${document.sofaDocumentId}">
           		<td class="table-date" onCLick="doDocumentSelected(${document.sofaDocumentId})">${document.dateCreated}</td>
           		<td>
           			<c:forEach var="test" items="${document.tests}">
           				<span onClick=doMentionSelected(this,${document.sofaDocumentId}) class="mention-type-test table-mention">${test.mentionText}</span>
           			</c:forEach>
           		</td>
           	</tr>
      		</c:forEach>
      		</tbody>


		</table>
	</div>	
	<div id="showAll" style="display:none;"><p>all</p>
	<table id=tests-table>
			<thead>
			<tr >
				<th>Doc Date</th>
				<th>Tests</th>
				
			</tr>	
			</thead>
		
			<tbody>
      		<c:forEach var="document" items="${allSofaDocuments}">
           	<tr class="concept-table document-${document.sofaDocumentId}">
           		<td class="table-date" onCLick="doDocumentSelected(${document.sofaDocumentId})">${document.dateCreated}</td>
           		<td>
           			<c:forEach var="test" items="${document.tests}">
           				<span onClick=doMentionSelected(this,${document.sofaDocumentId}) class="mention-type-test table-mention">${test.mentionText}</span>
           			</c:forEach>
           			<c:forEach var="problem" items="${document.problems}">
           				<span onClick=doMentionSelected(this,${document.sofaDocumentId}) class="mention-type-problem table-mention">${problem.mentionText}</span>
           			</c:forEach>
           			<c:forEach var="treatment" items="${document.tests}">
           				<span onClick=doMentionSelected(this,${document.sofaDocumentId}) class="mention-type-treatment table-mention">${treatment.mentionText}</span>
           			</c:forEach>
           		</td>
           	</tr>
      		</c:forEach>
      		</tbody>


		</table>
	</div>
	
	
	
	</div>
	
	
	
</div>
<span id=doc-date>DATE</span>
<div id=doc-viewer class="doc-viewer">${sofaDocument.annotatedHTML}</div>



</div>


<script type="text/javascript">

 $j(document).ready(function() {
        $j('#doc-table').dataTable({"pageLength": 50});
        
        $j('#treatments-table').dataTable({"pageLength": 50});
        $j('#problems-table').dataTable({"pageLength": 50});
        $j('#tests-table').dataTable({"pageLength": 50});
        
        $j("#doc-table").width("100%")
        $j("#treatments-table").width("100%")
        $j("#problems-table").width("100%")
        $j("#tests-table").width("100%")
        
        
        var c = getConceptTabCookie();
		if (c == null) {
			var tabs = document.getElementById("patientTabs").getElementsByTagName("a");
			if (tabs.length && tabs[0].id)
				c = tabs[0].id;
			else
				c="showProblemsTab"
		}
		
		var searchCookie = getsearchCookie();
		setSearchVals(searchCookie)
		changeConceptTypeTab(c);
		
		var mention = getSelectedMentionCookie();
		highlightSelectedMention(mention)
		
		
		updateDocumentColors(c);
		
		
		var doc = getSelectedDocumentCookie();
		highlightDocument(doc);
		
		// set keyup event binding for search box
		$j(".dataTables_filter input").keyup(searchKeyUp)
		updateTableStyle();
		refreshSearchBreadCrumb()
		
    } );




function changeConceptTypeTab(tabObj) {
	if (!document.getElementById || !document.createTextNode) {return;}
	if (typeof tabObj == "string")
		tabObj = document.getElementById(tabObj);
	
	if (tabObj) {
		var tabs = tabObj.parentNode.parentNode.getElementsByTagName('a');
		for (var i=0; i<tabs.length; i++) {
			if (tabs[i].className.indexOf('current') != -1) {
				manipulateClass('remove', tabs[i], 'current');
			}
			var divId = tabs[i].id.substring(0, tabs[i].id.lastIndexOf("Tab"));
			var divObj = document.getElementById(divId);
			if (divObj) {
				if (tabs[i].id == tabObj.id)
					divObj.style.display = "";
				else
					divObj.style.display = "none";
			}
		}
		addClass(tabObj, 'current');
		
		setConceptTabCookie(tabObj.id);
	}
	var searchVal = getSearchVal();
	setSearchCookie(searchVal)
	setSearchVals(searchVal);
	
	updateDocumentColors(tabObj.id)
	
	updateTableStyle()
	updateKey(tabObj.id);
	return false;
}

function updateKey(id)
{
	
}

function setConceptTabCookie(tabType) {
	document.cookie = "conceptTab-" + userId + "="+escape(tabType);
}


function getConceptTabCookie() {
	var cookies = document.cookie.match('conceptTab-' + userId + '=(.*?)(;|$)');
	if (cookies) {
		return unescape(cookies[1]);
	}
	return null;
}

function doMentionSelected(obj,docId){
	var $j = jQuery.noConflict();
	var queryString = window.location.href.slice(window.location.href.indexOf('?'))
	
	
	
	var selectedMention = obj.innerHTML
	setSelectedMentionCookie(selectedMention)
	addSearchBreadCrumb(selectedMention)
	
	var searchVal = getSearchVal();
	setSearchCookie(searchVal)
	
	setSelectedDocumentCookie(docId)
	
	$j.post("/openmrs/patientDashboard.form"+ queryString,
			{"docId":docId},
			function(result){
				window.location.reload()
			}
			)
	
	
	
}

function setSearchCookie(searchVal) {
	document.cookie = "search-" + userId + "="+escape(searchVal);
}
function getsearchCookie() {
	var cookies = document.cookie.match('search-' + userId + '=(.*?)(;|$)');
	if (cookies) {
		return unescape(cookies[1]);
	}
	return "";
}
function getSearchVal()
{
	var currentCookie = getsearchCookie();

	
	var searchInputs = $j(".dataTables_filter input");
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

var inputstmp

function setSearchVals(text){
	var searchInputs = $j(".dataTables_filter input");
	inputstmp = searchInputs
	//alert(searchInputs)

	for(i = 0; i<searchInputs.length; i++)
	{	
		
		
		searchInputs[i].value = text;
	}
	var e = $j.Event("keyup");
	$j(searchInputs).trigger(e)
}

function setSelectedMentionCookie(text){
	document.cookie = "mention-" + userId + "="+escape(text);
}

function getSelectedMentionCookie() {
	var cookies = document.cookie.match('mention-' + userId + '=(.*?)(;|$)');
	if (cookies) {
		return unescape(cookies[1]);
	}
	return "";
}

function highlightSelectedMention(mention){
	var mentionSpans = $j(".doc-viewer span");
	
	for(i = 0; i < mentionSpans.length; i++)
	{
		if(mentionSpans[i].innerHTML == mention)
			mentionSpans[i].style.backgroundColor = "rgb(157, 198, 245)"; 
			mentionSpans[i].focus()
	}
	
	var concepts = $j(".table-mention")
	
	for(i = 0; i < concepts.length; i++)
	{
		if(concepts[i].innerHTML== mention)
			concepts[i].style.backgroundColor = "rgb(157, 198, 245)"; 
	}
	
}

function setSelectedDocumentCookie(docId){
	document.cookie = "doc-" + userId + "="+escape(docId);
}

function getSelectedDocumentCookie() {
	var cookies = document.cookie.match('doc-' + userId + '=(.*?)(;|$)');
	if (cookies) {
		return unescape(cookies[1]);
	}
	return "";
}

function highlightDocument(doc){
	$j(".document-"+doc + " td").css("background-color","rgb(163, 236, 227)")
	var d = $j(".document-"+doc + " td")[0]
	var date = $j(d).html();
	$j("#doc-date").html("DATE: "+date);
	
	
}

function updateDocumentColors(c)
{
	var conceptType = c.replace("show","").replace("Tab","").toLowerCase();
	conceptType = conceptType.substring(0,conceptType.length-1)
	var spans = $j("#doc-viewer span")
	var keySpans = $j(".doc-key span")
	spans = spans.add(keySpans)
	

	if(conceptType == "al")
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
	$j("#PatientNotesNLP tbody td").css("background-color","rgb(245, 242, 242)");
	$j("#PatientNotesNLP table").css("background-color","rgb(200, 200, 200)");
	
	var doc = getSelectedDocumentCookie();
	highlightDocument(doc);
	
}

function doDocumentSelected(docId){
	var queryString = window.location.href.slice(window.location.href.indexOf('?'))
	var searchVal = getSearchVal();
	setSearchCookie(searchVal)
	
	setSelectedDocumentCookie(docId)
	
	$j.post("/openmrs/patientDashboard.form"+ queryString,
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

	
	var concepts = $j(".table-mention")
	
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

function addSearchBreadCrumb(searchVal)
{
	var crumb = getBreadCrumbCookie();
	if(crumb == "")
		crumb=searchVal;
	else
		crumb = crumb +"&"+ searchVal;
	
	setBreadCrumbCookie(crumb);
	refreshSearchBreadCrumb()
	
}

function getBreadCrumbCookie() {
	var cookies = document.cookie.match('searchBreadCrumb-' + userId + '=(.*?)(;|$)');
	if (cookies) {
		return unescape(cookies[1]);
	}
	return "";
}

function setBreadCrumbCookie(crumb){
	document.cookie = "searchBreadCrumb-" + userId + "="+escape(crumb);
}

function refreshSearchBreadCrumb()
{
	var crumbs = getBreadCrumbCookie().split("&");
	var crumbHTML = "";
	
	for(i=0; i < crumbs.length; i++)
		crumbHTML += "<span onCLick=doBreadCrumbClicked(\""+escape(crumbs[i])+"\")> > "+crumbs[i]+"</span>";
		
	$j("#search-history-items").html(crumbHTML)
	
}

function doBreadCrumbClicked(crumb)
{
	setSearchVals(unescape(crumb))	
}

function clearSearchHistory()
{
	setBreadCrumbCookie("");
	refreshSearchBreadCrumb();
}

</script>