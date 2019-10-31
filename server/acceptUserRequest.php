<?php 

if(isset($_REQUEST['value']))
{
	$username = $_REQUEST['value'];	
	
	
// $DBConnect = @mysqli_connect("127.0.0.1", "root","", "xlr8_inventory")
	// 	Or die ("<p>Unable to connect to the database server.</p>". "<p>Error code ". mysqli_connect_errno().": ". mysqli_connect_error()). "</p>";			
	
	include("dbConnect.php");
	$DBConnect= $con;
	$SQLstring = "UPDATE user SET isRegistered = true WHERE username = '$username'";

	
	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the user table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";


	echo "User Request Accepted for: $username";			
				
	mysqli_close($DBConnect);
}
	
?>