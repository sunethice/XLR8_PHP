<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");

function getRobots($conn)
{
  $query = "SELECT * FROM robot";
  $result = $conn->query($query);
  $resultArr = array();

  if ($result->num_rows > 0) {

      // output data of each row
      while ($row = $result->fetch_assoc())
      {
        $tempArray = array(
                'name' => $row['robot_name'],
                'season' => $row['season'],
                'max_weight'=> $row['max_weight'],
                'max_cost'=> $row['max_cost'],
                'image' => $row['image'],
                'CreatedDate'=> date("Y-m-d", strtotime($row['CreatedDate'])),
        );
        $resultArr[$row['robot_id']] = $tempArray;
      }
  }
  else {
      $resultArr[0] = "No Robots";
  }
  return $resultArr;
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

//$conn = OpenCon();
$conn = $con;
$resultArray = array();
$resultArray['robots']= getRobots($con);
echo json_encode($resultArray);
CloseCon($con)



?>
