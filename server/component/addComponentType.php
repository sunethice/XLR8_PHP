<?php
error_reporting(E_ERROR | E_PARSE);
require_once('../config.php'); 
require_once('../xlr8_utils.php');
session_start();

$response = null;
if (isset($_POST['componentType']))
{
    $component_Type = $_POST['componentType'];

    $response = new stdClass();
    $compTypeID = createUniqueId($con, 'component_type');

    $dbInstance = DBManager::cpGetInstance(); 
    $sql = "INSERT INTO `component_type`(`component_type_id`,`type_name`) VALUES ('$compTypeID','$component_Type')";
    if($dbInstance->cpDBQuery($sql)){
        $response->success = true;
        $response->message = "Records inserted successfully.";
    } else{
        $response->success = false;
        $response->message = "ERROR: Could not able to execute $sql. ".mysqli_error($conn);
    }
}
else
{
    $response->success = false;
}
// $con->close();
echo(json_encode($response));
?>