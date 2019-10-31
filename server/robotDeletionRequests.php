<?php

	include("dbConnect.php");
	$DBConnect= $con;
	$SQLstring = "SELECT robot_id, robot_name, season, max_weight, max_cost, competition_end_date, CreatedDate FROM robot WHERE delete_request = 1";


	$queryResult = @mysqli_query($DBConnect, $SQLstring)
		Or die ("<p>Unable to query the robot table.</p>"."<p>Error code ". mysqli_errno($DBConnect). ": ".mysqli_error($DBConnect)). "</p>";


	echo "<br><br>";

	echo "<table class='table table-hover' id='robotDeletionRequestsTbl' width='100%'>";
	echo "<th>Robot Name</th><th>Season</th><th>Max Weight</th><th>Max Cost</th><th>Competition End Date</th><th>Creation Date</th><th></th><th></th>";
	$row = mysqli_fetch_row($queryResult);


	while ($row) {
		echo "<tr><td>{$row[1]}</td>";
		echo "<td>{$row[2]}</td>";
		echo "<td>{$row[3]}</td>";
		echo "<td>{$row[4]}</td>";
		echo "<td>{$row[5]}</td>";
		echo "<td>{$row[6]}</td>";

		$robot_id = $row[0];

		echo "<td><button id='accBtn' class='btn btn-primary' type='submit' onclick=\"acceptDeletionRequest('$robot_id')\">Accept</button></td>";
		echo "<td><button id='rejBtn' class='btn btn-danger' type='submit' onclick=\"rejectDeletionRequest('$robot_id')\">Reject</button></td></tr>";
		$row = mysqli_fetch_row($queryResult);
	}
	echo "</table>";

	mysqli_close($DBConnect);
?>
