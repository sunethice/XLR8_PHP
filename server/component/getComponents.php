<?php
error_reporting(E_ERROR | E_PARSE);
// require_once('../config.php'); //by using my code
require_once('../dbConnect.php');
session_start();

$id = '';
if(isset($_POST['id'])){
    $id = $_POST['id'];
}
$response = new stdClass();
//$dbInstance = DBManager::cpGetInstance(); //by using my code
if(empty($id))
    $sql = "SELECT cmp.component_id,cmp.weight,cmp.cost,cmp.description,cmp.completion_status,cmp_tp.type_name FROM component cmp INNER JOIN component_type as cmp_tp ON cmp.type_id = cmp_tp.component_type_id";
else
    $sql = "SELECT *,cmp_tp.type_name FROM component cmp INNER JOIN component_type as cmp_tp ON cmp.type_id = cmp_tp.component_type_id WHERE component_id = '$id'";

//$results = $dbInstance->cpGetResultAsObject($sql); //by using my code
$result = $con->query($sql);
if ($result->num_rows > 0){
    $mAResults = new stdClass();
    while ($row = $result->fetch_object())
    {
        $compID = $row->component_id;
        $mAResults->$compID = $row;
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

//By using my code 

// if($results != null){
//     $mAResults = new stdClass();
//     foreach($results as $k => $val){
//         $compID = $val->component_id;
//         $mAResults->$compID = $val;
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




// $response = null;
// $conn = OpenCon();

// $sql = "SELECT * FROM `component_type`";
// $result = mysqli_query($conn, $sql);
// if($result->num_rows > 0){
//      $mAResults = new stdClass();
//     // // output data of each row
//     while ($row = $result->fetch_assoc())
//     {
//         $compID = $row['component_type_id'];
//         $mAResults->$compID = $row['type_name'];
//     }
//     $response->success = true;
//     $response->message = "Records retrieved successfully.";
//     $response->obj = $mAResults;
// } else{
//     $response->success = false;
//     $response->message = "No records found";
//     $response->obj = null;
// }
// CloseCon($conn);
// echo(json_encode($response));


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