<?php
session_start();
include("dbConnect.php");
$id = $_SESSION['userdetails']['user_id'];
//echo $id;
$query = "SELECT r.robot_name,r.season,r.max_weight,r.max_cost,r.competition_end_date,r.CreatedDate FROM robot r,user_robot u where r.robot_id=u.robot_id and u.user_id= '$id' "; 
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
