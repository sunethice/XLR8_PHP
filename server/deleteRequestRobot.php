<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");

//$conn = OpenCon();

$conn = $con;

if (isset($_POST['robotId']))
{
    /**
         * msg = 1  -> already requested
         * msg = 2  -> successfully requested
         * msg = 3  -> Error
    */

    $msg = 0;
    $robotId = $_POST['robotId'];

    $robotCurrentStatus = getCurrentStatus($robotId, $conn);

    if($robotCurrentStatus == 1) {
        //echo json_encode("robot weight exceeded");
        $msg = 1;

    } else {

        $sql = "UPDATE robot SET delete_request = 1 WHERE robot_id = '$robotId '";

        if(mysqli_query($conn, $sql)){
            $msg = 2;
        } else{
            $msg = 3;
        }
    } 
    
    echo json_encode($msg); 

    CloseCon($conn); 

}
else
{
    echo json_encode("passing error");
    CloseCon($conn);
}

function getCurrentStatus($robotId, $conn) {
    $query = "Select  delete_request from robot where robot_id = '$robotId'";

    $result = $conn->query($query);
    $resultArr = array();
    $status = -1;

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        //$sumCost = $row['sum_cost'];
        $status = $row['delete_request'];
    }
    else
    {
        echo json_encode("No Robot");
    }
    
    return $status;

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