<?php
header("Access-Control-Allow-Origin: *");
require_once('xlr8_utils.php');
require_once('dbConnect.php');
session_start();

$_SESSION['userdetails']['userId']="USR_1";
$userId = $_SESSION['userdetails']['userId'];

if( (isset($_POST['id'])) && (isset($_POST['qty'])) )
{
  $id = $_POST['id'];
  $qty = $_POST['qty'];

  $query= "UPDATE part_master
          SET total_qty = total_qty + '$qty' ,
          available_qty = available_qty + '$qty'
          WHERE part_id = '$id' ";

  if(mysqli_query($con,$query))
  {
    $new_tran_id = createUniqueId($con, 'part_transaction');
    $today = date("Y-m-d");

    $query = "INSERT INTO part_transaction (transaction_id,part_id,user_id,transaction_type,qty,date)
              SELECT '$new_tran_id','$id','$userId',keyword_id,'$qty','$today'
              FROM keywords
              WHERE keyword_name LIKE '%UPDATE%' ";

    if(mysqli_query($con,$query))
    {
      echo json_encode("true");
      $con->close();
    }
    else
    {
      echo json_encode("Error: Error in database insertion: Transacion table");
    }
  }
  else
  {
    echo json_encode("Error: Error in database insertion: Part table");
  }
}
else
{
  echo json_encode("Error: Error in data retrieval");
}


 ?>
