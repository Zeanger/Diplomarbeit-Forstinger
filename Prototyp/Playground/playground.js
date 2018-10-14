//Global
const stationNames = {
	"temperature_0": {
		getDataName: "TEMPERATURE_0",
		displayName: "Temperature-Warehouse",
		measurementType: "temperature"
	},
	"temperature_1": {
		getDataName: "TEMPERATURE_1",
		displayName: "Temperature-Shop",
		measurementType: "temperature"
	},
	"temperature_2": {
		getDataName: "TEMPERATURE_2",
		displayName: "Temperature-Draußen",
		measurementType: "temperature"
	},
	"water_0": {
		getDataName: "WATER_0",
		displayName: "Water usage 0",
		measurementType: "water"
	},
	"water_1": {
		getDataName: "WATER_1",
		displayName: "Water usage 1",
		measurementType: "water"
	},
	"water_2": {
		getDataName: "WATER_2",
		displayName: "Water usage 2",
		measurementType: "water"
	},
	"water_3": {
		getDataName: "WATER_3",
		displayName: "Water usage 3",
		measurementType: "water"
	}
	,
	"current_0": {
		getDataName: "CURRENT_0",
		displayName: "Current ussage 0",
		measurementType: "current"
	}
};
const datasetsColour = {
	borderColor: ["#0000ff", "#00ff00", "#ff0000", "#800000", "#008000", "#000080", "#ff00bb"],
	backgroundColor: ["#0000ff45", "#00ff0045", "#ff000045", "#80000045", "#00800045", "#00008045", "#ff00bb45"]
};
var activeGraphs = [];
var keepUpdatedInterval = false;
var allPresets = [];
var settings = {};

const graphConfigTemplate = {
	type: "line",
	data: {
		datasets: []
	},
	options: {
		legend: {
			display: false
		},
		tooltips: {
			mode: "index",
			intersect: false
		},
		hover: {
			mode: "nearest",
			intersect: true
		},
		animation: {
			duration: 0
		},
		scales: {
			xAxes: [{
				display: true,
				type: "time",
				ticks: {
					minRotation: 30,
				},
				time: {
					displayFormats: {
						 'millisecond': 'YY MM DD',
						 'second': 'YY MM DD',
						 'minute': 'YY MM DD',
						 'hour': 'YY MM DD',
						 'day': 'YY MM DD',
						 'week': 'YY MM DD',
						 'month': 'YY MM DD',
						 'quarter': 'YY MM',
						 'year': 'YYYY MM',
					}
				}
			}],
			yAxes: [{
				display: true,
				ticks: {
					max: 20,
					min: -20
				},
				scaleLabel: {
					display: false,
					labelString: ""
				}
			}]
		}
	}
};

