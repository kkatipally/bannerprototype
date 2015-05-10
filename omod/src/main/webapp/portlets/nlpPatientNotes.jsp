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

</style>

<span class="boxHeader">Texts</span>
<div class="box">
<div class=doc-key>
KEY:  
<span class=mention-type-test>test  </span>
<span class=mention-type-treatment>treatment  </span>
<span class=mention-type-problem>problem  </span>
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
           		<td>${document.dateCreated}</td>
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
           		<td >${document.dateCreated}</td>
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
           		<td>${document.dateCreated}</td>
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
           		<td>${document.dateCreated}</td>
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
		
		var doc = getSelectedDocumentCookie();
		highlightDocument(doc);
		
		updateDocumentColors(c);
		
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
	return false;
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
	
	var searchVal = getSearchVal();
	setSearchCookie(searchVal)
	
	var selectedMention = obj.innerHTML
	setSelectedMentionCookie(selectedMention)
	
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

function setSearchVals(text){
	var searchInputs = $j(".dataTables_filter input");
	var e = $j.Event("keyup");
	for(i = 0; i<searchInputs.length; i++)
	{	
		searchInputs[i].value = text;
		$j(searchInputs[i]).trigger(e)
	}
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
			mentionSpans[i].style.backgroundColor = "yellow"; 
			mentionSpans[i].focus()
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
	var tr = $j(".document-"+doc)
	
	
	for(i=0; i<tr.length; i++)
		tr[i].style.backgroundColor="lightgrey"
	
}

function updateDocumentColors(c)
{
	var conceptType = c.replace("show","").replace("Tab","").toLowerCase();
	conceptType = conceptType.substring(0,conceptType.length-1)
	var spans = $j("#doc-viewer span")

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


</script>