<?php
  date_default_timezone_set('Europe/Berlin');
  ini_set('max_execution_time', 4000);

  $servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "measurements";

	$tablename = "temperature_1";
	$valuemin = -10;
	$valuemax = 5;

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

  $i = 0;
	while($i <= 3600) {
    $i = $i + 1;
    $string = date('Y/m/d H:i:s', time());
    echo $string."<br>";
		$sql = "INSERT INTO `".$tablename."`(`ID`, `Date`, `Value`)
				VALUES (null,'".$string."',".rand($valuemin,$valuemax).")";
		$conn->query($sql);
    sleep(60);
	}
?>
