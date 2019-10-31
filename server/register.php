<?php
include("dbConnect.php");
$fname=$_POST['firstName'];
$lname=$_POST['lastName'];
$email=$_POST['inputEmail'];
$password=$_POST['inputPassword'];
$sql1="select * from user where username='$email'";
$result1=mysqli_query($con,$sql1);

if(mysqli_num_rows($result1)>0)
{
    
  
echo "<script>
window.location.href='../register.html';
alert('The email you entered already have an account');
</script>";
}
else
{
 //$query = "SELECT user_id FROM user ORDER BY user_id DESC LIMIT 1"; 
 $query = "SELECT SUBSTRING(u.user_id, 5) as ID FROM user AS u ORDER BY CONVERT(SUBSTRING(u.user_id, 5),UNSIGNED INTEGER) DESC LIMIT 1";
    $result2=mysqli_query($con,$query);
    while ($row = mysqli_fetch_object($result2)) {
      $lastId =  $row->ID;
    }
   // list($prefix,$Id) = explode('USR_',$lastId );
   // echo $lastId;
    $Id = ($lastId+1);

    $new_id = 'USR_'.$Id;
   // echo $new_id;
  
   
$sql2="INSERT INTO user(user_id,firstName,lastName,username,password,user_type)VALUES ('$new_id','$fname','$lname','$email','$password','member')";

    if(mysqli_query($con,$sql2))
    {
    echo "<script>
    window.location.href='../login.html';
    alert('Congratulations! You Have Successfully Registered');
    </script>";

    }
    else
    {
    echo "error".mysqli_errno();

}
}

?>