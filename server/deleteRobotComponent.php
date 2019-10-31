<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");
//$conn = OpenCon();
$conn = $con;

if ((isset($_POST['componentId'])) && (isset($_POST['robotId'])))
{

    $msg = "false";
    $robotId = $_POST['robotId'];
    $componentId = $_POST['componentId'];

    $sql = "DELETE FROM robot_component WHERE robot_id = '$robotId' and component_id = '$componentId'";

    if(mysqli_query($conn, $sql)){
        $msg = "true";
    } else{
        $msg = "false";
    }

    echo json_encode($msg); 

    CloseCon($conn); 

}
else
{
    echo json_encode("passing error");
    CloseCon($conn);
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