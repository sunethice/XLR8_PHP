<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");

//$conn = OpenCon();

$conn = $con;

if ((isset($_POST['componentId'])) && (isset($_POST['robotId'])))
{
    /**
     * msg = 1  -> weight exceeded
     * msg = 2  -> cost exceeded
     * msg = 3  -> weight and cost both exceeded
     * msg = 4  -> successful
     */

    $msg = 0;
    $robotId = $_POST['robotId'];
    $componentId = $_POST['componentId'];

    $robotWeight = getCurrentWeight($robotId, $conn);
    $robotCost = getCurrentCost($robotId, $conn);
    $robotMaxWeight = (int)getMaxWeight($robotId, $conn);
    $robotMaxCost = (int)getMaxCost($robotId, $conn);
    $componentWeight = getComponentWeight($componentId, $conn);
    $componentCost = getComponentCost($componentId, $conn);

    $newRobotWeight = $robotWeight + $componentWeight;
    $newRobotCost = $robotCost + $componentCost;

    $weightDiff = $newRobotWeight - $robotMaxWeight;

    if($newRobotWeight > $robotMaxWeight) {
        //echo json_encode("robot weight exceeded");
        $msg = 1;
        if($newRobotCost > $robotMaxCost){
            $msg = 3; 
        }
        /*$Recipient = "manoj.bandara91@gmail.com";
        $Subject = $robotId." robot weight exceeded!";
        $Message =  $robotId." robot weight exceeded by ".$weightDiff;
        $Headers = "MIME-Version: 1.0" . "\r\n";
        $Headers .= "Content-type:text/html;charset=ISO-8859-1" . "\r\n";
        
        mail($Recipient, $Subject, $Message, $Headers , "-r 101636451@student.swin.edu.au");*/
    } else if($newRobotCost > $robotMaxCost){
        $msg = 2;
    } else {
        $msg = 4;
    }
    
    echo json_encode($msg); 

    CloseCon($conn); 

}
else
{
    echo json_encode("passing error");
    CloseCon($conn);
}

function getCurrentWeight($robotId, $conn) {
    $query = "Select  SUM(C.weight) as sum_weight from component c where component_id in (SELECT component_id FROM `robot_component` WHERE robot_id = '$robotId')";

    $result = $conn->query($query);
    $resultArr = array();
    $sum = 0;

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        //$sumCost = $row['sum_cost'];
        $sum = $row['sum_weight'];
    }
    else
    {
        echo json_encode("No Components");
    }
    
    return $sum;

}

function getCurrentCost($robotId, $conn) {
    $query = "Select  SUM(C.cost) as sum_cost from component c where component_id in (SELECT component_id FROM `robot_component` WHERE robot_id = '$robotId')";

    $result = $conn->query($query);
    $resultArr = array();
    $sum = 0;

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $sum = $row['sum_cost'];
    }
    else
    {
        echo json_encode("No Components");
    }
    
    return $sum;

}

function getMaxWeight($robotId, $conn) {
    $query = "SELECT max_weight FROM `robot` WHERE robot_id = '$robotId'";

    $result = $conn->query($query);
    $resultArr = array();
    $maxWeight = 0;

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $maxWeight = $row['max_weight'];
    }
    else
    {
        echo json_encode("No Components");
    }
    
    return $maxWeight;
}

function getMaxCost($robotId, $conn) {
    $query = "SELECT max_cost FROM `robot` WHERE robot_id = '$robotId'";

    $result = $conn->query($query);
    $resultArr = array();
    $maxCost = 0;

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $maxCost = $row['max_cost'];
    }
    else
    {
        echo json_encode("No Components");
    }
    
    return $maxCost;
}

function getComponentWeight($componentId, $conn) {
    $query = "Select weight from component WHERE component_id = '$componentId'";

    $result = $conn->query($query);
    $resultArr = array();
    $weight = 0;

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $weight = $row['weight'];
    }
    else
    {
        echo json_encode("No Components");
    }
    
    return $weight;
}

function getComponentCost($componentId, $conn) {
    $query = "Select cost from component WHERE component_id = '$componentId'";

    $result = $conn->query($query);
    $resultArr = array();
    $cost = 0;

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $cost = $row['cost'];
    }
    else
    {
        echo json_encode("No Components");
    }
    
    return $cost;
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