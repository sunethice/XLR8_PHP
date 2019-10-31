<?php
include("server/dbConnect.php");
$email=$_POST['email'];
//echo "email"+$email;
$sql1="select * from user where username='$email'";
$result1=mysqli_query($con,$sql1);

if(!mysqli_num_rows($result1)>0)
{
    
echo json_encode("No User Found");
}
else
{
 $token = uniqid(true);
 $sql2= "INSERT INTO reset_password(token,email) VALUES('$token','$email')";
 if(mysqli_query($con,$sql2))
 {
     $url = "http://" . $_SERVER["HTTP_HOST"] . dirname($_SERVER["PHP_SELF"]) . "/resetPassword.php?token=$token";

    $EmailFrom = "buygemslanka@gmail.com";
    $Subject = "Password Reset Link for XLR8 inventory system";
    $EmailTo = Trim(stripslashes($email)); 
   

    // prepare email body text
    $Body = "Click <a href='$url'>this link</a> to reset password";
    // send email 
    $success = mail($EmailTo, $Subject, $Body, "From: <$EmailFrom>");
    if($success)
    {
    echo json_encode("Success");
    }
    else{
        echo json_encode("Fail");   
    }
 }
}

?>