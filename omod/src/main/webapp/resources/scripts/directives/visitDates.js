'use strict';

visitNotesApp.directive('visitDates', function($compile){

    return {
        restrict: 'E',
        scope: {
        	visitDatesData: '=visitDatesData',
        	visitDatesDataUpdated: '=visitDatesDataUpdated',
        	visitDateUuid: '=visitDateUuid',
        	sliderMinDate: '=sliderMinDate',
        	sliderMaxDate: '=sliderMaxDate'
        },
        link: function(scope, element, attrs, controller) {

        	function formatDateForToolTip(date) {

                  var day = date.getDate();
                  var month=new Array();
                    month[0]="Jan";
                    month[1]="Feb";
                    month[2]="Mar";
                    month[3]="Apr";
                    month[4]="May";
                    month[5]="Jun";
                    month[6]="Jul";
                    month[7]="Aug";
                    month[8]="Sep";
                    month[9]="Oct";
                    month[10]="Nov";
                    month[11]="Dec";

                  var mon = month[date.getMonth()];
                  var year = date.getFullYear();

                  return day+ '-' + mon + '-' + year;
            }

        	function buildviz(data, minDate, maxDate){
        		
        		var width = 900,
        		height = 50,
        		margin = { top: 0, right: 10, bottom: 0, left: 10 };
        		
        		var svg = d3.select("#visitdatesdir").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "g_main")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        		
        		var allDates = [];
        		for(var i=0; i<data.length; i++){
        			allDates.push(data[i].dateCreated);
        		}
        		allDates.sort();
        		
        		var xScale = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, width]);

        		var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %y"));

                var tooltip = d3.select("#visitdatesdir").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
                
        		var dates = svg.selectAll('.dates')
                .data(data)
                .enter().append('rect')
                .attr('x', function(d){ return xScale(new Date(d.dateCreated)) })
                .attr('y', 10)
                .attr("rx", 0)
                .attr("ry", 0)
                .attr('width', 2)
                .attr('height', 20)
                .attr("class", "datesClass")
                .attr('id', function(d, i) { return 'datesId' + i })
                .attr("class", "heatmap")
                .on("mouseover", function(d, i){
                                
                     tooltip.transition()
                        .duration(500)
                        .style("opacity", .9);
                     tooltip.html("<strong>Date: " + formatDateForToolTip(new Date(d.dateCreated)) + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d, i){
                      tooltip.transition()
                         .duration(500)
                         .style("opacity", 0);
                 })
                .on("click", function(d, i){
                      scope.$apply(function() {
                    	  scope.visitDateUuid = d.uuid;
                      });
                 });
        		
        		var xAxis = svg.append("g").call(xAxisGen)
                .attr("class","Xaxis")
                .attr("transform", "translate(" + 0 + "," + 30 + ")");
        	}//end of buildviz
        	
      	
        	scope.$watch('[visitDatesDataUpdated, sliderMinDate, sliderMaxDate]',
                    function(newVal, oldVal) {

                      // if 'val' is undefined, exit
                        if (newVal[0] == false || !newVal[1] || !newVal[2]) {
                            return;
                        }
                        
                        d3.select("svg").remove();
                        
                        var data = scope.visitDatesData;
                        var minDate = newVal[1];
                        var maxDate = newVal[2];
                        
                        buildviz(data, minDate, maxDate);
        	});

        }
    }
});