<?php
  include "connect.php";

  $sql = "UPDATE `stations` SET `displayName`='".$_POST['displayName']."',`measurementType`='".$_POST['measurementType']."',`mqttTopic`='".$_POST['mqttTopic']."' WHERE `Id` = ".$_POST['Id'];

  if($conn->query($sql)) {
    echo "success";
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
 ?>
