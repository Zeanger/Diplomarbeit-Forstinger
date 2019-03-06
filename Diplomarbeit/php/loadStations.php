<?php
  include "connect.php";

  $sql = "SELECT * FROM `stations`";

  $result = $conn->query($sql);
  $dataArray = array();

  while($row = mysqli_fetch_assoc($result)) {
    array_push($dataArray, $row);
  }

  echo json_encode($dataArray);

  $conn->close();
?>
