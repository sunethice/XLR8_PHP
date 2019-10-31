<?php
session_start();
include("dbConnect.php");
if (isset($_POST['username'])&& isset($_POST['password']) )
{
$userName = $_POST['username'];
$password = $_POST['password'];
//echo $userName."-".$password."-";


$query = "SELECT user_id,firstName,user_type,isRegistered FROM user where username='$userName' and password= '$password' ";
$result=mysqli_query($con,$query);
$row=mysqli_fetch_array($result);
//echo $row['firstName'];
//echo $row['user_type'];
  if(mysqli_num_rows($result) == 1)
  {
    if($row['isRegistered']==true)
    {
    $_SESSION['userdetails']['user_id']= $row['user_id'];
    $_SESSION['userdetails']['username']= $userName;
    $_SESSION['userdetails']['fName']= $row['firstName'];
    $_SESSION['userdetails']['userType']= $row['user_type'];
    header("location:../index.html");
    }
    else
    {
      echo "<script>
      window.location.href='../login.html';
      alert('Your details are still under review');
      </script>";
    }
  }
  else
  {
    echo "<script>
    window.location.href='../login.html';
    alert('incorrect login details');
    </script>";

  }

}
else
{
  echo "<script>
    window.location.href='../login.html';
    alert('Please enter all the fields');
    </script>";
}



?>