//Creates a new menuSection with its corresponding mainSection
//Done! unless new contend is added
function createSection(count) {
	var options0 = "";
	var options1 = "";
	for(key in stationNames) {
		options0 += '<option value="'+key+'">'+stationNames[key].displayName+'</optioin>';
		options1 += '<option value="'+key+'" style="display: none">'+stationNames[key].displayName+'</optioin>';
	}
	var dropdown0 =	'<select>'+
											options0 +
									'</select>';
	var dropdown1 =	'<select>'+
											options1 +
									'</select>';
	var mainSection = '<div id="mainSection_'+count+'" class="mainSection">'+
											'<div class="mainHeader">Graph '+(count+1)+'</div>'+
											'<div class="mainContent">'+
												'<div class="graph">'+
													'<canvas id="dateGraph_'+count+'"></canvas>'+
												'</div>'+
												'<div class="graphButtonHolder">'+
													'<div class="graphButton" onclick="configurePress(this)">'+
														'<img src="../img/configure.png">'+
													'</div>'+
													'<div class="graphButton">'+
														'<img src="../img/export.png">'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</div>';
	var menuSection = '<div id="menuSection_'+count+'" class="menuSection" value="open">'+
											'<div class="menuHeader" onclick="toggleMenuSection(this)">Menu '+(count+1)+'</div>'+
											'<div class="menuContent">'+
												'<div class="menuDropdown">'+
													dropdown0+
													'<div class="addButton" onclick="addGraph(this)">+</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													dropdown1+
													'<div class="removeButton" onclick="removeGraph(this)">-</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input type="date" onchange="startDateChanged(this)"></div>'+
													'<div class="datePickerText">Start</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input type="date" onchange="endDateChanged(this)"></div>'+
													'<div class="datePickerText">End</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input type="number" onchange="spanChanged(this)" placeholder="Minutes"></div>'+
													'<div class="datePickerText">Span (Min)</div>'+
												'</div>'+
												'<div class="menuCheckbox"><input type="checkbox" onclick="keepUpdatedChanged(this)">Till now</div>'+
												'<div class="menuCheckbox"><input type="checkbox" checked onclick="toggleInterpolation(this)">Interpolate</div>'+
												'<div class="applySettings" onclick="updateGraph(this)">Apply Settings</div>'+
												'<div class="menuDelete" onclick="deleteMenuSection(this)">Delete Graph</div>'+
											'</div>'+
										'</div>';

	$(".main").append(mainSection);
	if($(".menuSection").length > 0) 	$(".menu").find(".menuSection").last().after(menuSection);
	else $(".menu").find(".menuSectionGlobal").last().after(menuSection);

	$("#menuSection_"+count).find(".menuDropdown").next().find("Select").val(null);

	var time = {};
	time.start = null;
	time.end = null;
	time.span = null;

	var newGraph = {};
	newGraph.id = count;
	newGraph.canvas = null;
	newGraph.graphs = [];
	newGraph.time = time;
	newGraph.interpolation = true;
	newGraph.keepUpdated = false;
  newGraph.ctx = null;
  newGraph.graphConfig = JSON.parse(JSON.stringify(graphConfigTemplate)); //This line is more important the everything else!! This is legit copying the template

	activeGraphs.push(newGraph);
	var activeGraphsId = activeGraphs.length-1;

	activeGraphs[activeGraphsId].ctx = document.getElementById("dateGraph_"+count).getContext("2d");
	activeGraphs[activeGraphsId].canvas = new Chart(activeGraphs[activeGraphsId].ctx, activeGraphs[activeGraphsId].graphConfig);

	// updateAllGraphs();
}

//Creates the global menu
//Todo: Global-Time: Start, End, Span
function createGlobal() {
	var menuGlobal = 	'<div id="menuGlobal" class="menuSectionGlobal" value="open">'+
											'<div class="menuHeader" onclick="toggleMenuSectionGlobal(this)">Global</div>'+
											'<div class="menuContentGlobal">'+
												'<div>Preset</div>'+
												'<div class="menuDropdown">'+
													'<input type="text" placeholder="Preset name">'+
													'<div class="addButton" onclick="createPresetOfCurrent()">Save</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<select></select>'+
													'<div class="addButton" onclick="usePreset(this)">Load</div>'+
												'</div>'+
												'<div>Global Settings</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input type="date" onchange="startDateChangedGlobal(this)"></div>'+
													'<div class="datePickerText">Start</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input type="date" onchange="endDateChangedGlobal(this)"></div>'+
													'<div class="datePickerText">End</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input type="number" onchange="spanChangedGlobal(this)" placeholder="Minutes"></div>'+
													'<div class="datePickerText">Span</div>'+
												'</div>'+
												'<div class="menuCheckbox"><input type="checkbox" onclick="keepUpdatedChangedGlobal(this)">Till now</div>'+
												'<div class="menuCheckbox"><input type="checkbox" checked onclick="toggleInterpolationGlobal(this)">Interpolate</div>'+
												'<div class="applySettings" onclick="updateAllGraphs()">Apply Settings</div>'+
											'</div>'+
										'</div>';

	$(".menu").append(menuGlobal);

	//Load presets
	loadAllPresets(function(json_presets){
		var json_presets_decoded = JSON.parse(json_presets);
		for(var i = 0; i < json_presets_decoded.length; i++) {
			var preset_object = {};

			preset_object.name = json_presets_decoded[i].Name;
			preset_object.data = JSON.parse(json_presets_decoded[i].Data);

			if(preset_object.data[0].time.start) {
				preset_object.data[0].time.start = new Date(preset_object.data[0].time.start);
			}
			if(preset_object.data[0].time.end) {
				preset_object.data[0].time.end = new Date(preset_object.data[0].time.end);
			}

			allPresets.push(preset_object);
		}

		var options = "";
		for(var i = 0; i < allPresets.length; i++) {
			options += '<option value="'+allPresets[i].name+'">'+allPresets[i].name+'</optioin>';
		}

		$(".menuContentGlobal").find("Select").append(options);

	});
}

