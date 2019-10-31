<?php
session_start();
include("dbConnect.php");
$id = $_SESSION['userdetails']['user_id'];
//echo $id;
$query = "SELECT firstName,lastName,username,team_name,contact_no,address,institute_name,date_of_birth FROM user where user_id= '$id' "; 
$result=mysqli_query($con,$query);
$row=mysqli_fetch_array($result);
//echo $row['firstName']; 
//echo $row['user_type']; 
  if(mysqli_num_rows($result) == 1)
  {
    $userDetail["fName"]= $row['firstName'];
    $userDetail["lName"]= $row['lastName'];
    $userDetail["username"]= $row['username'];
    $userDetail["team"]= $row['team_name'];
    $userDetail["contactNo"]= $row['contact_no'];
    $userDetail["address"]= $row['address'];
    $userDetail["institute"]= $row['institute_name'];
    $userDetail["dob"]= $row['date_of_birth'];
    echo json_encode($userDetail);
    $con->close();
  }
  else
  {
    echo json_encode("No User Found");
    $con->close();
  }




?>