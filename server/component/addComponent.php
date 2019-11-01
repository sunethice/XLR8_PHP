<?php
error_reporting(E_ERROR | E_PARSE);
require_once('../config.php'); 
require_once('../xlr8_utils.php');
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
    $updated_by = $_SESSION['userdetails']['user_id'];
    $compID = createUniqueId($con, 'component');

    $dbInstance = DBManager::cpGetInstance();
    if(!isset($_POST['componentID'])){
        $mStrQuery = "INSERT INTO `component`(`component_id`,`type_id`,`weight`,`cost`,`description`,`completion_status`,`row_status`,`update_on`,`updated_by`)".
        " VALUES ('$compID','$component_type_id','0','0','$component_description','$component_status',0,NOW(),'$updated_by')";
    }
    else{
        $mStrQuery = "UPDATE `component` SET `type_id`='$component_type_id',`description`='$component_description',".
        "`completion_status`='$component_status',`update_on`= NOW(),`updated_by`='$updated_by' WHERE `component_id`='$component_id'";
    }
    $response = new stdClass();
    if($dbInstance->cpDBQuery($mStrQuery)){ 
        $response->success = true;
        if(!isset($_POST['componentID']))
            $response->message = "Records inserted successfully.";
        else
            $response->message = "Records updated successfully.";
    } else{
        $response->success = false;
        $response->message = "ERROR: Could not able to execute $mStrQuery. ".$dbInstance->getSQLError();
    }
}
else
{
    $response->success = false;
}
echo(json_encode($response));
?>