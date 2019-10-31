<?php
header("Access-Control-Allow-Origin: *");
session_start();
include("dbConnect.php");
$pname=$_POST['partName'];
$weight=$_POST['weight'];
$cost=$_POST['cost'];
$quantity=$_POST['quantity'];
$justification=$_POST['justification'];
$vendor=$_POST['vendor'];
$vendor_ref=$_POST['vendorReference'];
$id = $_SESSION['userdetails']['user_id'];

$query = "SELECT SUBSTRING(u.entry_id, 3) as ID FROM wishlist AS u ORDER BY CONVERT(SUBSTRING(u.entry_id, 3),UNSIGNED INTEGER) DESC LIMIT 1";
$result2=mysqli_query($con,$query);
    while ($row = mysqli_fetch_object($result2)) {
      $lastId =  $row->ID;
    }
   // list($prefix,$Id) = explode('USR_',$lastId );
   // echo $lastId;
    $Id = ($lastId+1);

    $new_id = 'W_'.$Id;
    //echo $new_id;
  
   
$sql2="INSERT INTO wishlist(entry_id,user_id,date,justification,part_name,weight,cost,quantity,vendor,vendor_reference)
        VALUES ('$new_id','$id',now(),'$justification','$pname','$weight','$cost','$quantity','$vendor','$vendor_ref')";

//var_dump($sql2);
if(mysqli_query($con,$sql2))
{
    echo json_encode("success");
    $con->close();

}
else
{
    echo json_encode("error".mysqli_error($con));
    $con->close();

}




?>