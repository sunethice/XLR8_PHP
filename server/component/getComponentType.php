<?php
error_reporting(E_ERROR | E_PARSE);
// require_once('../config.php'); //by using my code
require_once('../dbConnect.php');
session_start();

$response = new stdClass();
//$dbInstance = DBManager::cpGetInstance(); // by using my code
$sql = "SELECT * FROM `component_type`";
//$results = $dbInstance->cpGetResultAsObject($sql); //by using my code
$result = $con->query($sql);
if ($result->num_rows > 0){
    $mAResults = new stdClass();
    while ($row = $result->fetch_object())
    {
        $compTypID = $row->component_type_id;
        $mAResults->$compTypID = $row->type_name;
    }
    $response->success = true;
    $response->message = "Records retrieved successfully.";
    $response->obj = $mAResults;
} else{
    $response->success = false;
    $response->message = "No records found";
    $response->obj = null;
}
$con->close();
echo(json_encode($response));

// if($results != null){
//     $mAResults = new stdClass();
//     foreach($results as $k => $val){
//         $compTypID = $val->component_type_id;
//         $mAResults->$compTypID = $val->type_name;
//     }
//     $response->success = true;
//     $response->message = "Records retrieved successfully.";
//     $response->obj = $mAResults;
// } else{
//     $response->success = false;
//     $response->message = "No records found";
//     $response->obj = null;
// }
// echo(json_encode($response));
?>