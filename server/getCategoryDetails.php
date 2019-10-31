<?php
header("Access-Control-Allow-Origin: *");
require_once('dbConnect.php');

function getCategories($id, $con)
{
  if(strcmp($id,"0")==0)
  {
    $query = "SELECT * FROM category WHERE level = 1";
  }
  else
  {
    $query = "SELECT * FROM category WHERE parent= '$id' ";
  }

  $result = $con->query($query);

  $resultArr = array();

  if ($result->num_rows > 0) {

      // output data of each row
      while ($row = $result->fetch_assoc())
      {
        //$formattedImg = explode("htdocs", $row['image']);
        $tempArray = array(
                'name' => $row['category_name'],
                'level' => $row['level'],
                'parent'=> $row['parent'],
                'image' => $row['image']
        );
        $resultArr[$row['category_id']] = $tempArray;
      }
  }
  else {
    $query = "SELECT * FROM category WHERE category_id= '$id' ";
    $result = $con->query($query);
    $level = 0;
    if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc())
      {
        $level = $row['level'];
      }
    }

    if(strcmp($level,'3')==0)
    {
      $query = "SELECT * FROM part_master WHERE cat_id_level3= '$id' ";
      $result = $con->query($query);
      $resultArr = array();

      if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc())
        {
          //$formattedImg = explode("htdocs", $row['image']);
          $tempArray = array(
                  'name' => $row['part_name'],
                  'image' => $row['image']
          );
          $resultArr[$row['part_id']] = $tempArray;
        }
      }
      else
      {
          $resultArr = "No parts found";
      }
    }
    else
    {
      $resultArr = "No parts found";
    }
  }
  return $resultArr;
}



if(isset($_POST['id']))
{
  $id = $_POST['id'];
  if($id!="" && $id!=null)
  {
    $resultArr = getCategories($id, $con);
    echo json_encode($resultArr);
  }
  else
  {
    echo json_encode("No parts found");
  }
}
else
{
  echo json_encode("No parts found");
}
?>
