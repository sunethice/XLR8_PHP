<?php
include("server/dbConnect.php");
if(!isset($_GET["token"])){
    exit("can't find page");
}
$token=$_GET["token"];
$sql= "SELECT email from reset_password where token='$token'";
$result=mysqli_query($con,$sql);

if(mysqli_num_rows($result) == 0)
{
    
    exit("can't find page with token given");
}
if(isset($_POST["password"]))
{
    $password = $_POST["password"];
    $row = mysqli_fetch_array($result);
    $email = $row["email"];

    $sql2 = "UPDATE user set password = '$password' where username = '$email'";
    if(mysqli_query($con,$sql2))
    {
      $sql3 = mysqli_query($con,"DELETE FROM reset_password where token='$token'");
      if($sql3)
      {
      echo "<script>
      window.location.href='login.html';
      alert('Password updated');
      </script>";

      }
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>XLR8 - Forgot Password</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">
  <script src="forgotPassword.js"></script>

</head>

<body class="bg-dark">

  <div class="container">
    <div class="card card-login mx-auto mt-5">
      <div class="card-header">Reset Password</div>
      <div class="card-body">
        
        <form method="POST">
          <div class="form-group">
            <div class="form-label-group">
              <input type="password" id="password" name="password" class="form-control" placeholder="Enter new password" required="required" autofocus="autofocus" minLength="8">
              <label for="inputEmail">Enter new password</label>
            </div>
          </div>
          <input type="submit" class="btn btn-primary btn-block" value="Reset Password">
  
        </form>
       
      </div>
    </div>
  </div>

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
  <script src="forgotPassword.js"></script>

</body>

</html>
