<?php
session_start();
include("dbConnect.php");
$id = $_SESSION['userdetails']['user_id'];
//echo $id;
$query = "SELECT part_name,justification,quantity,vendor_reference,confirmation_status,entry_id FROM wishlist where user_id= '$id' "; 
$result=mysqli_query($con,$query);
//$rows=mysqli_fetch_array($result);
//echo $row['firstName']; 
//echo $row['user_type']; 
if(mysqli_num_rows($result)>0)
{
  $count=0;
  while($rows=mysqli_fetch_array($result))
  {
    for($i=0;$i<6;$i++)
    {
      $singleResultRow[$i]= $rows[$i];
    }
    $searchString[$count]= $singleResultRow;
    $count=$count+1;
  }		
}
else
{
  $searchString="No record found";
}

echo json_encode($searchString);




?>