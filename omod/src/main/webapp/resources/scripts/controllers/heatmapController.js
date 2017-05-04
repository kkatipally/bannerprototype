'use strict';

visitNotesApp
		.controller(
				'heatmapController',
				function($scope, $location, $timeout, DateFactory,
						SearchFactory, VisitUuidFactory, BreadcrumbFactory,
						dateRangeAndTermFilter, uniqueNotesFilter,
						SofaDocumentResource, SofaTextMentionUIResources,
						SofaDocumentUIResource, SofaDocumentUIResources) {

					$scope.searchInput = "";
					$scope.searchBarTerms = [];

					$scope.resetVisitList = function() {
                    	//$scope.filterFromDate = $scope.startDate.name;
                        //$scope.filterToDate = $scope.endDate.name;
                        $scope.filterFromDate = "";
                        $scope.filterToDate = "";
                    	$scope.matchTerm = "";
                    	$scope.visitListInput = "";
                    }

					$scope.page2Submit = function(searchInput) {

						$scope.searchBarTerms = $scope.searchInput.split(",");
						$scope.uniqueSearchBarTerms = $scope.searchBarTerms
								.filter(onlyUnique);
						$scope.finalSearchBarTerms = [];

						for (var i = 0; i < $scope.uniqueSearchBarTerms.length; i++) {
							$scope.uniqueSearchBarTerms[i] = $scope.uniqueSearchBarTerms[i]
									.trim().toLowerCase();
							if ($scope.uniqueSearchBarTerms[i] !== "")
								$scope.finalSearchBarTerms
										.push($scope.uniqueSearchBarTerms[i]);
						}

						addBreadCrumb($scope.searchInput);

						// console.log("Page 1 submitted with searchInput: " +
						// $scope.searchInput);
						// console.log("Page 1 submitted with
						// JSON.stringify(searchBarTerms): " +
						// JSON.stringify($scope.searchBarTerms));
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
											//console.log("heatmap:" + JSON.stringify($scope.stms.results));
											$scope.val = $scope.stms.results;
											//$scope.visitNotes = populateVisitNoteList($scope.stms.results);
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
                                            //console.log("visit list:" + JSON.stringify($scope.sds.results));
                                            $scope.visitNotes = populateVisitNoteList($scope.sds.results);
                                            // resetting visit note list filter
                                            // parameters
                                            $scope.resetVisitList();
                                        });
					};

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

						// console.log("date: " + date);
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

					// $scope.$watch(function () { return
					// DateFactory.getSliderMinDate(); },
					// function (newValue, oldValue) {
					// if (newValue !== oldValue) {
					$scope.startDate = {
						"name" : DateFactory.getSliderMinDate()
					};
					// console.log("startDate: " + $scope.startDate.name );
					// }
					// });
					// $scope.$watch(function () { return
					// DateFactory.getSliderMaxDate(); },
					// function (newValue, oldValue) {
					// if (newValue !== oldValue) {
					$scope.endDate = {
						"name" : DateFactory.getSliderMaxDate()
					};
					// console.log("Slider max in heatmapCtrl: " +
					// $scope.endDate.name);
					// }
					// });

					$scope.minDate1 = monthsBefore(new Date(), 24);

					$scope.dateOptions1 = {
						formatYear : 'yy',
						minDate : $scope.minDate1, // min start date: 2 years
						// ago from today
						startingDay : 0
					};

					$scope.$watch('endDate.name', function(newEnd) {
						if (newEnd) {
							$scope.dateOptions1.maxDate = monthsBefore(newEnd,
									3); // max start
							// date: min
							// of end
							// Date and
							// 3 months
							// ago from
							// today
							/*$scope.filterFromDate = $scope.startDate.name;
							$scope.filterToDate = newEnd;*/
						}
					});

					$scope.$watch('startDate.name', function(newStart) {
						if (newStart) {
							$scope.dateOptions2.minDate = monthsAfter(newStart,
									3); // min end
							// date:
							// start
							// date
							/*$scope.filterFromDate = newStart;
							$scope.filterToDate = $scope.endDate.name;*/
						}
					});

					$scope.dateOptions2 = {
						formatYear : 'yy',
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

					$scope.searchInput = SearchFactory.getSearchTerms();
					$scope.visitDateUuid = VisitUuidFactory.getVisitDateUuid();
					if (!$scope.searchInput && !$scope.visitDateUuid) {
						$location.url('/view1');
					} else if ($scope.searchInput){
						$scope.searchBarTerms = $scope.searchInput.split(",");

						$scope.uniqueSearchBarTerms = $scope.searchBarTerms
								.filter(onlyUnique);
						$scope.finalSearchBarTerms = [];

						for (var i = 0; i < $scope.uniqueSearchBarTerms.length; i++) {
							$scope.uniqueSearchBarTerms[i] = $scope.uniqueSearchBarTerms[i]
									.trim().toLowerCase();
							if ($scope.uniqueSearchBarTerms[i])
								$scope.finalSearchBarTerms
										.push($scope.uniqueSearchBarTerms[i]);
						}

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
											//console.log("heatmap:" + JSON.stringify($scope.stms.results));
											$scope.val = $scope.stms.results;
											//$scope.visitNotes = populateVisitNoteList($scope.stms.results);
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
                                            //console.log("visit list:" + JSON.stringify($scope.sds.results));
                                            $scope.visitNotes = populateVisitNoteList($scope.sds.results);
                                            // resetting visit note list filter
                                            // parameters
                                            $scope.resetVisitList();
                                        });
					} else if ($scope.visitDateUuid) {
						$scope.sofadocUI = SofaDocumentUIResource
								.get(
										{
											uuid : $scope.visitDateUuid,
											v : "full"
										},
										function() {
											//console.log("heatmap:" + JSON.stringify($scope.sofadocUI));
											$scope.visitNotes = populateVisitNote($scope.sofadocUI);
											// reset visitDateUuid
											VisitUuidFactory.setVisitDateUuid("");
										});
					}

					$scope.noteRendering = "";

					function populateVisitNote(sofadocUI) {

                        //console.log("results:" + JSON.stringify(results));
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
                                .get(
                                        {
                                            uuid : note.uuid,
                                            v : "full"
                                        },
                                        function() {
                                            $timeout(
                                                    function() {
                                                        $scope.noteRendering = $scope.sofadocInit.annotatedHTML;
                                                        //console.log("html: " + $scope.sofadocInit.annotatedHTML);
                                                        $scope.updateMailTo();
                                                        $scope.previousSearchTerm = "";
                                                    },
                                                    0);
                                        });
                    //console.log("visit notes: " + JSON.stringify(Notes));
                    return Notes;
                    }

					function populateVisitNoteList(dateList) {

						//console.log("results:" + JSON.stringify(results));
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
                                                                    //console.log("html: " + $scope.sofadocInit.annotatedHTML);
                                                                    $scope.updateMailTo();
                                                                    $scope.previousSearchTerm = "";
                                                                },
                                                                0);
                                                    });
                                }
                            }
						});
					//console.log("visit notes: " + JSON.stringify(Notes));
					return Notes;
				    }

					$scope.backToSearchPage = function() {
						BreadcrumbFactory.setBreadCrumbs($scope.breadCrumbs);
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
						// finSearchTerms.forEach(function(e){
						$timeout(function() {
							$scope.breadCrumbs.push({
								"word" : searchInput,
								"startDate" : $scope.startDate.name,
								"endDate" : $scope.endDate.name
							});
						}, 0);
						// });
					}
					;

					function addBreadCrumb(searchInput) {
						// finSearchTerms.forEach(function(e){
						$timeout(function() {
							$scope.breadCrumbs.push({
								"word" : searchInput,
								"startDate" : $scope.startDate.name,
								"endDate" : $scope.endDate.name
							});
						}, 0);
						// });
					}
					;

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

									$scope.searchBarTerms = $scope.searchInput
											.split(",");
									$scope.uniqueSearchBarTerms = $scope.searchBarTerms
											.filter(onlyUnique);
									$scope.finalSearchBarTerms = [];

									for (var i = 0; i < $scope.uniqueSearchBarTerms.length; i++) {
										$scope.uniqueSearchBarTerms[i] = $scope.uniqueSearchBarTerms[i]
												.trim().toLowerCase();
										if ($scope.uniqueSearchBarTerms[i])
											$scope.finalSearchBarTerms
													.push($scope.uniqueSearchBarTerms[i]);
									}

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
														//console.log("heatmap:" + JSON.stringify($scope.stms.results));
														$scope.val = $scope.stms.results;
														//$scope.visitNotes = populateVisitNoteList($scope.stms.results);
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
                                                    //console.log("visit list:" + JSON.stringify($scope.sds.results));
                                                    $scope.visitNotes = populateVisitNoteList($scope.sds.results);
                                                    // resetting visit note list filter
                                                    // parameters
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
											// console.log("sofadoc:" +
											// JSON.stringify($scope.sofadoc.text));
											$timeout(
													function() {
														$scope.noteRendering = $scope.sofadoc.annotatedHTML;
														$scope.updateMailTo();
														$scope.previousSearchTerm = "";
													}, 0);
										});
					}

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
                            var body = document.querySelector("#visit-note");

                            if(listPosition) {
                                var scroll =  jq(listPosition).position().top + jq(listPosition).parent().scrollTop();

                                jq("body").animate({
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
                        	           +"\nVisit Note Text:\n\n " + $scope.noteRendering;

                        var href = "mailto:"+email
                        	           +"?subject="+escape(subject)
                        	           +"&body="+escape(body);

                        jq("#report-problem a").attr("href", href);

                        //window.location = "mailto:" + adminEmail + "?Subject=Visit%20Notes%20Analysis%20Module%20Correction&body=[no document selected]";
                    }

				});
