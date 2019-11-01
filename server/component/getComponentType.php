<?php
error_reporting(E_ERROR | E_PARSE);
require_once('../config.php'); 
session_start();

$response = new stdClass();
$dbInstance = DBManager::cpGetInstance(); 
$sql = "SELECT * FROM `component_type`";
$results = $dbInstance->cpGetResultAsObject($sql); 

if($results != null){
    $mAResults = new stdClass();
    foreach($results as $k => $val){
        $compTypID = $val->component_type_id;
        $mAResults->$compTypID = $val->type_name;
    }
    $response->success = true;
    $response->message = "Records retrieved successfully.";
    $response->obj = $mAResults;
} else{
    $response->success = false;
    $response->message = "No records found";
    $response->obj = null;
}
echo(json_encode($response));
?>