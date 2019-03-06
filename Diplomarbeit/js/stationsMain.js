var stationNames = [];
var recoverStations = [];

$(function() {
	loadStations(function(){
		createStationsSection();
		addStationSection();
	});
});

//Loads all sations from the database
//Todo: Done
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
          tempObject.id = json_stations_decoded[variable].Id;
					stationNames[json_stations_decoded[variable].Id] = tempObject;
				}
			}
			console.table(stationNames);
			callback();
		},
	});
}

//Creats station table
//Todo: Done
function createStationsSection() {
  var stationsHtml = '<div class="stationBlock"><div class="blockTitel">Stationen</div><div><table><tr><th>ID</th><th>Anzeigename</th><th>Messart</th><th>Datenbankname</th><th>MQTT Topic</th><th></th></tr></div></div>';
  for(variable in stationNames) {
    stationsHtml +=  '<tr><td>'+stationNames[variable].id+'</td><td>'+stationNames[variable].displayName+'</td><td>'+stationNames[variable].measurementType+'</td><td>'+stationNames[variable].databasename+'</td><td>'+stationNames[variable].mqttTopic+'</td><td><div id="delete_'+stationNames[variable].id+'" class="deleteStationButton" onclick="deleteStation(this)">Delete</div><div id="recover_'+stationNames[variable].id+'" class="recoverStationButton" onclick="recoverStation(this)">Recover</div></td></tr>';
  }
  stationsHtml += '</table>';
  $(".main").append(stationsHtml);
}

//Creats createStation section
//Todo: All
function addStationSection() {
	var addStationHTML = "<div class='stationBlock'><div class='blockTitel'>Station hinzufügen</div><div><table>"+
											 "<tr><td><div>Anzeigename</div></td><td><input id='addDisplayName'></td></tr>"+
											 "<tr><td><div>Messart</div></td><td><input id='addMeasurementType'></td></tr>"+
											 "<tr><td><div>Datenbankname</div></td><td><input id='addDatabaseName'></td></tr>"+
											 "<tr><td><div>MQTT Topic</div></td><td><input id='addMqttTopic'></td></tr></table></div>"+
											 "<div class='addButton' onclick='addStation()'>Hinzufüngen</div></div>";

	$(".main").append(addStationHTML);
}

//Deletes a single station
//Todo: Done
function deleteStation(element) {
  console.log("debug: delete!");
  var id = $(element).attr("id").substring(7);
	console.log(id);

  swal({
    title: "Are you sure?",
    text: "Until you leave the page its still recoverable!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        url:"../php/deleteStation.php",
        type:"POST",
        data: {Id: id},
        success:function(success){
          console.log(success);
          if(success == "success") {
            recoverStations[id] = stationNames[id];
            $("#delete_"+id).css("display", "none");
            $("#recover_"+id).css("display", "inline-block");
            swal("Station was deleted!", "Preset name: "+stationNames[id].displayName+"", "success");
          } else {
            swal("Error while deleting the station!", {icon: "error"});
          }
        },
      });
    }
  });
}

//Recovers a station
//Todo: Done
function recoverStation(element) {
  console.log("debug: recover!");
  var id = $(element).attr("id").substring(8);

  $.ajax({
    url:"../php/saveStation.php",
    type:"POST",
    data: {displayName: recoverStations[id].displayName, databaseName: recoverStations[id].databasename, Id: recoverStations[id].id, mqttTopic: recoverStations[id].mqttTopic, measurementType: recoverStations[id].measurementType},
    success:function(success){
      console.log(success);
      if(success == "success") {
        $("#delete_"+id).css("display", "inline-block");
        $("#recover_"+id).css("display", "none");
        swal("Station was recovered!", "Station name: "+recoverStations[id].displayName+"", "success");
				recoverStations.splice(id,1);
      } else {
        swal("Error while recovering the station!", {icon: "error"});
      }
    },
  });
}

//Adds a station
//Todo: All
function addStation() {
	var addDisplayName = $("#addDisplayName").val();
	var addMeasurementType = $("#addMeasurementType").val();
	var addDatabaseName = $("#addDatabaseName").val();
	var addMqttTopic = $("#addMqttTopic").val();

	if(!addDisplayName || !addMeasurementType || !addDatabaseName || !addMqttTopic) {
		swal("Error while recovering the station!", {icon: "error"});
		return false;
	} else {
		$.ajax({
	    url:"../php/addStation.php",
	    type:"POST",
	    data: {displayName: addDisplayName, databaseName: addDatabaseName, mqttTopic: addMqttTopic, measurementType: addMeasurementType},
	    success:function(success){
	      console.log(success);
	      if(success == "success") {
	        swal("Station was created!", "Station name: "+addDisplayName+"", "success");
	      } else {
	        swal("Error while creating the station!", {icon: "error"});
	      }
	    },
	  });
	}
}
