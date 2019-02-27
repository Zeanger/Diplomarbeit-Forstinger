function preferenceChange(element) {
  var name = $(element).attr("id");
  var value = $("#"+name+"Input").val();

  //Min Value
  if(value < 1) {
    value = 1;
    $("#"+name+"Input").val(value);
  }

  $.ajax({
    url:"../php/uploadSettings.php",
    type:"POST",
    data: {name: name, value: (value*60*1000)},
    success:function(success){
      console.log(success);
      if(success == "success") {
        swal("Preference was Changed!", "Preset name: "+name+" Preset value: "+value, "success");
      } else {
        swal("Error while changing preference!", {icon: "error"});
      }
    },
  });
}

function deletePreset(element) {
  console.log("debug: delete!");
  var id = $(element).attr("id").substring(7);

  swal({
    title: "Are you sure?",
    text: "Until you leave the page its still recoverable!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        url:"../php/deletePreset.php",
        type:"POST",
        data: {name: presets[id].name},
        success:function(success){
          console.log(success);
          if(success == "success") {
            recoverPresets[id] = presets[id];
            $("#preset_"+id).css("display", "none");
            $("#recover_"+id).css("display", "inline-block");
            swal("Preset was deleted!", "Preset name: "+presets[id].name+"", "success");
          } else {
            swal("Error while deleting the preset!", {icon: "error"});
          }
        },
      });
    }
  });
}

function recoverPreset(element) {
  console.log("debug: recover!");
  var id = $(element).attr("id").substring(8);
  var name = recoverPresets[id].name;
  var tempPreset = [];

  for (var i = 0; i < recoverPresets[id].data.length; i++) {
    var graph = {};
    graph.graphs = recoverPresets[id].data[i].graphs;
    graph.time = recoverPresets[id].data[i].time;
    graph.interpolation = recoverPresets[id].data[i].interpolation;
    graph.keepUpdated = recoverPresets[id].data[i].keepUpdated;
    tempPreset.push(graph);
  }

  var preset_json = JSON.stringify(tempPreset);

  $.ajax({
    url:"../php/savePreset.php",
    type:"POST",
    data: {name: name, preset: preset_json},
    success:function(success){
      console.log(success);
      if(success == "success") {
        recoverPresets.splice(id,1);
        $("#preset_"+id).css("display", "inline-block");
        $("#recover_"+id).css("display", "none");
        swal("Preset was recovered!", "Preset name: "+name+"", "success");
      } else {
        swal("Error while recovering the preset!", {icon: "error"});
      }
    },
  });

}
