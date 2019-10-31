<?php
error_reporting(E_ERROR | E_PARSE);
// require_once('../config.php'); //by using my code
require_once('../xlr8_utils.php');
require_once('../dbConnect.php');
session_start();

$response = null;
if (isset($_POST['componentTypeID']) && isset($_POST['componentComplStatus']))
{
    $component_type_id = $_POST['componentTypeID'];
    $component_id = '';
    if(isset($_POST['componentID']))
        $component_id = $_POST['componentID'];

    $component_description = $_POST['componentDescription'];
    $component_status = $_POST['componentComplStatus'];
    // $conn = OpenCon();

    $response = new stdClass();

    // $dbInstance = DBManager::cpGetInstance(); //by using my code
    $updated_by = $_SESSION['userdetails']['user_id'];
    $compID = createUniqueId($con, 'component');
    if(!isset($_POST['componentID'])){
        $sql = "INSERT INTO `component`(`component_id`,`type_id`,`weight`,`cost`,`description`,`completion_status`,`row_status`,`update_on`,`updated_by`)".
        " VALUES ('$compID','$component_type_id','0','0','$component_description','$component_status',0,NOW(),'$updated_by')";
    }
    else{
        $sql = "UPDATE `component` SET `type_id`='$component_type_id',`description`='$component_description',".
        "`completion_status`='$component_status',`update_on`= NOW(),`updated_by`='$updated_by' WHERE `component_id`='$component_id'";
    }
    
    //if($dbInstance->cpDBQuery($sql)){ //by using my code
    if(mysqli_query($con,$sql)){
        $response->success = true;
        if(!isset($_POST['componentID']))
            $response->message = "Records inserted successfully.";
        else
            $response->message = "Records updated successfully.";
    } else{
        $response->success = false;
        $response->message = "ERROR: Could not able to execute $sql. ".mysqli_error($conn);
    }
}
else
{
    $response->success = false;
}
echo(json_encode($response));
$con -> close();

// function OpenCon()
//  {
//     $dbhost = "127.0.0.1";
//     $dbuser = "root";
//     $dbpass = "root123";
//     $db = "xlr8_inventory";
//     $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn->error);
    
//     return $conn;
//  }
 
// function CloseCon($conn)
// {
//     $conn -> close();
// }
?>