'use strict';

visitNotesApp.directive('heatMap', function($compile){

    return {
        restrict: 'E',
        scope: {
            val: '=val',
            dateSel: '=dateSel',
            termSel: '=termSel'
        },
        link: function(scope, element, attrs, controller) {

            var dateSel = scope.dateSel.datevalue;
            var termSel = scope.termSel.termvalue;

            //TODO - Get from datepicker. Change json data to add 2016
            var minDate = getDate('20150901');
            var maxDate = getDate('20161101');
            var numMonths = maxDate.getMonth() - minDate.getMonth() + (12 * (maxDate.getFullYear() - minDate.getFullYear()));
            //console.log("numMonths: " + numMonths);

            var i, j, k, heatRect, markDates,
                groupMonths = 3,
                margin = { top: 0, right: 0, bottom: 0, left: 50 },
                width = 800 - margin.left - margin.right,
                height = 430 - margin.top - margin.bottom, //not used
                termWidth = 100,
                gridWidth = ((width-2*termWidth)/numMonths),
                gridHeight = 20,
                entityTypes = ['red', 'green', 'blue'],
                buckets = 9,
                colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]; // alternatively colorbrewer.YlGnBu[9]

            function getDate(d){

                //20150101
                var strDate = new String(d);

                var year = strDate.substr(0,4);
                var month = strDate.substr(4,2)-1; //zero based index
                var day = strDate.substr(6,2);

                return new Date(year, month, day);
            }

            function buildviz(data){

                d3.select("svg").remove();

                var filterSearchTerm = data.filter(function(d) { return d.expand === "show" });

                var searchTerms = filterSearchTerm.map(function(d){ return d.term;});

                var svg = d3.select("#heatmapdir").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", ((searchTerms.length+3)*gridHeight) + margin.top + margin.bottom)
                    /*.call(d3.zoom().on("zoom", function () {
                     svg.attr("transform", d3.event.transform)
                     }))*/
                    //.on("dblclick.zoom", null)
                    .append("g")
                    .attr("class", "g_main")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tooltip = d3.select("#heatmapdir").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                var resetData = [{"name": "RESET"}];

                var reset = svg.selectAll('.g_main')
                    .data(resetData)
                    .enter();

                var resetLabel = reset.append("text")
                    .text(function(d) { return d.name; })
                    .attr("x", width - termWidth)
                    .attr("y", 15)
                    .style('text-anchor', 'start')
                    .style('font-family', 'sans-serif')
                    .style('font-size', '15')
                    .style('fill', 'black')
                    .attr('class', 'resetLabel')
                    .attr('id', 'resetLabel');

                data = data.filter(function(d) { return d.expand === "show" })

                var nested = svg.selectAll('g')
                    .data(data)
                    .enter().append('g')
                    .attr("class", "nestedClass")
                    .attr('id', function(d, i) { return 'nestedId' + i });

                /*//TODO - Get from datepicker. Change json data to add 2016
                 var minDate = getDate('20151001');
                 var maxDate = getDate('20161031');
                 var numMonths = maxDate.getMonth() - minDate.getMonth() + (12 * (maxDate.getFullYear() - minDate.getFullYear()));
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
                    .each(function(d1, i) {

                        var grps = Math.ceil(numMonths/groupMonths);
                        var startRect, endRect, lengthRect, yRect, totFreq, addFreq, currentDate;
                        var startIndex = 0;
                        var DataRect = [];

                        function getVisitDate(d, i){ return d[i]['date'];}

                        function gettotFreq(d, i){ return d[i]['freq'];}

                        startRect = new Date(minDate.getTime());
                        endRect = new Date(minDate.getTime());
                        //console.log("Init startRect: " + startRect);

                        for(i=0; i<grps; i++){
                            var listDates = [];
                            var newdate;
                            addFreq = 0;
                            yRect = j;
                            endRect.setMonth(startRect.getMonth() + groupMonths);
                            endRect = new Date(Math.min(endRect, maxDate));
                            //var maxDate=new Date(Math.max.apply(null,dates));
                            //console.log("endRect: " + endRect);

                            //TODO: add corresponding dates for each heatmapRect to newdata. also modify loop below
                            for(k=0; k<d1.counts.length; k++){
                                currentDate = getDate(getVisitDate(d1.counts, k));
                                //console.log("currentDate, startRect, endRect: " + currentDate, startRect, endRect);

                                if((currentDate >= startRect) && (currentDate < endRect)){
                                    addFreq += gettotFreq(d1.counts, k);
                                    //console.log("startRect, endRect, yRect, k, currentDate, addFreq: " + startRect, endRect, yRect, k, currentDate, addFreq);
                                    newdate = {
                                        "date": new Date(currentDate.getTime()),
                                        "yDate": j,
                                        "dateFreq": gettotFreq(d1.counts, k)
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
                                "listDates": listDates
                            }
                            //console.log("newdata.startRect: " + newdata.startRect);
                            //console.log("newdata.endRect: " + newdata.endRect);
                            //console.log("newdata.totFreq: " + newdata.totFreq);
                            //console.log("newdata.yRect: " + newdata.yRect);
                            //console.log("newdata.listDates: " + newdata.listDates);
                            DataRect.push(newdata);
                            startRect.setMonth(startRect.getMonth() + groupMonths);
                            //console.log("startRect: " + startRect);
                        }

                        var colorScale = d3.scaleLinear()
                            .domain([0, d3.max(DataRect, function(d){ return d.totFreq;})])
                            //.domain([0, d3.max(totFreq)])
                            //.range(['#ffffd9', '#081d58']); blue
                            .range(['#ffffd9', '#ff0033']); //pink

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
                            .text(function (d) { return d.term; })
                            .attr("x", 1.4*termWidth)
                            .attr("y", function (d, i) { return ((gridHeight*7)/4) + (j * gridHeight); })
                            .style('text-anchor', 'end')
                            .style('font-family', 'sans-serif')
                            .attr('class', 'yLabel')
                            .attr('id', 'yLabel')
                            //.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                            .each(
                                function(d){
                                    d3.select(this).classed(d.entityType, true)
                                });

                        heatRect = d3.select(this)
                            .selectAll('rect')
                            .data(DataRect)
                            .enter().append('rect')
                            .attr('x', function(d){ return 1.5*termWidth + xScale(d.startRect) })
                            .attr('y', function(d){ return ((d.yRect+1)*gridHeight); })
                            .attr("rx", 4)
                            .attr("ry", 4)
                            .attr('width', function(d){ return xScale(d.endRect)-xScale(d.startRect)/*groupMonths*gridWidth*/})
                            .attr('height', gridHeight)
                            .attr('fill', function(d) { return colorScale(d.totFreq) })
                            .attr('id', function(d, i) { return 'heatmapRect' + d.yRect })
                            .attr("class", "heatmap")
                            .on("mouseover", function(d, i){
                                var heatmapid = 'heatmapRect' + i + d.yRect;
                                //console.log('heatmapid: '+ heatmapid);

                                d3.select(this).attr('visibility', 'hidden');

                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", .9);
                                tooltip.html("<strong>Frequency: " + d.totFreq + "</strong>")
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");

                                markDates = nested
                                    .selectAll('d.listDates')
                                    .data(d.listDates).enter()
                                    .append('rect')
                                    .attr('x', function(d1){ return 1.5*termWidth + xScale(d1.date) })
                                    .attr('y', function(d1){ return (d1.yDate+1)*gridHeight; })
                                    .attr("rx", 4)
                                    .attr("ry", 4)
                                    .attr('width', 4)
                                    .attr('height', gridHeight)
                                    .attr("id", "markDatesClass")
                                    .attr('fill', function(d) { return colorScale(d.dateFreq) })
                                    //.attr('id', function(d) { return 'markDates' + d.date + j })
                                    //simple tooltip in next 2 lines
                                    .append("title")
                                    .text(function(d1){ return d1.dateFreq })
                                /*.on("mouseover", function(d) {
                                 console.log('tooltip mouseover works');
                                 d3.selectAll('#heatmapRect').attr('visibility', 'hidden');

                                 tooltip.transition()
                                 .duration(500)
                                 .style("opacity", .9);
                                 tooltip.html("<strong>Frequency: " + d.dateFreq + "</strong>")
                                 .style("left", (d3.event.pageX) + "px")
                                 .style("top", (d3.event.pageY - 28) + "px");
                                 })
                                 .on("mouseout", function(d) {
                                 tooltip.transition()
                                 .duration(500)
                                 .style("opacity", 0);
                                 });  */
                            })
                            .on("mouseout", function(d, i){
                                d3.select(this).attr('visibility', 'visible');
                                d3.selectAll('#markDatesClass').remove();
                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            })

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
            } //end of buildviz

            function updateviz(origData, dateSel, termSel, xdeleteArray, negToggleArray, searchTerms){

                var data1 = JSON.parse(JSON.stringify(origData));
                var data2, data, termfound;
                var toggleArray = [];

                //TODO - Set to num months in history from today. Change json data to add 2016
                var maxDate = getDate('20161101');

                var minDate = new Date(maxDate.getTime());
                minDate.setMonth(maxDate.getMonth() - dateSel);

                //console.log("Updated min Date: " + minDate);
                //console.log("Updated max Date: " + maxDate);

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
                        if (d.term === negToggleArray[n]){
                            d.symbol = '(+)';
                            //console.log("term tagged +: " + d.term);
                        }
                    }
                    for(var m=0; m<toggleArray.length; m++){
                        if (d.term === toggleArray[m]){
                            d.symbol = '(-)';
                            //console.log("term tagged -: " + d.term);
                        }
                    }
                });

                data1.forEach(function(d){
                    //d.counts.splice(0,d.counts.length-dateSel);
                    d.counts.filter(function(d) {
                        return dateSel >= (maxDate.getMonth() - (getDate(d.date)).getMonth() + (12 * (maxDate.getFullYear() - (getDate(d.date)).getFullYear()) ) )
                    });
                    //console.log(d.counts.length);
                });

                if(termSel === "Search")
                    data2 = data1.filter(function(d) { return d.expand === "show" })
                else if(termSel === "All")
                    data2 = data1;
                else { //toggle option

                    for(var n=0; n<negToggleArray.length; n++){
                        data1 = data1.filter(function(d, j) {
                            //console.log("negToggleArray[n], d.relatedTo: " + negToggleArray[n], d.relatedTo);
                            return (d.relatedTo !== negToggleArray[n]);
                        });
                        //console.log("data1 within toggle loop: " + JSON.stringify(data1));
                    }
                    data2 = data1;
                }
                //console.log("data after toggle: " + JSON.stringify(data2));


                for(var m=0; m<xdeleteArray.length; m++){
                    data2 = data2.filter(function(d, j) {
                        //console.log("xdeleteArray[m], d.term: " + xdeleteArray[m], d.term);
                        return ((d.term !== xdeleteArray[m]) && (d.relatedTo !== xdeleteArray[m]))
                    });
                }

                data = data2;

                d3.select("svg").remove();

                //var filterSearchTerm = data.filter(function(d) { return d.expand === "show" });

                var allTerms = data.map(function(d){ return d.term;});
                //console.log("allTerms: " + allTerms);

                var svg = d3.select("#heatmapdir").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", ((allTerms.length+3)*gridHeight) + margin.top + margin.bottom)
                    /*.call(d3.zoom().on("zoom", function () {
                     svg.attr("transform", d3.event.transform)
                     }))*/
                    //.on("dblclick.zoom", null)
                    .append("g")
                    .attr("class", "g_main")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                /*var svg = d3.select("#heatmapdir").select("svg")
                    .select(".g_main");*/

                var tooltip = d3.select("#heatmapdir").select("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

                svg.selectAll('.resetLabel').remove();

                var resetData = [{"name": "RESET"}];

                var reset = svg.selectAll('.g_main')
                    .data(resetData)
                    .enter();

                var resetLabel = reset.append("text")
                    .text(function(d) { return d.name; })
                    .attr("x", width - termWidth)
                    .attr("y", 15)
                    .style('text-anchor', 'start')
                    .style('font-family', 'sans-serif')
                    .style('font-size', '15')
                    .style('fill', 'black')
                    .attr('class', 'resetLabel')
                    .attr('id', 'resetLabel');

                svg.selectAll('.nestedClass').remove();

                var nested = svg.selectAll('.g_main')
                    .data(data)
                    .enter().append('g')
                    .attr("class", "nestedClass")
                    .attr('id', function(d, i) { return 'nestedId' + i });

                //console.log("Updated data: " + JSON.stringify(data[0].counts));
                //console.log("Updated dateSel: " + dateSel);

                /*//TODO - Set to num months in history from today. Change json data to add 2016
                 var maxDate = getDate('20161101');

                 var minDate = new Date(maxDate.getTime());
                 minDate.setMonth(maxDate.getMonth() - dateSel);

                 //console.log("Updated min Date: " + minDate);
                 //console.log("Updated max Date: " + maxDate);*/

                //scales
                var xScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, width-termWidth*2]);

                var j = 0;
                nested
                    .each(function(d1, i) {

                        var grps = Math.ceil(dateSel/groupMonths);
                        var startRect, endRect, lengthRect, yRect, totFreq, addFreq, currentDate;
                        var startIndex = 0;
                        var DataRect = [];

                        function getVisitDate(d, i){ return d[i]['date'];}

                        function gettotFreq(d, i){ return d[i]['freq'];}

                        startRect = new Date(minDate.getTime());
                        endRect = new Date(minDate.getTime());
                        //console.log("Init startRect: " + startRect);

                        for(i=0; i<grps; i++){
                            var listDates = [];
                            var newdate;
                            addFreq = 0;
                            yRect = j;
                            endRect.setMonth(startRect.getMonth() + groupMonths);
                            endRect = new Date(Math.min(endRect, maxDate));
                            //console.log("endRect: " + endRect);

                            for(k=0; k<d1.counts.length; k++){
                                currentDate = getDate(getVisitDate(d1.counts, k));
                                //console.log("currentDate, startRect, endRect: " + currentDate, startRect, endRect);

                                if((currentDate >= startRect) && (currentDate < endRect)){
                                    addFreq += gettotFreq(d1.counts, k);
                                    //console.log("startRect, endRect, yRect, k, currentDate, addFreq: " + startRect, endRect, yRect, k, currentDate, addFreq);
                                    newdate = {
                                        "date": new Date(currentDate.getTime()),
                                        "yDate": j,
                                        "dateFreq": gettotFreq(d1.counts, k)
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
                                "listDates": listDates
                            }
                            //console.log("newdata.startRect: " + newdata.startRect);
                            //console.log("newdata.endRect: " + newdata.endRect);
                            //console.log("newdata.totFreq: " + newdata.totFreq);
                            //console.log("newdata.yRect: " + newdata.yRect);
                            //console.log("newdata.listDates: " + newdata.listDates);
                            DataRect.push(newdata);
                            startRect.setMonth(startRect.getMonth() + groupMonths);
                            //console.log("startRect: " + startRect);
                        }

                        var colorScale = d3.scaleLinear()
                            .domain([0, d3.max(DataRect, function(d){ return d.totFreq;})])
                            //.domain([0, d3.max(totFreq)])
                            //.range(['#ffffd9', '#081d58']); blue
                            .range(['#ffffd9', '#ff0033']); //pink

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
                            .text(function (d) { return d.term; })
                            .attr("x", 1.4*termWidth)
                            .attr("y", function (d, i) { return ((gridHeight*7)/4) + (j * gridHeight); })
                            .style('text-anchor', 'end')
                            .style('font-family', 'sans-serif')
                            .attr('class', 'yLabel')
                            //.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                            .each(
                                function(d){
                                    d3.select(this).classed(d.entityType, true)
                                });

                        d3.select(this).selectAll('.heatmap').remove();

                        heatRect = d3.select(this)
                            .selectAll('rect')
                            .data(DataRect)
                            .enter().append('rect')
                            .attr('x', function(d){ return 1.5*termWidth + xScale(d.startRect) })
                            .attr('y', function(d){ return ((d.yRect+1)*gridHeight); })
                            .attr("rx", 4)
                            .attr("ry", 4)
                            .attr('width', function(d){ return xScale(d.endRect)-xScale(d.startRect)/*groupMonths*gridWidth*/})
                            .attr('height', gridHeight)
                            .attr('fill', function(d) { return colorScale(d.totFreq) })
                            .attr('id', function(d, i) { return 'heatmapRect' + d.yRect })
                            .attr("class", "heatmap")
                            .on("mouseover", function(d, i){

                                d3.select(this).attr('visibility', 'hidden');

                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", .9);
                                tooltip.html("<strong>Frequency: " + d.totFreq + "</strong>")
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");

                                markDates = nested
                                    .selectAll('d.listDates')
                                    .data(d.listDates).enter()
                                    .append('rect')
                                    .attr('x', function(d1){ return 1.5*termWidth + xScale(d1.date) })
                                    .attr('y', function(d1){ return (d1.yDate+1)*gridHeight; })
                                    .attr("rx", 4)
                                    .attr("ry", 4)
                                    .attr('width', 4)
                                    .attr('height', gridHeight)
                                    .attr("id", "markDatesClass")
                                    .attr('fill', function(d) { return colorScale(d.dateFreq) })
                                    //.attr('id', function(d) { return 'markDates' + d.date + j })
                                    //simple tooltip in next 2 lines
                                    .append("title")
                                    .text(function(d1){ return d1.dateFreq })
                                /*.on("mouseover", function(d) {
                                 console.log('tooltip mouseover works');
                                 d3.selectAll('#heatmapRect').attr('visibility', 'hidden');

                                 tooltip.transition()
                                 .duration(500)
                                 .style("opacity", .9);
                                 tooltip.html("<strong>Frequency: " + d.dateFreq + "</strong>")
                                 .style("left", (d3.event.pageX) + "px")
                                 .style("top", (d3.event.pageY - 28) + "px");
                                 })
                                 .on("mouseout", function(d) {
                                 tooltip.transition()
                                 .duration(500)
                                 .style("opacity", 0);
                                 });  */
                            })
                            .on("mouseout", function(d, i){
                                d3.select(this).attr('visibility', 'visible');
                                d3.selectAll('#markDatesClass').remove();
                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            })

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

                /*svg.selectAll("g.Xaxis").call(xAxisGen)
                    .attr("transform", "translate(" + 1.5*termWidth + "," + (j+1)*gridHeight + ")");*/
                var xAxis = svg.append("g").call(xAxisGen)
                    .attr("class","Xaxis")
                    .attr("transform", "translate(" + 1.5*termWidth + "," + (j+2)*gridHeight + ")");

                d3.selectAll(".Xdelete")
                    .on("click", function(d, i){
                        //var dateSel = d3.select('#date-option').node().value;
                        //var termSel = d3.select('#term-option').node().value;


                        var textToDelete = d3.select(this.parentNode).select('.yLabel').text();
                        //console.log("textToDelete: " + textToDelete);

                        xdeleteArray.push(textToDelete);

                        updateviz(origData, dateSel, termSel, xdeleteArray, negToggleArray, searchTerms);
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

                        if(negToggleArray.length === 0){
                            //d3.select('#term-option').node().value = 'All';
                            termSel = 'All';
                            scope.termSel.termvalue = 'All';
                        }
                        else if (negToggleArray.length === searchTerms.length){
                            //d3.select('#term-option').node().value = 'Search';
                            termSel = 'Search';
                            scope.termSel.termvalue = 'Search';
                        }
                        else {
                            //d3.select('#term-option').node().value = 'Toggle';
                            termSel = 'Toggle';
                            scope.termSel.termvalue = 'Toggle';
                        }

                        //var dateSel = d3.select('#date-option').node().value;
                        //var termSel = d3.select('#term-option').node().value;

                        updateviz(origData, dateSel, termSel, xdeleteArray, negToggleArray, searchTerms);
                    });

                d3.selectAll(".resetLabel")
                    .on("click", function(d){
                        console.log("Reset click registered");
                        xdeleteArray = [];
                        negToggleArray = JSON.parse(JSON.stringify(searchTerms));

                        //scope.termSel.termname = "Only search terms";
                        //scope.termSel.termvalue = "Search"; //NOT WORKING
                        //scope.dateSel.datename = "All Dates";
                        //scope.dateSel.datevalue = 14;

                        console.log("scope.termSel: " + angular.toJson(scope.termSel));
                        console.log("scope.parent.termSel: " + angular.toJson(scope.$parent.termSel));
                        updateviz(origData, 14, 'Search', xdeleteArray, negToggleArray, searchTerms);
                    });
            } //end of updateviz

            function zoomed() {
                view.attr("transform", d3.event.transform);
                gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
                gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
            }

            scope.$watch('val', function (newVal, oldVal) {

                // clear the elements inside of the directive
                //vis.selectAll('*').remove();
                d3.select("svg").remove();

                // if 'val' is undefined, exit
                if (!newVal) {
                    return;
                }

                var data = newVal;
                //console.log(JSON.stringify(data));

                buildviz(data);

                var xdeleteArray = [];
                var negToggleArray = [];

                var searchTerms = [];
                var allTerms = [];
                var filterSearchTerm;

                filterSearchTerm = data.filter(function(d) { return d.expand === "show" });
                //console.log("filterSearchTerm: " + JSON.stringify(filterSearchTerm));

                searchTerms = filterSearchTerm.map(function(d){ return d.term;});
                //console.log("searchTerms: " + JSON.stringify(searchTerms));
                negToggleArray = JSON.parse(JSON.stringify(searchTerms));
                //console.log("Initial negToggleArray: " + JSON.stringify(negToggleArray));

                searchTerms.sort();

                /*d3.selectAll(".selectClass")
                    .on("change", function(d,i){*/
                        //var dateSel = d3.select('#date-option').node().value;
                        //var termSel = d3.select('#term-option').node().value;
                        scope.$watch('dateSel', function (newVal, oldVal) {
                            if(newVal != oldVal) {
                                dateSel = newVal.datevalue;

                                updateviz(data, dateSel, termSel, xdeleteArray, negToggleArray, searchTerms);
                            }
                        });
                        scope.$watch('termSel', function (newVal, oldVal) {
                            if(newVal != oldVal) {
                                termSel = newVal.termvalue;

                                if (termSel === 'Search') {
                                    negToggleArray.splice(0, negToggleArray.length);
                                    negToggleArray = JSON.parse(JSON.stringify(searchTerms));
                                    //console.log("neg toggle array when termSel = Search: " + JSON.stringify(negToggleArray));
                                }
                                else if (termSel === 'All') {
                                    negToggleArray.splice(0, negToggleArray.length);
                                    //console.log("neg toggle array when termSel = All: " + JSON.stringify(negToggleArray));
                                }

                                negToggleArray.sort();
                                updateviz(data, dateSel, termSel, xdeleteArray, negToggleArray, searchTerms);
                            }
                        });

                d3.selectAll(".Xdelete")
                    .on("click", function(d, i){
                        //var dateSel = d3.select('#date-option').node().value;
                        //var termSel = d3.select('#term-option').node().value;

                        var textToDelete = d3.select(this.parentNode).select('.yLabel').text();
                        //console.log("textToDelete: " + textToDelete);

                        xdeleteArray.push(textToDelete);

                        updateviz(data, dateSel, termSel, xdeleteArray, negToggleArray, searchTerms);
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

                        if(negToggleArray.length === 0){
                            //d3.select('#term-option').node().value = 'All';
                            termSel = 'All';
                            scope.termSel.termvalue = 'All'; //NOT WORKING!
                        }
                        else if (negToggleArray.length === searchTerms.length){
                            //d3.select('#term-option').node().value = 'Search';
                            termSel = 'Search';
                            scope.termSel.termvalue = 'Search';
                        }
                        else {
                            //d3.select('#term-option').node().value = 'Toggle';
                            termSel = 'Toggle';
                            scope.termSel.termvalue = 'Toggle';
                        }

                        negToggleArray.sort();
                        //var dateSel = d3.select('#date-option').node().value;
                        //var termSel = d3.select('#term-option').node().value;

                        updateviz(data, dateSel, termSel, xdeleteArray, negToggleArray, searchTerms);
                    });

                d3.selectAll(".resetLabel")
                    .on("click", function(d){
                        console.log("Reset click registered");
                        xdeleteArray = [];
                        negToggleArray = JSON.parse(JSON.stringify(searchTerms));

                        //scope.termSel.termname = "Only search terms";
                        //scope.termSel.termvalue = "Search"; //NOT WORKING
                        //scope.dateSel.datename = "All Dates";
                        //scope.dateSel.datevalue = 14;

                        console.log("scope.termSel: " + angular.toJson(scope.termSel));
                        console.log("scope.parent.termSel: " + angular.toJson(scope.$parent.termSel));
                        updateviz(data, 14, 'Search', xdeleteArray, negToggleArray, searchTerms);
                    });

                d3.selectAll(".resetzoom")
                    .on("click", function(d){
                        console.log("Reset zoom click registered");

                        //d3.select("body").select("svg").attr('transform', 'translate(0, 0) scale(1)');
                        // d3.select("body").select("svg").call(d3.zoom().on("zoom", function () {
                        //d3.select(this).attr("transform", d3.event.transform)
                        // }).transform, d3.zoomIdentity);
                        /*.call(d3.zoom().on("zoom", function () {
                         svg.attr("transform", d3.event.transform)
                         }))*/
                        /*.call(d3.zoom().on("zoom", function () {
                         view.attr("transform", d3.event.transform);}
                         ).transform, d3.zoomIdentity);*/
                    });

            });
    }
}
});