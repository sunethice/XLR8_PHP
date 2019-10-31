<?php
session_start();
include("dbConnect.php");

$id = $_SESSION['userdetails']['user_id'];
$entry_id = $_GET["id"];

   
$sql2="Delete from wishlist where entry_id='$entry_id' and user_id='$id'";

if(mysqli_query($con,$sql2))
{
    echo json_encode("success");
    $con->close();

}
else
{
    echo json_encode("error");
    $con->close();

}




?>