<?php
require_once('dbConnect.php');


function createUniqueId($con, $tableName)
{
  switch($tableName)
  {
    case 'part_master': $ext = "PRT_";
                        $query = "SELECT P.part_id
                                  FROM part_master AS P
                                  ORDER BY CONVERT(SUBSTRING(P.part_id, 5),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;

    case 'part_history':$ext = "HIS_";
                        $query = "SELECT H.history_id
                                  FROM part_history AS H
                                  ORDER BY CONVERT(SUBSTRING(H.history_id, 5),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;

    case 'part_transaction':
                        $ext = "TRN_";
                        $query = "SELECT T.transaction_id
                                FROM part_transaction AS T
                                ORDER BY CONVERT(SUBSTRING(T.transaction_id, 5),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;

    case 'part_resources':
                        $ext = "RES_";
                        $query = "SELECT R.resource_id
                                FROM part_resources AS R
                                ORDER BY CONVERT(SUBSTRING(R.resource_id, 5),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;

    case 'part_notes':
                        $ext = "PN_";
                        $query = "SELECT N.note_id
                                FROM part_notes AS N
                                ORDER BY CONVERT(SUBSTRING(N.note_id, 4),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;

    case 'category':
                        $ext = "CAT_";
                        $query = "SELECT C.category_id
                                  FROM category AS C
                                  ORDER BY CONVERT(SUBSTRING(C.category_id, 5),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;
                      
    case 'component':
                        $ext = "CMP_";
                        $query = "SELECT C.component_id
                                  FROM component AS C
                                  ORDER BY CONVERT(SUBSTRING(C.component_id, 5),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;
                      
    case 'component_type':
                        $ext = "CTYP_";
                        $query = "SELECT C.component_type_id
                                  FROM component_type AS C
                                  ORDER BY CONVERT(SUBSTRING(C.component_type_id, 6),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;
                      
    case 'component_notes':
                        $ext = "CN_";
                        $query = "SELECT C.note_id
                                  FROM component_notes AS C
                                  ORDER BY CONVERT(SUBSTRING(C.note_id, 4),UNSIGNED INTEGER) DESC LIMIT 1";
                        break;

    default:            $ext =null;
                        $query=null;
                        break;
  }

  $result=mysqli_query($con,$query);
  $lastId = $ext."_0";
  while ($row = mysqli_fetch_array($result))
  {
     $lastId =  $row[0];
  }
    $idArr = explode('_',$lastId );

  $id = ($idArr[1]+1);
  return $ext.$id;
}

function validateCategory($con, $mainCatId, $subCatId, $catId)
{
  $valid = false;
  $query = "SELECT parent FROM category WHERE category_id= '$catId' ";
  $result = mysqli_query($con,$query);
  while($row = mysqli_fetch_assoc($result))
  {
    if(strcmp($row['parent'],$subCatId)==0)
    {
      $valid = true;
    }
  }
  if($valid)
  {
    $query = "SELECT parent FROM category WHERE category_id= '$subCatId' ";
    $result = mysqli_query($con,$query);
    while($row = mysqli_fetch_assoc($result))
    {
      if(strcmp($row['parent'],$mainCatId)==0)
      {
        $valid = true;
        return $valid;
      }
    }
    $valid = false;
  }
  return $valid;
}

 ?>
