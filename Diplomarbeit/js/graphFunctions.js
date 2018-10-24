//Creates a new menuSection with its corresponding mainSection
//Done! unless new contend is added
function createGraph(count) {
	var options0 = "";
	var options1 = "";
	for(key in stationNames) {
		options0 += '<option value="'+key+'">'+stationNames[key].displayName+'</optioin>';
		options1 += '<option value="'+key+'" style="display: none">'+stationNames[key].displayName+'</optioin>';
	}
	var dropdown0 =	'<select id="addGraphSelection_'+count+'">'+
											options0 +
									'</select>';
	var dropdown1 =	'<select id="removeGraphSelection_'+count+'">'+
											options1 +
									'</select>';
	var mainSection = '<div id="mainSection_'+count+'" class="mainSection">'+
											'<div class="mainHeader">Graph '+(count+1)+'</div>'+
											'<div class="mainContent">'+
												'<div class="graph">'+
													'<canvas id="dateGraph_'+count+'"></canvas>'+
												'</div>'+
												'<div class="graphButtonHolder">'+
													'<div id="configureButton_'+count+'" class="graphButton" onclick="configurePress(this)">'+
														'<img src="../resources/img/configure.png">'+
													'</div>'+
													'<div id="excelButton_'+count+'" class="graphButton" onclick="excelPress(this)">'+
														'<img src="../resources/img/export.png">'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</div>';
	var menuSection = '<div id="menuSection_'+count+'" class="menuSection" value="open">'+
											'<div class="menuHeader" onclick="toggleMenuSection(this)">Menu '+(count+1)+'</div>'+
											'<div class="menuContent">'+
												'<div class="menuDropdown">'+
													dropdown0+
													'<div id="addButton_'+count+'" class="addButton" onclick="addGraph(this)">+</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													dropdown1+
													'<div id="removeButton_'+count+'" class="removeButton" onclick="removeGraph(this)">-</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="startDate_'+count+'" type="date" onchange="startDateChanged(this)"></div>'+
													'<div class="datePickerText">Start</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="endDate_'+count+'" type="date" onchange="endDateChanged(this)"></div>'+
													'<div class="datePickerText">End</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="span_'+count+'" type="number" onchange="spanChanged(this)" placeholder="Minutes"></div>'+
													'<div class="datePickerText">Span (Min)</div>'+
												'</div>'+
												'<div class="menuCheckbox"><input id="keepUpdated_'+count+'" type="checkbox" onclick="keepUpdatedChanged(this)">Till now</div>'+
												'<div class="menuCheckbox"><input id="interpolation_'+count+'" type="checkbox" checked onclick="interpolationChanged(this)">Interpolate</div>'+
												'<div id="updateGraph_'+count+'" class="applySettings" onclick="updateGraph(this)">Apply Settings</div>'+
												'<div id="deleteMenuSection_'+count+'" class="menuDelete" onclick="deleteMenuSection(this)">Delete Graph</div>'+
											'</div>'+
										'</div>';

	$(".main").append(mainSection);
	if($(".menuSection").length > 0) 	$(".menu").find(".menuSection").last().after(menuSection);
	else $(".menu").find(".menuSectionGlobal").last().after(menuSection);

	$("#removeGraphSelection_"+count).val(null);

	var time = {};
	time.start = null;
	time.end = null;
	time.span = null;

  var tempMenuTime = {};
  tempMenuTime.start = null;
  tempMenuTime.end = null;
  tempMenuTime.span = null;

  var tempMenuOption = {};
  tempMenuOption.id = count;
  tempMenuOption.graphs = [];
  tempMenuOption.time = tempMenuTime
  tempMenuOption.interpolation = true;
  tempMenuOption.keepUpdated = false;

	var newGraph = {};
	newGraph.id = count;
	newGraph.canvas = null;
	newGraph.graphs = [];
	newGraph.time = time;
	newGraph.interpolation = true;
	newGraph.keepUpdated = false;

	activeGraphs.push(newGraph);
  menuOptions.push(tempMenuOption);

	startDateChangedGlobal($("#startDateGlobal"));
	endDateChangedGlobal($("#endDateGlobal"));
	spanChangedGlobal($("#spanGlobal"));
	interpolationChangedGlobal($("#interpolationGlobal"));
	keepUpdatedChangedGlobal($("#keepUpdatedGlobal"));

	var activeGraphsId = activeGraphs.length-1;

	var ctx = document.getElementById("dateGraph_"+count).getContext("2d");
	activeGraphs[activeGraphsId].canvas = new Chart(ctx, JSON.parse(JSON.stringify(graphConfigTemplate)));
}


