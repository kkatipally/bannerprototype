'use strict';

visitNotesApp.controller('cloudController',
    function cloudController($scope, $location, $timeout, DateFactory, SearchFactory, VisitUuidFactory,
    BreadcrumbFactory, SofaDocumentResources, WordResources){

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

        $scope.patient = getParameterByName('patientId');

        $scope.visitDatesDataUpdated = false;
        $scope.allSofadocs = SofaDocumentResources.displayAllDates({
            patient : $scope.patient,
            v : 'full'
        }, function() {
            $timeout(function() {
                $scope.visitDatesDataUpdated = true;
                $scope.visitDatesData = $scope.allSofadocs.results ;
                var allDates = [];
                    for(var i=0; i<$scope.visitDatesData.length; i++){
                        allDates.push($scope.visitDatesData[i].dateCreated);
                    }
                allDates.sort();
                $scope.patientMinDate = new Date(allDates[0]);

                $scope.minDate = monthsBefore(new Date(), 24);
                if($scope.minDate > $scope.patientMinDate)
                    $scope.minDate = $scope.patientMinDate;
                DateFactory.setMinDate($scope.minDate);

                if(!DateFactory.getSliderMinDate()){
                    $scope.sliderMinDate = $scope.minDate;
                    DateFactory.setSliderMinDate($scope.sliderMinDate);
                } else {
                    $scope.sliderMinDate = DateFactory.getSliderMinDate();
                    $scope.sliderMaxDate = DateFactory.getSliderMaxDate();
                }
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
                    SearchFactory.setSearchInput("");
                    $location.url('/view2');
                }
            });

        $scope.entityTypes = [{"id": 0, "name": "All"}, {"id": 1, "name": "Problems"}, {"id": 2, "name": "Treatments"}, {"id": 3, "name": "Tests"}];
        $scope.displayNumTerms = [{"id": 0, "name": "View 5", "num": 5}, {"id": 1, "name": "View 10", "num": 10}, {"id": 2, "name": "View 20", "num": 20}, {"id": 3, "name": "View 30", "num": 30}];

        $scope.entityTypes.selectedValue = "Problems";
        $scope.displayNumTerms.selectedValue = 5;
        
        $scope.entityType = 'All';
        $scope.displayNumTerm = 20;
        
        $scope.selectEntityType = function(entity){
            $scope.entityType = entity.name;
        };

        $scope.selectDisplayNumTerms = function(term){
            $scope.displayNumTerm = term.num;
        };

        $scope.sliderMinDate = monthsBefore(new Date(), 24);
        $scope.sliderMaxDate = new Date();

        $scope.words = WordResources.displayCloud({
	 			startDate: formatDate($scope.sliderMinDate),
	 			endDate: formatDate($scope.sliderMaxDate),
	 			entityType: $scope.entityType,
	 			patient : $scope.patient,
	 			numTerms: $scope.displayNumTerm,
	 			v : 'full'
			}, function() {
				$scope.finalCloud = $scope.words.results;
				$timeout(function() {
					i2.emph();
				}, 0);
			});
        
        $scope.$watch('[sliderMinDate, sliderMaxDate, entityType, displayNumTerm]', 
                function(newVals, oldVals) {

        			if((newVals[0] !== oldVals[0])||(newVals[1] !== oldVals[1])||
        				 (newVals[2] !== oldVals[2])||(newVals[3] !== oldVals[3])){
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
            				$scope.finalCloud = $scope.words.results;
            				$timeout(function() {
            					i2.emph();
            				}, 0);
            			});
            			}
                  });

        $scope.searchInput = "";
        $scope.searchInput = SearchFactory.getSearchInput();

        $scope.addToSearch = function(name){
            if($scope.searchInput === "")
                $scope.searchInput += name ;
            else {
                $scope.searchBarTerms = $scope.searchInput.split(",");

                for (var i = 0; i < $scope.searchBarTerms.length; i++) {
                    $scope.searchBarTerms[i] = $scope.searchBarTerms[i].trim().toLowerCase();
                }

                if($scope.searchBarTerms.indexOf(name) == -1)
                    $scope.searchInput += ", " + name ;
            }
        };

        $scope.page1Submit = function(searchInput){

            SearchFactory.setSearchInput($scope.searchInput);
            $location.url('/view2');
        };

        $scope.breadCrumbs = [];
        if (BreadcrumbFactory.getBreadCrumbs() != "")
            $scope.breadCrumbs = BreadcrumbFactory.getBreadCrumbs();

        $scope.clearHistory = function(term) {
            $scope.breadCrumbs = [];
        }

        BreadcrumbFactory.setAddNewBreadCrumb(true);

        $scope.clickBreadCrumb = function(term) {

            $timeout(
                function() {
                    $scope.sliderMinDate = term.startDate;
                    $scope.sliderMaxDate = term.endDate;

                    DateFactory.setSliderMinDate($scope.sliderMinDate);
                    DateFactory.setSliderMaxDate($scope.sliderMaxDate);

                    BreadcrumbFactory.setAddNewBreadCrumb(false);

                    $scope.searchInput = term.word;
                }, 0);
        }
});