<?php
  include "connect.php";

  $sql = "DELETE FROM `stations` WHERE `Id` =".$_POST["Id"];

  if($conn->query($sql)) {
    echo "success";
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
?>
