<?php

//$conn = OpenCon();
//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");
$conn = $con;
$query = "Select C.component_id, C.weight, C.cost, C.description, C.completion_status, CT.type_name from component C inner join component_type CT on C.type_id = CT.component_type_id where component_id not in (SELECT component_id FROM `robot_component`)";
$result = $conn->query($query);
$resultArr = array();

if ($result->num_rows > 0) {

while ($row = $result->fetch_assoc())
{
    $tempArray = array(
        'component_id' => $row['component_id'],
        'type_name' => $row['type_name'],
        'weight'=> $row['weight'],
        'cost'=> $row['cost'],
        'description' => $row['description'],
        'completion_status' => $row['completion_status']
    );
    $resultArr[$row['component_id']] = $tempArray;
}
}
else {
    $resultArr[0] = "No Components";
}

$resultArray['components'] = $resultArr;
echo json_encode($resultArray);
CloseCon($conn);



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