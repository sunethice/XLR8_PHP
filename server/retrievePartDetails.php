<?php
header("Access-Control-Allow-Origin: *");
require_once('dbConnect.php');

function getPartDetails($id, $con)
{
  $query = "SELECT * FROM part_master WHERE part_id= '$id' AND deleted = 0 ";

  $result = $con->query($query);
  $resultArr = array();

  if ($result->num_rows > 0) {

      // output data of each row
      while ($row = $result->fetch_assoc())
      {
        //$formattedImg = explode("htdocs", $row['image']);
        $tempArray = array(
                'name' => $row['part_name'],
                'weight' => $row['weight'],
                'cost'=> $row['cost'],
                'cat1' => $row['cat_id_level1'],
                'cat2' => $row['cat_id_level2'],
                'cat3' => $row['cat_id_level3'],
                'description'=> $row['description'],
                'other' => $row['other_dimensions'],
                'available_Quantity'=> $row['available_qty'],
                'total_Quantity'=> $row['total_qty'],
                'vendor_Reference'=> $row['vendor_reference'],
                'image' =>  $row['image']
        );
        $resultArr[$row['part_id']] = $tempArray;
        $id = $row['part_id'];
        $query_res = "SELECT * FROM part_resources WHERE part_id = '$id' ";
        $result_res = $con->query($query_res);
        $temp_res = array();
        if ($result_res->num_rows > 0)
        {
          $i=0;
          while ($row_res = $result_res->fetch_assoc())
          {
            $temp_res[$i] = $row_res['resource_link'];
            $i++;
          }
        }
        $resultArr[$row['part_id']]['resources'] = $temp_res;
        $resultArr[$row['part_id']]['notes'] = getNotes($id, $con);
      }
    }
    else
    {
        $resultArr[0] = "0 part results";
    }

    return $resultArr;
}

function getNotes($id, $con)
{
  $query = "SELECT N.note_id, U.firstName, U.lastName, N.condition_status, N.remarks, N.date_of_entry
            FROM part_notes N ,user U
            WHERE N.user_id = U.user_id
            AND N.part_id = '$id' ";
  $resArray = array();
  $result = $con->query($query);
  $resultArr = array();

  if ($result->num_rows > 0) {

      while ($row = $result->fetch_assoc())
      {
        $resArray[$row['note_id']] = array(
                'name' => $row['firstName']." ".$row['lastName'],
                'condition_status' => $row['condition_status'],
                'remarks' => $row['remarks'],
                'date_of_entry' => $row['date_of_entry']);
      }
  }
  return $resArray;
}

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

if(isset($_POST['id']))
{
  $id = $_POST['id'];
  if($id!="" && $id!=null)
  {
    $resultArr = getPartDetails($id, $con);
    $resultArr['cats'] = getCategories($con);
    echo json_encode($resultArr);
  }
  else
  {
    echo json_encode("Part Id is not specified");
  }
}
else
{
  echo json_encode("Part id is not set");
}
?>
