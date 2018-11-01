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

  $sql = "UPDATE `preferences` SET `Value`= ".$_POST['value']." WHERE `Setting` = '".$_POST['name']."'";

  if($conn->query($sql)) {
    echo "success";
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
 ?>
