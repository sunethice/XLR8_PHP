<?php
error_reporting(E_ERROR | E_PARSE);
require_once('../config.php'); //by using my code
// require_once('../dbConnect.php');
session_start();

$id = '';
if(isset($_POST['id'])){
    $id = $_POST['id'];
}
$response = new stdClass();
$dbInstance = DBManager::cpGetInstance(); 
if(empty($id))
    $sql = "SELECT cmp.component_id,cmp.weight,cmp.cost,cmp.description,cmp.completion_status,cmp_tp.type_name FROM component cmp INNER JOIN component_type as cmp_tp ON cmp.type_id = cmp_tp.component_type_id";
else
    $sql = "SELECT *,cmp_tp.type_name FROM component cmp INNER JOIN component_type as cmp_tp ON cmp.type_id = cmp_tp.component_type_id WHERE component_id = '$id'";

$results = $dbInstance->cpGetResultAsObject($sql); 

if($results != null){
    $mAResults = new stdClass();
    foreach($results as $k => $val){
        $compID = $val->component_id;
        $mAResults->$compID = $val;
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