

jq = jQuery;

 // setup function
 jq(function() { 
	 
	 // set global variables
	 currentDoc = "";
	 conceptTab = "all";
	 searchVal = "";
	 curMention = "";
	 
	  // initialize data tables
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
        
		
		// set keyup event binding for search box
		jq(".dataTables_filter input").keyup(searchKeyUp)
		updateTableStyle();
		//added clearSearchHistory and commented out refreshSearchBreadCrumb to fix a bug.
		//The breadcrumbs can be clean for a new user
		//refreshSearchBreadCrumb()
		clearSearchHistory();
		i2.emph();
		
		// without this, word-cloud coloring disappears
		// there is probably a more elegant css-oriented way to solve this
		jq("span.mention-type-problem").css({"color": "rgb(190, 53, 90)"})
		jq("span.mention-type-test").css({"color": "rgb(17, 76, 126)"})
		jq("span.mention-type-treatment").css({"color": "rgb(33, 119, 67)"})

		setConceptTab("all")
      
});
 
/*
 * function changes tabs in the Visit Notes and Entity List
 * it is passed a string matching a key in the conMap dict, corresponding tab is rendered. 
 */
function setConceptTab(c){
	var conMap = {"problem":0,
	              "treatment":1,
	              "test":2,
	              "all":3};
	
	jq( "#conceptTabs" ).tabs({
  	active: conMap[c]
	});
}
/*
 * changes Concept Type tab, updates document rendering to show only entities of that type 
 */
function changeConceptTypeTab(cType) {
	
	conceptTab = cType

	setSearchVals(searchVal);
	
	updateDocumentColors(cType)
	
	updateTableStyle()

    highlightSelectedMention(getSelectedMentionCookie())

	return false;
}
/*
 * 
 */
function doWordCloudMentionSelected(obj)
{
	var selectedMention = obj.innerHTML

	setSearchVals(selectedMention)
	setConceptTab(getClassFromElement(obj));
	
	doMentionSelected(obj, -1)
}
function doMentionSelected(obj,docId){
	
	var selectedMention = obj.innerHTML.replace("-","@")

	curMention = selectedMention

	addSearchBreadCrumb(selectedMention,docId)
	
	//docID == -1 if mention selected from Word Cloud
	//update Visit Note Rendering
	if(docId != -1 && docId != currentDoc)
	{
		updateDocumentFragmentHTML(docId);
		highlightDocument(docId);
		currentDoc = docId;
	}

	highlightSelectedMention(curMention)

}


// returns entity class
function getClassFromElement(obj)
{
	var classList =jq(obj).attr('class').split(" ")
	
	
	for(index in classList)
	{
		if(classList[index].indexOf("mention-type") != -1)
			return classList[index].split("-")[2]
	}

}

// returns text in search box of data tables.  
// this is complicated by the fact that there are 4 of them, 3 hidden at any 1 time.
function getSearchVal()
{


	
	var searchInputs = jq(".dataTables_filter input");
	var allBlank = true;
	
	// check if they are blank
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
		if (searchInputs[i].value != searchVal){
			return searchInputs[i].value;
		}
	}

	return searchVal;
	
}

// sets the text of the search boxes to the input text
// then triggers a keyup event to make datatables perform search
function setSearchVals(text){
	var searchInputs = jq(".dataTables_filter input");

	for(i = 0; i<searchInputs.length; i++)
	{	
		searchInputs[i].value = text;
	}
	var e = jq.Event("keyup");
	jq(searchInputs).trigger(e)
}

// finds mentions matching the input, highlights them on the screen
function highlightSelectedMention(mention){
    var split = mention.split("-")
    mention = split[0].replace("@","-")

	clearMentionHighlights()

    var mentionSpans = jq(".doc-viewer span");

    mentionSpans = mentionSpans.add(jq(".table-mention"))

	
	for(i = 0; i < mentionSpans.length; i++)
	{
		if(mentionSpans[i].innerHTML == mention)
		{	
			jq(mentionSpans[i]).addClass("highlighted-mention") 
		}	
			
	}

	
}
/*
 * clears the highlights on mentions
 */
