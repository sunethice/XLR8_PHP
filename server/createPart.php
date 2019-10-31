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
  //This needs to change based on the local computer until the app is hosted

  $currentFolder = "/Applications/MAMP/htdocs/xlr8-frc/";

  $linkToResourceFiles = array();
  $image = "default_part.png";
  $folder = "images/";
  $resourceFolder = "resources/";
  $name = $_POST['partName'];
  $cost = $_POST['cost'];
  $weight = $_POST['weight'];
  $vendor = $_POST['vendor'];
  $qty = $_POST['qty'];
  $mainCatId = $_POST['mainCatId'];
  $subCatId = $_POST['subCatId'];
  $catId = $_POST['catId'];
  $linkToImageFile = $folder.$image;
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
    //echo "imaage before: ".$image;

    if(move_uploaded_file($_FILES['image']['tmp_name'], $currentFolder.$folder.$image))
    {
      $linkToImageFile = $folder.$image;
      //echo "imaage after: ".$folder.$image;
    }
  }

  $new_id = createUniqueId($con, 'part_master');

  if(isset($_FILES['resources']))
  {
    $count = count($_FILES['resources']['name']);
    $j = 0;

    $resourceFolder = $resourceFolder.$new_id."/";
    if(!mkdir($resourceFolder, 0777, true))
    {
      echo "Failed\n";
      die('Failed to create folder');
    }
    for ($i = 0; $i < $count; $i++) {
        if(move_uploaded_file($_FILES['resources']['tmp_name'][$i], $currentFolder.$resourceFolder.$_FILES['resources']['name'][$i]))
         {
           $linkToResourceFiles[$j] = $resourceFolder.$_FILES['resources']['name'][$i];
           $j++;
         }
    }
  }
  if(validateCategory($con, $mainCatId, $subCatId, $catId))
  {
    $query="INSERT INTO part_master(part_id,part_name,weight,cost,cat_id_level1,cat_id_level2,cat_id_level3,description,vendor_reference,total_qty,available_qty,other_dimensions,image)
    VALUES ('$new_id','$name','$weight','$cost','$mainCatId','$subCatId','$catId','$description','$vendor','$qty','$qty','$other','$linkToImageFile')";

      if(mysqli_query($con,$query))
      {
        $new_tran_id = createUniqueId($con, 'part_transaction');
        $today = date("Y-m-d");

        $query = "INSERT INTO part_transaction (transaction_id,part_id,user_id,transaction_type,qty,date)
                  VALUES ('$new_tran_id','$new_id','$userId','1','$qty','$today' )";

        if(mysqli_query($con,$query))
        {

          if(sizeOf($linkToResourceFiles)>0)
          {
            for($i=0; $i<sizeOf($linkToResourceFiles);$i++)
            {
              $new_res_id = createUniqueId($con, 'part_resources');
echo $linkToResourceFiles[$i];
              $query = "INSERT INTO part_resources (resource_id,part_id,resource_link)
                        VALUES ('$new_res_id','$new_id','$linkToResourceFiles[$i]' )";

              mysqli_query($con,$query);
            }
          }
          echo json_encode("true");
          $con->close();
        }
        else
        {
          echo json_encode("Error: Error in database insertion: Transacion table");
        }
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
