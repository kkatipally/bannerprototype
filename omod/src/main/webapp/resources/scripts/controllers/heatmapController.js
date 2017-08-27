'use strict';

visitNotesApp
		.controller(
				'heatmapController',
				function($scope, $location, $timeout, DateFactory,
						SearchFactory, VisitUuidFactory, BreadcrumbFactory,
						dateRangeAndTermFilter, uniqueNotesFilter,
						SofaDocumentResource, SofaTextMentionUIResources,
						SofaDocumentUIResource, SofaDocumentUIResources) {

        function monthsBefore(d, months) {
            var nd = new Date(d.getTime());
            nd.setMonth(d.getMonth() - months);
            return nd;
        }

        function monthsAfter(d, months) {
            var nd = new Date(d.getTime());
            nd.setMonth(d.getMonth() + months);
            return nd;
        }

        function formatDate(date) {

            var day = date.getDate();
            var month;
            if (date.getMonth() < 9) {
                month = date.getMonth() + 1;
                month = "0" + month;
            } else {
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
            var regex = new RegExp("[?&]" + name
                    + "(=([^&#]*)|&|#|$)"), results = regex
                    .exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2]
                    .replace(/\+/g, " "));
        }

        //Date picker related
        $scope.startDate = {
            "name" : DateFactory.getSliderMinDate()
        };

        $scope.endDate = {
            "name" : DateFactory.getSliderMaxDate()
        };

        $scope.minDate1 = DateFactory.getMinDate()

        $scope.dateOptions1 = {
            formatYear : 'yyyy',
            minDate : $scope.minDate1, // min(2 years ago from today, min date with patient data)
            startingDay : 0
        };

        $scope.$watch('endDate.name', function(newEnd) {
            if (newEnd) {
                $scope.dateOptions1.maxDate = monthsBefore(newEnd, 3);
                // max start date: min of end Date and 3 months ago from today
            }
        });

        $scope.$watch('startDate.name', function(newStart) {
            if (newStart) {
                $scope.dateOptions2.minDate = monthsAfter(newStart,
                        3); // min end date: start date
            }
        });

        $scope.dateOptions2 = {
            formatYear : 'yyyy',
            maxDate : new Date(), // max end date: today
            startingDay : 0
        };

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.formats = [ 'MM-dd-yyyy', 'yyyy/MM/dd',
                'dd.MM.yyyy', 'shortDate' ];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = [ 'M!/d!/yyyy' ];

        $scope.popup1 = {
            opened : false
        };

        $scope.popup2 = {
            opened : false
        };

        $scope.searchInput = "";
        $scope.searchBarTerms = [];

        $scope.orderByField = 'date';
        $scope.reverseSort = false;
        $scope.resetVisitList = function() {
            $scope.filterFromDate = "";
            $scope.filterToDate = "";
            $scope.matchTerm = "";
            $scope.visitListInput = "";
        }

        $scope.resetMap = false;
        $scope.resetHeatMap = function() {
            $timeout(function() {
                $scope.resetMap = true;
            }, 0);
            // reset visit note list too
            $scope.resetVisitList();
        };

        $scope.resetVisitList();

        $scope.patient = getParameterByName('patientId');

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        $scope.noteRendering = "";
        $scope.noteText = "";

        //populates visit note list when a visit date is clicked on page 1
        function populateVisitNote(sofadocUI) {

            var Notes = [];

            $timeout(function() {
                $scope.noteRendering = "";
            }, 0);

            var note = {};
            note["uuid"] = sofadocUI.uuid;
            note["date"] = new Date(sofadocUI.dateCreated);
            note["diagnosis"] = sofadocUI.diagnosis;
            note["provider"] = sofadocUI.provider;
            note["location"] = sofadocUI.location;
            note["problemWordList"] = sofadocUI.problemWordList.map(function(word) {
                return {"word": word.word, "count": word.count, "className": word.className};
            });
            note["treatmentWordList"] = sofadocUI.treatmentWordList.map(function(word) {
                return {"word": word.word, "count": word.count, "className": word.className};
            });
            note["testWordList"] = sofadocUI.testWordList.map(function(word) {
                return {"word": word.word, "count": word.count, "className": word.className};
            });

            Notes.push(note);
            $scope.selectedNoteUuid = note.uuid;
            $scope.selectedNoteDate = note.date;
            $scope.problemCloud = note.problemWordList;
            $scope.treatmentCloud = note.treatmentWordList;
            $scope.testCloud = note.testWordList;

            $scope.sofadocInit = SofaDocumentResource
                    .get({
                                uuid : note.uuid,
                                v : "full"
                            },
                            function() {
                                $timeout(
                                        function() {
                                            $scope.noteRendering = $scope.sofadocInit.annotatedHTML;
                                            $scope.noteText = $scope.sofadocInit.text;
                                            $scope.updateMailTo();
                                            $scope.previousSearchTerm = "";
                                        },
                                        0);
                            });
        return Notes;
        }

        //populates visit note list when search terms are submitted
        function populateVisitNoteList(dateList) {

            var Notes = [];
            var unique = {};

            $timeout(function() {
                $scope.noteRendering = "";
            }, 0);
            dateList.forEach(function(date, j) {
                if(!(date.uuid in unique)){
                    unique[date.uuid] = date;

                    var note = {};
                    note["uuid"] = date.uuid;
                    note["date"] = new Date(
                            date.dateCreated);
                    note["diagnosis"] = date.diagnosis;
                    note["provider"] = date.provider;
                    note["location"] = date.location;
                    note["problemWordList"] = date.problemWordList.map(function(word) {
                        return {"word": word.word, "count": word.count, "className": word.className};
                    });
                    note["treatmentWordList"] = date.treatmentWordList.map(function(word) {
                        return {"word": word.word, "count": word.count, "className": word.className};
                    });
                    note["testWordList"] = date.testWordList.map(function(word) {
                        return {"word": word.word, "count": word.count, "className": word.className};
                    });

                    Notes.push(note);
                    if (j == 0) {
                        $scope.selectedNoteUuid = note.uuid;
                        $scope.selectedNoteDate = note.date;
                        $scope.problemCloud = note.problemWordList;
                        $scope.treatmentCloud = note.treatmentWordList;
                        $scope.testCloud = note.testWordList;

                        $scope.sofadocInit = SofaDocumentResource
                                .get(
                                        {
                                            uuid : date.uuid,
                                            v : "full"
                                        },
                                        function() {
                                            $timeout(
                                                    function() {
                                                        $scope.noteRendering = $scope.sofadocInit.annotatedHTML;
                                                        $scope.noteText = $scope.sofadocInit.text;
                                                        $scope.updateMailTo();
                                                        $scope.previousSearchTerm = "";
                                                    },
                                                    0);
                                        });
                    }
                }
            });
        return Notes;
        }

        $scope.searchInput = SearchFactory.getSearchInput();
        $scope.visitDateUuid = VisitUuidFactory.getVisitDateUuid();

        //if both search terms and visit date are falsy, reload
        if (!$scope.searchInput && !$scope.visitDateUuid) {
            $location.url('/view1');
        } else if ($scope.searchInput){ //search terms entered
            $scope.searchBarTerms = $scope.searchInput.split(",");

            for (var i = 0; i < $scope.searchBarTerms.length; i++) {
                $scope.searchBarTerms[i] = $scope.searchBarTerms[i]
                        .trim().toLowerCase();
            }

            $scope.uniqueSearchBarTerms = $scope.searchBarTerms.filter(onlyUnique);
            $scope.finalSearchBarTerms = $scope.uniqueSearchBarTerms;

            initiateBreadCrumb($scope.searchInput);

            $scope.stms = SofaTextMentionUIResources
                    .displayHeatMap(
                            {
                                patient : $scope.patient,
                                startDate : formatDate($scope.startDate.name),
                                endDate : formatDate($scope.endDate.name),
                                searchTerms : $scope.finalSearchBarTerms,
                                v : "full"
                            },
                            function() {
                                $scope.val = $scope.stms.results;
                            });
            $scope.sds = SofaDocumentUIResources
                    .displayNoteList(
                            {
                                patient : $scope.patient,
                                startDate : formatDate($scope.startDate.name),
                                endDate : formatDate($scope.endDate.name),
                                searchTerms : $scope.finalSearchBarTerms,
                                v : "full"
                            },
                            function() {
                                $scope.visitNotes = populateVisitNoteList($scope.sds.results);
                                // resetting visit note list filter parameters
                                $scope.resetVisitList();
                            });
        } else if ($scope.visitDateUuid) { //visit date entered
            $scope.sofadocUI = SofaDocumentUIResource
                    .get(
                            {
                                uuid : $scope.visitDateUuid,
                                v : "full"
                            },
                            function() {
                                $scope.visitNotes = populateVisitNote($scope.sofadocUI);
                                // reset visitDateUuid
                                VisitUuidFactory.setVisitDateUuid("");
                            });
        }

        $scope.page2Submit = function(searchInput) {

            $scope.searchBarTerms = $scope.searchInput.split(",");

            for (var i = 0; i < $scope.searchBarTerms.length; i++) {
                $scope.searchBarTerms[i] = $scope.searchBarTerms[i]
                        .trim().toLowerCase();
            }

            $scope.uniqueSearchBarTerms = $scope.searchBarTerms.filter(onlyUnique);
            $scope.finalSearchBarTerms = $scope.uniqueSearchBarTerms;

            addBreadCrumb($scope.searchInput);

            $scope.stms = SofaTextMentionUIResources
                    .displayHeatMap(
                            {
                                patient : $scope.patient,
                                startDate : formatDate($scope.startDate.name),
                                endDate : formatDate($scope.endDate.name),
                                searchTerms : $scope.finalSearchBarTerms,
                                v : "full"
                            },
                            function() {
                                $scope.val = $scope.stms.results;
                            });
            $scope.sds = SofaDocumentUIResources
                    .displayNoteList(
                            {
                                patient : $scope.patient,
                                startDate : formatDate($scope.startDate.name),
                                endDate : formatDate($scope.endDate.name),
                                searchTerms : $scope.finalSearchBarTerms,
                                v : "full"
                            },
                            function() {
                                $scope.visitNotes = populateVisitNoteList($scope.sds.results);
                                // resetting visit note list filter parameters
                                $scope.resetVisitList();
                            });
        };

		$scope.backToSearchPage = function() {
            BreadcrumbFactory.setBreadCrumbs($scope.breadCrumbs);

            //update the search bar and dates on page 1 from the last search
            SearchFactory.setSearchInput($scope.searchInput);
            DateFactory.setSliderMinDate($scope.startDate.name);
            DateFactory.setSliderMaxDate($scope.endDate.name);

            $location.url('/view1');
        };

        $scope.breadCrumbs = [];
        if (BreadcrumbFactory.getBreadCrumbs() != "")
            $scope.breadCrumbs = BreadcrumbFactory.getBreadCrumbs();

        function initiateBreadCrumb(searchInput) {
            $scope.breadCrumbs = [];
            if (BreadcrumbFactory.getBreadCrumbs() != "")
                $scope.breadCrumbs = BreadcrumbFactory
                        .getBreadCrumbs();

            $scope.addNewBreadCrumb = BreadcrumbFactory.getAddNewBreadCrumb();

            if($scope.addNewBreadCrumb){
                $timeout(function() {
                    $scope.breadCrumbs.push({
                        "word" : searchInput,
                        "startDate" : $scope.startDate.name,
                        "endDate" : $scope.endDate.name
                    });
                }, 0);
            }
        };

        function addBreadCrumb(searchInput) {
            $timeout(function() {
                $scope.breadCrumbs.push({
                    "word" : searchInput,
                    "startDate" : $scope.startDate.name,
                    "endDate" : $scope.endDate.name
                });
            }, 0);
        };

        $scope.clearHistory = function(term) {
            $scope.breadCrumbs = [];
        }

        $scope.clickBreadCrumb = function(term) {

            $timeout(
                    function() {
                        $scope.startDate = {
                            "name" : term.startDate
                        }
                        $scope.endDate = {
                            "name" : term.endDate
                        }
                        $scope.searchInput = term.word;

                        $scope.searchBarTerms = $scope.searchInput.split(",");

                        for (var i = 0; i < $scope.searchBarTerms.length; i++) {
                            $scope.searchBarTerms[i] = $scope.searchBarTerms[i]
                                    .trim().toLowerCase();
                        }

                        $scope.uniqueSearchBarTerms = $scope.searchBarTerms.filter(onlyUnique);
                        $scope.finalSearchBarTerms = $scope.uniqueSearchBarTerms;

                        $scope.stms = SofaTextMentionUIResources
                                .displayHeatMap(
                                        {
                                            patient : $scope.patient,
                                            startDate : formatDate(term.startDate),
                                            endDate : formatDate(term.endDate),
                                            searchTerms : $scope.finalSearchBarTerms,
                                            v : "full"
                                        },
                                        function() {
                                            $scope.val = $scope.stms.results;
                                        });
                        $scope.sds = SofaDocumentUIResources
                            .displayNoteList(
                                    {
                                        patient : $scope.patient,
                                        startDate : formatDate($scope.startDate.name),
                                        endDate : formatDate($scope.endDate.name),
                                        searchTerms : $scope.finalSearchBarTerms,
                                        v : "full"
                                    },
                                    function() {
                                        $scope.visitNotes = populateVisitNoteList($scope.sds.results);
                                        // resetting visit note list filter parameters
                                        $scope.resetVisitList();
                                    });
                    }, 0);
        };

        // visit note rendering upon click in the visit list
        $scope.selectNote = function() {
            $scope.selectedNote = this.visitNote;
            $scope.selectedNoteUuid = this.visitNote.uuid;
            $scope.selectedNoteDate = this.visitNote.date;
            $scope.problemCloud = $scope.selectedNote.problemWordList;
            $scope.treatmentCloud = $scope.selectedNote.treatmentWordList;
            $scope.testCloud = $scope.selectedNote.testWordList;

            $scope.sofadoc = SofaDocumentResource
                    .get(
                            {
                                uuid : $scope.selectedNote.uuid,
                                v : "full"
                            },
                            function() {
                                $timeout(
                                        function() {
                                            $scope.noteRendering = $scope.sofadoc.annotatedHTML;
                                            $scope.noteText = $scope.sofadoc.text;
                                            $scope.updateMailTo();
                                            $scope.previousSearchTerm = "";
                                        }, 0);
                            });
        }

        //Implements scrolling functionality in visit note rendering section
        $scope.previousSearchTerm = null;
        $scope.searchSpanIds = [];
        $scope.currentSpanId = null;

        function findSpans(mention_text){
            var spans =  document.querySelectorAll("#visit-note-rendering #entireNote span");

            for(var i=0; i < spans.length; i++){
                var spanHtml = spans[i].innerHTML;
                var id = parseInt(spans[i].id.substr(16));
                if(spanHtml && spanHtml.toLowerCase() === mention_text) {
                    $scope.searchSpanIds.push(id);
                }
            }
        }

        $scope.findMentionSubmit = function() {

            $scope.activeJustified = 0;

            var findMention = $scope.findMention.toLowerCase();

            var prevSpan =  document.querySelector("#visit-note-span-"+$scope.currentSpanId);

            if(prevSpan) {
                jq(prevSpan).removeClass("highlighted-mention");
            }

            if(findMention !== $scope.previousSearchTerm) {
                $scope.searchSpanIds = [];
                findSpans(findMention);
                $scope.currentSpanId = $scope.searchSpanIds[0];
                $scope.previousSearchTerm = findMention;
            } else {
                for(var i in $scope.searchSpanIds) {
                    if($scope.searchSpanIds[i] > $scope.currentSpanId) {
                        $scope.currentSpanId = $scope.searchSpanIds[i];
                        break;
                    } else if ($scope.searchSpanIds[i] === $scope.searchSpanIds[$scope.searchSpanIds.length - 1]) {
                        $scope.currentSpanId = $scope.searchSpanIds[0];
                        break;
                    }
                }
            }

            var span =  document.querySelector("#visit-note-span-"+$scope.currentSpanId);

            $timeout(function(){
                if(span) {
                    jq(span).addClass("highlighted-mention");
                    var scroll =  jq(span).position().top + jq("#visit-note-rendering #entireNote")
                    .scrollTop() - 180;

                    jq('#visit-note-rendering #entireNote').animate({
                        scrollTop: scroll
                        }, 500);
                    }
            }, 0)

        }

        $scope.addToFind = function(name){
             $scope.findMention = name ;
        };

        $scope.scrollToList = false;
        //scroll to visit note sections upon click in heat map
        $scope.$watch('scrollToList', function(newVal) {
            if (newVal) {
                var listPosition =  document.querySelector("#visit-note");

                if(listPosition) {
                    var scroll =  jq(listPosition).position().top + jq(listPosition).parent().scrollTop();

                    jq("body,html").animate({
                                            scrollTop: scroll
                                            }, 500);

                $scope.scrollToList = false;
                }
            }
        });

        // pagination in visit note list
        $scope.currentPage = 1;

        $scope.updateMailTo = function(){

            var email = adminEmail;
            var subject = "Visit Notes Analysis Module Correction"
            var body = "\n[describe problem here]\n\n***********************************"
                           +"\nDocument Number: " + $scope.selectedNoteUuid
                           +"\nDocument Date: "+ $scope.selectedNoteDate
                           +"\nPatient MRN: " + patientMRN
                           +"\nVisit Note Text:\n\n " + $scope.noteText;

            var href = "mailto:"+email
                           +"?subject="+escape(subject)
                           +"&body="+escape(body);

            jq("#report-problem a").attr("href", href);

            //window.location = "mailto:" + adminEmail + "?Subject=Visit%20Notes%20Analysis%20Module%20Correction&body=[no document selected]";
        }

    });
