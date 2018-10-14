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

  $sql = "SELECT `Setting`, `Value` FROM `preferences`";

  $result = $conn->query($sql);
  $dataArray = array();

  while($row = mysqli_fetch_assoc($result)) {
    array_push($dataArray, $row);
  }

  echo json_encode($dataArray);

  $conn->close();
?>
