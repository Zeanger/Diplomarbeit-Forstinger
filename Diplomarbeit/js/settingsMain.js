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

const settingNames = {
	"refreshRate": "Refresh Rate (Minutes)",
}

function createSettings() {
	var settingsHtml = '';
  var presetsHtml = '';

	for(var i = 0; i < presets.length; i++) {
		presetsHtml +=  '<div class="presetSection"><div class="presetName">'+presets[i].name+'</div>';
		var presetsHtmlGraphs = "";
		for(var j = 0; j < presets[i].data.length; j++) {
			presetsHtmlGraphs += '<div class="graphSection">Graph '+(j+1)+'<div>';
			for(var k = 0; k < presets[i].data[j].graphs.length; k++) {
				presetsHtmlGraphs += '<div class="measurement">'+stationNames[presets[i].data[j].graphs[k]].displayName+'</div>';
			}
			presetsHtmlGraphs += '</div><table class="presetTable">';
			presetsHtmlGraphs += '<tr><td>Interpolation:</td><td>'+(presets[i].data[j].interpolation ? "Yes" : "No")+'</td></tr>';
			presetsHtmlGraphs += '<tr><td>Till now:</td><td>'+(presets[i].data[j].keepUpdated ? "Yes" : "No")+'</td></tr>';
			presetsHtmlGraphs += '<tr><td>Start:</td><td>'+(presets[i].data[j].time.start ? toDatepickerFormat(presets[i].data[j].time.start) : "No")+'</td></tr>';
			presetsHtmlGraphs += '<tr><td>End:</td><td>'+(presets[i].data[j].time.end ? toDatepickerFormat(presets[i].data[j].time.end) : "No")+'</td></tr>';
			presetsHtmlGraphs += '<tr><td>Span:</td><td>'+(presets[i].data[j].time.span ? presets[i].data[j].time.span : 0)+' Minutes</td></tr>';
			presetsHtmlGraphs += '</table></div>';
		}
		presetsHtml += '<div class="presetHolder">'+presetsHtmlGraphs+'</div><div id="preset_'+i+'" class="deletePresetButton" onclick="deletePreset(this)">Delete</div><div id="recover_'+i+'" class="recoverPresetButton" onclick="recoverPreset(this)">Recover</div></div>';
	}
	for(key in settings) {
		settingsHtml += '<div class="preference">' +
													'<div class="preferenceName">'+settingNames[key]+':</div>' +
													'<input id="'+key+"Input"+'" class="preferenceInput" type="number" value="'+(settings[key]/(1000*60))+'">' +
													'<div id="'+key+'" class="preferenceButton" onclick="preferenceChange(this)">Change</div>' +
											'</div>';
	}

	var mainSettings = '<div class="settings">' +
												'<div class="preferenceHeader">Preferences</div>' +
                        settingsHtml +
										 '</div>' +
                     '<div class="presets">' +
										 		'<div class="presetHeader">Presets</div>' +
                        presetsHtml +
                     '</div>';

	$(".main").append(mainSettings);
}
