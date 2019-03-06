<?php
  include "connect.php";

  $sql = "SELECT `databaseName` FROM `stations` WHERE `Id` =".$_POST["Id"];
  $sql2 = "DELETE FROM `stations` WHERE `Id` =".$_POST["Id"];

  $tablename;
  if($tablename = $conn->query($sql)) {
    if($conn->query($sql2)) {
      echo "success";
      $conn->query("DROP TABLE ".$tablename->fetch_assoc()["databaseName"]);
    } else {
      echo "failed! sql: ".$sql2;
    }
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
?>
