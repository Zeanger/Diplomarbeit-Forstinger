var presets = [];
var settings = {};

$(function() {
	loadSettings();
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
    console.log(presets);

		createSettings();
	});

});

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
