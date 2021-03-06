var presets = [];
var recoverPresets = [];
var settings = {};
var stationNames = [];

$(function() {
  loadStations(function() {
    loadPresets(function(json_presets){
      var json_presets_decoded = JSON.parse(json_presets);
      for(var i = 0; i < json_presets_decoded.length; i++) {
        var preset_object = {};

        preset_object.name = json_presets_decoded[i].Name;
        preset_object.data = JSON.parse(json_presets_decoded[i].Data);

        for(var i2 = 0; i2 < preset_object.data.length; i2++) {
          if(preset_object.data[i2].time.start) {
            var tempStartDate = new Date(preset_object.data[i2].time.start);
            tempStartDate.setMinutes(tempStartDate.getMinutes()+tempStartDate.getTimezoneOffset());
            preset_object.data[i2].time.start = tempStartDate;
          }
          if(preset_object.data[i2].time.end) {
            var tempEndDate = new Date(preset_object.data[i2].time.end);
            tempEndDate.setMinutes(tempEndDate.getMinutes()+tempEndDate.getTimezoneOffset());
            preset_object.data[i2].time.end =  tempEndDate;
          }
        }
        presets.push(preset_object);
      }
      console.log(presets);

      loadSettings(function() {
        createSettings();
      });
    });
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
function loadSettings(callback) {
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
			if(typeof callback == "function") {
				callback();
			}
		},
	});
}

//Loads all sations from the database
//Todo: all
function loadStations(callback) {
	$.ajax({
		url:"../php/loadStations.php",
		success:function(msg){
			console.log(msg);
			var json_stations_decoded = JSON.parse(msg);
			//console.log(json_stations_decoded);
			for (var variable in json_stations_decoded) {
				//console.log(json_stations_decoded[variable].displayName);
				if (json_stations_decoded.hasOwnProperty(variable)) {
					var tempObject = {};
					tempObject.displayName = json_stations_decoded[variable].displayName;
					tempObject.measurementType = json_stations_decoded[variable].measurementType;
					tempObject.databasename = json_stations_decoded[variable].databaseName;
					tempObject.mqttTopic = json_stations_decoded[variable].mqttTopic;
					stationNames[json_stations_decoded[variable].databaseName] = tempObject;
				}
			}
			console.table(stationNames);
			callback();
		},
	});
}
