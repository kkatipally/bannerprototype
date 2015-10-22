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
<openmrs:globalProperty key="bannerprototype.adminEmail" var="adminEmail"/>
<openmrs:globalProperty key="bannerprototype.noteConceptId" var="noteConceptId"/>

<div class=boxHeader>Manage Tagger</div>
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
            <td></td>
            <td class=description>Choose one of the Models to tag documents</td>
        </tr>

        <tr>
            <td>Problems</td>
            <td><input type=text id=problems value=${problemClasses}> </td>
        </tr>
        <tr>
            <td></td>
            <td class=description>Comma separated list of Concept Classes to be mapped to "Problem"</td>
        </tr>
        <tr>
            <td>Treatments</td>
            <td><input type=text id=treatments value=${treatmentClasses}> </td>
        </tr>
        <tr>
            <td></td>
            <td class=description>Comma separated list of Concept Classes to be mapped to "Treatment"</td>
        </tr>
        <tr>
            <td>Tests</td>
            <td><input type=text id=tests value=${testClasses}> </td>
        </tr>
        <tr>
            <td></td>
            <td class=description>Comma separated list of Concept Classes to be mapped to "Test" </td>
        </tr>
        <tr>
            <td>Administrator Email</td>
            <td><input type=text id=adminEmail value=${adminEmail}> </td>
        </tr>
        <tr>
            <td></td>
            <td class=description>This address will be used to report incorrect annotations </td>
        </tr>
        <tr>
            <td>Concept Id for Encounter note</td>
            <td><input type=text id=noteConceptId value=${noteConceptId}> </td>
        </tr>
        <tr>
            <td></td>
            <td class=description>Concept id for Text of Encounter Note. All obs under this concept is used by the module</td>
        </tr>
    </table>
    <button onClick=saveProperties()>Save </button>
    <button onClick=cancelChanges()>Cancel </button>
</div>

<div class=boxHeader>Upload New Model </div>
<div class=box>
    <form method="POST" enctype="multipart/form-data"
          action="upload.form">
        File to upload: <input type="file" name="file"><br /> Model Name: 
        <input id="file-name" type="text" name="name"><br /> <br />
        <span id="model-name-error">Don't Forget The Model Name!</span> 
        <span id="submit-button-span"> <input id="submit-button" disabled="true" type="submit" value="Upload"></span> Press here to upload the file!
    </form>

</div>
<div class=boxHeader>Re-analyze documents</div>
<div class=box>
    <p class=description> Run the analysis on all Visit Notes in the database with the chosen Tagger<p>
        <button id="run-analysis" onCLick=reanalyzeDocuments()>Run</button>

</div> 

<div class=boxHeader>Reports</div>
<div class=box>
    <h2>Entity Frequency Report (Right click, 'save as...' to download)</h2>
    <a href="report-entity-freq.form">Entity Frequency Report</a>
    <p class=description> This report contains all entities identified and their frequencies</p>

    <h2>All Notes Report (Right click, 'save as...' to download)</h2>
    <a href="report-all-notes.form">All Notes Report</a>
    <p class=description> This report shows all entities identified broken down per visit note</p>

</div> 

<%@ include file="/WEB-INF/template/footer.jsp"%>
<script>
    $j(function () {
        $j("#file-name").on("keyup",
                function () {
                    if ($j("#file-name").val() != "")
                    {
                        document.getElementById("submit-button").disabled = false;
                        document.getElementById("model-name-error").hidden = true;
                    }
                    else
                    {
                        document.getElementById("submit-button").disabled = true;
                        document.getElementById("model-name-error").hidden = false;
                    }
                })
    })


    function saveProperties() {
        var model = $j("#model-selection option:selected").text();
        var test = $j("#tests").val();
        var problem = $j("#problems").val();
        var treatment = $j("#treatments").val();
        var adminEmail = $j("#adminEmail ").val();
        $j.post("manage.form",
                {"model": model,
                    "test": test,
                    "problem": problem,
                    "treatment": treatment,
                    "adminEmail": adminEmail
                },
        function (result) {
            window.location.reload()
        }
        )
    }

    function cancelChanges()
    {
        $j("#problems").val("${problemClasses}");
        $j("#tests").val("${testClasses}");
        $j("#treatments").val("${treatmentClasses}");

    }

    function reanalyzeDocuments()
    {
        $j("#run-analysis").text("running...")
        $j.post("reanalyze.form",
                function (data) {
                    $j("#run-analysis").text("run")
                    alert(data);
                }
        );
    }

    function allNoteReport()
    {
        window.location.href = "report-all-notes.form"
    }

    function entityFrequencyReport()
    {
        window.location.href = "report-entity-freq.form"
    }
</script>