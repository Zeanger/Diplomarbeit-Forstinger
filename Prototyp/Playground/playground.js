function setup() {
	function randomDate(start, end) {
    var d= new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d;
}

var excel = $JExcel.new("Verdana 10 #333333");
excel.set( {sheet:0,value:"This is Sheet 0" } );
var evenRow=excel.addStyle( { border: "none,none,none,thin #333333"});
var oddRow=excel.addStyle ( { fill: "#ECECEC" ,border: "none,none,none,thin #333333"});
for (var i=1;i<50;i++) excel.set({row:i,style: i%2==0 ? evenRow: oddRow  });

var headers=["Header 0","Header 1","Header 2","Header 3","Header 4"];
var formatHeader=excel.addStyle ( {
    border: "none,none,none,thin #333333",font: "Calibri 12 #0000AA B"}
);

for (var i=0;i<headers.length;i++){              // Loop headers
    excel.set(0,i,0,headers[i],formatHeader);    // Set CELL header text & header format
    excel.set(0,i,undefined,"auto");             // Set COLUMN width to auto
}

var initDate = new Date(2000, 0, 1);
var endDate = new Date(2016, 0, 1);
var dStyle = excel.addStyle ( {
    align: "R",
    format: "yyyy.mm.dd hh:mm:ss",
    font: "#00AA00"}
);

for (var i=1;i<50;i++){                                    // Generate 50 rows
    excel.set(0,0,i,"This is line "+i);                    // This column is a TEXT
    var d=randomDate(initDate,endDate);                    // Get a random date
    excel.set(0,1,i,d.toLocaleString());                   // Random date as STRING
    excel.set(0,2,i,$JExcel.toExcelLocalTime(d));          // Date as a NUMERIC
    excel.set(0,3,i,$JExcel.toExcelLocalTime(d),dStyle);   // Date as a NUMERIC in dStyle.format
    excel.set(0,4,i,"Some other text");                    // Some other text
}

excel.generate("SampleData.xlsx");
}
