<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");

if ((isset($_POST['name'])) && (isset($_POST['robotId'])) && (isset($_POST['season'])) && (isset($_POST['maxWeight'])) && (isset($_POST['totalCost'])) && (isset($_POST['compEnteredDate'])))
{

    $robotName = $_POST['name'];
    $season = $_POST['season'];
    $maxWeight = $_POST['maxWeight'];
    $maxCost = $_POST['totalCost'];
    $compEndDate = $_POST['compEnteredDate'];
    $robotID = $_POST['robotId'];
    //echo $compEndDate;

    // $conn = OpenCon();
    $conn = $con;
    $endDate = date("Y-m-d", strtotime($compEndDate));

    $sql = "UPDATE robot SET robot_name = '$robotName', season = '$season', max_weight = '$maxWeight', max_cost = '$maxCost', competition_end_date = '$endDate' WHERE robot_id = '$robotID '";

    if(mysqli_query($conn, $sql)){
        echo json_encode("true");
    } else{
        echo json_encode("false");
    }
    CloseCon($conn);
}
else
{
    echo json_encode("passing error");
}



function OpenCon()
 {
    $con=mysqli_connect("127.0.0.1","root","","xlr8_inventory");
    // Check connection
    if (mysqli_connect_errno())
    {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
  
    return $con;
 }
 
function CloseCon($conn)
{
    $conn -> close();
}

?>