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

  $sql = 'DELETE FROM `presets` WHERE `Name` = "'.$_POST['name'].'" LIMIT 1';

  if($conn->query($sql)) {
    echo "success";
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
 ?>
