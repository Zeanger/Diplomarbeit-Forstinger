<?php
include "connect.php";

$sql = "INSERT INTO `presets`(`ID`, `Name`, `Data`) VALUES (null,'".$_POST['name']."','".$_POST['preset']."')";

if($conn->query($sql)) {
  echo "success";
} else {
  echo "failed! sql: ".$sql;
}

$conn->close();

?>
