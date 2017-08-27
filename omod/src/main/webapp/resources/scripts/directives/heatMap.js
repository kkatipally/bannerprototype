'use strict';

visitNotesApp.directive('heatMap', function($compile){

    return {
        restrict: 'E',
        scope: {
            val: '=val',
            startDate: '=startDate',
            endDate: '=endDate',
            filterFromDate: '=filterFromDate', //Used to filter visit notes
            filterToDate: '=filterToDate', //Used to filter visit notes
            matchTerm: '=matchTerm', //Used to filter visit notes
            searchInput: '=searchInput', //Used to add term to the search bar
            resetMap: '=resetMap', //Reset the heatmap
            scrollToList: '=scrollToList', //Scroll down to the Visit List section upon click in heatmap
            visitListInput: '=visitListInput' //Populates input in the Visit Note List
        },
        link: function(scope, element, attrs, controller) {

        	var minDate = scope.startDate.name;
            var maxDate = scope.endDate.name;

            if((minDate === "") || (maxDate === ""))
                return;

            var numMonths = 1 + maxDate.getMonth() - minDate.getMonth() + (12 * (maxDate.getFullYear() - minDate.getFullYear()));

            var i, j, k, heatRect, markDates,
                groupMonths = 3,
                margin = { top: 30, right: 0, bottom: 0, left: 0 },
                width = 870 - margin.left - margin.right,
                termWidth = 200,
                gridWidth = ((width-2*termWidth)/numMonths),
                gridHeight = 20,
            	legendElementWidth = 100;

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

            function updateviz(origData, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms){

                var data1 = JSON.parse(JSON.stringify(origData));
                var data2, data, termfound;
                var toggleArray = [];

                var numMonths = 1 + maxDate.getMonth() - minDate.getMonth() + (12 * (maxDate.getFullYear() - minDate.getFullYear()));

                for(var n=0; n<searchTerms.length; n++){
                    termfound = 0;
                    for(var m=0; m<negToggleArray.length; m++){
                        if(searchTerms[n] === negToggleArray[m]){
                            termfound = 1;
                        }
                    }
                    if(termfound === 0){
                        toggleArray.push(searchTerms[n]);
                    }
                }

                data1.forEach(function(d){
                    for(var n=0; n<negToggleArray.length; n++){
                        if ((d.mentionText === negToggleArray[n]) && (d.relatedTo === null)){
                            d.symbol = '(+)';
                        }
                    }
                    for(var m=0; m<toggleArray.length; m++){
                        if ((d.mentionText === toggleArray[m]) && (d.relatedTo === null)){
                            d.symbol = '(-)';
                        }
                    }
                });

                data1.forEach(function(d){
                    d.dateList.filter(function(d) {
                        return ((new Date(d.dateCreated) >= minDate) && (new Date(d.dateCreated) <= maxDate) );
                    });
                });

                for(var n=0; n<negToggleArray.length; n++){
                    data1 = data1.filter(function(d, j) {
                        return (d.relatedTo !== negToggleArray[n]);
                    });
                }
                data2 = data1;

                for(var m=0; m<xdeleteArray.length; m++){
                    data2 = data2.filter(function(d, j) {
                        return ((d.mentionText !== xdeleteArray[m]) && (d.relatedTo !== xdeleteArray[m]))
                    });
                }

                data = data2;

                d3.select("svg").remove();

                var allTerms = data.map(function(d){ return d.mentionText;});

                var svg = d3.select("#heatmapdir").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", ((allTerms.length+searchTerms.length+4)*gridHeight) + margin.top + margin.bottom)
                    .append("g")
                    .attr("class", "g_main")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tooltip = d3.select("#heatmapdir").append("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

                svg.selectAll('.nestedClass').remove();
                
                var nested = svg.selectAll('.g_main')
                    .data(data)
                    .enter().append('g')
                    .attr("class", "nestedClass")
                    .attr('id', function(d, i) { return 'nestedId' + i });

                //scales
                var xScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, width-termWidth*2]);

                var j = 0,
                AllRect = [];
                //This section is used to get frequencies from all rectangles of the heatmap for the color scale
                nested
                .each(function(d1, nestedInd) {

                    var grps = Math.ceil(numMonths/groupMonths);
                    var startRect, endRect, lengthRect, yRect, totFreq, addFreq, currentDate;
                    var startIndex = 0;
                    var DataRect = [];
                    
                    function getVisitDate(d, i){ return d[i]['dateCreated'];}
                    function gettotFreq(d, i){ return d[i]['mentionCount'];}
                    
                    startRect = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                    endRect = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                    
                    i = 0;
                    while(endRect < maxDate){ //handles notes entered today
                    	var listDates = [];
                        var newdate;
                        addFreq = 0;
                        yRect = j;
                        
                        if(i == 0){
                        	if(startRect.getMonth() <= 2) //Before March
                        		endRect = new Date(startRect.getFullYear(), 3, 1, 0, 0, 0, 0);
                        	else if(startRect.getMonth() <= 5) //April to June
                        		endRect = new Date(startRect.getFullYear(), 6, 1, 0, 0, 0, 0);
                        	else if(startRect.getMonth() <= 8) //July to September
                        		endRect = new Date(startRect.getFullYear(), 9, 1, 0, 0, 0, 0);
                        	else //October to December
                        		endRect = new Date(startRect.getFullYear(), 12, 1, 0, 0, 0, 0);
                        }
                        else{
                        	endRect = new Date(startRect.getFullYear(), startRect.getMonth() + groupMonths, 1, 0, 0, 0, 0);
                        }
                        endRect = new Date(Math.min(endRect, maxDate)); //handles notes entered today

                        for(k=0; k<d1.dateList.length; k++){ 
                            currentDate = new Date(getVisitDate(d1.dateList, k));

                            if((currentDate >= startRect) && (currentDate < endRect)){
                                addFreq += gettotFreq(d1.dateList, k);
                                newdate = {
                                    "date": new Date(currentDate.getTime()),
                                    "yDate": j,
                                    "dateFreq": gettotFreq(d1.dateList, k)
                                }
                            }
                            else if (currentDate >=  endRect){
                                //startIndex = k;
                                break;
                            }
                        }
                        var newdata = {
                            "startRect":  new Date(startRect.getTime()),
                            "endRect": new Date(endRect.getTime()),
                            "yRect": yRect,
                            "lengthRect": lengthRect,
                            "totFreq":  addFreq
                        }
                        AllRect.push(newdata);
                        startRect= new Date(endRect.getTime());
                        i++;
                    }
                });
                
                var colorScale = d3.scaleLinear()
                                .domain([0, d3.max(AllRect, function(d){ return d.totFreq;})])
                                .range(['#ffffd9', '#ff0033']); //red

                //Draws all the visualization row by row
                nested
                    .each(function(d1, nestedInd) {

                        if ((searchTerms.indexOf(d1.mentionText) > -1) && (d1.relatedTo === null) && (nestedInd > 0)){
                            var emptyLine = d3.select(this)
                                .selectAll('.emptyline')
                                .data(d1)
                                .enter().append('rect')
                                .attr('x', 0)
                                .attr("y", function (d, i) { return ((gridHeight*3)/4) + ((j+1) * gridHeight); })
                                .attr('width', width)
                                .attr('height', gridHeight)
                                .attr('fill', 'white')
                                .attr("class", "emptyline");
                            j++;
                        }

                        var grps = Math.ceil(numMonths/groupMonths);
                        var startRect, endRect, lengthRect, yRect, totFreq, addFreq, currentDate, mention;
                        var startIndex = 0;
                        var DataRect = [];

                        function getVisitDate(d, i){ return d[i]['dateCreated'];}

                        function gettotFreq(d, i){ return d[i]['mentionCount'];}
                        
                        startRect = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                        endRect = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                        mention = d1.mentionText;
                        
                        i = 0;
                        while(endRect < maxDate){ //handles notes entered today
                        	var listDates = [];
                            var newdate;
                            addFreq = 0;
                            yRect = j;

                            if(i == 0){
                            	if(startRect.getMonth() <= 2) //Before March
                            		endRect = new Date(startRect.getFullYear(), 3, 1, 0, 0, 0, 0);
                            	else if(startRect.getMonth() <= 5) //April to June
                            		endRect = new Date(startRect.getFullYear(), 6, 1, 0, 0, 0, 0);
                            	else if(startRect.getMonth() <= 8) //July to September
                            		endRect = new Date(startRect.getFullYear(), 9, 1, 0, 0, 0, 0);
                            	else //October to December
                            		endRect = new Date(startRect.getFullYear(), 12, 1, 0, 0, 0, 0);
                            }
                            else{
                            	endRect = new Date(startRect.getFullYear(), startRect.getMonth() + groupMonths, 1, 0, 0, 0, 0);
                            }
                            endRect = new Date(Math.min(endRect, maxDate)); //handles notes entered today

                            for(k=0; k<d1.dateList.length; k++){
                                currentDate = new Date(getVisitDate(d1.dateList, k));

                                if((currentDate >= startRect) && (currentDate < endRect)){
                                    addFreq += gettotFreq(d1.dateList, k);
                                    newdate = {
                                        "date": new Date(currentDate.getTime()),
                                        "yDate": j,
                                        "dateFreq": gettotFreq(d1.dateList, k),
                                        "provider": d1.dateList[k]['provider'],
                                        "location": d1.dateList[k]['location'],
                                        "diagnosis": d1.dateList[k]['diagnosis']
                                    }
                                    listDates.push(newdate);
                                }
                                else if (currentDate >=  endRect){
                                    break;
                                }
                            }
                            var newdata = {
                                "startRect":  new Date(startRect.getTime()),
                                "endRect": new Date(endRect.getTime()),
                                "yRect": yRect,
                                "lengthRect": lengthRect,
                                "totFreq":  addFreq,
                                "mention": mention,
                                "listDates": listDates
                            }
                            DataRect.push(newdata);
                            startRect= new Date(endRect.getTime());
                            i++;
                        }

                        d3.select(this).select(".expandLabel").remove();

                        var expandLabel = d3.select(this).append("text")
                            .text(function(d) { return d.symbol})
                            .attr("x", 0)
                            .attr("y", function (d, i) { return ((gridHeight*3)/4) + (j * gridHeight); })
                            .style('text-anchor', 'start')
                            .style('font-family', 'sans-serif')
                            .style('font-size', '15')
                            .attr('class', 'expandLabel')
                            .each(
                                function(d){
                                    d3.select(this).classed(d.expand, true)
                                });

                        d3.select(this).select(".yLabel").remove();

                        var yLabel = d3.select(this).append("text")
                            .text(function (d) { return d.mentionText; })
                            .attr("x", 1.4*termWidth)
                            .attr("y", function (d, i) { return ((gridHeight*3)/4) + (j * gridHeight); })
                            .style('text-anchor', 'end')
                            .style('font-family', 'sans-serif')
                            .attr('class', 'yLabel')
                            .each( //sets the color of the text
                                function(d){
                                    d3.select(this).classed(d.mentionType, true)
                                })
                            .on("contextmenu", function(d, i){ //right click to add to search bar
                            	d3.event.preventDefault();
                            	scope.$apply(function() {
                            		if(scope.searchInput === "")
                                		scope.searchInput += d.mentionText ;
                                	else{
                                        scope.searchBarTerms = scope.searchInput.split(",");
                                        for (var i = 0; i < scope.searchBarTerms.length; i++) {
                                            scope.searchBarTerms[i] = scope.searchBarTerms[i].trim().toLowerCase();
                                        }
                                        if(scope.searchBarTerms.indexOf(d.mentionText) == -1)
                                            scope.searchInput += ", " + d.mentionText ;
                                    }
                            	});
                            })
                            .on("click", function(d, i){ //left click to add to Visit Note List filter
                            	scope.$apply(function() {
                                    scope.scrollToList = true;
                                    scope.visitListInput = d.mentionText;
                            	});
                            });                            

                        d3.select(this).selectAll('.heatmap').remove();
                        
                        heatRect = d3.select(this)
                            .selectAll('.heatmap')
                            .data(DataRect)
                            .enter().append('rect')
                            .attr('x', function(d){ return 1.5*termWidth + xScale(d.startRect) })
                            .attr('y', function(d){ return ((d.yRect)*gridHeight); })
                            .attr("rx", 4)
                            .attr("ry", 4)
                            .attr('width', function(d){ return xScale(d.endRect)-xScale(d.startRect)})
                            .attr('height', gridHeight)
                            .attr('fill', function(d) { return colorScale(d.totFreq) })
                            .attr('id', function(d, i) { return 'heatmapRect' + d.yRect + i; })
                            .attr("class", "heatmap")
                            .on("mouseover", function(d, i){

                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", .9);
                                tooltip.html("<strong>Frequency: " + d.totFreq + "</strong>")
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");

                                var markDatesClass = 'markDates' + d.yRect + i;
                                d3.selectAll('.g_main').selectAll('.nestedClass').selectAll('.'+markDatesClass)
                                .attr("visibility", "visible");
                                
                                d3.select(this).attr('visibility', 'hidden');
                                
                            })
                            .on("mouseout", function(d, i){
                                d3.select(this).attr('visibility', 'visible');
                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                                
                                var markDatesClass = 'markDates' + d.yRect + i;
                                d3.selectAll('.g_main').selectAll('.nestedClass').selectAll('.'+markDatesClass)                                //.style("opacity", 0);
                                .attr('visibility', 'hidden');
                            })
                            .on("click", function(d, i){
                            	scope.$apply(function() {
                            		scope.filterFromDate = new Date(d.startRect);
                            		scope.filterToDate = new Date(d.endRect);
                            		scope.matchTerm = d.mention;
                            		scope.scrollToList = true;
                            	});
                            });
                        
                        heatRect
                            .each(function(d2, k) {
                         	
                            	markDates = nested
                                .selectAll('markDatesClass')
                                .data(d2.listDates).enter()
                                .append('rect')
                                .attr('x', function(d1){ return 1.5*termWidth + xScale(d1.date) })
                                .attr('y', function(d1){ return (d1.yDate)*gridHeight; })
                                .attr("rx", 4)
                                .attr("ry", 4)
                                .attr('width', 4)
                                .attr('height', gridHeight)
                                .attr('visibility', 'hidden')
                                .attr("class", function(d) { return 'markDates' + d2.yRect + k})
                                .attr('fill', function(d) { return colorScale(d.dateFreq) })
                            .on("mouseover", function(d) {
                             
                             var heatmapRectId = 'heatmapRect' + d2.yRect + k;
                             d3.selectAll('.g_main').selectAll('.nestedClass').selectAll('#'+heatmapRectId).attr('visibility', 'hidden');

                             d3.select(this).attr('visibility', 'visible');
                             
                             tooltip.transition()
                             .duration(500)
                             .style("opacity", .9);
                             tooltip.html("<strong>Date: " + formatDateForToolTip(d.date) + "</strong><br/><strong>Diagnosis: " + d.diagnosis + "</strong><br/><strong>Provider: " + d.provider + "</strong><br/><strong>Location: " + d.location + "</strong>")
                             .style("left", (d3.event.pageX) + "px")
                             .style("top", (d3.event.pageY - 28) + "px");
                             })
                             .on("mouseout", function(d) {
                             tooltip.transition()
                             .duration(500)
                             .style("opacity", 0);
                             
                             var heatmapRectId = 'heatmapRect' + d2.yRect + k;
                             d3.selectAll('.g_main').selectAll('.nestedClass').selectAll('#'+heatmapRectId).attr('visibility', 'visible');

                             d3.select(this).attr('visibility', 'hidden');
                             })
                            .on("click", function(d, i){
                                	scope.$apply(function() {
                                		scope.filterFromDate = new Date(d.date);
                                		scope.filterToDate = new Date(d.date);
                                		scope.matchTerm = d2.mention;
                                		scope.scrollToList = true;
                                	});
                              })
                            });
                        
                        d3.select(this).select(".Xdelete").remove();

                        var Xdelete = d3.select(this).append("text")
                            .text('X')
                            .attr("x", width)
                            .attr("y", function (d, i) { return ((gridHeight*3)/4) + (j * gridHeight); })
                            .style('text-anchor', 'end')
                            .style('font-family', 'sans-serif')
                            .attr('class', 'Xdelete');

                        j++;
                    });

                var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %y"));

                var xAxis = svg.append("g").call(xAxisGen)
                    .attr("class","Xaxis")
                    .attr("transform", "translate(" + 1.5*termWidth + "," + (j+1)*gridHeight + ")")
                    .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(45)")
                    .style("text-anchor", "start");

                svg.selectAll(".legend").remove();
                
                var colors = [], element;
                 for (var c=0; c<5 ;c++){
                	 var indVal;
                 	 if(AllRect.length == 0) 
                 		indVal = 0; 
                 	 else 
                 		indVal = Math.round(d3.max(AllRect, function(d){ return d.totFreq;})*(c/4),0);
                 	
                     element = {"index": indVal, "color": colorScale(indVal)};
                     colors.push(element);
                     }
                 
                 var legend = svg.append("g")
                                .attr("class", "legend");
                 
                 legend.append("text")
                 .text('Color Scale:')
                 .attr("x", 0)
                 .attr("y", (j+4)*gridHeight)
                 .style('text-anchor', 'start')
                 .style('font-family', 'sans-serif')
                 .attr('class', 'legendlabel');

                  legend.selectAll('rect')
                    .data(colors)
                    .enter().append('rect')
                    .attr("x", function(d, i) { return legendElementWidth * (i+1); })
                    .attr("y", (j+3)*gridHeight)
                    .attr("width", legendElementWidth)
                    .attr("height", gridHeight)
                    .style("fill", function(d, i) { return d.color });

                  legend.selectAll('colorScaletext')
                    .data(colors)
                    .enter().append('text')
                    .attr("class", "legendtext")
                    .text(function(d) { return d.index; })
                    .attr("x", function(d, i) { return legendElementWidth * (i + (3/2)); })
                    .attr("y", (j+5)*gridHeight );

                  legend.exit().remove();
                  
                d3.selectAll(".Xdelete")
                    .on("click", function(d, i){
                        var textToDelete = d3.select(this.parentNode).select('.yLabel').text();

                        xdeleteArray.push(textToDelete);

                        updateviz(origData, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms);
                    });

                d3.selectAll(".expandLabel")
                    .on("click", function(d, i){

                        var textToToggle = d3.select(this.parentNode).select('.yLabel').text();

                        var found = 0;
                        for(var n=0; n<negToggleArray.length; n++){
                            if (textToToggle === negToggleArray[n]){
                                negToggleArray.splice(n,1);
                                found = 1;
                            }
                        }
                        if (found === 0){
                            negToggleArray.push(textToToggle);
                        }

                        updateviz(origData, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms);
                    });

            } //end of updateviz

            scope.$watch('[val, resetMap]',
            function(newVals, oldVals) {
              if((oldVals[0] != newVals[0]) || 
            	 (oldVals[1] != newVals[1])){
              
               // clear the elements inside of the directive
                d3.select("svg").remove();

                var data = newVals[0];
                var minDate = scope.startDate.name;
                var maxDate = scope.endDate.name;
                
                scope.resetMap = false;

                var xdeleteArray = [];
                var negToggleArray = [];

                var searchTerms = [];

                var allTerms = [];
                var filterSearchTerm;

                filterSearchTerm = data.filter(function(d) { return d.relatedTo == null });

                searchTerms = filterSearchTerm.map(function(d){ return d.mentionText;});
                negToggleArray = JSON.parse(JSON.stringify(searchTerms));

                searchTerms.sort();

                updateviz(data, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms);

                d3.selectAll(".Xdelete")
                    .on("click", function(d, i){
                        var textToDelete = d3.select(this.parentNode).select('.yLabel').text();

                        xdeleteArray.push(textToDelete);

                        updateviz(data, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms);
                    });

                d3.selectAll(".expandLabel")
                    .on("click", function(d, i){

                        var textToToggle = d3.select(this.parentNode).select('.yLabel').text();

                        var found = 0;
                        for(var n=0; n<negToggleArray.length; n++){
                            if (textToToggle === negToggleArray[n]){
                                negToggleArray.splice(n,1);
                                found = 1;
                            }
                        }
                        if (found === 0){
                            negToggleArray.push(textToToggle);
                        }

                        negToggleArray.sort();

                        updateviz(data, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms);
                    });

              }
            }, 
            true);
    }
}
});