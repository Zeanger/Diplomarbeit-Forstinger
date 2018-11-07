function getData(measurement, mode, callback, start, end) {
	//All tables
	// switch(measurement) {
	// 	case "TEMPERATURE_0": break;
	// 	case "TEMPERATURE_1": break;
	// 	case "TEMPERATURE_2": break;
	// 	case "WATER_0": break;
	// 	case "WATER_1": break;
	// 	case "WATER_2": break;
	// 	case "WATER_3": break;
	// 	case "CURRENT_0": break;
	// 	default: console.log("Invalid measurement!"); return false;
	// }
	//All modes
	switch(mode) {
		case "DATA_PER_ID": break;
		case "DATA_PER_DATE": break;
		case "FIRST_PER_DATE": break;
		case "LAST_PER_DATE": break;
		default: console.log("Invalid mode!"); return false;
	}

	//Get ID, Date, Value with an ID range
	//START
	//start is a number, end is a number
	if(mode == "DATA_PER_ID" && typeof start == "number" && typeof end == "number" && start >= 1 && end > start) {
		dataArray = new Array();
		$.ajax({
			url:"../php/getData.php",
			type:"POST",
			data: { measurement: measurement, mode: mode, StartID: Math.ceil(start).toString(), EndID: Math.ceil(end).toString()},
			success:function(msg){
				dataArray = JSON.parse(msg);
				console.log(dataArray); //Dev
				if(typeof callback == "function") {
					callback(dataArray);
				}
			},
		});
	}
	//start is a string, end is a string
	else if(mode == "DATA_PER_ID" && typeof start == "string" && typeof end == "string" && typeof Number(start) == "number" && typeof Number(end) == "number" && Number(start) >= 1 && Number(end) > start) {
		$.ajax({
			url:"../php/getData.php",
			type:"POST",
			data: { measurement: measurement, mode: mode, StartID: Math.ceil(Number(start)).toString(), EndID: Math.ceil(Number(end)).toString()},
			success:function(msg){
				dataArray = JSON.parse(msg);
				console.log(dataArray); //Dev
				if(typeof callback == "function") {
					callback(dataArray);
				}
			},
		});
	}
	//END

	//Get ID, Date, Value with an Date range
	//START
	//start is a date, end is a date
	else if(mode == "DATA_PER_DATE" && start instanceof Date && end instanceof Date && end > start) {
		dataArray = new Array();
		//console.log(start.getFullYear()+"-"+(Number(start.getMonth())+1).toString()+"-"+start.getDate());
		//console.log(end.getFullYear()+"-"+(Number(end.getMonth())+1).toString()+"-"+end.getDate())
		$.ajax({
			url:"../php/getData.php",
			type:"POST",
			data: { measurement: measurement, mode: mode, StartDate: toMysqlFormat(start), EndDate: toMysqlFormat(end)},
			success:function(msg){
				dataArray = JSON.parse(msg);
				console.log(dataArray); //Dev
				if(typeof callback == "function") {
					callback(dataArray);
				}
			},
		});
	}
	//END

	//Get the very first element
	//START
	else if(mode == "FIRST_PER_DATE") {
		dataArray = new Array();
		$.ajax({
			url:"../php/getData.php",
			type:"POST",
			data: {measurement: measurement, mode: mode},
			success:function(msg){
				dataArray = JSON.parse(msg);
				console.log(dataArray); //Dev
				if(typeof callback == "function") {
					callback(dataArray);
				}
			},
		});
	}
	//END

	//Get the very last element
	//START
	else if(mode == "LAST_PER_DATE") {
		dataArray = new Array();
		$.ajax({
			url:"../php/getData.php",
			type:"POST",
			data: {measurement: measurement, mode: mode},
			success:function(msg){
				dataArray = JSON.parse(msg);
				console.log(dataArray); //Dev
				if(typeof callback == "function") {
					callback(dataArray);
				}
			},
		});
	}
	//END
	else {
		console.log("Error in getData.js")
		return false;
	}
}
