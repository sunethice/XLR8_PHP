<?php  
//export.php  
include("dbConnect.php");
$connect = $con;
$output = '';
if(isset($_POST["export"]))
{
 $query = "SELECT part_name,weight,cost,description,available_qty,vendor_reference,total_qty FROM part_master";
 $result = mysqli_query($connect, $query);
 if(mysqli_num_rows($result) > 0)
 {
  $output .= '
    <table class="table" bordered="1">  
    <tr>  
        <th>Name</th>  
        <th>Weight</th>  
        <th>Cost</th>  
        <th>Description</th>
        <th>Vendor</th>
        <th>Total quantity</th>
        <th>Available quantity</th>
    </tr>
  ';
  while($row = mysqli_fetch_array($result))
  {
   $output .= '
        <tr>  
            <td>'.$row["part_name"].'</td>  
            <td>'.$row["weight"].'</td>  
            <td>'.$row["cost"].'</td>  
            <td>'.$row["description"].'</td>  
            <td>'.$row["vendor_reference"].'</td>
            <td>'.$row["total_qty"].'</td>
            <td>'.$row["available_qty"].'</td>
        </tr>
   ';
  }
  $output .= '</table>';
  header('Content-Type: application/xls');
  header('Content-Disposition: attachment; filename=partdetails.xls');
  echo $output;
 }
}
?>