<?php
  include "connect.php";

  //This command isnt finisched yet!!
  $sql = 'DELETE FROM `presets` WHERE `Name` = "'.$_POST['name'].'" LIMIT 1';

  if($conn->query($sql)) {
    echo "success";
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
 ?>
