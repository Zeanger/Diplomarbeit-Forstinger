<?php
  include "connect.php";

  $sql = 'INSERT INTO `stations`(`databaseName`, `displayName`, `measurementType`, `mqttTopic`) VALUES ("'.$_POST["databaseName"].'","'.$_POST["displayName"].'","'.$_POST["measurementType"].'","'.$_POST["mqttTopic"].'")';
  $sql2 = 'CREATE TABLE '.$_POST["databaseName"].' (ID INT NOT NULL AUTO_INCREMENT,Date DATETIME NOT NULL,Value FLOAT(6,2) NOT NULL,PRIMARY KEY(id))';

  if($conn->query($sql)) {
    $idToDelete = $conn->insert_id;
    if($conn->query($sql2)) {
      $data = (object) [
        'success' => 'success',
        'id' => $idToDelete,
  ];
      echo json_encode($data);
    } else {
      if($conn->query("DELETE FROM `stations` WHERE `Id` =".$idToDelete)) {
        echo "managed to delete faulty entry!";
      } else {
        echo "failed to delete faulty entry!";
      }
      echo "failed! sql: ".$sql2;
    }
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
?>