//loads all presets from the server per callback
//Todo: Done!
function loadAllPresets(callback) {
	$.ajax({
		url:"../php/loadAllPresets.php",
		success:function(msg){
			if(typeof callback == "function") {
				callback(msg);
			}
		},
	});
}

//
//
function loadSettings() {
	$.ajax({
		url:"../php/loadSettings.php",
		success:function(msg){
			var json_settings_decoded = JSON.parse(msg);
			var refreshRate = 30000; //Default value
			for(var i = 0; i < json_settings_decoded.length; i++) {
				if(json_settings_decoded[i].Setting = "refreshRate") refreshRate = json_settings_decoded[i].Value;
			}
			settings.refreshRate = refreshRate;
			console.log(settings);
		},
	});
}

//Highlight corresponding menuSection
//Done!
function configurePress(element) {
	var mainSectionId = $(element).parent().parent().parent().attr("id").substring(12);
	closeAllMenuSections();
	closeMenuSectionGlobal();
	openMenuSection($("#menuSection_"+mainSectionId).find(".menuHeader"));
}

//Toggle the graphs Interpolation settings
//Done!
function toggleInterpolation(element) {
	var mainSectionId = $(element).parent().parent().parent().attr("id").substring(12);
	var isChecked = $(element)[0].checked;
	for(var i = 0; i < activeGraphs.length; i++) {
		if(activeGraphs[i].id == mainSectionId) {
			activeGraphs[i].interpolation = isChecked;
			break;
		}
	}
}

//Add a measurement to the graph
//Done!
function addGraph(element) {
	//Saving
	if($(element).siblings("Select").val() != null) {
		var dropdownValue = $(element).siblings("Select").val();
		var id = $(element).parent().parent().parent().attr("id").substring(12);

		for(var i = 0; i < activeGraphs.length; i++) {
			if(activeGraphs[i].id == id) {
				activeGraphs[i].graphs.push(dropdownValue);

				break;
			}
		}

		//Visuals
		var measurementType = stationNames[$(element).siblings("Select").find("Option[value="+dropdownValue+"]").val()].measurementType;

		$(element).siblings("Select").find("Option[value="+dropdownValue+"]").hide();
		for(key in stationNames) {
			if(stationNames[key].measurementType != measurementType) {
				$(element).siblings("Select").find("Option[value="+key+"]").hide();
			}
		}
		for(key in stationNames) {
			if($(element).siblings("Select").find("Option[value="+key+"]").css("display") != "none") {
				$(element).siblings("Select").val(key);
				break;
			}
			else {
				$(element).siblings("Select").val(null);
			}
		}

		$(element).parent().next().find("Option[value="+dropdownValue+"]").show();
		for(key in stationNames) {
			if($(element).parent().next().find("Option[value="+key+"]").css("display") != "none") {
				$(element).parent().next().find("Select").val(key);
				break;
			}
			else {
				$(element).parent().next().find("Select").val(null);
			}
		}
	}
}

//Removes a measurement to the graph
//Done!
function removeGraph(element) {
	if($(element).siblings("Select").val() != null) {
		//Saving
		var dropdownValue = $(element).siblings("Select").val();
		var id = $(element).parent().parent().parent().attr("id").substring(12);

		for(var i = 0; i < activeGraphs.length; i++) {
			if(activeGraphs[i].id == id) {
				for(var j = 0; j < activeGraphs[i].graphs.length; j++) {
					if(activeGraphs[i].graphs[j] == dropdownValue) {
						activeGraphs[i].graphs.splice(j,1);
					}
				}
			}
		}

		//Visuals
		$(element).siblings("Select").find("Option[value="+dropdownValue+"]").hide();
		for(key in stationNames) {
			if($(element).siblings("Select").find("Option[value="+key+"]").css("display") != "none") {
				$(element).siblings("Select").val(key);
				break;
			}
			else {
				$(element).siblings("Select").val(null);
			}
		}

		$(element).parent().prev().find("Option[value="+dropdownValue+"]").show();
		for(key in stationNames) {
			if($(element).parent().prev().find("Option[value="+key+"]").css("display") != "none") {
				$(element).parent().prev().find("Select").val(key);
				break;
			}
			else {
				$(element).parent().prev().find("Select").val(null);
			}
		}

		if($(element).siblings("Select").val() == null) {
			for(key in stationNames) {
				if($(element).parent().prev().find("Option[value="+key+"]").css("display") == "none") {
					$(element).parent().prev().find("Option[value="+key+"]").show();
				}
			}
		}
	}
}

