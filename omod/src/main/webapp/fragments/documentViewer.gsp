</div>

<span id=doc-date>DATE</span>
<div id=doc-viewer class="doc-viewer">$annotatedHTML</div>
</div>

<script>
var docDate = "";


function updateDocumentFragmentHTML(docId) {
    var request = jq.ajax({
    dataType: "json",
    url: '${ ui.actionLink("getHTML") }',
    data: {'docId': docId},
    success: function(data) {
            jq('#doc-viewer').html(data);
            var mention = getSelectedMentionCookie();
            highlightSelectedMention(mention);
            var mention_text = mention.split("-")[0].replace("@","-");
            var scroll =  jq(findSpan(mention_text)).position().top+ jq(".doc-viewer").scrollTop() - 100
            
            jq('.doc-viewer').animate({
                scrollTop: scroll
                }, 1000);
            updateMailto();
            
            
            jq.getJSON('${ ui.actionLink("getDate") }',
            {
              'docId': docId
            })
        .success(function(data) {
            docDate = data;
            updateMailto();
            })
            },
    timeout: 2000
})
        
        
        
        /*
        jq.getJSON('${ ui.actionLink("getHTML") }',
            {
              'docId': docId
            })
        
        .success(function(data) {
            jq('#doc-viewer').html(data);
            var mention = getSelectedMentionCookie();
			highlightSelectedMention(mention);
			var mention_text = mention.split("-")[0].replace("@","-");
			var scroll =  jq(findSpan(mention_text)).position().top+ jq(".doc-viewer").scrollTop() - 100
			
            jq('.doc-viewer').animate({
        		scrollTop: scroll
    			}, 1000);
    		updateMailto();
            
            
            jq.getJSON('${ ui.actionLink("getDate") }',
            {
              'docId': docId
            })
        .success(function(data) {
            docDate = data;
            updateMailto();
            })
            })
            
            
        */    
        }
        
function findSpan(mention_text)
{
	spans =  jq(".doc-viewer span")
	
	for(index in spans)
	{
		if(jq(spans[index]).text() == mention_text)
			return spans[index];
	}
}

</script>