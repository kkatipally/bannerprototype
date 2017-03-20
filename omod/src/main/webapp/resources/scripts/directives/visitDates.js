'use strict';

visitNotesApp.directive('visitDates', function($compile){

    return {
        restrict: 'E',
        scope: {
        	visitDatesData: '=visitDatesData',
        	visitDatesDataUpdated: '=visitDatesDataUpdated'
        },
        link: function(scope, element, attrs, controller) {
        	
        	function buildviz(data){
        		
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
        		console.log("allDates: " + JSON.stringify(allDates));
        		allDates.sort();
        		
        		var minDate = monthsBefore(new Date(), 24); /*new Date(allDates[0]);*/
        		var maxDate = new Date(); /*new Date(allDates[allDates.length-1]);*/
        		
        		var xScale = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, width]);

        		var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %y"));
        		var yAxisGen = d3.axisLeft();
        		
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
                                tooltip.html("<strong>Date: " + new Date(d.dateCreated) + "</strong>")
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d, i){
                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                 });
        		
        		var xAxis = svg.append("g").call(xAxisGen)
                .attr("class","Xaxis")
                .attr("transform", "translate(" + 0 + "," + 30 + ")");
        	}
        	
        	scope.$watch('visitDatesData', 
                    function(newVal, oldVal) {
                      //if(oldVal != newVal){

                        d3.select("svg").remove();
                        
                     // if 'val' is undefined, exit
                        if (!newVal) {
                            return;
                        }

                        var data = newVal;

                        buildviz(data);
                      //}
        	}, true);
        	
        	function monthsBefore(d, months) {
        		  var nd = new Date(d.getTime());
        		  nd.setMonth(d.getMonth() - months);
        		  return nd;
        		}
        }
    }
});