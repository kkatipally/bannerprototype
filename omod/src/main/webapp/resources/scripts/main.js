
//var userId = ${user.getId()}

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
		i2.emph();
		
		jq("span.mention-type-problem").css({"color": "rgb(190, 53, 90)"})
		jq("span.mention-type-test").css({"color": "rgb(17, 76, 126)"})
		jq("span.mention-type-treatment").css({"color": "rgb(33, 119, 67)"})




		
		
               
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
	
	//window.location="/openmrs/bannerprototype/notesNLP.page"+queryString+"&docId="+docId;
	if(docId != -1)
	{
		updateDocumentFragmentHTML(docId);
		highlightDocument(docId)
	}	
	var mention = getSelectedMentionCookie();
	highlightSelectedMention(mention)
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
    mention = split[0]
	
	clearMentionHighlights()
    if(getConceptTabCookie() != split[1])
    {
        return false
    }
   
	
    var mentionSpans = jq(".doc-viewer span");
    mentionSpans = mentionSpans.add(jq(".table-mention"))
	
	for(i = 0; i < mentionSpans.length; i++)
	{
		if(mentionSpans[i].innerHTML == mention)
			jq(mentionSpans[i]).addClass("highlighted-mention") 
			
	}

	
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