//Toggle if the graph should be Updated
//Done!
function keepUpdatedChanged(element) {
	var mainSectionId = $(element).parent().parent().parent().attr("id").substring(12);
	var isChecked = $(element)[0].checked;
	for(var i = 0; i < activeGraphs.length; i++) {
		if(activeGraphs[i].id == mainSectionId) {
			activeGraphs[i].keepUpdated = isChecked;
			break;
		}
	}
}

//Writes a span value to corresponding graph
//Done!
function spanChanged(element) {
	var mainSectionId = $(element).parent().parent().parent().parent().attr("id").substring(12);
	var span = $(element).val();
	if(span < 0) {
		span = 0;
		$(element).val(span);
	}
	for(var i = 0; i < activeGraphs.length; i++) {
		if(activeGraphs[i].id == mainSectionId) {
			activeGraphs[i].time.span = Number(span);
			break;
		}
	}
}

//Saves current Start Date to activeGraphs
//Done!
function startDateChanged(element) {
	var mainSectionId = $(element).parent().parent().parent().parent().attr("id").substring(12);
	for(var i = 0; i < activeGraphs.length; i++) {
		if(activeGraphs[i].id == mainSectionId) {
			if(!$(element)[0].value) activeGraphs[i].time.start = null;
			else {
				var start = new Date($(element)[0].value);
				activeGraphs[i].time.start = start;
		}
		}
	}
}

//Saves current End Date to activeGraphs
//Done!
function endDateChanged(element) {
	var mainSectionId = $(element).parent().parent().parent().parent().attr("id").substring(12);
	for(var i = 0; i < activeGraphs.length; i++) {
		if(activeGraphs[i].id == mainSectionId) {
			if(!$(element)[0].value) activeGraphs[i].time.end = null;
			else {
				var	end = new Date($(element)[0].value);
				activeGraphs[i].time.end = end;
			}
		}
	}
}

//Apply Settings button was pressed
//Some new shit with span
function updateGraph(element) {
	elementId = $(element).parent().parent().attr("id").substring(12);

	var activeGraphId = null;

	var anyKeepUpdated = false;
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
	activeGraphs[activeGraphId].canvas.update();

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

	console.log(id, index);

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
	activeGraphs[id].canvas.update();

}

//Updates all Graphs with keepUpdated true
//Done!
function updateTillNow() {
	for(var j = 0; j < activeGraphs.length; j++) {
		if(activeGraphs[j].keepUpdated) {
			activeGraphs[j].canvas.data.datasets = [];
			activeGraphs[j].canvas.update();

			for(var i = 0; i < activeGraphs[j].graphs.length; i++) {
				pushGraphData(activeGraphs[j].id, i)
			}
		}
	}
}

