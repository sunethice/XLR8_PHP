<?php 

if(isset($_REQUEST['value']))
{
	$part_id = $_REQUEST['value'];		
	
	include("dbConnect.php");
	$DBConnect= $con;		
	
	$SQLstring = "UPDATE part_master SET deleted = 0 WHERE part_id = '$part_id'";

	
	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the part_master table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";


	echo "Deletion Request Rejected for Part: $part_id";			
				
	mysqli_close($DBConnect);
}
	
?>