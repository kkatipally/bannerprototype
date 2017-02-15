'use strict';

visitNotesApp.controller('cloudController',
    function cloudController($scope, DateFactory, SofaDocumentResource, SofaDocumentResources, SofaTextMentionResource, SofaTextMentionResources){

        $scope.searchInput = "";

        /*$scope.addToSearch = function(name){
            console.log("Added to search: " + name);
            $scope.searchInput = $scope.searchInput + " " + name;
        };

        $scope.page1Submit = function(searchInput){
            console.log("Page 1 submitted with: " + searchInput);
            //$location.path('/view2');
            //$location.url('/view2');
        };*/
        
        $scope.entityTypes = [{"id": 0, "name": "Problems"}, {"id": 1, "name": "Treatments"}, {"id": 2, "name": "Tests"}];
        $scope.displayNumTerms = [{"id": 5, "name": "View 5"}, {"id": 10, "name": "View 10"}, {"id": 20, "name": "View 20"}, {"id": 30, "name": "View 30"}];

        $scope.entityTypes.selectedValue = "Problems";
        $scope.displayNumTerms.selectedValue = 5;
        
        $scope.entityType = 'Problems';
        $scope.numTerms = '5';
        
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
            console.log("Entity type selected: " + entity.name);
            $scope.entityType = entity.name;
        };

        $scope.selectDisplayNumTerms = function(term){
            console.log("Number of terms selected: " + term.id);
            $scope.numTerms = term.id;
        };
        
        //$scope.startDate = { "name": DateFactory.getSliderMinDate() };
        //$scope.endDate = { "name": DateFactory.getSliderMaxDate() };
      
        $scope.sliderMinDate = monthsBefore(new Date(), 24);
        $scope.sliderMaxDate = new Date();
        
        DateFactory.setSliderMinDate($scope.sliderMinDate);
        DateFactory.setSliderMaxDate($scope.sliderMaxDate);
        
        $scope.$watch('sliderMinDate', function (newValue, oldValue) {
            //if (newValue !== oldValue) {
            	DateFactory.setSliderMinDate(newValue);
            	//console.log("Slider min in sliderController: " + newValue);
            //}
            	$scope.sofatextmentions = SofaTextMentionResources.displayCloud({
    	 			startDate: formatDate(newValue),
    	 			endDate: formatDate($scope.sliderMaxDate),
    	 			entityType: $scope.entityType,
    	 			patient : $scope.patient
    			}, function() {
    				console.log("After start date change:");
    				console.log($scope.sofatextmentions);
    			});
        });
        
        $scope.$watch('sliderMaxDate', function (newValue, oldValue) {
            //if (newValue !== oldValue) {
            	DateFactory.setSliderMaxDate(newValue);
            	//console.log("Slider max in sliderController: " + newValue);
            //}
                	$scope.sofatextmentions = SofaTextMentionResources.displayCloud({
        	 			startDate: formatDate($scope.sliderMinDate),
        	 			endDate: formatDate(newValue),
        	 			entityType: $scope.entityType,
        	 			patient : $scope.patient
        			}, function() {
        				console.log("After end date change:");
        				console.log($scope.sofatextmentions);
        			});

        });
        
        $scope.patient = getParameterByName('patientId');
        
        //$scope.sofadoctest1 = SofaDocumentResource.get({ id: '1d840527-cef9-4a90-9f98-0ea9bffffe2f' }, function() {
        $scope.sofatextmention1 = SofaTextMentionResource.get(function() {
        	console.log($scope.sofatextmention1.mentionText);
          }); // get() returns a single entry

 
        $scope.sofatextmentions = SofaTextMentionResources.displayCloud({
	 			startDate: formatDate($scope.sliderMinDate),
	 			endDate: formatDate($scope.sliderMaxDate),
	 			entityType: $scope.entityType,
	 			patient : $scope.patient
			}, function() {
				console.log($scope.sofatextmentions);
			});
        
        $scope.$watch('entityType', function(newVal, oldVal) {
            //if(newVal) {
            	$scope.sofatextmentions = SofaTextMentionResources.displayCloud({
    	 			startDate: formatDate($scope.sliderMinDate),
    	 			endDate: formatDate($scope.sliderMaxDate),
    	 			entityType: newVal,
    	 			patient : $scope.patient
    			}, function() {
    				console.log("After change:");
    				console.log($scope.sofatextmentions);
    			});
           // }
          });

});