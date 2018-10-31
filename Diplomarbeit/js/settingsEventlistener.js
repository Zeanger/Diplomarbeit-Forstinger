function preferenceChange(element) {
  console.log("change!");
}

function deletePreset(element) {
  console.log("debug: delete!");
  var id = $(element).attr("id").substring(7);

  $.ajax({
    url:"../php/deletePreset.php",
    type:"POST",
    data: {name: presets[id].name},
    success:function(success){
      console.log(success);
      if(success == "success") {
        swal("Preset was deleted!", "Preset name: "+presets[id].name+"", "success");
      } else {
        swal("Error while deleting the preset!", {icon: "error"});
      }
    },
  });
}
