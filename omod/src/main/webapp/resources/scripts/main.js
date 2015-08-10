

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
		refreshSearchBreadCrumb()
		i2.emph();
		
		// without this, word-cloud coloring disappears
		// there is probably a more elegant css-oriented way to solve this
		jq("span.mention-type-problem").css({"color": "rgb(190, 53, 90)"})
		jq("span.mention-type-test").css({"color": "rgb(17, 76, 126)"})
		jq("span.mention-type-treatment").css({"color": "rgb(33, 119, 67)"})

      
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

function changeConceptTypeTab(cType) {
	
	setConceptTabCookie(cType)
	
	var searchVal = getSearchVal();
	setSearchCookie(searchVal)
	setSearchVals(searchVal);
	
	updateDocumentColors(cType)
	
	updateTableStyle()
	setConceptTabCookie(cType)
    highlightSelectedMention(getSelectedMentionCookie())
    
    
	//updateKey(cType);
	return false;
}

function doWordCloudMentionSelected(obj)
{
	var selectedMention = obj.innerHTML
	setSelectedMentionCookie(selectedMention)
	setSearchVals(selectedMention)
	setConceptTab(getClassFromElement(obj));
	
	doMentionSelected(obj, -1)
}
function doMentionSelected(obj,docId){
	
	//var queryString = window.location.href.slice(window.location.href.indexOf('?'))
	//var docIndex = queryString.indexOf("&docId")
	//if(docIndex != -1)
	//	queryString =  queryString.substring(0,docIndex)
	
	console.log(docId)
	var selectedMention = obj.innerHTML.replace("-","@")//.replace("\n"," ")
	console.log("before setSelectedMentionCookie")
	setSelectedMentionCookie(selectedMention)
	console.log("before addSearchBreadCrumb")
	addSearchBreadCrumb(selectedMention,docId)
	
	console.log("before getSearchVal")
	var searchVal = getSearchVal();
	console.log("before setSearchCookie")
	setSearchCookie(searchVal)
	
	console.log("before setSelectedDocumentCookie")	
	//window.location="/openmrs/bannerprototype/notesNLP.page"+queryString+"&docId="+docId;
	console.log(currentDoc)
	console.log(docId)
	if(docId != -1 && docId != currentDoc)
	{
		updateDocumentFragmentHTML(docId);
		highlightDocument(docId);
		currentDoc = docId;
	}
	console.log("before getSelectedMentionCookie")
	var mention = getSelectedMentionCookie();
	console.log(mention)
	console.log("before highlightSelectedMention")
	highlightSelectedMention(mention)

			
	console.log("ok!")
}

function getClassFromElement(obj)
{
	var classList =jq(obj).attr('class').split(" ")
	
	
	for(index in classList)
	{
		if(classList[index].indexOf("mention-type") != -1)
			return classList[index].split("-")[2]
	}

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
    mention = split[0].replace("@","-")
	//console.log("1")
	clearMentionHighlights()
	//console.log("2")
    //if(getConceptTabCookie() != split[1])
    //{
    //    return false
    //}
   
    //console.log("3")
    var mentionSpans = jq(".doc-viewer span");
    //console.log("4")
    mentionSpans = mentionSpans.add(jq(".table-mention"))
    //console.log("5")
	
	for(i = 0; i < mentionSpans.length; i++)
	{
		//console.log(i)
		if(mentionSpans[i].innerHTML == mention)
		{	
			//console.log("!")
			jq(mentionSpans[i]).addClass("highlighted-mention") 
			//console.log("!!")
		}	
			
	}
    
    //console.log("6")
    return false;
	
}

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
	updateDocumentFragmentHTML(docId);
	highlightDocument(docId);
	
	
	
}

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
    setSelectedMentionCookie(mention)
    setConceptTab(crumb_vals[2])
    doDocumentSelected(crumb_vals[1])
    highlightSelectedMention(mention)


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
	currentDoc = docId
    document.cookie = "doc-" + userId + "="+escape(docId);
}


function getSelectedDocumentCookie() {
    //var cookies = document.cookie.match('doc-' + userId + '=(.*?)(;|\$)');
    //if (cookies) {
    //    return unescape(cookies[1]);
   // }
    //return "";
	
	return currentDoc
}

function setSelectedMentionCookie(text){
	curMention = text+"-"+getConceptTabCookie()
    //document.cookie = "mention-"+ userId + "="+escape(text+"-"+getConceptTabCookie());
}

function getSelectedMentionCookie() {
    //var cookies = document.cookie.match('mention-' + userId + '=(.*?)(;|\$)');
    //if (cookies) {
    //    return unescape(cookies[1]);
    //}
    //return "";
	
	return curMention;
}


function setSearchCookie(searchValue) {
	searchVal = searchValue
    //document.cookie = "search-" + userId + "="+escape(searchVal);
}

function getsearchCookie() {
    //var cookies = document.cookie.match('search-' + userId + '=(.*?)(;|\$)');
    //if (cookies) {
    //    return unescape(cookies[1]);
    //}
    //return "";
	return searchVal;
}


function setConceptTabCookie(tabType) {
	conceptTab = tabType;
    //document.cookie = "conceptTab-" + userId + "="+escape(tabType);
}


function getConceptTabCookie() {
    //var cookies = document.cookie.match('conceptTab-' + userId + '=(.*?)(;|\$)');
    //if (cookies) {
    //   return unescape(cookies[1]);
    //}
    //return null;
	return conceptTab
}

function updateMailto()
{
	var docNum = getSelectedDocumentCookie();
	//docDate
	//patientMRN
	
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
	
	//<span id=report-problem>See a problem? 
	//		<A HREF="mailto:ryaneshleman@gmail.com?subject=Visit Notes Analysis Module Correction&body=Just testing">E-mail the administrator</A>
	//		</span>
}
