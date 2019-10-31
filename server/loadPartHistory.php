<?php
session_start();
include("dbConnect.php");
$id = $_SESSION['userdetails']['user_id'];
//echo $id;
$query = "SELECT m.part_name,t.qty,m.weight,k.keyword_name,t.date,m.vendor_reference FROM part_master m,part_transaction t,keywords k where m.part_id=t.part_id and t.transaction_type=k.keyword_id and t.user_id= '$id' "; 
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