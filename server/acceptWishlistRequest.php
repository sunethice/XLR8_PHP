<?php 

if(isset($_REQUEST['value']))
{
	$entry_id = $_REQUEST['value'];		
	
	include("dbConnect.php");
	$DBConnect= $con;		
	
	$SQLstring = "UPDATE wishlist SET confirmation_status = 'Approved' WHERE entry_id = '$entry_id'";

	
	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the wishlist table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";


	echo "Wishlist Request Approved - Wishlist Entry ID: $entry_id";			
				
	mysqli_close($DBConnect);
}
	
?>