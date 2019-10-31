<?php 

if(isset($_REQUEST['value']))
{
	$robot_id = $_REQUEST['value'];		
	
	include("dbConnect.php");
	$DBConnect= $con;		
	
	$SQLstring = "DELETE FROM robot WHERE robot_id = '$robot_id'";

	
	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the robot table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";


	echo "Robot deleted with ID: $robot_id";			
				
	mysqli_close($DBConnect);
}
	
?>