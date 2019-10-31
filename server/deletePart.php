<?php
header("Access-Control-Allow-Origin: *");
require_once('xlr8_utils.php');
require_once('dbConnect.php');
session_start();

$_SESSION['userdetails']['userId']="USR_1";
$userId = $_SESSION['userdetails']['userId'];

if(isset($_POST['id']))
{
  $partId = $_POST['id'];
  $query = "SELECT *
            FROM part_transaction T, part_component C
            WHERE T.transaction_id=C.part_id
            AND T.part_id = '$partId' ";

  $result = $con->query($query);

  if ($result->num_rows > 0) {
    echo json_encode("Error: Cannot delete this part. It is being used in a component.");
  }
  else
  {
    $query = "UPDATE part_master SET deleted = 1 WHERE part_id = '$partId' ";
      
    if(mysqli_query($con,$query))
    {
      echo json_encode("true");
      $con->close();
    }
    else {
      echo json_encode("Error: Error in row deletion");
    }
  }
}
else {
  echo json_encode("Error: Error in identifying part");
}

 ?>
