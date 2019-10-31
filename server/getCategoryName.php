<?php
header("Access-Control-Allow-Origin: *");
require_once('dbConnect.php');

function getCatName($id, $con)
{
  $query = "SELECT category_name FROM category WHERE category_id= '$id' ";

  $result = $con->query($query);
  $resultArr = array();

  if ($result->num_rows > 0) {

      // output data of each row
      while ($row = $result->fetch_assoc())
      {
        $resultArr['name'] = $row['category_name'];
      }
    }
    else {
        $resultArr['name'] = "No results for this id";
    }
    return $resultArr;
}

if(isset($_POST['id']))
{
  $id = $_POST['id'];
  if($id!="" && $id!=null)
  {
    $resultArr = getCatName($id, $con);
    echo json_encode($resultArr);
  }
  else
  {
    echo json_encode("Category Id is not specified");
  }
}
else
{
  echo json_encode("Category id is not set");
}
?>
