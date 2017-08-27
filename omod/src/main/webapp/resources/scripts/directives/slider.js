'use strict';

visitNotesApp.directive('slider', function($compile){
    return {
    	scope: {
    	    minDate: '=minDate',
    		sliderMinDate: '=sliderMinDate',
    		sliderMaxDate: '=sliderMaxDate'
        },
        link: function(scope, element, attrs, controller){
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            function monthsBefore(d, months) {
      		  var nd = new Date(d.getTime());
      		  nd.setMonth(d.getMonth() - months);
      		  return nd;
            }
            element.dateRangeSlider({
                    bounds: { //bounds of the date range
                        min: monthsBefore(new Date(), 24),
                        max: new Date()
                    },
                    defaultValues:{
                        min: monthsBefore(new Date(), 24),
                        max: new Date()
                    },
                    formatter:function(val){
                        var days = val.getDate(),
                            month = val.getMonth() + 1,
                            year = val.getFullYear();
                        return month + "-" + days + "-" + year;
                    },
                    range:{
                    min: {months: 3},   //User has to select a minimum of 3 months
                    max: false
                    },
                    scales: [{          //displays the Jan, Feb, etc ticks on the slider
                        first: function(value){ return value; },
                        end: function(value) {return value; },
                        next: function(value){
                            var next = new Date(value);
                            return new Date(next.setMonth(value.getMonth() + 1));
                        },
                        label: function(value){
                            return months[value.getMonth()];
                        },
                        format: function(tickContainer, tickStart, tickEnd){
                            tickContainer.addClass("myCustomClass");
                        }
                    }],
                    step:{          //User can select dates in steps of 1 week
                        //weeks: 1	//Results in incorrect end date being displayed
                    }
                }
            );
            
            scope.$watch('minDate',
                function(newVal, oldVal) {

                  // if 'val' is undefined, exit
                  if (!newVal) {
                     return;
                  }

                  element.dateRangeSlider({
                      bounds: { //bounds of the date range
                          min: newVal,
                          max: new Date()
                      }
                  });

            });

            scope.$watch('[sliderMinDate, sliderMaxDate]',
                function(newVals, oldVals) {

                  // if 'val' is undefined, exit
                  if (!newVals[0]) {
                     return;
                  }

                  element.dateRangeSlider("values", newVals[0], newVals[1]);

            });

            element.bind("userValuesChanged", function(e, data){
                scope.$apply(function() {
                	scope.sliderMinDate = data.values.min ;
                	scope.sliderMaxDate = data.values.max ;
                });
                
            });
        }
    }
});