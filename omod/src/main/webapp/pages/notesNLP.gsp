<%
 ui.decorateWith("appui", "standardEmrPage")

%>

<%= ui.resourceLinks() %>

<%
ui.includeJavascript("bannerprototype", "i2ui.js")
ui.includeJavascript("bannerprototype", "lib/jquery-3.1.0.min.js")
ui.includeJavascript("bannerprototype","lib/bootstrap.min.js")
ui.includeJavascript("bannerprototype", "lib/angular.min.js")
ui.includeJavascript("bannerprototype","lib/angular-route.min.js")
ui.includeJavascript("bannerprototype", "lib/angular-resource.min.js")
ui.includeJavascript("bannerprototype","lib/angular-animate.min.js")
ui.includeJavascript("bannerprototype", "lib/angular-sanitize.min.js")
ui.includeJavascript("bannerprototype","lib/jquery-ui.min.js")

ui.includeJavascript("bannerprototype", "lib/jQRangeSliderMouseTouch.js")
ui.includeJavascript("bannerprototype","lib/jQRangeSliderDraggable.js")
ui.includeJavascript("bannerprototype", "lib/jQRangeSliderBar.js")
ui.includeJavascript("bannerprototype","lib/jQRangeSliderHandle.js")
ui.includeJavascript("bannerprototype", "lib/jQRangeSliderLabel.js")
ui.includeJavascript("bannerprototype","lib/jQRangeSlider.js")
ui.includeJavascript("bannerprototype", "lib/jQDateRangeSliderHandle.js")
ui.includeJavascript("bannerprototype","lib/jQDateRangeSlider.js")
ui.includeJavascript("bannerprototype","lib/jQRuler.js")
ui.includeJavascript("bannerprototype", "lib/ui-bootstrap-tpls-2.4.0.min.js")
ui.includeJavascript("bannerprototype","lib/d3.min.js")

ui.includeJavascript("bannerprototype","app.js")
ui.includeJavascript("bannerprototype", "controllers/view1Controller.js")
ui.includeJavascript("bannerprototype","controllers/view2Controller.js")
ui.includeJavascript("bannerprototype", "controllers/inputController.js")
ui.includeJavascript("bannerprototype","controllers/cloudController.js")
ui.includeJavascript("bannerprototype","controllers/heatmapController.js")
ui.includeJavascript("bannerprototype","controllers/sliderController.js")
ui.includeJavascript("bannerprototype","directives/cloud.js")
ui.includeJavascript("bannerprototype", "directives/slider.js")
ui.includeJavascript("bannerprototype","directives/heatMap.js")
ui.includeJavascript("bannerprototype","services/DateFactory.js")
  
ui.includeCss("bannerprototype", "bootstrap.min.css")
ui.includeCss("bannerprototype", "iThing.css")
ui.includeCss("bannerprototype", "app.css")
%>

<script type="text/javascript">
   var breadcrumbs = [
        { icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
        { label: "${ ui.escapeJs(patient.familyName + ', ' + patient.givenName ) }" , link: '${ui.escapeJs(returnUrl)}'},
        { label: "Visit Notes Analysis"}
    ];
var ret = "${returnUrl}";
var x = 1;

jq = jQuery;

var patientMRN = "$patientMRN"
var adminEmail = "$adminEmail"
	
jq(function() {
  	if(patientMRN == "NONE")
  	{
  		patientID = document.cookie.match('prevPatient=(.*?)(;|\$)')[0]
  		patientID = patientID.replace("prevPatient","patientId")
  		patientID = patientID.replace(";","")
  		
  		returnUrl = document.cookie.match('returnUrl=(.*?)(;|\$)')[0]
  		returnUrl = returnUrl.replace(";","")
  		
  		url = window.location.href
  		url = url.substr(0,url.indexOf("?")+1)
  		url = url +"&"+patientID+"&"+returnUrl
  		
  		window.location.href = url
  		
  	}
else
  	{
  		document.cookie = "prevPatient=${patientId}"
  		document.cookie = "returnUrl=${returnUrl}"
  	}
  	 });
  	 
var userId = ${user}

    	
 // setup function
 jq(function() {
	 i2.emph();
 });

</script> 

<div ng-app="visitNotesApp" class="center" ng-controller="sliderController">
    <h4>Select start and end dates, entity type (problems/treatments/tests) and number of terms to view:</h4>
    <article>
        <div id="slider" slider></div>
    </article>

    <!--<div ng-controller="inputController">
        <div id="entityTypes" class="btn-group" data-toggle="buttons-radio" name="entityType">
            <entityType ng-repeat="entityType in entityTypes">
                <button type="button" class="btn btn-secondary" ng-click="selectEntityType(entityType.name)">
                    {{entityType.name}}
                </button>
            </entityType>
        </div>
        
        
        <div id="dropdownpage1" class="btn-group">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                View
                <span class="caret"></span></button>
            <ul id="numTermsDropdownMenu" class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <li ng-repeat="displayNumTerm in displayNumTerms">
                    <a class="dropdown-item" href="#" ng-click="selectDisplayNumTerms(displayNumTerm.name)">{{displayNumTerm.name}}</a>
                </li>
            </ul>
        </div>-->
        <br>
        <br>

<form method="get" class="horizontalForm">
<input type="hidden" name="patientId" value="${patient.patientId}"/>
<input type="hidden" name="returnUrl" value="${returnUrl}"/>

<p class="left">                
                    <select name="entityType">
                        <option value="Problems" <% if (entityType == "Problems") { %> selected <% } %>>
                            Problems
                        </option>
                        <option value="Treatments" <% if (entityType == "Treatments") { %> selected <% } %>>
                            Treatments
                        </option>
                        <option value="Tests" <% if (entityType == "Tests") { %> selected <% } %>>
                            Tests
                        </option>
                    </select>
        </p>
        
        <p class="left">                
                    <select name="numTerms">
                        <option value=5 <% if (numTerms == "5") { %> selected <% } %>>
                            View 5
                        </option>
                        <option value=10 <% if (numTerms == "10") { %> selected <% } %>>
                            View 10
                        </option>
                        <option value=20 <% if (numTerms == "20") { %> selected <% } %>>
                            View 20
                        </option>
                        <option value=30 <% if (numTerms == "30") { %> selected <% } %>>
                            View 30
                        </option>
                    </select>
        </p>
        
    	<p class="left"> 
                    <input type="submit" value="Update">
                </p>
        </form>
        </div>
</div>
      
<!--<div ng-controller="cloudController">-->
    <div id="cloudborder">
        <div id="cloud">
        <div data-i2="css:[{fontSize:'12px'},{fontSize:'30px'}]">
            
            <% tagCloudWords.each { word -> %>
    <span class=mention-type-${word.getClassName()} data-i2="rate:${word.getCount()}">${word.getWord()}</span>
    
	<% } %> 
	</div>
        </div>
    </div>
    
    <div class="container">
    <form class="form-inline searchbottom" ng-submit="page1Submit(searchInput)">
        <!-- <div class="form-group"> -->
        <div class="row"> 
        <div class="col-md-2">
            <input type="text" class="form-control" ng-model="searchInput" placeholder="Search">
        </div>
        <div class="col-md-2">
            <input type="submit" class="form-control">
            </div>
        </div>
        <!--<button type="submit" class="btn btn-default">
            <span class="glyphicon glyphicon-search"></span> Submit
        </button>-->
    </form>
</div>
    


