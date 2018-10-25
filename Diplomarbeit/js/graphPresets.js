//Creates and saves the current constellation of graphs to the database
//Todo: Conditioning in the savePreset.php file with error messages
//Todo: if name is empty -> error, if name is already saved -> error
function createPresetOfCurrent() {
	var name = $("#presetName").val();
	console.log(name);
	var preset = [];
	var isPresetAllowed = true;

	if(!name) {
		console.log("Preset not Allowed: Missing Name");
		swal("Preset is missing a name!", {icon: "error"});
		isPresetAllowed = false;
		return false;
	}
	for (variable of presets) {
		if(name == variable.name) {
			console.log("Preset not Allowed: Name allready exists!");
			swal("Preset name allready exists!", {icon: "error"});
			isPresetAllowed = false;
			return false;
		}
	}
	if(activeGraphs.length < 1) {
		console.log("Preset not Allowed: No Graph");
		swal("To create a preset atleast 1 graph needs to exist!", {icon: "error"});
		isPresetAllowed = false;
		return false;
	}

	for(var i = 0; i < activeGraphs.length; i++) {
		var graph = {};
		graph.graphs = activeGraphs[i].graphs;
		graph.time = activeGraphs[i].time;
		graph.interpolation = activeGraphs[i].interpolation;
		graph.keepUpdated = activeGraphs[i].keepUpdated;
		preset.push(graph);

		if(activeGraphs[i].graphs.length < 1) {
			console.log("Preset not Allowed: No Station");
			swal("To create a preset atleast 1 measurement needs to exist on each graph!", {icon: "error"});
			isPresetAllowed = false;
			return false;
		}

		if(!activeGraphs[i].time.end && !activeGraphs[i].keepUpdated) {
			console.log("Preset not Allowed: End or Till-Now missing");
			swal("To create a preset a valid time window needs to exist on each graph! Try adding 'End' or 'Till now'", {icon: "error"});
			isPresetAllowed = false;
			return false;
		}
		if(!activeGraphs[i].time.start && !activeGraphs[i].time.span) {
			console.log("Preset not Allowed: Start or Span missing");
			swal("To create a preset a valid time window needs to exist on each graph! Try adding 'Start' or 'Span'", {icon: "error"});
			isPresetAllowed = false;
			return false;
		}
	}
	var preset_json = JSON.stringify(preset);

	if(isPresetAllowed) {
		$.ajax({
			url:"../php/savePreset.php",
			type:"POST",
			data: {name: name, preset: preset_json},
			success:function(success){
				console.log(success);
				if(success == "success") {
					swal("Preset was created!", "Preset name: "+name+"", "success");
				} else {
					swal("Error while creating the preset!", {icon: "error"});
				}

				loadPresets(function(json_presets){
					//Delete current presets
					presets = [];
					$("#presetSelection").find("Option").remove();

					var json_presets_decoded = JSON.parse(json_presets);
					console.log(json_presets_decoded);

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
						console.log(preset_object);
						presets.push(preset_object);
					}

					var options = "";
					for(var i = 0; i < presets.length; i++) {
						options += '<option value="'+presets[i].name+'">'+presets[i].name+'</optioin>';
					}

					$("#presetSelection").append(options);

				});
			},
		});
	}
}

//loads a preset with the corresponding name
//Todo: Visuals and setInterval
function usePreset(element) {
	presetName = $("#presetSelection").val();
	var index = null;

	//Get index
	console.log("presetName: "+presetName);
	for(var i = 0; i < presets.length; i++) {
		console.log(presets[i].name);
		if(presets[i].name == presetName) {
			index = i;
			break;
		}
	}

	//Delete all
	//All Sections + main + activeGraphs + keepUpdatedInterval = false
	//Empty freeId's + reset count
	count = 0;

	activeGraphs = [];
	menuOptions = [];
	freeId = [];
	$(".mainSection").remove();
	$(".menuSection").remove();

	//create new sections + main
	//create activeGraphs from presets
	//update Graph with section->button->element (find with count id)
	console.log(presets);
	console.log(index);
	for(var i = 0; i < presets[index].data.length; i++) {
		//Create Sections, watch out for createPresetOfCurrent
		createGraph(i);
		count++;
	}
	for(var i = 0; i < presets[index].data.length; i++) {

		//Apply preset and Push new ActiveGraphs
		activeGraphs[i].time = presets[index].data[i].time;
		activeGraphs[i].graphs = presets[index].data[i].graphs;
		activeGraphs[i].interpolation = presets[index].data[i].interpolation;
		activeGraphs[i].keepUpdated = presets[index].data[i].keepUpdated;

    //Apply preset to menuOptions
    menuOptions[i].time = presets[index].data[i].time;
		menuOptions[i].graphs = presets[index].data[i].graphs;
		menuOptions[i].interpolation = presets[index].data[i].interpolation;
		menuOptions[i].keepUpdated = presets[index].data[i].keepUpdated;

	}
	updateAllGraphs();

	//Visuals like dropdowns and checkboxes
	updateAllVisuals();
}
