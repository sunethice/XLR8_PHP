<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");

if ((isset($_POST['name'])) && (isset($_POST['season'])) && (isset($_POST['maxWeight'])) && (isset($_POST['totalCost'])) && (isset($_POST['compEnteredDate'])) && (isset($_FILES['image'])))
{
    //$imagePath = 'C:\\xampp\\htdocs\\XLR8\\images\\';
    $pathBack = '/Applications/MAMP/htdocs/xlr8-frc/';
    $imagePath ='images/';
    $robotName = $_POST['name'];
    $season = $_POST['season'];
    $maxWeight = $_POST['maxWeight'];
    $maxCost = $_POST['totalCost'];
    $compEndDate = $_POST['compEnteredDate'];
    //echo $compEndDate;

    $image = $_FILES['image']['name'];
    if(move_uploaded_file($_FILES['image']['tmp_name'], $pathBack.$imagePath.$image))
    {
       // $conn = OpenCon();
       $conn=$con;
        $path = "/images/".$image;
        $endDate = date("Y-m-d", strtotime($compEndDate));
        $robotID = getID($conn);
        $sql = "INSERT INTO robot(robot_id, robot_name, season, max_weight, max_cost, competition_end_date, image)
        VALUES ('$robotID','$robotName','$season','$maxWeight','$maxCost','$endDate', '$path' )";
        if(mysqli_query($conn, $sql)){
            echo json_encode("true");
        } else{
            echo json_encode("false");
        }
        CloseCon($conn);
    }
}
else
{
    echo json_encode("passing error");
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

function getID($conn)
{
    $query = "select count(1) as count from robot";
    $queryResults = @mysqli_query($conn, $query)
    Or die ("<p>Unable to query the $TableName table.</p>"."<p>Error code ". mysqli_errno($conn). ": ".mysqli_error($DBConnect)). "</p>";
    $row = mysqli_fetch_row($queryResults);

    $idNo =  $row[0] + 1;
    $ID = "RBT_".$idNo;
    return $ID;

}


?>
