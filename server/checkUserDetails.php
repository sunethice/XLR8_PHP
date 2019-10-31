<?php
session_start();
$userDetail= array();
if(!empty($_SESSION['userdetails']['username']))
{

 $username=$_SESSION['userdetails']['username'];
 $fname=$_SESSION['userdetails']['fName'];
 $userType=$_SESSION['userdetails']['userType'];

$userDetail["username"]=$username;
$userDetail["fName"]=$fname;
$userDetail["userType"]=$userType;
 echo json_encode($userDetail);

}
else
{
 echo json_encode("No User Found");
}
?>