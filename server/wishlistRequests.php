<?php 
	// $DBConnect = @mysqli_connect("127.0.0.1", "root","", "xlr8_inventory")
	// 	Or die ("<p>Unable to connect to the database server.</p>". "<p>Error code ". mysqli_connect_errno().": ". mysqli_connect_error()). "</p>";			
	
	include("dbConnect.php");
	$DBConnect= $con;
	$SQLstring = "SELECT w.entry_id, w.user_id, w.date, u.firstName, u.lastName, w.part_name, w.weight, w.cost, w.quantity, w.vendor, w.vendor_reference 
					FROM wishlist w, user u 
					WHERE w.user_id = u.user_id AND w.confirmation_status = 'Pending'";

	
	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the wishlist/user table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";

	
	echo "<br><br>";
		
	echo "<table class='table table-hover' id='wishlistRequestsTbl' width='100%'>";
	echo "<th>Request Date</th><th>Requested By</th><th>Part Name</th><th>Weight</th><th>Cost</th><th>Quantity</th><th>Vendor</th><th>Vendor Reference</th><th></th><th></th>";
	$row = mysqli_fetch_row($queryResult);
			
	
	while ($row) {	
		
		$wishlistEntryId = $row[0];
		$firstName = $row[3];
		$lastName = $row[4];
		$fullName = $firstName." ".$lastName;
		
		echo "<tr><td>{$row[2]}</td>";				
		echo "<td>{$fullName}</td>";											
		echo "<td>{$row[5]}</td>";
		echo "<td>{$row[6]}</td>";
		echo "<td>{$row[7]}</td>";
		echo "<td>{$row[8]}</td>";
		echo "<td>{$row[9]}</td>";
		echo "<td>{$row[10]}</td>";
				
		
		echo "<td><button id='accBtn' class='btn btn-primary' type='submit' onclick=\"acceptRequest('$wishlistEntryId')\">Accept</button></td>";
		echo "<td><button id='rejBtn' class='btn btn-danger' type='submit' onclick=\"deleteRequest('$wishlistEntryId')\">Delete</button></td></tr>";
		$row = mysqli_fetch_row($queryResult);
	}
	echo "</table>";				
				
	mysqli_close($DBConnect);
?>