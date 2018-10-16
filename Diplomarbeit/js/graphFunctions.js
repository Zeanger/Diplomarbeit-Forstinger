//Creates a new menuSection with its corresponding mainSection
//Done! unless new contend is added
function createGraph(count) {
	var options0 = "";
	var options1 = "";
	for(key in stationNames) {
		options0 += '<option value="'+key+'">'+stationNames[key].displayName+'</optioin>';
		options1 += '<option value="'+key+'" style="display: none">'+stationNames[key].displayName+'</optioin>';
	}
	var dropdown0 =	'<select id="addGraphSelection_'+count+'">'+
											options0 +
									'</select>';
	var dropdown1 =	'<select id="removeGraphSelection_'+count+'">'+
											options1 +
									'</select>';
	var mainSection = '<div id="mainSection_'+count+'" class="mainSection">'+
											'<div class="mainHeader">Graph '+(count+1)+'</div>'+
											'<div class="mainContent">'+
												'<div class="graph">'+
													'<canvas id="dateGraph_'+count+'"></canvas>'+
												'</div>'+
												'<div class="graphButtonHolder">'+
													'<div id="configureButton_'+count+'" class="graphButton" onclick="configurePress(this)">'+
														'<img src="../resources/img/configure.png">'+
													'</div>'+
													'<div class="graphButton">'+
														'<img src="../resources/img/export.png">'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</div>';
	var menuSection = '<div id="menuSection_'+count+'" class="menuSection" value="open">'+
											'<div class="menuHeader" onclick="toggleMenuSection(this)">Menu '+(count+1)+'</div>'+
											'<div class="menuContent">'+
												'<div class="menuDropdown">'+
													dropdown0+
													'<div id="addButton_'+count+'" class="addButton" onclick="addGraph(this)">+</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													dropdown1+
													'<div id="removeButton_'+count+'" class="removeButton" onclick="removeGraph(this)">-</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="startDate_'+count+'" type="date" onchange="startDateChanged(this)"></div>'+
													'<div class="datePickerText">Start</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="endDate_'+count+'" type="date" onchange="endDateChanged(this)"></div>'+
													'<div class="datePickerText">End</div>'+
												'</div>'+
												'<div class="menuDropdown">'+
													'<div class="datePicker"><input id="span_'+count+'" type="number" onchange="spanChanged(this)" placeholder="Minutes"></div>'+
													'<div class="datePickerText">Span (Min)</div>'+
												'</div>'+
												'<div class="menuCheckbox"><input id="keepUpdated_'+count+'" type="checkbox" onclick="keepUpdatedChanged(this)">Till now</div>'+
												'<div class="menuCheckbox"><input id="interpolation_'+count+'" type="checkbox" checked onclick="interpolationChanged(this)">Interpolate</div>'+
												'<div class="applySettings" onclick="updateGraph(this)">Apply Settings</div>'+
												'<div class="menuDelete" onclick="deleteMenuSection(this)">Delete Graph</div>'+
											'</div>'+
										'</div>';

	$(".main").append(mainSection);
	if($(".menuSection").length > 0) 	$(".menu").find(".menuSection").last().after(menuSection);
	else $(".menu").find(".menuSectionGlobal").last().after(menuSection);

	$("#removeGraphSelection_"+count).val(null);

	var time = {};
	time.start = null;
	time.end = null;
	time.span = null;

  var tempMenuTime = {};
  tempMenuTime.start = null;
  tempMenuTime.end = null;
  tempMenuTime.span = null;

  var tempMenuOption = {};
  tempMenuOption.id = count;
  tempMenuOption.graphs = [];
  tempMenuOption.time = tempMenuTime
  tempMenuOption.interpolation = true;
  tempMenuOption.keepUpdated = false;

	var newGraph = {};
	newGraph.id = count;
	newGraph.canvas = null;
	newGraph.graphs = [];
	newGraph.time = time;
	newGraph.interpolation = true;
	newGraph.keepUpdated = false;

	activeGraphs.push(newGraph);
  menuOptions.push(tempMenuOption);

	var activeGraphsId = activeGraphs.length-1;

	var ctx = document.getElementById("dateGraph_"+count).getContext("2d");
	activeGraphs[activeGraphsId].canvas = new Chart(ctx, JSON.parse(JSON.stringify(graphConfigTemplate)));
}
