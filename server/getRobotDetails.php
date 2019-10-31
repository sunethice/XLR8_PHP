<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");
$conn = $con;
if ((isset($_POST['robotId'])))
{
    $robotId = $_POST['robotId'];
    // $conn = OpenCon();
    $conn = $con;
    $query = "SELECT * FROM robot WHERE robot_id = '$robotId'";
    $result = $con->query($query);
    $resultArr = array();

    if ($result->num_rows > 0) {

        while ($row = $result->fetch_assoc())
        {
            $tempArray = array(
                'name' => $row['robot_name'],
                'season' => $row['season'],
                'max_weight'=> $row['max_weight'],
                'max_cost'=> $row['max_cost'],
                'comEndDate' => $row['competition_end_date'],
                'image' => $row['image'],
                'CreatedDate'=> date("Y-m-d", strtotime($row['CreatedDate'])),
            );
            $resultArr['robot'] = $tempArray;
        }
    }
    else {
        $resultArr['robot'] = "No Robots";
    }
    echo json_encode($resultArr);
    CloseCon($con);
}
else
{
    echo json_encode("passing error");
    CloseCon($con);
}



// function OpenCon()
//  {
//     $con=mysqli_connect("127.0.0.1","root","","xlr8_inventory");
//     // Check connection
//     if (mysqli_connect_errno())
//     {
//     echo "Failed to connect to MySQL: " . mysqli_connect_error();
//     }

//     return $con;
//  }

function CloseCon($con)
{
    $con -> close();
}

?>
