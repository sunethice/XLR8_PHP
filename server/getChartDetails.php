<?php
header("Access-Control-Allow-Origin: *");
require_once('dbConnect.php');

function getPartCount($con)
{
  $query = "SELECT available_qty FROM part_master WHERE availability = 0 ";
  $result = $con->query($query);
  $resultArr = array();
  $tot = 0;
  if ($result->num_rows > 0) {

      // output data of each row
      while ($row = $result->fetch_assoc())
      {
        $tot = $tot + $row['available_qty'];
      }
      $resultArr[0]= $tot;
  }
  else {
      $resultArr[0]= "0";
  }
  return $resultArr;
}

function getComponentCount($con)
{
  $query = "SELECT COUNT(component_id) FROM component "; //have a deleted value
  $result = $con->query($query);
  $resultArr = array();

  if ($result->num_rows > 0)
  {
    while ($row = $result->fetch_array())
    {
      if ($row[0]==NULL) {
        $resultArr[0]= '0';
      }
      else {
        $resultArr[0]= $row[0];
      }
    }
  }
  else
  {
      $resultArr[0]= "0";
  }
  return $resultArr;
}

function getRobotCount($con)
{
  $query = "SELECT COUNT(robot_id) FROM robot "; //have a deleted value
  $result = $con->query($query);
  $resultArr = array();

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_array())
    {
      if ($row[0]==NULL) {
        $resultArr[0]= '0';
      }
      else {
        $resultArr[0]= $row[0];
      }
    }
  }
  else {
      $resultArr[0]= "0";
  }
  return $resultArr;
}

function getPartDistribution($con)
{
  $query = "SELECT total_qty, available_qty, availability FROM part_master ";
  $result = $con->query($query);

  $resultArr = array();
  $new = 0;
  $used = 0;
  $na = 0;
  if ($result->num_rows > 0) {

      // output data of each row
      while ($row = $result->fetch_assoc())
      {
        if(strcmp($row['availability'],'-1')==0)
        {
          $na = $na + $row['total_qty'];
        }
        else
        {
          $new = $new + $row['available_qty'];
          $used = $used + ($row['total_qty'] - $row['available_qty']);

        }
      }
  }
  $resultArr['new']= $new;
  $resultArr['used']= $used;
  $resultArr['na']= $na;

  return $resultArr;

}

function getRobotTimeFrame($con)
{
  $query = "SELECT robot_id, robot_name, season, max_weight, max_cost, competition_end_date, date_of_creation
            FROM robot ";
  $result = $con->query($query);
  $resultArr = array();
  $today = date();
  $temp = array();
  if ($result->num_rows > 0)
  {
      while ($row = $result->fetch_assoc())
      {
        //$competitionDate = DateTime::createFromFormat('d-M-y', $row['competition_end_date']);
        $time = strtotime($row['competition_end_date']);
        $newformat = date('Y',$time);
        //$competitionYear = $row['competition_end_date']->format('Y');


        if( strcmp($newformat, date('Y')) == 0 )
        {
          $temp = $row;
        }

      }
      $resultArr[0]= $temp;
  }
  else
  {
      $resultArr[0]= "0";
  }

  return $resultArr;
}

function getRobotDetails($con)
{

  $robot = getRobotTimeFrame($con);

  $resultArr= array();
  $resultArr['robotName']= $robot[0]['robot_name'];
  $resultArr['endDate']= $robot[0]['competition_end_date'];
  $resultArr['MaxWeight']= $robot[0]['max_weight'];
  $resultArr['MaxCost']= $robot[0]['max_cost'];
  $resultArr['createdDate']= $robot[0]['date_of_creation'];

  $resultArr['weight']= 0;
  $resultArr['cost']= 0;
  if($robot != null && $robot!="")
  {
    $id = $robot[0]['robot_id'];
    // $query = "SELECT T.part_id, T.qty, P.weight, P.cost
    //           FROM part_component C, robot_component R , part_transaction T, part_master P
    //           WHERE T.part_id = P.part_id
    //           and T.transaction_id = C.part_id
    //           and C.component_id = R.component_id
    //           and R.robot_id = '$id'";

    $query = "SELECT C.weight, C.cost
            FROM component C, robot_component X, robot R
            WHERE R.robot_id = X.robot_id
            AND C.component_id = X.component_id
            AND R.robot_id = '$id' ";

    $result = $con->query($query);
    $totWeight = 0; $totCost = 0;
    if ($result->num_rows > 0)
    {
        while ($row = $result->fetch_assoc())
        {
          $totWeight = $totWeight + ($row['weight']);
          $totCost = $totCost + ($row['cost']);
        }
        $resultArr['weight']= $totWeight;
        $resultArr['cost']= $totCost;
    }

  }

  return $resultArr;

}

$returnArray['partCount'] = getPartCount($con);
$returnArray['componentCount'] = getComponentCount($con);
$returnArray['robotCount'] = getRobotCount($con);
$returnArray['pieChart'] = getPartDistribution($con);
$returnArray['robotTimeLine'] =getRobotDetails($con);

echo json_encode($returnArray);
$con->close();

?>
