<%
 ui.decorateWith("appui", "standardEmrPage")

%>

<%= ui.resourceLinks() %>

<%
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
</script>

<html ng-app="visitNotesApp"/>
<base href="/"/>

<div ng-view></div>

