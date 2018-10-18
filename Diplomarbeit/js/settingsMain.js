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

function createSettings() {
	var settingsHtml = '';
  var presetsHtml = '';

	for(var i = 0; i < presets.length; i++) {
		presetsHtml +=  '<div class="presetName">'+presets[i].name+'</div>';
		var presetsHtmlGraphs = "";
		for(var j = 0; j < presets[i].data.length; j++) {
			presetsHtmlGraphs += '<div>Graph '+(j+1)+'<div>';
			for(var k = 0; k < presets[i].data[j].graphs.length; k++) {
				presetsHtmlGraphs += '<div>'+stationNames[presets[i].data[j].graphs[k]].displayName+'</div>';
			}
			presetsHtmlGraphs += '<div><div>Interpolation:</div><div>'+presets[i].data[j].interpolation+'</div></div>';
			presetsHtmlGraphs += '<div><div>Till now</div><div>'+presets[i].data[j].keepUpdated+'</div></div>';
		}
		presetsHtml += '<div class="presetGraphHolder">'+presetsHtmlGraphs+'</div>';

	}
	for(key in settings) {
		settingsHtml += '<div>' +
												'<div>' +
													'<div>'+key+'</div>' +
													'<input type="number" value="'+settings[key]+'">' +
													'<div>Change</div>' +
												'</div>' +
											'</div>';
	}

	var mainSettings = '<div class="settings">' +
                        settingsHtml +
										 '</div>' +
                     '<div class="presets">' +
                        presetsHtml +
                     '</div>';

	$(".main").append(mainSettings);
}
