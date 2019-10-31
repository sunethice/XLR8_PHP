<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");

if ((isset($_POST['componentId'])) && (isset($_POST['robotId'])))
{

    $robotId = $_POST['robotId'];
    $robotComponentId = $_POST['componentId'];

    $conn = $con;

    $sql = "INSERT INTO robot_component(robot_id, component_id) VALUES ('$robotId','$robotComponentId')";
    
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