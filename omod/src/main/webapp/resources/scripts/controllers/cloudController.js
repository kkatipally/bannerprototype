'use strict';

visitNotesApp.controller('cloudController',
    function cloudController($scope, $location, $timeout, DateFactory, SearchFactory, SofaDocumentResources, WordResources){

        $scope.searchInput = "";
        $scope.searchBarTerms = [];
        
        $scope.addToSearch = function(name){
            //console.log("Added to search: " + name);
            $scope.searchInput += " " + name;
            $scope.searchBarTerms.push(name);
        };

        $scope.page1Submit = function(searchInput){
        	
        	SearchFactory.setSearchTerms($scope.searchBarTerms);
            //console.log("Page 1 submitted with searchInput: " + $scope.searchInput);
            //console.log("Page 1 submitted with JSON.stringify(searchBarTerms): " + JSON.stringify($scope.searchBarTerms));
            //$location.path('/view2');
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
        
        /*function Word(name, className){
            this.name = name;
            this.className  = className;
            this.count = 1; // Assign that method as property.
         }
        
        function incrementCount(Word){
           Word.count++ ; 
         }
        
        function shuffle(array) {
            var counter = array.length;

            while (counter > 0) {
                let index = Math.floor(Math.random() * counter);
                counter--;
                var temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        }
        
        function finalCloudDisplay(results){
        	
        	if(typeof results  != 'undefined'){
        	var resultsarr = results;
			var clouddict = {};
			var tmp, tmpword ;

			for(var i=0; i<resultsarr.length; i++){
				tmp = resultsarr[i].display.split("/");
				if(tmp[0] in clouddict){
					incrementCount(clouddict[tmp[0]]);
				}
				else{
					clouddict[tmp[0]] = new Word(tmp[0], tmp[1]);
				}
			}
			
			var keysSorted = Object.keys(clouddict).sort(function(a,b){return clouddict[b].count-clouddict[a].count})
			
			var keysSelected;
			if (keysSorted.length > $scope.numTerms)
				keysSelected = keysSorted.slice(0, $scope.numTerms);
			else keysSelected = keysSorted;
			
			var keysShuffled = shuffle(keysSelected);
			
			var cloudSelected = [];
			for (var j=0; j<keysShuffled.length; j++){
				cloudSelected.push(clouddict[keysShuffled[j]]);
			};
			return cloudSelected;
        	}
        }*/
     
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
				//console.log('visitDatesData:' + JSON.stringify($scope.visitDatesData));
			}, 0);
		
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