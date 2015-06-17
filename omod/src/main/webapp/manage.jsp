<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/template/header.jsp"%>

<%@ include file="template/localHeader.jsp"%>


<head>
<style>

td input {
	width:300px;
}

</style>

</head>


<openmrs:globalProperty key="bannerprototype.conceptClassMappingProblem" var="problemClasses"/>
<openmrs:globalProperty key="bannerprototype.conceptClassMappingTest" var="testClasses"/>
<openmrs:globalProperty key="bannerprototype.conceptClassMappingTreatment" var="treatmentClasses"/>


<div class="class-mapping box">
	<table>
		<tr>
			<td>Tagger</td>
			<td>
				<select id="model-selection">
					<c:forEach var="model" items="${modelFiles}">
           				<option value=${model} >${model}</option>    		
        			</c:forEach>
				</select>
		
			</td>
		</tr>
		<tr>
			<td>Problems</td>
			<td><input type=text id=problems value=${problemClasses}> </td>
		</tr>
		<tr>
			<td>Treatments</td>
			<td><input type=text id=treatments value=${treatmentClasses}> </td>
		</tr>
		<tr>
			<td>Tests</td>
			<td><input type=text id=tests value=${testClasses}> </td>
		</tr>
	</table>
</div>
<button onClick=saveProperties()>Save </button>
<button onClick=cancelChanges()>Cancel </button>


<%@ include file="/WEB-INF/template/footer.jsp"%>
<script>

function saveProperties(){
	
	var model		=$j( "#model-selection option:selected" ).text();
	var test		=$j( "#tests" ).val();
	var problem		=$j( "#problems" ).val();
	var treatment	=$j( "#treatments" ).val();
	$j.post("manage.form",
			{"model":model,
		     "test":test,
		     "problem":problem,
		     "treatment":treatment
			},
			function(result){
				window.location.reload()
			}
			)
}

function cancelChanges()
{
	$j( "#problems" ).val("${problemClasses}");
	$j( "#tests" ).val("${testClasses}");
	$j( "#treatments" ).val("${treatmentClasses}");
	
}


</script>