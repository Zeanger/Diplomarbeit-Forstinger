<?php
  include "connect.php";
  
  $sql = "UPDATE `preferences` SET `Value`= ".$_POST['value']." WHERE `Setting` = '".$_POST['name']."'";

  if($conn->query($sql)) {
    echo "success";
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
 ?>
