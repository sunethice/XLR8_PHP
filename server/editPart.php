<?php
header("Access-Control-Allow-Origin: *");
require_once('xlr8_utils.php');
require_once('dbConnect.php');
session_start();

$_SESSION['userdetails']['userId']="USR_1";
$userId = $_SESSION['userdetails']['userId'];

if( (isset($_POST['partName'])) && (isset($_POST['weight'])) && (isset($_POST['cost'])) && (isset($_POST['vendor'])) &&
   (isset($_POST['qty'])) )
{
  //echo "hi";
  $image = "default_part.png";
  $folder = "/Applications/MAMP/htdocs/xlr8-frc/images/";
  $id = $_POST['partId'];
  $name = $_POST['partName'];
  $cost = $_POST['cost'];
  $weight = $_POST['weight'];
  $vendor = $_POST['vendor'];
  $qty = $_POST['qty'];
  $mainCatId = $_POST['mainCatId'];
  $subCatId = $_POST['subCatId'];
  $catId = $_POST['catId'];
  $linkToImageFile = null;
  //echo json_encode("true");
  //echo $name.",".$cost.",".$weight.",".$vendor.",".$qty.",".$catName;
  if(isset($_POST['other']))
  {
    $other = $_POST['other'];
   // echo $other;
  }
  else
  {
    $other = "";
  }
  if(isset($_POST['description']))
  {
    $description = $_POST['description'];
   // echo $description;
  }
  else
  {
    $description = "";
  }
  if(isset($_FILES['image']))
  {
    $image = $_FILES['image']['name'];
    if(move_uploaded_file($_FILES['image']['tmp_name'], $folder.$image))
    {
      $linkToImageFile = $folder.$image;
    }
  }
  $linkToImageFile = $folder.$image;
  //$new_id = createUniqueId($con, 'part_master');

  if(validateCategory($con, $mainCatId, $subCatId, $catId))
  {
    $query="UPDATE part_master
            SET part_name = '$name' ,weight = '$weight' ,cost = '$cost' ,cat_id_level1= '$mainCatId' ,
                cat_id_level2= '$subCatId',cat_id_level3 = '$catId',description = '$description',vendor_reference = '$vendor',
                other_dimensions = '$other'
            WHERE part_id = '$id' ";
        
      if(mysqli_query($con,$query))
      {
          echo json_encode("true");
          $con->close();
      }
      else
      {
        echo json_encode("Error: Error in database insertion: Part table");
      }
  }
  else
  {
    echo json_encode("Error: Error in category hierarchy");
  }
}
else {
  echo json_encode("Error: Values are not set");
}

 ?>
