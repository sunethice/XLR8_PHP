<?php
session_start();
include("dbConnect.php");
$fname=$_POST['fName'];
$lname=$_POST['lName'];
$team=$_POST['team'];
$dob=$_POST['dob'];
$address=$_POST['address'];
$contactNo=$_POST['contactNo'];
$institute=$_POST['institute'];
$id = $_SESSION['userdetails']['user_id'];
$query = "UPDATE user set firstName='$fname',lastName='$lname',team_name='$team',contact_no='$contactNo',address='$address',date_of_birth='$dob',institute_name='$institute' where user_id='$id'"; 
    
if(mysqli_query($con,$query))
{
    echo "<script>
    window.location.href='../index.html';
    </script>";
    $con->close();

}
else
{
    echo "<script>
    window.location.href='../index.html';
    alert('Something went wrong !');
    </script>";
    $con->close();

}


?>