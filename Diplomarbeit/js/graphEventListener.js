//Highlight corresponding menuSection
//Done!
function configurePress(element) {
	var mainSectionId = $(element).attr("id").substring(16);
	closeAllMenuSections();
	closeMenuSectionGlobal();
	openMenuSection($("#menuSection_"+mainSectionId).find(".menuHeader"));
}

//Exports current graphs to excel
//Todo: All!
function excelPress(element) {
	var id = $(element).attr("id").substring(12);
	var activeGraphId = null;
	var excelGraph = [];

	for (var i = 0; i < activeGraphs.length; i++) {
		if(activeGraphs[i].id == id) {
			activeGraphId = i;
			break;
		}
	}

	for (variable of activeGraphs[activeGraphId].canvas.config.data.datasets) {
		if(variable.label) {
			var excelObject = {
					name: "",
					data: []
			};
			excelObject.name = variable.label;
			for (variable2 of variable.data) {
				if(variable2.t.getTime() != activeGraphs[activeGraphId].canvas.config.data.datasets[0].data[0].t.getTime() && variable2.t.getTime() != activeGraphs[activeGraphId].canvas.config.data.datasets[0].data[1].t.getTime()) {
					var excelDataObject = {
						x: variable2.t.getTime(),
						y: variable2.y
					}
					excelObject.data.push(excelDataObject);
				}
			}
			excelGraph.push(excelObject);
		}
	}

	var unsortedData = {};
	for (var i = 0; i < excelGraph.length; i++) {
		for (var j = 0; j < excelGraph[i].data.length; j++) {
			if(excelGraph[i].data[j].x in unsortedData) {
				unsortedData[excelGraph[i].data[j].x][i] = excelGraph[i].data[j].y;
			} else {
				var tempArray = new Array(excelGraph.length);
				tempArray[i] = excelGraph[i].data[j].y;
				unsortedData[excelGraph[i].data[j].x] = tempArray;
			}
		}
	}

	var sortedData = {};
	Object.keys(unsortedData).sort().forEach(function(key) {
		sortedData[key] = unsortedData[key];
	});

	//Excel
	var excel = $JExcel.new("Calibri light 11 #000000");
	excel.set({sheet:0,value: "Sheet 1"});
	var evenRow=excel.addStyle( { border: "none,none,none,thin #333333"});
	var oddRow=excel.addStyle ( { fill: "#ECECEC" ,border: "none,none,none,thin #333333"});
	for (var i=1;i<sortedData.length;i++) {
		excel.set({row:i,style: i%2==0 ? evenRow: oddRow });
	}

	var formatHeader=excel.addStyle ( {
		border: "none,none,none,thin #333333",font: "Calibri 12 #0000AA B"}
	);

	excel.set(0,0,0,"Date",formatHeader);
	for (var i=0;i<excelGraph.length;i++){              	// Loop headers
	 	excel.set(0,i+1,0,excelGraph[i].name,formatHeader);   // Set CELL header text & header format
	}

	var i = 0;
	for (var variable in sortedData) {
		if (sortedData.hasOwnProperty(variable)) {
			console.log(toMysqlFormat(new Date(Number(variable))).toString());
			// excel.set(0,0,i+1,toMysqlFormat(new Date(Number(variable))).toString());
			excel.set(0,0,i+1,$JExcel.toExcelLocalTime(new Date(Number(variable))),excel.addStyle({format: "dd.mm.yyyy hh:mm:ss"}));
			for (var j = 0; j < sortedData[variable].length; j++) {
				console.log(sortedData[variable][j]);
				if(sortedData[variable][j] != undefined) {
					excel.set(0,1+j,i+1,sortedData[variable][j]);
				}
			}
		}
		i++;
	}

	excel.generate("Graph.xlsx");
}

//Add a measurement to the graph
//Done!
function addGraph(element) {
	var id = $(element).attr("id").substring(10);
	//Saving
	if($(element).siblings("Select").val() != null) {
		var dropdownValue = $("#addGraphSelection_"+id).val();

		for(var i = 0; i < menuOptions.length; i++) {
			if(menuOptions[i].id == id) {
				menuOptions[i].graphs.push(dropdownValue);

				break;
			}
		}

		//Visuals
		var measurementType = stationNames[$("#addGraphSelection_"+id).find("Option[value="+dropdownValue+"]").val()].measurementType;

		$("#addGraphSelection_"+id).find("Option[value="+dropdownValue+"]").hide();
		for(key in stationNames) {
			if(stationNames[key].measurementType != measurementType) {
				$("#addGraphSelection_"+id).find("Option[value="+key+"]").hide();
			}
		}
		for(key in stationNames) {
			if($("#addGraphSelection_"+id).find("Option[value="+key+"]").css("display") != "none") {
				$("#addGraphSelection_"+id).val(key);
				break;
			}
			else {
				$("#addGraphSelection_"+id).val(null);
			}
		}

		$("#removeGraphSelection_"+id).find("Option[value="+dropdownValue+"]").show();
		for(key in stationNames) {
			if($("#removeGraphSelection_"+id).find("Option[value="+key+"]").css("display") != "none") {
				$("#removeGraphSelection_"+id).val(key);
				break;
			}
			else {
				$("#removeGraphSelection_"+id).val(null);
			}
		}
	}
}


