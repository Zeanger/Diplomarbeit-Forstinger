function toggleMenuSection(element) {
  if(($(element).parent(".menuSection").attr("value") == "open")) {
    $(element).parent(".menuSection").attr("value", "closed");

    $(element).parent(".menuSection").css("height", "5.9vh");
    $(element).siblings(".menuContent").css("display", "none");
    $(element).css("border-bottom", "none");
    $(element).css("border-bottom-left-radius", "1.5vh");
    $(element).css("border-bottom-right-radius", "1.5vh");
    $(element).css("background", "linear-gradient(to right, rgb(200, 200, 200), rgba(255, 255, 255, 0) 5%, transparent 6%, transparent 94%, rgba(255, 255, 255, 0) 95%, rgb(200, 200, 200) 100%), linear-gradient(to bottom, rgb(200, 200, 200), rgb(255, 255, 255) 20%, transparent 21%, transparent 79%, rgba(255, 255, 255, 0) 80%, rgb(200, 200, 200) 100%)");
  }
  else if(($(element).parent(".menuSection").attr("value") == "closed")) {
    $(element).parent(".menuSection").attr("value", "open");

    $(element).parent(".menuSection").css("height", "40vh");
    $(element).siblings(".menuContent").css("display", "block");
    $(element).css("border-bottom", "0.4vh solid rgb(100, 100, 100)");
    $(element).css("border-bottom-left-radius", "0");
    $(element).css("border-bottom-right-radius", "0");
    $(element).css("background", "linear-gradient(to right, rgb(200, 200, 200), rgba(255, 255, 255, 0) 5%, transparent 6%, transparent 94%, rgba(255, 255, 255, 0) 95%, rgb(200, 200, 200) 100%), linear-gradient(to bottom, rgb(200, 200, 200), rgb(255, 255, 255) 20%, transparent 21%, transparent 100%)");
  }
}

function closeMenuSection(element) {
  $(element).parent(".menuSection").attr("value", "closed");

  $(element).parent(".menuSection").css("height", "5.9vh");
  $(element).siblings(".menuContent").css("display", "none");
  $(element).css("border-bottom", "none");
  $(element).css("border-bottom-left-radius", "1.5vh");
  $(element).css("border-bottom-right-radius", "1.5vh");
  $(element).css("background", "linear-gradient(to right, rgb(200, 200, 200), rgba(255, 255, 255, 0) 5%, transparent 6%, transparent 94%, rgba(255, 255, 255, 0) 95%, rgb(200, 200, 200) 100%), linear-gradient(to bottom, rgb(200, 200, 200), rgb(255, 255, 255) 20%, transparent 21%, transparent 79%, rgba(255, 255, 255, 0) 80%, rgb(200, 200, 200) 100%)");

}

function openMenuSection(element) {
  $(element).parent(".menuSection").attr("value", "open");

  $(element).parent(".menuSection").css("height", "40vh");
  $(element).siblings(".menuContent").css("display", "block");
  $(element).css("border-bottom", "0.4vh solid rgb(100, 100, 100)");
  $(element).css("border-bottom-left-radius", "0");
  $(element).css("border-bottom-right-radius", "0");
  $(element).css("background", "linear-gradient(to right, rgb(200, 200, 200), rgba(255, 255, 255, 0) 5%, transparent 6%, transparent 94%, rgba(255, 255, 255, 0) 95%, rgb(200, 200, 200) 100%), linear-gradient(to bottom, rgb(200, 200, 200), rgb(255, 255, 255) 20%, transparent 21%, transparent 100%)");

}

function closeAllMenuSections() {
  closeMenuSection($("#menuGlobal").find(".menuHeader"));
  for(var i = 0; i < $(".menuSection").length; i++) {
    closeMenuSection($("#menuSection_"+i).find(".menuHeader"));
  }
}

function deleteMenuSection(element) {
  var mainSectionId = $(element).parent().parent().attr("id").substring(12);

  for(var i = 0; i < activeGraphs.length; i++) {
      if(activeGraphs[i].id == mainSectionId) {
        activeGraphs.splice(i,1);
        freeId.push(mainSectionId);
      }
  }

  $("#mainSection_"+mainSectionId).remove();
  $("#menuSection_"+mainSectionId).remove();

  updateAllGraphs();
}

function toggleMenuSectionGlobal() {
  element = $(".menuContentGlobal").siblings(".menuHeader");
  if(($(element).parent(".menuSectionGlobal").attr("value") == "open")) {
    $(element).parent(".menuSectionGlobal").attr("value", "closed");

    $(element).parent(".menuSectionGlobal").css("height", "5.9vh");
    $(element).siblings(".menuContentGlobal").css("display", "none");
    $(element).css("border-bottom", "none");
    $(element).css("border-bottom-left-radius", "1.5vh");
    $(element).css("border-bottom-right-radius", "1.5vh");
    $(element).css("background", "linear-gradient(to right, rgb(200, 200, 200), rgba(255, 255, 255, 0) 5%, transparent 6%, transparent 94%, rgba(255, 255, 255, 0) 95%, rgb(200, 200, 200) 100%), linear-gradient(to bottom, rgb(200, 200, 200), rgb(255, 255, 255) 20%, transparent 21%, transparent 79%, rgba(255, 255, 255, 0) 80%, rgb(200, 200, 200) 100%)");
  }
  else if(($(element).parent(".menuSectionGlobal").attr("value") == "closed")) {
    $(element).parent(".menuSectionGlobal").attr("value", "open");

    $(element).parent(".menuSectionGlobal").css("height", "45vh");
    $(element).siblings(".menuContentGlobal").css("display", "block");
    $(element).css("border-bottom", "0.4vh solid rgb(100, 100, 100)");
    $(element).css("border-bottom-left-radius", "0");
    $(element).css("border-bottom-right-radius", "0");
    $(element).css("background", "linear-gradient(to right, rgb(200, 200, 200), rgba(255, 255, 255, 0) 5%, transparent 6%, transparent 94%, rgba(255, 255, 255, 0) 95%, rgb(200, 200, 200) 100%), linear-gradient(to bottom, rgb(200, 200, 200), rgb(255, 255, 255) 20%, transparent 21%, transparent 100%)");
  }
}

function closeMenuSectionGlobal() {
  element = $(".menuContentGlobal").siblings(".menuHeader");

  $(element).parent(".menuSectionGlobal").attr("value", "closed");

  $(element).parent(".menuSectionGlobal").css("height", "5.9vh");
  $(element).siblings(".menuContentGlobal").css("display", "none");
  $(element).css("border-bottom", "none");
  $(element).css("border-bottom-left-radius", "1.5vh");
  $(element).css("border-bottom-right-radius", "1.5vh");
  $(element).css("background", "linear-gradient(to right, rgb(200, 200, 200), rgba(255, 255, 255, 0) 5%, transparent 6%, transparent 94%, rgba(255, 255, 255, 0) 95%, rgb(200, 200, 200) 100%), linear-gradient(to bottom, rgb(200, 200, 200), rgb(255, 255, 255) 20%, transparent 21%, transparent 79%, rgba(255, 255, 255, 0) 80%, rgb(200, 200, 200) 100%)");
}