//Updates all Visuals
//some!
function updateAllVisuals() {
	console.log("Updated all visuals!");
	for(var i = 0; i < menuOptions.length; i++) {
		$("#keepUpdated_"+menuOptions[i].id).prop("checked",menuOptions[i].keepUpdated);
		$("#interpolation_"+menuOptions[i].id).prop("checked",menuOptions[i].interpolation);
		$("#span_"+menuOptions[i].id).val(menuOptions[i].time.span);
		if(menuOptions[i].time.start) $("#startDate_"+menuOptions[i].id).val(toDatepickerFormat(menuOptions[i].time.start));
		if(menuOptions[i].time.end) $("#endDate_"+menuOptions[i].id).val(toDatepickerFormat(menuOptions[i].time.end));

		$("#addGraphSelection_"+menuOptions[i].id).val(null);
		$("#removeGraphSelection_"+menuOptions[i].id).val(null);
		for(key in stationNames) {
			$("#addGraphSelection_"+menuOptions[i].id).find("Option[value="+key+"]").show();
			$("#removeGraphSelection_"+menuOptions[i].id).find("Option[value="+key+"]").hide();
		}

		for(var j = 0; j < menuOptions[i].graphs.length; j++) {
			$("#addGraphSelection_"+menuOptions[i].id).find("Option[value="+menuOptions[i].graphs[j]+"]").hide();
			$("#removeGraphSelection_"+menuOptions[i].id).find("Option[value="+menuOptions[i].graphs[j]+"]").show();
		}
		var measurementType = null;
		if(menuOptions[i].graphs.length > 0) measurementType = stationNames[menuOptions[i].graphs[0]].measurementType;
		for(key in stationNames) {
			if(stationNames[key].measurementType != measurementType && measurementType != null) {
				$("#addGraphSelection_"+menuOptions[i].id).find("Option[value="+key+"]").hide();
			}
		}
		for(key in stationNames) {
			if($("#addGraphSelection_"+menuOptions[i].id).find("Option[value="+key+"]").css("display") != "none") {
				$("#addGraphSelection_"+menuOptions[i].id).val(key);
				break;
			}
			else {
				$("#addGraphSelection_"+menuOptions[i].id).val(null);
			}
		}
		for(key in stationNames) {
			if($("#removeGraphSelection_"+menuOptions[i].id).find("Option[value="+key+"]").css("display") != "none") {
				$("#removeGraphSelection_"+menuOptions[i].id).val(key);
				break;
			}
			else {
				$("#removeGraphSelection_"+menuOptions[i].id).val(null);
			}
		}
	}
}


//Apply Settings button was pressed
//Some new shit with span
function updateGraph(element) {
	elementId = $(element).attr("id").substring(12);

	var activeGraphId = null;
	var menuOptionsId = null;

	var anyKeepUpdated = false;

	for(var i = 0; i < menuOptions.length; i++) {
		if(menuOptions[i].id == elementId) {
			menuOptionsId = elementId;
		}
	}
	for(var i = 0; i < activeGraphs.length; i++) {
		if(activeGraphs[i].id == elementId) {
			activeGraphsId = elementId;
		}
	}

	activeGraphs[activeGraphsId].graphs = menuOptions[menuOptionsId].graphs;
	activeGraphs[activeGraphsId].interpolation = menuOptions[menuOptionsId].interpolation;
	activeGraphs[activeGraphsId].keepUpdated = menuOptions[menuOptionsId].keepUpdated;
	activeGraphs[activeGraphsId].time.start = menuOptions[menuOptionsId].time.start;
	activeGraphs[activeGraphsId].time.end = menuOptions[menuOptionsId].time.end;
	activeGraphs[activeGraphsId].time.span = menuOptions[menuOptionsId].time.span;

	for(var i = 0; i < activeGraphs.length; i++) {
		if(activeGraphs[i].id == elementId) {
			activeGraphId = i;
		}
		if(activeGraphs[i].keepUpdated) {
			anyKeepUpdated = true;
		}
		if(activeGraphs[i].keepUpdated && keepUpdatedInterval == false) {
			keepUpdatedInterval = setInterval(updateTillNow, settings.refreshRate);
		}
	}
	if(!anyKeepUpdated) {
		clearInterval(keepUpdatedInterval);
		keepUpdatedInterval = false;
	}

	activeGraphs[activeGraphId].canvas.data.datasets = [];
	activeGraphs[activeGraphId].canvas.options.scales.yAxes[0].ticks.min = 0;
	activeGraphs[activeGraphId].canvas.options.scales.yAxes[0].ticks.max = 0;
	//activeGraphs[activeGraphId].canvas.update();

	if(activeGraphs[activeGraphId].graphs.length == 0) {
		activeGraphs[activeGraphId].canvas.options.legend.display = false;
		activeGraphs[activeGraphId].canvas.options.scales.yAxes[0].scaleLabel.display = false;
		activeGraphs[activeGraphId].canvas.options.scales.yAxes[0].ticks.min = -20;
		activeGraphs[activeGraphId].canvas.options.scales.yAxes[0].ticks.max = 20;
		activeGraphs[activeGraphId].canvas.data.datasets = [];
		activeGraphs[activeGraphId].canvas.update();
		return false;
	}

	pushBaseLine(activeGraphId);

	for(var i = 0; i < activeGraphs[activeGraphId].graphs.length; i++) {
		pushGraphData(activeGraphId, i)
	}
}


