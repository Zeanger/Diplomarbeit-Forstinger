<?php
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "measurements";

	$tablename = "temperature_0";
	$datemin = "2018-10-10";
	$datemax = "2018-10-11";
	$valuemin = -10;
	$valuemax = 5;

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	for($i = 0; $i < 100; $i++) {
		$min = strtotime($datemin);
		$max = strtotime($datemax);
		$int= mt_rand($min,$max);
		$string = date("Y-m-d H:i:s",$int);

		$sql = "INSERT INTO `".$tablename."`(`ID`, `Date`, `Value`)
				VALUES (null,'".$string."',".rand($valuemin,$valuemax).")";
		$conn->query($sql);
	}
?>
