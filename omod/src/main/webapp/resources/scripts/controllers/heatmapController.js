'use strict';

visitNotesApp
		.controller(
				'heatmapController',
				function($scope, $location, $timeout, DateFactory,
						SearchFactory, VisitUuidFactory, BreadcrumbFactory,
						dateRangeAndTermFilter, uniqueNotesFilter,
						SofaDocumentResource, SofaTextMentionUIResources) {

					$scope.searchInput = "";
					$scope.searchBarTerms = [];

					$scope.page2Submit = function(searchInput) {

						$scope.searchBarTerms = $scope.searchInput.split(",");
						$scope.uniqueSearchBarTerms = $scope.searchBarTerms
								.filter(onlyUnique);
						$scope.finalSearchBarTerms = [];

						for (var i = 0; i < $scope.uniqueSearchBarTerms.length; i++) {
							$scope.uniqueSearchBarTerms[i] = $scope.uniqueSearchBarTerms[i]
									.trim();
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
											// console.log("heatmap:" +
											// JSON.stringify($scope.stms.results));
											$scope.val = $scope.stms.results;
											$scope.visitNotes = populateVisitNoteList($scope.stms.results);
											// console.log("visitNotes:" +
											// JSON.stringify($scope.visitNotes));
											// resetting visit note list filter
											// parameters
											$scope.filterFromDate = $scope.startDate.name;
											$scope.filterToDate = $scope.endDate.name;
											$scope.matchTerm = "";
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
							$scope.filterFromDate = $scope.startDate.name;
							$scope.filterToDate = $scope.endDate.name;
							$scope.matchTerm = "";
						}
					});

					$scope.$watch('startDate.name', function(newStart) {
						if (newStart) {
							$scope.dateOptions2.minDate = monthsAfter(newStart,
									3); // min end
							// date:
							// start
							// date
							$scope.filterFromDate = $scope.startDate.name;
							$scope.filterToDate = $scope.endDate.name;
							$scope.matchTerm = "";
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
						$scope.filterFromDate = $scope.startDate.name;
						$scope.filterToDate = $scope.endDate.name;
						$scope.matchTerm = "";
					};

					$scope.filterFromDate = $scope.startDate.name;
					$scope.filterToDate = $scope.endDate.name;
					$scope.matchTerm = "";

					$scope.patient = getParameterByName('patientId');

					function onlyUnique(value, index, self) {
						return self.indexOf(value) === index;
					}

					$scope.searchInput = SearchFactory.getSearchTerms();
					if ($scope.searchInput === '') {
						$location.url('/view1');
					} else {
						$scope.searchBarTerms = $scope.searchInput.split(",");

						$scope.uniqueSearchBarTerms = $scope.searchBarTerms
								.filter(onlyUnique);
						$scope.finalSearchBarTerms = [];

						for (var i = 0; i < $scope.uniqueSearchBarTerms.length; i++) {
							$scope.uniqueSearchBarTerms[i] = $scope.uniqueSearchBarTerms[i]
									.trim();
							if ($scope.uniqueSearchBarTerms[i] !== "")
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
											// console.log("heatmap:" +
											// JSON.stringify($scope.stms.results));
											$scope.val = $scope.stms.results;
											$scope.visitNotes = populateVisitNoteList($scope.stms.results);
											// console.log("visitNotes:" +
											// JSON.stringify($scope.visitNotes));
										});
					}

					$scope.visitDateUuid = VisitUuidFactory.getVisitDateUuid();
					if ($scope.visitDateUuid !== "") {
						$scope.stms = SofaTextMentionUIResources
								.displayHeatMapForVisit(
										{
											sofaDocUuid : $scope.visitDateUuid,
											v : "full"
										},
										function() {
											// console.log("heatmap:" +
											// JSON.stringify($scope.stms.results));
											$scope.val = $scope.stms.results;
											$scope.visitNotes = populateVisitNoteList($scope.stms.results);
											// console.log("visitNotes:" +
											// JSON.stringify($scope.visitNotes));
											// reset visitDateUuid
											VisitUuidFactory
													.setVisitDateUuid("");
										});
					}

					$scope.noteRendering = "";

					function populateVisitNoteList(results) {

						//console.log("results:" + JSON.stringify(results));
						var Notes = [];
						$timeout(function() {
							$scope.noteRendering = "";
						}, 0);
						results
								.forEach(function(result, i) {
									result.dateList
											.forEach(function(date, j) {
												var note = {};
												note["uuid"] = date.uuid;
												note["term"] = result.mentionText;
												note["date"] = new Date(
														date.dateCreated);
												note["diagnosis"] = date.diagnosis;
												note["provider"] = date.provider;
												note["location"] = date.location;
												note["problemWordList"] = date.problemWordList.map(function(word) {
												    return word.word;
												});
												note["treatmentWordList"] = date.treatmentWordList.map(function(word) {
                                                	return word.word;
                                                });
                                                note["testWordList"] = date.testWordList.map(function(word) {
                                                    return word.word;
                                                });

												Notes.push(note);
												if ((i == 0) && (j == 0)) {
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
																				},
																				0);
																	});
												}
											});
								});
						console.log("visit notes: " + JSON.stringify(Notes));
						return Notes;
					}

					$scope.visitListSearchInput = "";

					$scope.resetVisitList = function() {
						$scope.filterFromDate = $scope.startDate.name;
						$scope.filterToDate = $scope.endDate.name;
						$scope.matchTerm = "";
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
												.trim();
										if ($scope.uniqueSearchBarTerms[i] !== "")
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
														// console.log("heatmap:"
														// +
														// JSON.stringify($scope.stms.results));
														$scope.val = $scope.stms.results;
														$scope.visitNotes = populateVisitNoteList($scope.stms.results);
														// console.log("visitNotes:"
														// +
														// JSON.stringify($scope.visitNotes));
														// resetting visit note
														// list filter
														// parameters
														$scope.filterFromDate = $scope.startDate.name;
														$scope.filterToDate = $scope.endDate.name;
														$scope.matchTerm = "";
													});
								}, 0);
					};

					// visit note rendering upon click in the visit list
					$scope.selectNote = function() {
						$scope.selectedNote = this.visitNote;

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
													}, 0);
										});
					}

					// pagination in visit note list
					$scope.currentPage = 1;

				});
