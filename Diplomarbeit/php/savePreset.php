<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "settings";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO `presets`(`ID`, `Name`, `Data`) VALUES (null,'".$_POST['name']."','".$_POST['preset']."')";

if($conn->query($sql)) {
  echo "success";
} else {
  echo "failed! sql: ".$sql;
}

$conn->close();

?>
