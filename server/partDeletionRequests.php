<?php 		
	
	include("dbConnect.php");
	$DBConnect= $con;
	$SQLstring = "SELECT part_id, part_name, weight, cost, description, vendor_reference, availability FROM part_master WHERE deleted = 1";

	
	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the part_master table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";

	
	echo "<br><br>";
		
	echo "<table class='table table-hover' id='partDeletionRequestsTbl' width='100%'>";
	echo "<th>Part Name</th><th>Weight</th><th>Cost</th><th>Description</th><th>Vendor Reference</th><th>Availability</th><th></th><th></th>";
	$row = mysqli_fetch_row($queryResult);
			
	
	while ($row) {							
		echo "<tr><td>{$row[1]}</td>";
		echo "<td>{$row[2]}</td>";											
		echo "<td>{$row[3]}</td>";
		echo "<td>{$row[4]}</td>";
		echo "<td>{$row[5]}</td>";
		echo "<td>{$row[6]}</td>";
		
		$part_id = $row[0];
		
		echo "<td><button id='accBtn' class='btn btn-primary' type='submit' onclick=\"acceptDeletionRequest('$part_id')\">Accept</button></td>";
		echo "<td><button id='rejBtn' class='btn btn-danger' type='submit' onclick=\"rejectDeletionRequest('$part_id')\">Reject</button></td></tr>";
		$row = mysqli_fetch_row($queryResult);
	}
	echo "</table>";				
				
	mysqli_close($DBConnect);
?>