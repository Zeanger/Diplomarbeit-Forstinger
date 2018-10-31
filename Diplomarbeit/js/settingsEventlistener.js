function preferenceChange(element) {
  console.log("change!");
}

function deletePreset(element) {
  console.log("debug: delete!");
  console.log(element);

  // $.ajax({
  //   url:"../php/savePreset.php",
  //   type:"POST",
  //   data: {name: name},
  //   success:function(success){
  //     console.log(success);
  //     if(success == "success") {
  //       swal("Preset was deleted!", "Preset name: "+name+"", "success");
  //     } else {
  //       swal("Error while creating the preset!", {icon: "error"});
  //     }
  //   },
  // });
}