//Creates and saves the current constellation of graphs to the database
//Todo: Conditioning in the savePreset.php file with error messages
//Todo: if name is empty -> error, if name is already saved -> error
function createPresetOfCurrent() {
	var name = $(".menuContentGlobal").find("input").val();
	var preset = [];
	var isPresetAllowed = true;

	if(!name) {
		console.log("Preset not Allowed: Missing Name");
		isPresetAllowed = false;
	}
	if(activeGraphs.length < 1) {
		console.log("Preset not Allowed: No Graph");
		isPresetAllowed = false;
	}

	for(var i = 0; i < activeGraphs.length; i++) {
		var graph = {};
		graph.graphs = activeGraphs[i].graphs;
		graph.time = activeGraphs[i].time;
		graph.interpolation = activeGraphs[i].interpolation;
		graph.keepUpdated = activeGraphs[i].keepUpdated;
		preset.push(graph);

		if(activeGraphs[i].graphs.length < 1) {
			console.log("Preset not Allowed: No Station");
			isPresetAllowed = false;
		}

		if(!activeGraphs[i].time.end && !activeGraphs[i].keepUpdated) {
			console.log("Preset not Allowed: End or Till-Now missing");
			isPresetAllowed = false;
		}
		if(!activeGraphs[i].time.start && !activeGraphs[i].time.span) {
			console.log("Preset not Allowed: Start or Span missing");
			isPresetAllowed = false;
		}
	}
	var preset_json = JSON.stringify(preset);

	if(isPresetAllowed) {
		$.ajax({
			url:"../php/savePreset.php",
			type:"POST",
			data: {name: name, preset: preset_json},
			success:function(success){
				console.log(success);
				if(success == "success") {
					console.log("Preset was created!");
				} else {
					console.log("Error while creating!");
				}

				loadAllPresets(function(json_presets){
					//Delete current presets
					allPresets = [];
					$(".menuContentGlobal").find("Option").remove();

					var json_presets_decoded = JSON.parse(json_presets);
					console.log(json_presets_decoded);

					for(var i = 0; i < json_presets_decoded.length; i++) {
						var preset_object = {};

						preset_object.name = json_presets_decoded[i].Name;
						preset_object.data = JSON.parse(json_presets_decoded[i].Data);

						if(preset_object.data[0].time.start) {
							preset_object.data[0].time.start = new Date(preset_object.data[0].time.start);
						}
						if(preset_object.data[0].time.end) {
							preset_object.data[0].time.end = new Date(preset_object.data[0].time.end);
						}

						allPresets.push(preset_object);
					}

					var options = "";
					for(var i = 0; i < allPresets.length; i++) {
						options += '<option value="'+allPresets[i].name+'">'+allPresets[i].name+'</optioin>';
					}

					$(".menuContentGlobal").find("Select").append(options);

				});
			},
		});
	}
}

//loads a preset with the corresponding name
//Todo: Visuals and setInterval
function usePreset(element) {
	presetName = $(element).parent().find("select").val();
	var index = null;

	//Get index
	for(var i = 0; i < allPresets.length; i++) {
		if(allPresets[i].name == presetName) {
			index = i;
			break;
		}
	}

	//Delete all
	//All Sections + main + activeGraphs + keepUpdatedInterval = false
	//Empty freeId's + reset count
	count = 0;

	activeGraphs = [];
	freeId = [];
	$(".mainSection").remove();
	$(".menuSection").remove();

	//create new sections + main
	//create activeGraphs from presets
	//update Graph with section->button->element (find with count id)
	for(var i = 0; i < allPresets[index].data.length; i++) {
		//Create Sections, watch out for createPresetOfCurrent
		createSection(i);
		count++;
	}
	for(var i = 0; i < allPresets[index].data.length; i++) {

		//Apply preset and Push new ActiveGraphs
		activeGraphs[i].time = allPresets[index].data[i].time;
		activeGraphs[i].graphs = allPresets[index].data[i].graphs;
		activeGraphs[i].interpolation = allPresets[index].data[i].interpolation;
		activeGraphs[i].keepUpdated = allPresets[index].data[i].keepUpdated;


	}
	updateAllGraphs();
	//Visuals like dropdowns and checkboxes
	updateAllVisuals();

}

//Updates all Graphs because chart.js is worse then my depression
//Done!
var updateAllGraphsItterator;
var updateAllGraphsInterval = false;
function updateAllGraphs() {
	updateAllGraphsItterator = 0;
	clearInterval(updateAllGraphsInterval);
	updateAllGraphsInterval = false;
	updateAllGraphsInterval = setInterval(updateAllGraphsLoop, 200);
}
function updateAllGraphsLoop() {
	if(activeGraphs.length > updateAllGraphsItterator) {
		updateGraph($("#menuSection_"+activeGraphs[updateAllGraphsItterator].id).find(".applySettings")[0]);
	}
	updateAllGraphsItterator++;
	if(updateAllGraphsItterator > activeGraphs.length) {
		clearInterval(updateAllGraphsInterval);
		updateAllGraphsInterval = false;
	}
}

