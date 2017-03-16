'use strict';

visitNotesApp.controller('heatmapController', 
		function($scope, $location, DateFactory, SearchFactory, SofaTextMentionUIResources) {

	/*
	 * $scope.dateSelOptions = [{"datename": "All Dates", "datevalue": 14},
	 * {"datename": "Last Year", "datevalue": 12}, {"datename": "Last 6 mo",
	 * "datevalue": 6}, {"datename": "Last 3 mo", "datevalue": 3}];
	 * $scope.termSelOptions = [{"termname": "Only search terms", "termvalue":
	 * "Search"}, {"termname": "All terms", "termvalue": "All"}, {"termname":
	 * "Use toggle below", "termvalue": "Toggle"}];
	 * 
	 * $scope.$watch('dateSel', function() { console.log("dateSel has changed: " +
	 * angular.toJson($scope.dateSel)); });
	 * 
	 * $scope.$watch('termSel', function() { console.log("termSel has changed: " +
	 * angular.toJson($scope.termSel)); });
	 * 
	 * $scope.dateSel = $scope.dateSelOptions[0]; $scope.termSel =
	 * $scope.termSelOptions[0];
	 * 
	 * $scope.selectDateSel = function(date){ //console.log("Date for chart
	 * selected: " + date.value); $scope.dateSel = date; };
	 * 
	 * $scope.selectTermSel = function(term){ //console.log("Terms for chart
	 * selected: " + term.value); $scope.termSel = term; };
	 */

	function monthsBefore(d, months) {
		var nd = new Date(d.getTime());
		nd.setMonth(d.getMonth() - months);
		return nd;
	}

	function monthsAfter(d, months) {
		var nd = new Date(d.getTime());
		nd.setMonth(d.getMonth() + months);
		return nd;
	}
	
	function formatDate(date) {
  	  
	  console.log("date: " + date);
  	  var day = date.getDate();
  	  var month;
  	  if(date.getMonth() < 9){
  		  month = date.getMonth() + 1;
  		  month = "0" + month;
  	  }
  	  else {
  		  month = date.getMonth() + 1;
  	  }
  	  
  	  var year = date.getFullYear();

  	  return year + '-' + month + '-' + day;
  	}
	
	function getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

	// $scope.$watch(function () { return DateFactory.getSliderMinDate(); },
	// function (newValue, oldValue) {
	// if (newValue !== oldValue) {
	$scope.startDate = {
		"name" : DateFactory.getSliderMinDate()
	};
	console.log("startDate: " + $scope.startDate.name );
	// }
	// });
	// $scope.$watch(function () { return DateFactory.getSliderMaxDate(); },
	// function (newValue, oldValue) {
	// if (newValue !== oldValue) {
	$scope.endDate = {
		"name" : DateFactory.getSliderMaxDate()
	};
	// console.log("Slider max in heatmapCtrl: " + $scope.endDate.name);
	// }
	// });

	$scope.minDate1 = monthsBefore(new Date(), 24);

	$scope.dateOptions1 = {
		formatYear : 'yy',
		minDate : $scope.minDate1, // min start date: 2 years ago from today
		startingDay : 0
	};

	$scope.$watch('endDate.name', function(newEnd) {
		if (newEnd) {
			$scope.dateOptions1.maxDate = monthsBefore(newEnd, 3); // max start
																	// date: min
																	// of end
																	// Date and
																	// 3 months
																	// ago from
																	// today
		}
	});

	$scope.$watch('startDate.name', function(newStart) {
		if (newStart) {
			$scope.dateOptions2.minDate = monthsAfter(newStart, 3); // min end
																	// date:
																	// start
																	// date
		}
	});

	$scope.dateOptions2 = {
		formatYear : 'yy',
		maxDate : new Date(), // max end date: today
		startingDay : 0
	};

	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.open2 = function() {
		$scope.popup2.opened = true;
	};

	$scope.formats = [ 'MM-dd-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate' ];
	$scope.format = $scope.formats[0];
	$scope.altInputFormats = [ 'M!/d!/yyyy' ];

	$scope.popup1 = {
		opened : false
	};

	$scope.popup2 = {
		opened : false
	};

	$scope.resetHeatMap = function() {

	};

	// d3.json("/moduleResources/bannerprototype/d3data.json", function(error,
	// data) {
	/*d3.json('/' + OPENMRS_CONTEXT_PATH
			+ '/ms/uiframework/resource/bannerprototype/d3data.json', function(
			error, data) {

		// check if the file loaded properly
		if (error) {
			console.log(error);
		} else {
			// console.log(JSON.stringify(data));
			$scope.val = data;
		}

	});*/

	$scope.patient = getParameterByName('patientId');
	$scope.searchTerms = SearchFactory.getSearchTerms();

	$scope.stms = SofaTextMentionUIResources.displayHeatMap({
		patient : $scope.patient,
		startDate : formatDate($scope.startDate.name),
		endDate : formatDate($scope.endDate.name),
		searchTerms : $scope.searchTerms,
		v : "full"
	}, function() {
		console.log("heatmap:" + JSON.stringify($scope.stms.results));
		$scope.val = $scope.stms.results;
		$scope.visitNotes = populateVisitNoteList($scope.stms.results);
		console.log("visitNotes:" + JSON.stringify($scope.visitNotes));
	});
	
	function displayDate(date) {
  	  
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
		                  "Jul", "Aug", "Sep", "Oct","Nov", "Dec"];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;
  	}
	
	function populateVisitNoteList(results){
		
		var Notes = [];
		results.forEach(function (result, i){
			result.dateList.forEach(function (date, j){
				var note = {};
				note["uuid"] = date.uuid;
				note["term"] = result.mentionText;
				note["date"] = displayDate(new Date(date.dateCreated));
				note["diagnosis"] = date.diagnosis;
				note["provider"] = date.provider;
				note["location"] = date.location;
				Notes.push(note);
			});
		});
		return Notes;
	}
	
	$scope.visitListSearchInput = "";

    $scope.backToSearchPage = function(){
        //$location.path('/view1');
        $location.url('/view1');
    };

    $scope.visitListSearch = function(visitListSearchInput){
        console.log("Visit list search clicked with: " + visitListSearchInput);
    };

    $scope.rendering = "Morbi libero urna, pretium sed arcu vitae, luctus semper sem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque quam dui, congue id gravida quis, tempor sit amet justo. Aliquam blandit placerat nisi, in condimentum erat semper sed.Cras quam lorem, vestibulum nec mi elementum, pulvinar venenatis sapien. Suspendisse vitae nulla mattis, laoreet nibh ut, elementum mi. Nullam vestibulum mi arcu, nec mattis lorem facilisis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

});


