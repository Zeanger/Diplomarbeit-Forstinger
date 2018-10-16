//Highlight corresponding menuSection
//Done!
function configurePress(element) {
	var mainSectionId = $(element).attr("id").substring(16);
	closeAllMenuSections();
	closeMenuSectionGlobal();
	openMenuSection($("#menuSection_"+mainSectionId).find(".menuHeader"));
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
	var start = new Date($(element).val());
	for(var i = 0; i < menuOptions.length; i++) {
		menuOptions[i].time.start = start;
	}
	updateAllVisuals();
}