//Updates all Visuals
//some!
function updateAllVisuals() {
	for(var i = 0; i < activeGraphs.length; i++) {
		$($($("#menuSection_"+activeGraphs[i].id).find(".menuCheckbox")[1]).find("input")[0]).prop("checked",activeGraphs[i].interpolation);
		$($($("#menuSection_"+activeGraphs[i].id).find(".menuCheckbox")[0]).find("input")[0]).prop("checked",activeGraphs[i].keepUpdated);
		$($($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[4]).find("input")[0]).val(activeGraphs[i].time.span);
		if(activeGraphs[i].time.start) $($($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[2]).find("input")[0]).val(toDatepickerFormat(activeGraphs[i].time.start));
		if(activeGraphs[i].time.end) $($($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[3]).find("input")[0]).val(toDatepickerFormat(activeGraphs[i].time.end));

		$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[0]).find("Select").val(null);
		$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[1]).find("Select").val(null);
		for(key in stationNames) {
			$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[0]).find("Option[value="+key+"]").show();
			$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[1]).find("Option[value="+key+"]").hide();
		}

		for(var j = 0; j < activeGraphs[i].graphs.length; j++) {
			$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[0]).find("Option[value="+activeGraphs[i].graphs[j]+"]").hide();
			$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[1]).find("Option[value="+activeGraphs[i].graphs[j]+"]").show();
		}
		var measurementType = null;
		if(activeGraphs[i].graphs.length > 0) measurementType = stationNames[activeGraphs[i].graphs[0]].measurementType;
		for(key in stationNames) {
			if(stationNames[key].measurementType != measurementType && measurementType != null) {
				$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[0]).find("Option[value="+key+"]").hide();
			}
		}
		for(key in stationNames) {
			if($($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[0]).find("Option[value="+key+"]").css("display") != "none") {
				$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[0]).find("Select").val(key);
				break;
			}
			else {
				$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[0]).find("Select").val(null);
			}
		}
		for(key in stationNames) {
			if($($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[1]).find("Option[value="+key+"]").css("display") != "none") {
				$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[1]).find("Select").val(key);
				break;
			}
			else {
				$($("#menuSection_"+activeGraphs[i].id).find(".menuDropdown")[1]).find("Select").val(null);
			}
		}
	}
}

//Changes time.start of all Graphs
//Done!
function startDateChangedGlobal(element) {
	var start = new Date($(element).val());
	for(var i = 0; i < activeGraphs.length; i++) {
		activeGraphs[i].time.start = start;
	}
	updateAllVisuals();

}

//Changes time.end of all Graphs
//Done!
function endDateChangedGlobal(element) {
	var end = new Date($(element).val());
	for(var i = 0; i < activeGraphs.length; i++) {
		activeGraphs[i].time.end = end;
	}
	updateAllVisuals();
}

//Changes span of all Graphs
//Done!
function spanChangedGlobal(element) {
	var span = $(element).val();
	if(span < 0) {
		span = 0;
		$(element).val(span);
	}
	for(var i = 0; i < activeGraphs.length; i++) {
		activeGraphs[i].time.span = span;
	}
	updateAllVisuals();
}

//Changes keepUpdated of all Graphs
//Done!
function keepUpdatedChangedGlobal(element) {
	var isChecked = $(element)[0].checked;
	for(var i = 0; i < activeGraphs.length; i++) {
		activeGraphs[i].keepUpdated = isChecked;
	}
	updateAllVisuals();
}

//Changes Interpolation of all Graphs
//Done!
function toggleInterpolationGlobal(element) {
	var isChecked = $(element)[0].checked;
	for(var i = 0; i < activeGraphs.length; i++) {
		activeGraphs[i].interpolation = isChecked;
	}
	updateAllVisuals();
}

//Takes a 1 or 2 digit number and converts it to a 2 digit string
//Done!
function twoDigits(d) {
    if(0 <= d && d < 10) return "0"+d.toString();
    if(-10 < d && d < 0) return "-0"+(-1*d).toString();
    return d.toString();
}

//Converts Js date type to Mysql date type
//Done!
function toMysqlFormat(date) {
    return date.getFullYear()+"-"+twoDigits(1+date.getMonth())+"-"+twoDigits(date.getDate())+" "+twoDigits(date.getHours())+":"+twoDigits(date.getMinutes())+":"+twoDigits(date.getSeconds());
}

//Converts Js date to datepicker format
//Done!
function toDatepickerFormat(date) {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

//Logs variables for debugging
//Done!
function customLog(name) {
	if(name == "activeGraphs") console.log(activeGraphs);
	if(name == "freeId") console.log(freeId);
	if(name == "allPresets") console.log(allPresets);
	if(name == "keepUpdatedInterval") console.log(keepUpdatedInterval);
	if(name == "stationNames") console.log(stationNames);
  if(name == "graphConfigTemplate") console.log(graphConfigTemplate);

	return null;
}
