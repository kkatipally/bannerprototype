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
            resetMap: '=resetMap' //Reset the heatmap
        },
        link: function(scope, element, attrs, controller) {

        	var minDate = scope.startDate.name;
            var maxDate = scope.endDate.name;

            var numMonths = 1 + maxDate.getMonth() - minDate.getMonth() + (12 * (maxDate.getFullYear() - minDate.getFullYear()));
            //console.log("numMonths in updateviz: " + numMonths);

            var i, j, k, heatRect, markDates,
                groupMonths = 3,
                margin = { top: 30, right: 0, bottom: 0, left: 0 },
                width = 870 - margin.left - margin.right,
                height = 430 - margin.top - margin.bottom, //not used
                termWidth = 200,
                gridWidth = ((width-2*termWidth)/numMonths),
                gridHeight = 20,
                entityTypes = ['red', 'green', 'blue'],
                buckets = 9,
            	AllRect = [],
            	legendElementWidth = 100;
            
            function getJSDate(d){

                var strDate = new String(d);

                var year = strDate.substr(0,4);
                var month = strDate.substr(4,2)-1; //zero based index
                var day = strDate.substr(6,2);

                return new Date(year, month, day);
            }
            
            function formatDate(date) {
          	  
            	  //console.log("date: " + date);
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

              	  return year + month + day;
              	}
            
            function buildviz(data, minDate, maxDate){

            	var colorScale;
            	
                d3.select("svg").remove();

                var filterSearchTerm = data.filter(function(d) { return d.relatedTo == null /*return d.expand === "show"*/ });

                var searchTerms = filterSearchTerm.map(function(d){ return d.mentionText;});

                var svg = d3.select("#heatmapdir").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", ((searchTerms.length+7)*gridHeight) + margin.top + margin.bottom)
                    .append("g")
                    .attr("class", "g_main")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tooltip = d3.select("#heatmapdir").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                data = data.filter(function(d) { return d.relatedTo == null /*return d.expand === "show"*/ })
                //console.log("nested data: " + JSON.stringify(data));
                
                var nested = svg.selectAll('g')
                    .data(data)
                    .enter().append('g')
                    .attr("class", "nestedClass")
                    .attr('id', function(d, i) { return 'nestedId' + i });

                 var numMonths = 1 + maxDate.getMonth() - minDate.getMonth() + (12 * (maxDate.getFullYear() - minDate.getFullYear()));
                 //console.log("numMonths: " + numMonths);
                 //console.log("Min Date: " + minDate);
                 //console.log("Max Date: " + maxDate);*/

                //scales
                var xScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, width-termWidth*2]);

                var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %y"));
                var yAxisGen = d3.axisLeft();

                var j = 0;
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
                    
                    //console.log("Init startRect: " + startRect);
                    
                    i = 0;

                    while(endRect < new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)){
                        var listDates = [];
                        var newdate;
                        addFreq = 0;
                        yRect = j;
                        
                        if(i == 0){
                        	//console.log("startRect in loop: " + startRect.getMonth());
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

                        endRect = new Date(Math.min(endRect, new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)));
                        //console.log("i, endRect:" + i + ' ' + endRect);
                        
                        for(k=0; k<d1.dateList.length; k++){ 
                            currentDate = new Date(getVisitDate(d1.dateList, k));
                            //console.log("currentDate, startRect, endRect: " + currentDate, startRect, endRect);
                            
                            if((currentDate >= startRect) && (currentDate < endRect)){
                                addFreq += gettotFreq(d1.dateList, k);
                                //console.log("startRect, endRect, yRect, k, currentDate, addFreq: " + startRect, endRect, yRect, k, currentDate, addFreq);
                                newdate = {
                                    "date": new Date(currentDate.getTime()),
                                    "yDate": j,
                                    "dateFreq": gettotFreq(d1.dateList, k)
                                }
                                //console.log("newdate.date: " + newdate.date);
                                //listDates.push(newdate);
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
                            //"listDates": listDates
                        }
                        //console.log("newdata.startRect: " + newdata.startRect);
                        //console.log("newdata.endRect: " + newdata.endRect);
                        //console.log("newdata.totFreq: " + newdata.totFreq);
                        //console.log("newdata.yRect: " + newdata.yRect);
                        //console.log("newdata.listDates: " + newdata.listDates);
                        AllRect.push(newdata);
                        startRect= new Date(endRect.getTime());
                        
                        //console.log("i, startRect: " + i + ' ' + startRect);
                        //console.log("i, endRect:" + i + ' ' + endRect);
                        i++;
                    }
                    //AllRect.push(DataRect);
                    //console.log("Build DataRect: " + JSON.stringify(DataRect));
                });
                
                //console.log("Build AllRect: " + JSON.stringify(AllRect));
                //console.log("max color: " + d3.max(AllRect, function(d){ return d.totFreq;}));

                colorScale = d3.scaleLinear()
                                .domain([0, d3.max(AllRect, function(d){ return d.totFreq;})])
                                //.domain([0, d3.max(totFreq)])
                                //.range(['#ffffd9', '#081d58']); blue
                                .range(['#ffffd9', '#ff0033']); //red
                  
                nested.each(function(d1, nestedInd) {

                        var grps = Math.ceil(numMonths/groupMonths);
                        //console.log("numMonths, grps : " + numMonths + ' ' + grps);
                        var startRect, endRect, lengthRect, yRect, totFreq, addFreq, currentDate, mention;
                        var startIndex = 0;
                        var DataRect = [];

                        function getVisitDate(d, i){ return d[i]['dateCreated'];}

                        function gettotFreq(d, i){ return d[i]['mentionCount'];}
                        
                        startRect = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                        endRect = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                        mention = d1.mentionText;
                        
                        //console.log("Init startRect: " + startRect);

                        i = 0;
                        while(endRect < new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)){
                        
                        	var listDates = [];
                            var newdate;
                            addFreq = 0;
                            yRect = j;
                        	if(i == 0){
                            	//console.log("startRect in loop: " + startRect.getMonth());
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
                        	endRect = new Date(Math.min(endRect, new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)));

                            //console.log("endRect: " + endRect);

                            for(k=0; k<d1.dateList.length; k++){
                                currentDate = new Date(getVisitDate(d1.dateList, k));
                                                                
                                //console.log("currentDate, startRect, endRect: " + currentDate, startRect, endRect);

                                if((currentDate >= startRect) && (currentDate < endRect)){
                                    addFreq += gettotFreq(d1.dateList, k);
                                    //console.log("startRect, endRect, yRect, k, currentDate, addFreq: " + startRect, endRect, yRect, k, currentDate, addFreq);
                                    newdate = {
                                        "date": new Date(currentDate.getTime()),
                                        "yDate": j,
                                        "dateFreq": gettotFreq(d1.dateList, k),
                                        "provider": d1.dateList[k]['provider'],
                                        "location": d1.dateList[k]['location'],
                                        "diagnosis": d1.dateList[k]['diagnosis']
                                    }
                                    //console.log("newdate.date: " + newdate.date);
                                    listDates.push(newdate);
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
                                "totFreq":  addFreq,
                                "mention": mention,
                                "listDates": listDates
                            }
                            //console.log("newdata.startRect: " + newdata.startRect);
                            //console.log("newdata.endRect: " + newdata.endRect);
                            //console.log("newdata.totFreq: " + newdata.totFreq);
                            //console.log("newdata.yRect: " + newdata.yRect);
                            //console.log("newdata.listDates: " + newdata.listDates);
                            DataRect.push(newdata);
                            startRect= new Date(endRect.getTime());
                            //console.log("DataRect: " + JSON.stringify(DataRect));
                            i++;
                        }

                        //console.log("Build d1: " + JSON.stringify(d1));
                        //console.log("Build DataRect: " + JSON.stringify(DataRect));

                        var expandLabel = d3.select(this).append("text")
                            .text('(+)')
                            .attr("x", 0)
                            .attr("y", function (d, i) { return ((gridHeight*7)/4) + (j * gridHeight); })
                            .style('text-anchor', 'start')
                            .style('font-family', 'sans-serif')
                            .style('font-size', '15')
                            .attr('class', 'expandLabel')
                            .each(
                                function(d){
                                    d3.select(this).classed(d.expand, true)
                                });

                        var yLabel = d3.select(this).append("text")
                            .text(function (d) { return d.mentionText; })
                            .attr("x", 1.4*termWidth)
                            .attr("y", function (d, i) { return ((gridHeight*7)/4) + (j * gridHeight); })
                            .style('text-anchor', 'end')
                            .style('font-family', 'sans-serif')
                            .attr('class', 'yLabel')
                            .attr('id', 'yLabel')
                            .each(
                                function(d){
                                    d3.select(this).classed(d.mentionType, true)
                                })
                            //right click
                            .on("contextmenu", function(d, i){
                            	d3.event.preventDefault();
                            	scope.$apply(function() {
                            		if(scope.searchInput === "")
                                		scope.searchInput += d.mentionText ;
                                	else
                                		scope.searchInput += ", " + d.mentionText ;
                            	});
                            });
                        
                        //console.log("heatRect data: " + JSON.stringify(DataRect));
                        heatRect = d3.select(this)
                            .selectAll('.heatmap')
                            .data(DataRect)
                            .enter().append('rect')
                            .attr('x', function(d){ return 1.5*termWidth + xScale(d.startRect) })
                            .attr('y', function(d){ return ((d.yRect+1)*gridHeight); })
                            .attr("rx", 4)
                            .attr("ry", 4)
                            .attr('width', function(d){ return xScale(d.endRect)-xScale(d.startRect)/*groupMonths*gridWidth*/})
                            .attr('height', gridHeight)
                            .attr('fill', function(d) { return colorScale(d.totFreq) })
                            .attr('id', function(d, i) { return 'heatmapRect' + d.yRect + i})
                            .attr("class", "heatmap")
                            .on("mouseover", function(d, i){
                                
                                //console.log('heatmapid: '+ heatmapid);

                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", .9);
                                tooltip.html("<strong>Frequency: " + d.totFreq + "</strong>")
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                                
                                var markDatesClass = 'markDates' + d.yRect + i;
                                d3.selectAll('.g_main').selectAll('.nestedClass').selectAll('.'+markDatesClass)
                                //.style("opacity", 1);
                                .attr("visibility", "visible");
                                
                                d3.select(this).attr('visibility', 'hidden');
                             })
                            .on("mouseout", function(d, i){
                                d3.select(this).attr('visibility', 'visible');
                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                                
                                var markDatesClass = 'markDates' + d.yRect + i;
                                d3.selectAll('.g_main').selectAll('.nestedClass').selectAll('.'+markDatesClass)
                                .attr('visibility', 'hidden');
                            })
                            .on("click", function(d, i){
                            	//console.log("heatmapRect clicked");
                            	scope.$apply(function() {
                            		scope.filterFromDate = new Date(d.startRect);
                            		scope.filterToDate = new Date(d.endRect);
                            		scope.matchTerm = d.mention;
                            	});
                            });

                            heatRect
                            .each(function(d2, k) {
                            	markDates = nested
                                .selectAll('markDatesClass')
                                .data(d2.listDates).enter()
                                .append('rect')
                                .attr('x', function(d1){ return 1.5*termWidth + xScale(d1.date) })
                                .attr('y', function(d1){ return (d1.yDate+1)*gridHeight; })
                                .attr("rx", 4)
                                .attr("ry", 4)
                                .attr('width', 4)
                                .attr('height', gridHeight)
                                .attr('visibility', 'hidden')
                                .attr("class", function(d) { return 'markDates' + d2.yRect + k})
                                .attr('fill', function(d) { return colorScale(d.dateFreq) })
                                //.attr('id', function(d) { return 'markDates' + d2.yRect + k })
                            .on("mouseover", function(d) {
                             
                             var heatmapRectId = 'heatmapRect' + d2.yRect + k;
                             d3.selectAll('.g_main').selectAll('.nestedClass').selectAll('#'+heatmapRectId).attr('visibility', 'hidden');

                             d3.select(this).attr('visibility', 'visible');
                             
                             tooltip.transition()
                             .duration(500)
                             .style("opacity", .9);
                             tooltip.html("<strong>Date: " + d.date + "</strong><br/><strong>Diagnosis: " + d.diagnosis + "</strong><br/><strong>Provider: " + d.provider + "</strong><br/><strong>Location: " + d.location + "</strong>")
                             .style("left", (d3.event.pageX) + "px")
                             .style("top", (d3.event.pageY - 28) + "px");
                             })
                             .on("mouseout", function(d) {
                             tooltip.transition()
                             .duration(500)
                             .style("opacity", 0);
                             })
                            .on("click", function(d, i){
                                	//console.log("markDate clicked");
                                	scope.$apply(function() {
                                		scope.filterFromDate = new Date(d.date);
                                		scope.filterToDate = new Date(d.date);
                                		scope.matchTerm = d2.mention;
                                	});
                             })
                            });

                        var Xdelete = d3.select(this).append("text")
                            .text('X')
                            .attr("x", width)
                            .attr("y", function (d, i) { return ((gridHeight*7)/4) + (j * gridHeight);/*(d.yRect*gridHeight);*/ })
                            .style('text-anchor', 'end')
                            .style('font-family', 'sans-serif')
                            .attr('class', 'Xdelete');

                        j++;
                    });

                var xAxis = svg.append("g").call(xAxisGen)
                    .attr("class","Xaxis")
                    .attr("transform", "translate(" + 1.5*termWidth + "," + (j+2)*gridHeight + ")");
            
                var colors = [], element;
                for (var c=0; c<5 ;c++){
                    element = {"index": Math.round(d3.max(AllRect, function(d){ return d.totFreq;})*(c/4),0), "color": colorScale(Math.round(d3.max(AllRect, function(d){ return d.totFreq;})*(c/4)),0)};
                    colors.push(element);
                } 
                
                //console.log("colors: " + JSON.stringify(colors));

                var legend = svg.append("g")
                               .attr("class", "legend");

                legend.append("text")
                .text('Color Scale:')
                .attr("x", 0)
                .attr("y", (j+5)*gridHeight)
                .style('text-anchor', 'start')
                .style('font-family', 'sans-serif')
                .attr('class', 'legendlabel');
                
                 legend.selectAll('rect')
                   .data(colors)
                   .enter().append('rect')
                   .attr("x", function(d, i) { return legendElementWidth * (i+1); })
                   .attr("y", (j+4)*gridHeight)
                   .attr("width", legendElementWidth)
                   .attr("height", gridHeight)
                   .style("fill", function(d, i) { return d.color });

                 legend.selectAll('colorScaletext')
                   .data(colors)
                   .enter().append('text')
                   .attr("class", "legendtext")
                   .text(function(d) { return d.index; })
                   .attr("x", function(d, i) { return legendElementWidth * (i + (3/2)); })
                   .attr("y", (j+6)*gridHeight );

                 legend.exit().remove();
            } //end of buildviz

            function updateviz(origData, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms){

                var data1 = JSON.parse(JSON.stringify(origData));
                var data2, data, termfound;
                var toggleArray = [];
                var AllRect = [];

                //console.log("Updated min Date: " + minDate);
                //console.log("Updated max Date: " + maxDate);
                
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
                        if (d.mentionText === negToggleArray[n]){
                            d.symbol = '(+)';
                            //console.log("term tagged +: " + d.term);
                        }
                    }
                    for(var m=0; m<toggleArray.length; m++){
                        if (d.mentionText === toggleArray[m]){
                            d.symbol = '(-)';
                            //console.log("term tagged -: " + d.term);
                        }
                    }
                });

                data1.forEach(function(d){
                    d.dateList.filter(function(d) {
                    	//TODO
                        //return dateSel >= (maxDate.getMonth() - (getJSDate(formatDate(d.dateCreated))).getMonth() + (12 * (maxDate.getFullYear() - (getJSDate(formatDate(d.dateCreated))).getFullYear()) ) )
                        return ((new Date(d.dateCreated) >= minDate) && (new Date(d.dateCreated) <= maxDate) );
                    });
                    //console.log(d.dateList.length);
                });

                    for(var n=0; n<negToggleArray.length; n++){
                        data1 = data1.filter(function(d, j) {
                            //console.log("negToggleArray[n], d.relatedTo: " + negToggleArray[n], d.relatedTo);
                            return (d.relatedTo !== negToggleArray[n]);
                        });
                        //console.log("data1 within toggle loop: " + JSON.stringify(data1));
                    }
                    data2 = data1;
                //}
                //console.log("data after toggle: " + JSON.stringify(data2));


                for(var m=0; m<xdeleteArray.length; m++){
                    data2 = data2.filter(function(d, j) {
                        //console.log("xdeleteArray[m], d.term: " + xdeleteArray[m], d.term);
                        return ((d.mentionText !== xdeleteArray[m]) && (d.relatedTo !== xdeleteArray[m]))
                    });
                }

                data = data2;

                d3.select("svg").remove();

                var allTerms = data.map(function(d){ return d.mentionText;});
                //console.log("allTerms: " + allTerms);

                var svg = d3.select("#heatmapdir").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", ((allTerms.length+7)*gridHeight) + margin.top + margin.bottom)
                    .append("g")
                    .attr("class", "g_main")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tooltip = d3.select("#heatmapdir").select("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

                svg.selectAll('.nestedClass').remove();
                
                //console.log("nested data: " + JSON.stringify(data));
                
                var nested = svg.selectAll('.g_main')
                    .data(data)
                    .enter().append('g')
                    .attr("class", "nestedClass")
                    .attr('id', function(d, i) { return 'nestedId' + i });

                //console.log("Updated data: " + JSON.stringify(data[0].dateList));
                //console.log("Updated dateSel: " + dateSel);

                 //console.log("Updated min Date: " + minDate);
                 //console.log("Updated max Date: " + maxDate);

                //scales
                var xScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, width-termWidth*2]);

                var j = 0;
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
                    
                    //console.log("Init startRect: " + startRect);
                    
                    i = 0;
                    while(endRect < new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)){
                    
                    	var listDates = [];
                        var newdate;
                        addFreq = 0;
                        yRect = j;
                        
                        if(i == 0){
                        	//console.log("startRect in loop: " + startRect.getMonth());
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
                        endRect = new Date(Math.min(endRect, new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)));
                        //console.log("endRect: " + endRect);
                        
                        for(k=0; k<d1.dateList.length; k++){ 
                            currentDate = new Date(getVisitDate(d1.dateList, k));
                            //console.log("currentDate, startRect, endRect: " + currentDate, startRect, endRect);
                            
                            if((currentDate >= startRect) && (currentDate < endRect)){
                                addFreq += gettotFreq(d1.dateList, k);
                                //console.log("startRect, endRect, yRect, k, currentDate, addFreq: " + startRect, endRect, yRect, k, currentDate, addFreq);
                                newdate = {
                                    "date": new Date(currentDate.getTime()),
                                    "yDate": j,
                                    "dateFreq": gettotFreq(d1.dateList, k)
                                }
                                //console.log("newdate.date: " + newdate.date);
                                //listDates.push(newdate);
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
                            //"listDates": listDates
                        }
                        //console.log("newdata.startRect: " + newdata.startRect);
                        //console.log("newdata.endRect: " + newdata.endRect);
                        //console.log("newdata.totFreq: " + newdata.totFreq);
                        //console.log("newdata.yRect: " + newdata.yRect);
                        //console.log("newdata.listDates: " + newdata.listDates);
                        //DataRect.push(newdata);
                        AllRect.push(newdata);
                        startRect= new Date(endRect.getTime());
                        //console.log("startRect: " + startRect);
                        i++;
                    }
                });
                
                    //console.log("Build AllRect: " + JSON.stringify(AllRect));
                    //console.log("max color: " + d3.max(AllRect, function(d){ return d.totFreq;}));
                    
                    
                    var colorScale = d3.scaleLinear()
                                .domain([0, d3.max(AllRect, function(d){ return d.totFreq;})])
                                //.domain([0, d3.max(totFreq)])
                                //.range(['#ffffd9', '#081d58']); blue
                                .range(['#ffffd9', '#ff0033']); //red
                    
                nested
                    .each(function(d1, nestedInd) {

                        var grps = Math.ceil(numMonths/groupMonths);
                        //console.log("grps in updateviz: " + grps);
                        var startRect, endRect, lengthRect, yRect, totFreq, addFreq, currentDate, mention;
                        var startIndex = 0;
                        var DataRect = [];

                        function getVisitDate(d, i){ return d[i]['dateCreated'];}

                        function gettotFreq(d, i){ return d[i]['mentionCount'];}
                        
                        startRect = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                        endRect = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                        mention = d1.mentionText;
                        
                        //console.log("Init startRect: " + startRect);

                        i = 0;
                        //for(i=0; i<grps; i++){
                        while(endRect < new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)){
                        
                        	var listDates = [];
                            var newdate;
                            addFreq = 0;
                            yRect = j;

                            if(i == 0){
                            	//console.log("startRect in loop: " + startRect.getMonth());
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
                            endRect = new Date(Math.min(endRect, new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)));
                            //console.log("endRect: " + endRect);

                            for(k=0; k<d1.dateList.length; k++){
                                currentDate = new Date(getVisitDate(d1.dateList, k));
                                //console.log("currentDate, startRect, endRect: " + currentDate, startRect, endRect);

                                if((currentDate >= startRect) && (currentDate < endRect)){
                                    addFreq += gettotFreq(d1.dateList, k);
                                    //console.log("startRect, endRect, yRect, k, currentDate, addFreq: " + startRect, endRect, yRect, k, currentDate, addFreq);
                                    newdate = {
                                        "date": new Date(currentDate.getTime()),
                                        "yDate": j,
                                        "dateFreq": gettotFreq(d1.dateList, k),
                                        "provider": d1.dateList[k]['provider'],
                                        "location": d1.dateList[k]['location'],
                                        "diagnosis": d1.dateList[k]['diagnosis']
                                    }
                                    //console.log("newdate.date: " + newdate.date);
                                    listDates.push(newdate);
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
                                "totFreq":  addFreq,
                                "mention": mention,
                                "listDates": listDates
                            }
                            //console.log("newdata.startRect: " + newdata.startRect);
                            //console.log("newdata.endRect: " + newdata.endRect);
                            //console.log("newdata.totFreq: " + newdata.totFreq);
                            //console.log("newdata.yRect: " + newdata.yRect);
                            //console.log("newdata.listDates: " + newdata.listDates);
                            DataRect.push(newdata);
                            startRect= new Date(endRect.getTime());
                            //console.log("startRect: " + startRect);
                            i++;
                        }

                        //console.log("Update d1: " + JSON.stringify(d1));
                        //console.log("Update DataRect: " + JSON.stringify(DataRect));

                        d3.select(this).select(".expandLabel").remove();

                        var expandLabel = d3.select(this).append("text")
                            .text(function(d) { return d.symbol})
                            .attr("x", 0)
                            .attr("y", function (d, i) { return ((gridHeight*7)/4) + (j * gridHeight);/*(d.yRect*gridHeight);*/ })
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
                            .attr("y", function (d, i) { return ((gridHeight*7)/4) + (j * gridHeight); })
                            .style('text-anchor', 'end')
                            .style('font-family', 'sans-serif')
                            .attr('class', 'yLabel')
                            //.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                            .each(
                                function(d){
                                    d3.select(this).classed(d.mentionType, true)
                                })
                            .on("contextmenu", function(d, i){
                            	d3.event.preventDefault();
                            	scope.$apply(function() {
                            		if(scope.searchInput === "")
                                		scope.searchInput += d.mentionText ;
                                	else
                                		scope.searchInput += ", " + d.mentionText ;
                            	});
                            });

                        d3.select(this).selectAll('.heatmap').remove();
                        
                        //console.log("Update heatRect data: " + JSON.stringify(DataRect));
                        heatRect = d3.select(this)
                            .selectAll('.heatmap')
                            .data(DataRect)
                            .enter().append('rect')
                            .attr('x', function(d){ return 1.5*termWidth + xScale(d.startRect) })
                            .attr('y', function(d){ return ((d.yRect+1)*gridHeight); })
                            .attr("rx", 4)
                            .attr("ry", 4)
                            .attr('width', function(d){ return xScale(d.endRect)-xScale(d.startRect)/*groupMonths*gridWidth*/})
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
                                //.style("opacity", 1);
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
                            	//console.log("heatmapRect clicked");
                            	scope.$apply(function() {
                            		scope.filterFromDate = new Date(d.startRect);
                            		scope.filterToDate = new Date(d.endRect);
                            		scope.matchTerm = d.mention;
                            	});
                            });
                        
                        heatRect
                            .each(function(d2, k) {
                         	
                            	markDates = nested
                                .selectAll('markDatesClass')
                                .data(d2.listDates).enter()
                                .append('rect')
                                .attr('x', function(d1){ return 1.5*termWidth + xScale(d1.date) })
                                .attr('y', function(d1){ return (d1.yDate+1)*gridHeight; })
                                .attr("rx", 4)
                                .attr("ry", 4)
                                .attr('width', 4)
                                .attr('height', gridHeight)
                                //.style("opacity", 0)
                                .attr('visibility', 'hidden')
                                .attr("class", function(d) { return 'markDates' + d2.yRect + k})
                                .attr('fill', function(d) { return colorScale(d.dateFreq) })
                                //.attr('id', function(d) { return 'markDates' + d2.yRect + k })
                            .on("mouseover", function(d) {
                             
                             var heatmapRectId = 'heatmapRect' + d2.yRect + k;
                             d3.selectAll('.g_main').selectAll('.nestedClass').selectAll('#'+heatmapRectId).attr('visibility', 'hidden');

                             d3.select(this).attr('visibility', 'visible');
                             
                             tooltip.transition()
                             .duration(500)
                             .style("opacity", .9);
                             tooltip.html("<strong>Date: " + d.date + "</strong><br/><strong>Diagnosis: " + d.diagnosis + "</strong><br/><strong>Provider: " + d.provider + "</strong><br/><strong>Location: " + d.location + "</strong>")
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
                                	//console.log("markDate clicked");
                                	scope.$apply(function() {
                                		scope.filterFromDate = new Date(d.date);
                                		scope.filterToDate = new Date(d.date);
                                		scope.matchTerm = d2.mention;
                                	});
                              })
                            });
                        
                        d3.select(this).select(".Xdelete").remove();

                        var Xdelete = d3.select(this).append("text")
                            .text('X')
                            .attr("x", width)
                            .attr("y", function (d, i) { return ((gridHeight*7)/4) + (j * gridHeight);/*(d.yRect*gridHeight);*/ })
                            .style('text-anchor', 'end')
                            .style('font-family', 'sans-serif')
                            .attr('class', 'Xdelete');

                        j++;
                    });

                var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %y"));

                var xAxis = svg.append("g").call(xAxisGen)
                    .attr("class","Xaxis")
                    .attr("transform", "translate(" + 1.5*termWidth + "," + (j+2)*gridHeight + ")");

                svg.selectAll(".legend").remove();
                
                var colors = [], element;
                 for (var c=0; c<5 ;c++){
                     element = {"index": Math.round(d3.max(AllRect, function(d){ return d.totFreq;})*(c/4),0), "color": colorScale(Math.round(d3.max(AllRect, function(d){ return d.totFreq;})*(c/4)),0)};
                     colors.push(element);
                 } 
                 
                 console.log("colors: " + JSON.stringify(colors));

                 var legend = svg.append("g")
                                .attr("class", "legend");
                 
                 legend.append("text")
                 .text('Color Scale:')
                 .attr("x", 0)
                 .attr("y", (j+5)*gridHeight)
                 .style('text-anchor', 'start')
                 .style('font-family', 'sans-serif')
                 .attr('class', 'legendlabel');

                  legend.selectAll('rect')
                    .data(colors)
                    .enter().append('rect')
                    .attr("x", function(d, i) { return legendElementWidth * (i+1); })
                    .attr("y", (j+4)*gridHeight)
                    .attr("width", legendElementWidth)
                    .attr("height", gridHeight)
                    .style("fill", function(d, i) { return d.color });

                  legend.selectAll('colorScaletext')
                    .data(colors)
                    .enter().append('text')
                    .attr("class", "legendtext")
                    .text(function(d) { return d.index; })
                    .attr("x", function(d, i) { return legendElementWidth * (i + (3/2)); })
                    .attr("y", (j+6)*gridHeight );

                  legend.exit().remove();
                  
                d3.selectAll(".Xdelete")
                    .on("click", function(d, i){
                        var textToDelete = d3.select(this.parentNode).select('.yLabel').text();
                        //console.log("textToDelete: " + textToDelete);

                        xdeleteArray.push(textToDelete);

                        updateviz(origData, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms);
                    });

                d3.selectAll(".expandLabel")
                    .on("click", function(d, i){

                        var textToToggle = d3.select(this.parentNode).select('.yLabel').text();
                        //console.log("textToToggle: " + textToToggle);

                        var found = 0;
                        for(var n=0; n<negToggleArray.length; n++){
                            if (textToToggle === negToggleArray[n]){
                                negToggleArray.splice(n,1);
                                found = 1;
                                //console.log("negToggleArray at index after splice: " + JSON.stringify(negToggleArray), n);
                            }
                        }
                        if (found === 0){
                            negToggleArray.push(textToToggle);
                            //console.log("negToggleArray after push: " + JSON.stringify(negToggleArray));
                        }

                        updateviz(origData, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms);
                    });

            } //end of updateviz

            scope.$watch('[val, startDate, endDate, resetMap]', 
            function(newVals, oldVals) {
              if((oldVals[0] != newVals[0]) || 
            	 (oldVals[1] != newVals[1]) || 
            	 (oldVals[2] != newVals[2]) ||
            	 (oldVals[3] != newVals[3])){
              
               // clear the elements inside of the directive
                d3.select("svg").remove();

                var data = newVals[0];
                var minDate = newVals[1].name;
                var maxDate = newVals[2].name;
                
                //console.log("data: " + JSON.stringify(data));

                buildviz(data, minDate, maxDate);
                scope.resetMap = false;

                var xdeleteArray = [];
                var negToggleArray = [];

                var searchTerms = [];
                var allTerms = [];
                var filterSearchTerm;

                filterSearchTerm = data.filter(function(d) { return d.relatedTo == null /*return d.expand === "show"*/ });
                //console.log("filterSearchTerm: " + JSON.stringify(filterSearchTerm));

                searchTerms = filterSearchTerm.map(function(d){ return d.mentionText;});
                //console.log("searchTerms: " + JSON.stringify(searchTerms));
                negToggleArray = JSON.parse(JSON.stringify(searchTerms));
                //console.log("Initial negToggleArray: " + JSON.stringify(negToggleArray));

                searchTerms.sort();

                d3.selectAll(".Xdelete")
                    .on("click", function(d, i){
                        var textToDelete = d3.select(this.parentNode).select('.yLabel').text();
                        //console.log("textToDelete: " + textToDelete);

                        xdeleteArray.push(textToDelete);

                        updateviz(data, minDate, maxDate, xdeleteArray, negToggleArray, searchTerms);
                    });

                d3.selectAll(".expandLabel")
                    .on("click", function(d, i){

                        var textToToggle = d3.select(this.parentNode).select('.yLabel').text();
                        //console.log("textToToggle: " + textToToggle);

                        var found = 0;
                        for(var n=0; n<negToggleArray.length; n++){
                            if (textToToggle === negToggleArray[n]){
                                negToggleArray.splice(n,1);
                                found = 1;
                                //console.log("negToggleArray at index after splice: " + JSON.stringify(negToggleArray), n);
                            }
                        }
                        if (found === 0){
                            negToggleArray.push(textToToggle);
                            //console.log("negToggleArray after push: " + JSON.stringify(negToggleArray));
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