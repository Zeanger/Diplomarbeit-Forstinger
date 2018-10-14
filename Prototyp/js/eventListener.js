var count = 0;
var freeId = []

$(function() {
  //Add Graph click
  $(".addGraphButton").click(function() {
    if(freeId.length > 0) {
      var smallestFreeId = freeId[0];
      var smallestFreeIdIndex = 0;

      for(var i = 0; i < freeId.length; i++) {
        if(Number(freeId[i]) < Number(smallestFreeId)) {
          smallestFreeId = freeId[i];
          smallestFreeIdIndex = i;
        }
      }

      freeId.splice(smallestFreeIdIndex,1);
      createSection(Number(smallestFreeId));
    }
    else {
      createSection(count);
      count++;
    }
  });

});