function clearMentionHighlights()
{
    var mentionSpans = jq(".doc-viewer span");
    mentionSpans = mentionSpans.add(jq(".table-mention"))
    for(i = 0; i < mentionSpans.length; i++)
    {
        
        jq(mentionSpans[i]).removeClass("highlighted-mention")
            
    }

}


function highlightDocument(doc){
	clearDocumentHighlights()

	jq(".document-"+doc + " td").addClass("highlighted-document")
	var d = jq(".document-"+doc + " td")[0]
	var date = jq(d).html();
	jq("#doc-date").html("DATE: "+date);
	
	
}

function clearDocumentHighlights()
{
	jq(".concept-table td").removeClass("highlighted-document")
	
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

/*
 * datatables css overrides page css, so resetting css is necessary
 */
function updateTableStyle(){
	jq("#conceptTabs tbody td").css("background-color","rgb(245, 242, 242)");
	jq("#conceptTabs table").css("background-color","rgb(200, 200, 200)");

	highlightDocument(currentDoc);
	
}

function doDocumentSelected(docId){
	
	//var queryString = window.location.href.slice(window.location.href.indexOf('?'))
	searchVal = getSearchVal();
	//setSearchCookie(searchVal)
	currentDoc = docId;
	//setSelectedDocumentCookie(docId)
	updateDocumentFragmentHTML(docId)
	highlightDocument(docId);
	
	
	
}

/*
 * highlights mentions that match current state of search box 
 */
function searchKeyUp(event){
	
	var searchVal = getSearchVal();
	
	//if enter, do breadcrumbs
	if (event.which == 13 || event.keyCode == 13) {
		addSearchBreadCrumb(searchVal)        

        return;
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
	searchVal = searchVal.replace("-","@")
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
		crumbHTML += "<span onCLick=doBreadCrumbClicked(\""+escape(crumbs[i])+"\")> > "+crumbs[i].split("-")[0].replace("@","-")+"</span>";
		
	jq("#search-history-items").html(crumbHTML)
	
}

function doBreadCrumbClicked(crumb)
{
	var crumb_vals = unescape(crumb).split("-")
	var mention = crumb_vals[0].replace("@","-")
	
    setSearchVals(mention)
    curMention = mention

    setConceptTab(crumb_vals[2])
    doDocumentSelected(crumb_vals[1])
    highlightSelectedMention(mention)


}

function clearSearchHistory()
{
	setBreadCrumbCookie("");
	refreshSearchBreadCrumb();
}

/*
 * sets values for e-mail to administrator button
 */
function updateMailto()
{
	var docNum = getSelectedDocumentCookie();

	
	var email = adminEmail;
	var subject = "Visit Notes Analysis Module Correction"
	var body = "\n[describe problem here]\n\n***********************************"
		       +"\nDocument Number: " + docNum
	           +"\nDocument Date: "+docDate
	           +"\nPatient MRN: " + patientMRN
	           +"\nVisit Note Text:\n\n " + jq("#doc-viewer").text();
		
		
		
	var href = "mailto:"+email
	           +"?subject="+escape(subject)
	           +"&body="+escape(body);
	
	jq("#report-problem a").attr("href",href)
	

}


// ****************** COOKIE and GLOBAL VARIABLE MANAGEMENT FUNCTIONS ****************************

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
	currentDoc = docId

}


function getSelectedDocumentCookie() {

	
	return currentDoc
}

function setSelectedMentionCookie(text){
	curMention = text+"-"+getConceptTabCookie()

}

function getSelectedMentionCookie() {

	return curMention;
}


function setSearchCookie(searchValue) {
	searchVal = searchValue

}

function getsearchCookie() {

	return searchVal;
}


function setConceptTabCookie(tabType) {
	conceptTab = tabType;

}


function getConceptTabCookie() {

	return conceptTab
}