//Applies and Update all changes in activeGraphs
//Some new shit with span!
function pushGraphData(id, index) {
	var newDataset = {};
	newDataset.lineTension = 0;
	newDataset.data = [];
	newDataset.label = "";
	newDataset.borderColor = "";
	newDataset.backgroundColor = "";

	newDataset.label = stationNames[activeGraphs[id].graphs[index]].displayName;
	newDataset.borderColor = datasetsColour.borderColor[index];
	newDataset.backgroundColor = datasetsColour.backgroundColor[index];

	var getDataName = stationNames[activeGraphs[id].graphs[index]].getDataName;
	var measurementType = stationNames[activeGraphs[id].graphs[index]].measurementType;

	var startDateDisplay = new Date(activeGraphs[id].time.start);
	var endDateDisplay = new Date(activeGraphs[id].time.end);
	startDateDisplay.setMinutes(startDateDisplay.getMinutes()+new Date().getTimezoneOffset());
	endDateDisplay.setMinutes(endDateDisplay.getMinutes()+new Date().getTimezoneOffset());
	var startDateData = new Date(startDateDisplay);
	var endDateData = new Date(endDateDisplay);
	startDateData.setDate(startDateDisplay.getDate()-1);
	endDateData.setDate(endDateDisplay.getDate()+1);

	if(activeGraphs[id].time.span > 0) {
		var date = new Date();
		startDateDisplay = new Date(endDateDisplay.getTime() - (activeGraphs[id].time.span * 60 * 1000));
		startDateData.setDate(startDateDisplay.getDate()-1);
	}

	if(activeGraphs[id].keepUpdated) {
		endDateData = new Date();
		endDateDisplay = new Date();

		if(activeGraphs[id].time.span > 0) {
			var date = new Date();
			startDateDisplay = new Date(date.getTime() - (activeGraphs[id].time.span * 60 * 1000));
			startDateData.setDate(startDateDisplay.getDate()-1);
		}
	}

	if(activeGraphs[id].interpolation) {
		newDataset.lineTension = 0.2;
	} else {
		newDataset.lineTension = 0;
	}

	getData(getDataName, "DATA_PER_DATE", function(data){
		var chartDataY = new Array();
		var d1O = { date: new Date(startDateData), value: null };
		var d1I = { date: new Date(endDateDisplay), value: null };
		var d2O = { date: new Date(endDateData), value: null };
		var d2I = { date: new Date(startDateDisplay), value: null };
		for(var i = 0; i < data.length; i++) {
			var chartT = new Date(data[i]["Date"]);
			if(chartT >= startDateDisplay && chartT <= endDateDisplay) {
				newDataset.data.push({t:chartT,y:Number(data[i]["Value"])});
				chartDataY.push(Number(data[i]["Value"]));
			}
			if(chartT < startDateDisplay && chartT > d1O.date) {
				d1O.date = chartT; d1O.value = Number(data[i]["Value"]);
			}
			if(chartT > startDateDisplay && chartT < d1I.date) {
				d1I.date = chartT; d1I.value = Number(data[i]["Value"]);
			}
			if(chartT > endDateDisplay && chartT < d2O.date) {
				d2O.date = chartT; d2O.value = Number(data[i]["Value"]);
			}
			if(chartT < endDateDisplay && chartT > d2I.date) {
				d2I.date = chartT; d2I.value = Number(data[i]["Value"]);
			}
		}

		if(d1O.value && d1I.value) {
			var minBoundDataPoint = {t:startDateDisplay, y: d1O.value+(d1I.value-d1O.value)*Number(((startDateDisplay-d1O.date)/(d1I.date-d1O.date)))};
			newDataset.data.unshift(minBoundDataPoint);
		}
		if(d2O.value && d2I.value) {
			var maxBoundDataPoint = {t:endDateDisplay, y: d2I.value+(d2O.value-d2I.value)*Number(((endDateDisplay-d2I.date)/(d2O.date-d2I.date)))};
			newDataset.data.push(maxBoundDataPoint);
		}

		var chartYDelta = (Math.max.apply(Math, chartDataY)-Math.min.apply(Math, chartDataY));
		var chartYMin = Math.floor(Math.min.apply(Math, chartDataY)-chartYDelta*0.1);
		var chartYMax = Math.ceil(Math.max.apply(Math, chartDataY)+chartYDelta*0.1);

		if(chartYMin < activeGraphs[id].canvas.options.scales.yAxes[0].ticks.min) {
			activeGraphs[id].canvas.options.scales.yAxes[0].ticks.min = chartYMin;
		}
		if(chartYMax > activeGraphs[id].canvas.options.scales.yAxes[0].ticks.max) {
			activeGraphs[id].canvas.options.scales.yAxes[0].ticks.max = chartYMax;
		}

		activeGraphs[id].canvas.options.legend.display = true;
		activeGraphs[id].canvas.options.scales.yAxes[0].scaleLabel.display = true;
		activeGraphs[id].canvas.options.scales.yAxes[0].scaleLabel.labelString = measurementType;

		activeGraphs[id].canvas.data.datasets.push(newDataset);
		activeGraphs[id].canvas.update();
	}, startDateData, endDateData);
}


