<?php
error_reporting(E_ERROR | E_PARSE);
require_once('../config.php'); //By using  my code
// require_once('../dbConnect.php');
require_once('componentPartsHandler.php');
session_start();

$deleteID = $_POST['id'];
$response = new stdClass();
$dbInstance = DBManager::cpGetInstance();
$sql = "DELETE FROM component WHERE component_id='$deleteID'";

$results = $dbInstance->cpDBQuery($sql);
if($results){
    $response->success = true;
    $response->message = "Records deleted successfully.";
    $mAResults = new stdClass();
    $mAResults->compID = $deleteID;
    $response->obj = $mAResults;
} else{
    $response->success = false;
    $response->message = "No record deleted";
}
echo(json_encode($response));

?>