</div>

<span id=doc-date>DATE</span>
<div id=doc-viewer class="doc-viewer">$annotatedHTML</div>
</div>

<script>

function updateDocumentFragmentHTML(docId) {
        jq.getJSON('${ ui.actionLink("getHTML") }',
            {
              'docId': docId
            })
        .success(function(data) {
            jq('#doc-viewer').html(data);
            
            })
        }

</script>