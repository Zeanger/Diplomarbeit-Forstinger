//Takes a 1 or 2 digit number and converts it to a 2 digit string
//Done!
function twoDigits(d) {
    if(0 <= d && d < 10) return "0"+d.toString();
    if(-10 < d && d < 0) return "-0"+(-1*d).toString();
    return d.toString();
}

//Converts Js date type to Mysql date type
//Done!
function toMysqlFormat(date) {
    return date.getFullYear()+"-"+twoDigits(1+date.getMonth())+"-"+twoDigits(date.getDate())+" "+twoDigits(date.getHours())+":"+twoDigits(date.getMinutes())+":"+twoDigits(date.getSeconds());
}

//Converts Js date to datepicker format
//Done!
function toDatepickerFormat(date) {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

//Logs variables for debugging
//Done!
function customLog(name) {
	if(name == "activeGraphs") console.log(activeGraphs);
	if(name == "freeId") console.log(freeId);
	if(name == "allPresets") console.log(allPresets);
	if(name == "keepUpdatedInterval") console.log(keepUpdatedInterval);
	if(name == "stationNames") console.log(stationNames);

	return null;
}
