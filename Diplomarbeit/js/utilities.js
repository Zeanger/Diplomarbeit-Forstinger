//Takes a 1 or 2 digit number and converts it to a 2 digit string
//Done!
function twoDigits(d) {
    if(0 <= d && d < 10) return "0"+d.toString();
    if(-10 < d && d < 0) return "-0"+(-1*d).toString();
    return d.toString();
}

//Converts Js date type to Mysql date type
//Done!
function toMysqlFormat(date2) {
    var date = new Date(date2)
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

function toExcelFormat(date2) {
  var date = new Date(date2)
  var year = date.getFullYear();
  var month = (date.getMonth() + 1);
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return twoDigits(day)+"/"+twoDigits(month)+"/"+year+" "+twoDigits(hour)+":"+twoDigits(minute)+":"+twoDigits(second);

}

//Logs variables for debugging
//Done!
function customLog(name) {
	if(name == "activeGraphs") console.log(activeGraphs);
	if(name == "freeId") console.log(freeId);
	if(name == "presets") console.log(presets);
	if(name == "keepUpdatedInterval") console.log(keepUpdatedInterval);
	if(name == "stationNames") console.log(stationNames);
  if(name == "menuOptions") console.log(menuOptions);

	return null;
}
