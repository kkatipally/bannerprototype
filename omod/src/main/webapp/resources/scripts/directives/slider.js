'use strict';

visitNotesApp.directive('slider', function($compile){
    return {
        link: function(scope, element, attrs, controller){
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            element.dateRangeSlider({
                    bounds: { //bounds of the date range
                        min: new Date(2015, 0, 1),
                        max: new Date(2017, 0, 1)
                    },
                    defaultValues:{
                        min: new Date(2015, 0, 1),
                        max: new Date(2017, 0, 1)
                    },
                    formatter:function(val){
                        var days = val.getDate(),
                            month = val.getMonth() + 1,
                            year = val.getFullYear();
                        return month + "-" + days + "-" + year;
                    },
                    range:{
                    min: {months: 6},   //User has to select a minimum of 6 months
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
                        weeks: 1
                    }
                }
            );
            element.bind("userValuesChanged", function(e, data){
                console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
            });
        }
    }
});