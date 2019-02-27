<?php
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "measurements";

	$tablename = "current_0";
	$datemin = "2018-2-1";
	$datemax = "2018-2-28";
	$valuemin = -5;
	$valuemax = 20;

	$faktormin = -0.2;
	$faktormax = 0.2;

	$entries = 400;

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$min = strtotime($datemin);
	$max = strtotime($datemax);
	$deltaDate = ($max - $min)/$entries;
	$oldDate = $min;
	$oldValue = mt_rand($valuemin,$valuemax);
	for($i = 0; $i < $entries; $i++) {
		$int = $oldDate + $deltaDate;
		$oldDate = $int;
		$tempValue = mt_rand($valuemin,$valuemax);
		$value = $oldValue + $tempValue * (mt_rand($faktormin*mt_getrandmax(),$faktormax*mt_getrandmax()) / mt_getrandmax());
		$oldValue = $value;
		$string = date("Y-m-d H:i:s",$int);

		$sql = "INSERT INTO `".$tablename."`(`ID`, `Date`, `Value`)
				VALUES (null,'".$string."','".$value."')";
		$conn->query($sql);
	}
?>
