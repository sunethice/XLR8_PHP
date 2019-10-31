<?php
// define('DB_USERNAME','root');
// define('DB_PASSWORD','root123');
// define('DB_HOST','127.0.0.1');
// define('DB_DATABASE','sql12291931');

  DEFINE('DB_USERNAME', 'sql12291931');
  DEFINE('DB_PASSWORD', 'uw6XYp3L8W');
  DEFINE('DB_HOST', 'sql12.freesqldatabase.com');
  DEFINE('DB_DATABASE', 'sql12291931');

  $con = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

  if (mysqli_connect_error()) {
    die('Connect Error ('.mysqli_connect_errno().') '.mysqli_connect_error());
  }


if(!$con)
{
    die ("Could not connect to database server" . mysqli_error());
}
else{
 //echo 'Connected successfully.';
}


?>