//Removes a measurement to the graph
//Done!
function removeGraph(element) {
	var id = $(element).attr("id").substring(13);

	if($(element).siblings("Select").val() != null) {
		//Saving
		var dropdownValue = $("#removeGraphSelection_"+id).val();

		for(var i = 0; i < menuOptions.length; i++) {
			if(menuOptions[i].id == id) {
				for(var j = 0; j < menuOptions[i].graphs.length; j++) {
					if(menuOptions[i].graphs[j] == dropdownValue) {
						menuOptions[i].graphs.splice(j,1);
					}
				}
			}
		}

		//Visuals
		$("#removeGraphSelection_"+id).find("Option[value="+dropdownValue+"]").hide();
		for(key in stationNames) {
			if($("#removeGraphSelection_"+id).find("Option[value="+key+"]").css("display") != "none") {
				$("#removeGraphSelection_"+id).val(key);
				break;
			}
			else {
				$("#removeGraphSelection_"+id).val(null);
			}
		}

		$("#addGraphSelection_"+id).find("Option[value="+dropdownValue+"]").show();
		for(key in stationNames) {
			if($("#addGraphSelection_"+id).find("Option[value="+key+"]").css("display") != "none") {
				$("#addGraphSelection_"+id).val(key);
				break;
			}
			else {
				$("#addGraphSelection_"+id).val(null);
			}
		}

		if($("#removeGraphSelection_"+id).val() == null) {
			for(key in stationNames) {
				if($("#addGraphSelection_"+id).find("Option[value="+key+"]").css("display") == "none") {
					$("#addGraphSelection_"+id).find("Option[value="+key+"]").show();
				}
			}
		}
	}
}


//Saves current Start Date to activeGraphs
//Done!
function startDateChanged(element) {
	var mainSectionId = $(element).attr("id").substring(10);
	for(var i = 0; i < menuOptions.length; i++) {
		if(menuOptions[i].id == mainSectionId) {
			if(!$(element)[0].value) menuOptions[i].time.start = null;
			else {
				var start = new Date($(element)[0].value);
				menuOptions[i].time.start = start;
			}
		}
	}
}


//Saves current End Date to activeGraphs
//Done!
function endDateChanged(element) {
	var mainSectionId = $(element).attr("id").substring(8);
	for(var i = 0; i < menuOptions.length; i++) {
		if(menuOptions[i].id == mainSectionId) {
			if(!$(element)[0].value) menuOptions[i].time.end = null;
			else {
				var	end = new Date($(element)[0].value);
				menuOptions[i].time.end = end;
			}
		}
	}
}


//Writes a span value to corresponding graph
//Done!
function spanChanged(element) {
	var mainSectionId = $(element).attr("id").substring(5);
	var span = $(element).val();
	if(span < 0) {
		span = 0;
		$(element).val(span);
	}
	for(var i = 0; i < menuOptions.length; i++) {
		if(menuOptions[i].id == mainSectionId) {
			menuOptions[i].time.span = Number(span);
			break;
		}
	}
}


//Toggle if the graph should be Updated
//Done!
function keepUpdatedChanged(element) {
	var mainSectionId = $(element).attr("id").substring(12);
	var isChecked = $(element)[0].checked;
	for(var i = 0; i < menuOptions.length; i++) {
		if(menuOptions[i].id == mainSectionId) {
			menuOptions[i].keepUpdated = isChecked;
			break;
		}
	}
}


//Toggle the graphs Interpolation settings
//Done!
function interpolationChanged(element) {
	var mainSectionId = $(element).attr("id").substring(14);
	var isChecked = $(element)[0].checked;
	for(var i = 0; i < menuOptions.length; i++) {
		if(menuOptions[i].id == mainSectionId) {
			menuOptions[i].interpolation = isChecked;
			break;
		}
	}
}


//Changes time.start of all Graphs
//Done!
function startDateChangedGlobal(element) {
	var start = null;
	if($(element).val()) {
		start = new Date($(element).val());
	}
	for(var i = 0; i < menuOptions.length; i++) {
		menuOptions[i].time.start = start;
	}
	updateAllVisuals();
}


//Changes keepUpdated of all Graphs
//Done!
function keepUpdatedChangedGlobal(element) {
	var isChecked = $(element)[0].checked;
	for(var i = 0; i < menuOptions.length; i++) {
		menuOptions[i].keepUpdated = isChecked;
	}
	updateAllVisuals();
}


//Changes Interpolation of all Graphs
//Done!
function interpolationChangedGlobal(element) {
	var isChecked = $(element)[0].checked;
	for(var i = 0; i < menuOptions.length; i++) {
		menuOptions[i].interpolation = isChecked;
	}
	updateAllVisuals();
}


//Changes span of all Graphs
//Done!
function spanChangedGlobal(element) {
	var span = null;
	if($(element).val()) {
		span = $(element).val();
		if(span < 0) {
			span = 0;
			$(element).val(span);
		}
	}
	for(var i = 0; i < menuOptions.length; i++) {
		menuOptions[i].time.span = span;
	}
	updateAllVisuals();
}


//Changes time.end of all Graphs
//Done!
function endDateChangedGlobal(element) {
	var end = null;
	if($(element).val()) {
		end = new Date($(element).val());
	}
	for(var i = 0; i < menuOptions.length; i++) {
		menuOptions[i].time.end = end;
	}
	updateAllVisuals();
}


function addSection() {
	//Add Graph click
  if(freeId.length > 0) {
    var smallestFreeId = freeId[0];
    var smallestFreeIdIndex = 0;

    for(var i = 0; i < freeId.length; i++) {
      if(Number(freeId[i]) < Number(smallestFreeId)) {
        smallestFreeId = freeId[i];
        smallestFreeIdIndex = i;
      }
    }

    freeId.splice(smallestFreeIdIndex,1);
    createGraph(Number(smallestFreeId));
  }
  else {
    createGraph(count);
    count++;
  }
}
