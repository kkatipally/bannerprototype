<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/template/header.jsp"%>

<%@ include file="template/localHeader.jsp"%>
<openmrs:htmlInclude file="/scripts/jquery/jquery-1.3.2.min.js" />
<openmrs:htmlInclude
	file="/scripts/jquery/dataTables/css/dataTables.css" />
<openmrs:htmlInclude
	file="/scripts/jquery/dataTables/js/jquery.dataTables.min.js" />


<style>
div.doc-viewer {
	width: 49%;
	height: 600px;
	border: 1px solid #ccc;
	padding: 5px;
	overflow-x: hidden;
	float: left;
	background: white;
}

span.mention-type-problem {
	background: rgb(236, 106, 141)
}

tr.document :hover {
	background-color: yellow;
}

span.mention-type-test {
	background: rgb(106, 236, 127);
}

span.mention-type-treatment {
	background: rgb(106, 152, 236);
}

table.datatable {
	width: 100%;
	margin: 0 auto;
	clear: both;
	border-collapse: separate;
	border-spacing: 0;
}

table.dataTable.hover tbody tr:hover {
	background-color: yellow;
}

tr.even {
	background-color: lightblue;
}

div.doc-key {
	text-align: right;
}

#doc-table {
	width: 100%;
}
</style>
<p>Hello ${user.systemId}!</p>


<span class="boxHeader">Texts</span>
<div class="box">
	<div class=doc-key>
		KEY: <span class=mention-type-test>test </span> <span
			class=mention-type-treatment>treatment </span> <span
			class=mention-type-problem>problem </span>
	</div>
	<div class="doc-viewer">

		<table id=doc-table>
			<thead>
				<tr>
					<th>Date</th>
					<th>Description</th>
				</tr>
			</thead>

			<tbody>
				<c:forEach var="document" items="${allSofaDocuments}">
					<tr class=document
						onClick=doDocumentSelected(${document.sofaDocumentId})>
						<td>${document.dateCreated}</td>
						<td>SHORT DESCRIPTION</td>
					</tr>
				</c:forEach>
			</tbody>


		</table>

	</div>
	<div id=doc-viewer class="doc-viewer">${sofaDocument.annotatedHTML}</div>

</div>

<span class="boxHeader">Enter Text</span>
<div class="box">
	<form action="analyze.form" method="post">
		<table cellpadding="5">
			<tr>
				<td><spring:bind path="bannerprototype.string">

						<textarea rows="25" cols="100" name="text">
                </textarea>
						<input type="text" name="patientID">

					</spring:bind></td>
			</tr>

		</table>

		<input type="submit" value="OK">
	</form>
</div>
<script type="text/javascript">

 $j(document).ready(function() {
	    
        $j('#doc-table').dataTable({"pageLength": 50});
        
        
        $j("#doc-table").width("100%")
        
        //$j.post("/openmrs/module/bannerprototype/classSearch.form",
		//	{"class":"Test",
        //	"text": "Test text with CD4"},
		//	function(result){
		//		alert(result)
		//	}
		//	)
    } );


function doDocumentSelected(docId){
	
	var xmlhttp;
	if (window.XMLHttpRequest)
  	{// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp=new XMLHttpRequest();
  	}
	else
  	{// code for IE6, IE5
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}
  	
  	xmlhttp.onreadystatechange=function()
  	{
  		if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    	document.getElementById("doc-viewer").innerHTML=xmlhttp.responseText;
    	
    }
}

	xmlhttp.open("GET","choose.form?docId="+docId,true);
	xmlhttp.send();

}


</script>



<%@ include file="/WEB-INF/template/footer.jsp"%>