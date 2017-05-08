'use strict';

visitNotesApp.controller('cloudController',
    function cloudController($scope, $location, $timeout, DateFactory, SearchFactory, VisitUuidFactory, SofaDocumentResources, WordResources){

        $scope.searchInput = "";
        
        $scope.addToSearch = function(name){
            //console.log("Added to search: " + name);
        	if($scope.searchInput === "")
        		$scope.searchInput += name ;
        	else
        		$scope.searchInput += ", " + name ;
        };

        $scope.page1Submit = function(searchInput){
        	
        	SearchFactory.setSearchTerms($scope.searchInput);
            //console.log("Page 1 submitted with searchInput: " + $scope.searchInput);
            $location.url('/view2');
        };
        
        $scope.entityTypes = [{"id": 0, "name": "All"}, {"id": 1, "name": "Problems"}, {"id": 2, "name": "Treatments"}, {"id": 3, "name": "Tests"}];
        $scope.displayNumTerms = [{"id": 0, "name": "View 5", "num": 5}, {"id": 1, "name": "View 10", "num": 10}, {"id": 2, "name": "View 20", "num": 20}, {"id": 3, "name": "View 30", "num": 3}];

        $scope.entityTypes.selectedValue = "Problems";
        $scope.displayNumTerms.selectedValue = 5;
        
        $scope.entityType = 'All';
        $scope.displayNumTerm = 20;
        
        function monthsBefore(d, months) {
  		  var nd = new Date(d.getTime());
  		  nd.setMonth(d.getMonth() - months);
  		  return nd;
  		}
        
        function formatDate(date) {
        	  
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
        
        $scope.selectEntityType = function(entity){
            //console.log("Entity type selected: " + entity.name);
            $scope.entityType = entity.name;
        };

        $scope.selectDisplayNumTerms = function(term){
            //console.log("Number of terms selected: " + term.num);
            $scope.displayNumTerm = term.num;
        };
        
        $scope.sliderMinDate = monthsBefore(new Date(), 24);
        $scope.sliderMaxDate = new Date();
        
        DateFactory.setSliderMinDate($scope.sliderMinDate);
        DateFactory.setSliderMaxDate($scope.sliderMaxDate);
        
        $scope.patient = getParameterByName('patientId');
        
        $scope.visitDatesDataUpdated = false;
        $scope.allSofadocs = SofaDocumentResources.displayAllDates({
 			patient : $scope.patient,
 			v : 'full'
		}, function() {
			$timeout(function() {
				$scope.visitDatesDataUpdated = true;
				$scope.visitDatesData = $scope.allSofadocs.results ;
			}, 0);
		});
        
        $scope.visitDateUuid = "";
        $scope.$watch('visitDateUuid', 
            function(newVals, oldVals) {
        		if($scope.visitDateUuid !== ""){
        			VisitUuidFactory.setVisitDateUuid($scope.visitDateUuid);
        			//reset visitDateUuid 
        			$scope.visitDateUuid = "";
        			//reset search Terms
                	SearchFactory.setSearchTerms("");
        			$location.url('/view2');
        		}
        	});

        $scope.words = WordResources.displayCloud({
	 			startDate: formatDate($scope.sliderMinDate),
	 			endDate: formatDate($scope.sliderMaxDate),
	 			entityType: $scope.entityType,
	 			patient : $scope.patient,
	 			numTerms: $scope.displayNumTerm,
	 			v : 'full'
			}, function() {
				//console.log('words:' + JSON.stringify($scope.words));
				$scope.finalCloud = $scope.words.results;
				//$scope.finalCloud = finalCloudDisplay($scope.words.results);
				//console.log('finalcloud: ' + JSON.stringify($scope.finalCloud));
				$timeout(function() {
					i2.emph();
				}, 0);
			});
        
        $scope.$watch('[sliderMinDate, sliderMaxDate, entityType, displayNumTerm]', 
                function(newVals, oldVals) {
        		  /*if(oldVals[0] != newVals[0])||
                	 (oldVals[1] != newVals[1]) || 
                	 (oldVals[2] != newVals[2]) ||
                	 (oldVals[3] != newVals[3])){*/
        				
        				DateFactory.setSliderMinDate($scope.sliderMinDate);
                	  	DateFactory.setSliderMaxDate($scope.sliderMaxDate);
                	  	
                	  	$scope.words = WordResources.displayCloud({
            	 			startDate: formatDate($scope.sliderMinDate),
            	 			endDate: formatDate($scope.sliderMaxDate),
            	 			entityType: $scope.entityType,
            	 			patient : $scope.patient,
            	 			numTerms: $scope.displayNumTerm,
            	 			v : 'full'
            			}, function() {
            				//console.log('words:' + JSON.stringify($scope.words));
            				$scope.finalCloud = $scope.words.results;
            				//$scope.finalCloud = finalCloudDisplay($scope.words.results);
            				//console.log('finalcloud: ' + JSON.stringify($scope.finalCloud));
            				$timeout(function() {
            					i2.emph();
            				}, 0);
            			});
                  });

});