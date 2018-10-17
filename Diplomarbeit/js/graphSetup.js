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
var menuOptions = [];
var keepUpdatedInterval = false;
var presets = [];
var settings = {};
var count = 0;
var freeId = []
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

$(function() {
	loadSettings();
  createGlobal();
  closeMenuSectionGlobal();
  closeAllMenuSections();
});

//Creates the global menu
//Todo: Global-Time: Start, End, Span
function createGlobal() {
	var menuGlobal = 	'<div id="menuGlobal" class="menuSectionGlobal" value="open">'+
											'<div class="menuHeader" onclick="toggleMenuSectionGlobal(this)">Global</div>'+
											'<div class="menuContentGlobal">'+
												'<div>Preset</div>'+
												'<div class="menuDropdown">'+
													'<input id="presetName" type="text" placeholder="Preset name">'+
													'<div class="addButton" onclick="createPresetOfCurrent()">Save</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<select id="presetSelection"></select>'+
													'<div class="addButton" onclick="usePreset(this)">Load</div>'+
												'</div>'+
												'<div>Global Settings</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="startDateGlobal" type="date" onchange="startDateChangedGlobal(this)"></div>'+
													'<div class="datePickerText">Start</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="endDateGlobal" type="date" onchange="endDateChangedGlobal(this)"></div>'+
													'<div class="datePickerText">End</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="spanGlobal" type="number" onchange="spanChangedGlobal(this)" placeholder="Minutes"></div>'+
													'<div class="datePickerText">Span</div>'+
												'</div>'+
												'<div class="menuCheckbox"><input id="keepUpdatedGlobal" type="checkbox" onclick="keepUpdatedChangedGlobal(this)">Till now</div>'+
												'<div class="menuCheckbox"><input id="interpolationGlobal" type="checkbox" checked onclick="interpolationChangedGlobal(this)">Interpolate</div>'+
												'<div class="applySettings" onclick="updateAllGraphs()">Apply Settings</div>'+
											'</div>'+
										'</div>';

	$(".menu").append(menuGlobal);

	//Load presets
	loadPresets(function(json_presets){
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

			presets.push(preset_object);
		}

		var options = "";
		for(var i = 0; i < presets.length; i++) {
			options += '<option value="'+presets[i].name+'">'+presets[i].name+'</optioin>';
		}

		$("#presetSelection").append(options);

	});
}


//loads all presets from the server per callback
//Todo: Done!
function loadPresets(callback) {
	$.ajax({
		url:"../php/loadPresets.php",
		success:function(msg){
			if(typeof callback == "function") {
				callback(msg);
			}
		},
	});
}


//Loads all settings from the server and stores them
//Todo: Done!
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
