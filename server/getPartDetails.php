<?php
require_once('dbConnect.php');

function getCategories($con)
{
  $query = "SELECT * FROM category";
  $result = $con->query($query);
  $resultArr = array();

  if ($result->num_rows > 0) {

      // output data of each row
      while ($row = $result->fetch_assoc())
      {
        $tempArray = array(
                'id' => $row['category_id'],
                'name' => $row['category_name'],
                'level' => $row['level'],
                'parent'=> $row['parent']
        );
        $resultArr[$row['category_id']] = $tempArray;
      }
  }
  else {
      $resultArr[0]= "0 results";
  }
  return $resultArr;
}

function getParts($con)
{
  $query = "SELECT * FROM part_master  WHERE deleted = 0";
  $result = $con->query($query);
  $resultArr = array();

  if ($result->num_rows > 0) {

      // output data of each row
      while ($row = $result->fetch_assoc())
      {
        $tempArray = array(
                'name' => $row['part_name'],
                'weight' => $row['weight'],
                'cost'=> $row['cost'],
                // 'cat1' => $row['cat_id_level1'],
                // 'cat2' => $row['cat_id_level2'],
                // 'cat3' => $row['cat_id_level3'],
                'description'=> $row['description'],
                'total_Quantity' => $row['total_qty'],
                'available_Quantity'=> $row['available_qty'],
                'vendor_Reference'=> $row['vendor_reference']
        );
        $resultArr[$row['part_id']] = $tempArray;
      }
  }
  else {
      $resultArr[0] = "0 part results";
  }
  return $resultArr;
}

$resultArray = array();
$resultArray['categories'] = getCategories($con);
$resultArray['parts']= getParts($con);
echo json_encode($resultArray);
$con->close();



 ?>
