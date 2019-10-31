<?php
header("Access-Control-Allow-Origin: *");
require_once('xlr8_utils.php');
require_once('dbConnect.php');
session_start();

$_SESSION['userdetails']['userId']="USR_1";
$userId = $_SESSION['userdetails']['userId'];

if( (isset($_POST['id'])) && (isset($_POST['note'])) && (isset($_POST['status'])) )
{
  $id = $_POST['id'];
  $note = $_POST['note'];
  $status = $_POST['status'];

  $new_notes_id = createUniqueId($con, 'part_notes');
  $today = date("Y-m-d");

  $query = "INSERT INTO part_notes (note_id,part_id,user_id,condition_status,remarks,date_of_entry)
            VALUES('$new_notes_id','$id','$userId','$status','$note','$today')";

  if(mysqli_query($con,$query))
  {
    echo json_encode("true");
    $con->close();
  }
  else
  {
    echo json_encode("Error: Error in database insertion: Part_Notes table");
  }
}
else
{
  echo json_encode("Error: Error in data retrieval");
}


 ?>
