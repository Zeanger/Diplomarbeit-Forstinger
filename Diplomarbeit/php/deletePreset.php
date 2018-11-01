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

<<<<<<< HEAD
  //This command isnt finisched yet!!
  $sql = "DELETE FROM presets WHERE Name";

  $result = $conn->query($sql);
  echo $result;
  $conn->close();
?>
=======
  $sql = 'DELETE FROM `presets` WHERE `Name` = "'.$_POST['name'].'" LIMIT 1';

  if($conn->query($sql)) {
    echo "success";
  } else {
    echo "failed! sql: ".$sql;
  }

  $conn->close();
 ?>
>>>>>>> deb9da4da8c8ca5efa4fa7699c5c1162a35cc6d7
