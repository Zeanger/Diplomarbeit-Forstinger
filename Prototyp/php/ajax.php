<?php
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "measurements";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$sql = null;
	$dataArray = array();

	switch ($_POST['measurement']) {
    case "TEMPERATURE_0": $tableName = "temperature_0";
        break;
    case "TEMPERATURE_1": $tableName = "temperature_1";
        break;
		case "TEMPERATURE_2": $tableName = "temperature_2";
        break;
		case "WATER_0": $tableName = "water_0";
        break;
		case "WATER_1": $tableName = "water_1";
        break;
		case "WATER_2": $tableName = "water_2";
        break;
		case "WATER_3": $tableName = "water_3";
        break;
		case "CURRENT_0": $tableName = "current_0";
        break;
	}

	if(isset($tableName)) {
		if($_POST['mode'] === "DATA_PER_ID") {
			$sql="SELECT `ID`, `Date`, `Value`
				  FROM ".$tableName."
				  WHERE `ID` <= ".$_POST['EndID']." AND `ID` >= ".$_POST['StartID']."
					ORDER BY `Date` ASC";
		}
		else if($_POST['mode'] === "DATA_PER_DATE") {
			$startDate = strtotime($_POST["StartDate"]);
			if ($startDate !== false) {
				date('Y-m-d', $startDate );
			}
			$endDate = strtotime($_POST["EndDate"]);
			if ($endDate !== false) {
				date('Y-m-d', $endDate );
			}
			$sql="SELECT `ID`, `Date`, `Value`
				  FROM ".$tableName."
				  WHERE `Date` <= '".$_POST["EndDate"]."' AND `Date` >= '".$_POST["StartDate"]."'
				  ORDER BY `Date` ASC";
		}
		else if($_POST['mode'] === "FIRST_PER_DATE") {
			$sql="SELECT `ID`, `Date`, `Value`
				  FROM ".$tableName."
				  ORDER BY `Date` ASC LIMIT 1";
		}
		else if($_POST['mode'] === "LAST_PER_DATE") {
			$sql="SELECT `ID`, `Date`, `Value`
				  FROM ".$tableName."
				  ORDER BY `Date` DESC LIMIT 1";
		}
		$result = $conn->query($sql);

		while($row = mysqli_fetch_assoc($result)) {
			array_push($dataArray, $row);
		}
	}

	echo json_encode($dataArray);

?>
