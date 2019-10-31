<?php

//error_reporting(E_ERROR | E_PARSE);
include("dbConnect.php");

if ((isset($_FILES['image'])) && (isset($_POST['robotId'])))
{
    $imagePath = 'C:\\xampp\\htdocs\\XLR8\\images\\';
    $robotID = $_POST['robotId'];
    //echo $compEndDate;

    $image = $_FILES['image']['name'];
    if(move_uploaded_file($_FILES['image']['tmp_name'], $imagePath.$image))
    {
       // $conn = OpenCon();
       $conn =$con;
        $path = "/images/".$image;
        
        $sql = "UPDATE robot SET image = '$path' WHERE robot_id = '$robotID'";


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




?>