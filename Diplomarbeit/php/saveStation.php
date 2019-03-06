<?php
  include "connect.php";

  $sql = 'INSERT INTO `stations`(`Id`, `databaseName`, `displayName`, `measurementType`, `mqttTopic`) VALUES ('.$_POST["Id"].',"'.$_POST["databaseName"].'","'.$_POST["displayName"].'","'.$_POST["measurementType"].'","'.$_POST["mqttTopic"].'")';

  if($conn->query($sql)) {
    echo "success";
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
?>
