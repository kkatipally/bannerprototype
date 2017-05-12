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
ui.includeJavascript("bannerprototype", "resources/sofaResources.js")
ui.includeJavascript("bannerprototype","controllers/cloudController.js")
ui.includeJavascript("bannerprototype","controllers/heatmapController.js")
ui.includeJavascript("bannerprototype", "directives/slider.js")
ui.includeJavascript("bannerprototype","directives/heatMap.js")
ui.includeJavascript("bannerprototype","directives/visitDates.js")
ui.includeJavascript("bannerprototype","directives/renderNote.js")
ui.includeJavascript("bannerprototype","services/DateFactory.js")
ui.includeJavascript("bannerprototype","services/SearchFactory.js")
ui.includeJavascript("bannerprototype","services/VisitUuidFactory.js")
ui.includeJavascript("bannerprototype","services/BreadcrumbFactory.js")
ui.includeJavascript("bannerprototype","filters/dateRangeAndTerm.js")
ui.includeJavascript("bannerprototype","filters/uniqueNotes.js")

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


</script> 

<html>
 <body ng-app="visitNotesApp">
    <base href="/"/>

    <div ng-view></div>
 </body>
</html>