//Pushes a line at 0 from start to end
//Todo: All
function pushBaseLine(id) {
	var newDataset = {};
	newDataset.lineTension = 0;
	newDataset.data = [];
	newDataset.label = "";
	newDataset.borderColor = "#ffffff00";
	newDataset.backgroundColor = "#ffffff00";

	var startDateDisplay = new Date(activeGraphs[id].time.start);
	var endDateDisplay = new Date(activeGraphs[id].time.end);
	startDateDisplay.setMinutes(startDateDisplay.getMinutes()+new Date().getTimezoneOffset());
	endDateDisplay.setMinutes(endDateDisplay.getMinutes()+new Date().getTimezoneOffset());

	if(activeGraphs[id].time.span > 0) {
		var date = new Date();
		startDateDisplay = new Date(endDateDisplay.getTime() - (activeGraphs[id].time.span * 60 * 1000));
	}

	if(activeGraphs[id].keepUpdated) {
		endDateDisplay = new Date();

		if(activeGraphs[id].time.span > 0) {
			var date = new Date();
			startDateDisplay = new Date(date.getTime() - (activeGraphs[id].time.span * 60 * 1000));
		}
	}

	var chartData = new Array();
	var chartStart = { t: new Date(startDateDisplay), y: 0 };
	var chartEnd = { t: new Date(endDateDisplay), y: 0 };

	newDataset.data.push(chartStart);
	newDataset.data.push(chartEnd);

	activeGraphs[id].canvas.data.datasets.push(newDataset);
	//activeGraphs[id].canvas.update();

}


//Updates all Graphs with keepUpdated true
//Done!
function updateTillNow() {
	for(var j = 0; j < activeGraphs.length; j++) {
		if(activeGraphs[j].keepUpdated) {
			activeGraphs[j].canvas.data.datasets = [];
			//activeGraphs[j].canvas.update();
			pushBaseLine(j);
			for(var i = 0; i < activeGraphs[j].graphs.length; i++) {
				pushGraphData(activeGraphs[j].id, i)
			}
		}
	}
}


//Updates all Graphs because chart.js is worse then my depression
//Done!
// var updateAllGraphsItterator;
// var updateAllGraphsInterval = false;
// function updateAllGraphs() {
// 	updateAllGraphsItterator = 0;
// 	clearInterval(updateAllGraphsInterval);
// 	updateAllGraphsInterval = false;
// 	updateAllGraphsInterval = setInterval(updateAllGraphsLoop, 200);
// }
// function updateAllGraphsLoop() {
// 	if(activeGraphs.length > updateAllGraphsItterator) {
// 		updateGraph($("#updateGraph_"+activeGraphs[updateAllGraphsItterator].id));
// 	}
// 	updateAllGraphsItterator++;
// 	if(updateAllGraphsItterator > activeGraphs.length) {
// 		clearInterval(updateAllGraphsInterval);
// 		updateAllGraphsInterval = false;
// 	}
// }

function updateAllGraphs() {
	for(var i = 0; i < activeGraphs.length; i++) {
		updateGraph($("#updateGraph_"+activeGraphs[i].id));
	}
}
