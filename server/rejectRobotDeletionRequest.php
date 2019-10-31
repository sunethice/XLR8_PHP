<?php 

if(isset($_REQUEST['value']))
{
	$robot_id = $_REQUEST['value'];		
	
	include("dbConnect.php");
	$DBConnect= $con;		
	
	$SQLstring = "UPDATE robot SET delete_request = 0 WHERE robot_id = '$robot_id'";

	
	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the robot table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";


	echo "Deletion Request Rejected for Robot: $entry_id";			
				
	mysqli_close($DBConnect);
}
	
?>