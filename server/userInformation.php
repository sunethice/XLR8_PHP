<?php 

	// $DBConnect = @mysqli_connect("127.0.0.1", "root","", "xlr8_inventory")
	// 	Or die ("<p>Unable to connect to the database server.</p>". "<p>Error code ". mysqli_connect_errno().": ". mysqli_connect_error()). "</p>";			
	
	include("dbConnect.php");
	$DBConnect= $con;
	$SQLstring = "SELECT username, firstName, lastName, user_type, team_Name, contact_no FROM user WHERE isRegistered = true";

	
	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the user table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";


	//echo "<H3>Requests for Registration</H3>";
	echo "<br><br>";
		
	echo "<table class='table table-hover' id='userRequestsTbl' width='100%'>";
	echo "<th>First Name</th><th>Last Name</th><th>Username</th><th>User Type</th><th>Team Name</th><th>Contact Number</th><th></th><th></th>";
	$row = mysqli_fetch_row($queryResult);
			
	
	while ($row) {							
		echo "<tr><td>{$row[1]}</td>";
		echo "<td>{$row[2]}</td>";											
		echo "<td>{$row[0]}</td>";
		echo "<td>{$row[3]}</td>";
		echo "<td>{$row[4]}</td>";
		echo "<td>{$row[5]}</td>";
		
		$username = $row[0];
				
		echo "<td><button id='delBtn' class='btn btn-danger' type='submit' onclick=\"deleteUserFromSystem('$username')\">Delete</button></td></tr>";
		$row = mysqli_fetch_row($queryResult);
	}
	echo "</table>";				
				
	mysqli_close($DBConnect);
?>