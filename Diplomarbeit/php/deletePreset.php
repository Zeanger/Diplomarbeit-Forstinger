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

  //This command isnt finisched yet!!
  $sql = "DELETE FROM presets WHERE Name";

  $result = $conn->query($sql);
  echo $result;
  $conn->close();
?>
