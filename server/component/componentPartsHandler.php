<?php
error_reporting(E_ERROR | E_PARSE);
require_once('../config.php'); // by using my code
require_once('../dbConnect.php');
require_once('../xlr8_utils.php');
session_start();

$response = new stdClass();
if(isset($_POST['cAction'])){
    $componentPartHandler = new componentPartHandler($_POST['cAction'],$con);
    switch($_POST['cAction']){
        case "GET_PART_CATEGORIES":
            $componentPartHandler->cpGetPartCategories();
            break;
        case "GET_PARTS_FOR_SELECTED_CATEGORIES":
            $componentPartHandler->cpGetPartForCategories($_POST['cat1'],$_POST['cat2'],$_POST['cat3']);
            break;
        case "GET_COMPONENT_PARTS":
            $componentPartHandler->cpGetComponentParts($_POST['cCompID']);
            break;
        case "ADD_COMPONENT_PARTS":
            $componentPartHandler->cpAddComponentPart(
                $_POST['cCompID'],
                $_POST['cPartID'],
                $_POST['cAvlQty'],
                $_POST['cTotQty'],
                $_POST['cItemWeight'],
                $_POST['cItemCost']);
            break;
        case "REMOVE_COMPONENT_PART":
            $componentPartHandler->cpRemoveComponentPart(
                $_POST['cPartID'],
                $_POST['cCompID'],
                $_POST['cQty'],
                $_POST['cWeight'],
                $_POST['cCost'],
                $_POST['cIsAllQty']);
            break;
        case "REMOVE_ALL_COMPONENT_PARTS":
            $componentPartHandler->cpRemoveComponentPart(
                $_POST['cCompID']);
            break;
        case "GET_COMPONENT_NOTES":
            $componentPartHandler->cpGetComponentNotes(
                $_POST['cCompID']);
            break;
        case "ADD_COMPONENT_NOTES":
            $componentPartHandler->cpADDComponentNotes(
                $_POST['cCompID'],
                $_POST['cNote']);
            break;
    }
}
else{
    $response->success = false;
    $response->message = "Action Not Found.";
}


class componentPartHandler{
    private $con = null;
    public $dbInstance = null;
    function __construct($pAction,$con)
    {
        $this->con = $con;
        $this->dbInstance = DBManager::cpGetInstance();
    }

    function cpGetPartCategories(){
        error_reporting(E_ERROR | E_PARSE);
        $sql = "SELECT cat.category_id, cat.category_name, cat.level, cat.parent FROM category cat";

        $results = $this->dbInstance->cpGetResultAsObject($sql);
        $response = new stdClass();
        if($results != null){
            $mAResults = new stdClass();
            foreach($results as $k => $val)
            {
                $rowLevel = $val->level;
                $catID = $val->category_id;
                $mAResults->$rowLevel->$catID = $val;
            }
            $response->success = true;
            $response->message = "Records retrieved successfully.";
            $response->obj = $mAResults;
        } else{
            $response->success = false;
            $response->message = "No records found";
            $response->obj = null;
        }
        echo(json_encode($response));
    }

    function cpGetPartForCategories($pCat1,$pCat2,$pCat3){
        $sql = "SELECT prt_mst.part_id, prt_mst.part_name, prt_mst.weight, prt_mst.cost, prt_mst.description, prt_mst.available_qty ".
               "FROM part_master prt_mst WHERE ".
               "cat_id_level1 = '$pCat1' AND cat_id_level2 = '$pCat2' AND cat_id_level3 = '$pCat3'";

        $results = $this->dbInstance->cpGetResultAsObject($sql);
        $response = new stdClass();
        if($results != null){
            $response->success = true;
            $response->message = "Records retrieved successfully.";
            $response->obj = $results;
        } else{
            $response->success = false;
            $response->message = "No records found";
            $response->obj = null;
        }
        echo(json_encode($response));
    }

    function cpGetComponentParts($pCompID){
        $sql = "SELECT pm.part_id,pm.part_name,pm.weight,pm.cost,pm.description,pm.vendor_reference,pt.qty,pt.date FROM `part_master` pm, `part_transaction` pt, `part_component` pc WHERE pc.component_id = '$pCompID' AND pt.transaction_type=2 AND pc.trans_id = pt.transaction_id AND pt.part_id = pm.part_id";

        // $results = $dbInstance->cpGetResultAsObject($sql);
        $results = $this->dbInstance->cpGetResultAsObject($sql);
        $response = new stdClass();
        if($results != null){
            $response->success = true;
            $response->message = "Records retrieved successfully.";
            $response->obj = $results;
        } else{
            $response->success = false;
            $response->message = "Error executing operation(0).".mysqli_error($this->dbInstance->cpGetConInstance());
            $response->obj = null;
        }
        $response->request = $pCompID;
        echo(json_encode($response));
    }
    
    function cpAddComponentPart($pCompID,$pPartID,$pTrnsQty,$pTotQty,$pItemWeight,$pItemCost){
        $response = new stdClass();
        
        //update Part Master
        $sql = "UPDATE `part_master` SET `available_qty`= `available_qty` - $pTrnsQty WHERE `part_id`='$pPartID'";
        $userId = $_SESSION['userdetails']['user_id'];
        // echo  $userId;die;
        if($this->dbInstance->cpDBQuery($sql)){
            $sql = "SELECT trans_id FROM part_component WHERE  `part_id`='$pPartID' AND `component_id`='$pCompID'";
            $results = $this->dbInstance->cpGetResultAsObject($sql);
            $mTransID = "";
            if(sizeof($results)>0){
                
                foreach($results as $k => $val)
                {
                    $mTransID = $val->trans_id;
                    break;
                }
                $sql = "UPDATE part_transaction SET `qty`=`qty`+$pTrnsQty, `user_id`='$userId', `date`= NOW() ".
                       "WHERE `transaction_id`='$mTransID'";
                if($this->dbInstance->cpDBQuery($sql)){
                    $sql = "UPDATE component SET `weight`=`weight`+ ($pItemWeight*$pTrnsQty),`cost`= `cost`+ ($pItemCost*$pTrnsQty) WHERE `component_id`='$pCompID'";
                    if($this->dbInstance->cpDBQuery($sql)){
                        
                        $response->success = true;
                        $response->message = "Records updated successfully.";
                        $response->obj = null;
                        $response->requestCompID = $pCompID;
                        $response->requestPartID = $pPartID;
                    }
                    else{
                        $response->success = false;
                        $response->message = "Error executing operation(0).".mysqli_error($this->dbInstance->cpGetConInstance());
                    }
                }
                else{
                    // $this->dbInstance->cpRollBack();
                    $response->success = false;
                    $response->message = "Error executing operation(1).".mysqli_error($this->dbInstance->cpGetConInstance());
                }
            }
            else{
                $mTransID = createUniqueId($this->dbInstance->cpGetConInstance(), 'part_transaction');
                $sql = "INSERT INTO part_transaction (`transaction_id`,`part_id`,`user_id`,`transaction_type`,`qty`,`date`) ".
                        "SELECT '$mTransID','$pPartID','$userId',keyword_id,$pTrnsQty,NOW() ".
                        "FROM keywords ".
                        "WHERE keyword_name LIKE '%RETRIEVE%' ";
                        // echo json_encode($sql);die;
                if($this->dbInstance->cpDBQuery($sql)){
                    $sql = "INSERT INTO part_component (part_id,component_id,trans_id) VALUES ('$pPartID','$pCompID','$mTransID')";
                    if($this->dbInstance->cpDBQuery($sql)){
                        $sql = "UPDATE component SET `weight`=`weight`+ ($pItemWeight*$pTrnsQty),`cost`= `cost`+ ($pItemCost*$pTrnsQty) WHERE `component_id`='$pCompID'";
                        if($this->dbInstance->cpDBQuery($sql)){
                            
                            $response->success = true;
                            $response->message = "Records updated successfully.";
                            $response->obj = $mAResults;
                            $response->requestCompID = $pCompID;
                            $response->requestPartID = $pPartID;
                        }
                        else{
                            $response->success = false;
                            $response->message = "Error executing operation(2).".mysqli_error($this->dbInstance->cpGetConInstance());
                        }
                    }
                    else{
                        // $this->dbInstance->cpRollBack();
                        $response->success = false;
                        $response->message = "Error executing operation(3).".mysqli_error($this->dbInstance->cpGetConInstance());
                    }
                }
                else{
                    // $this->dbInstance->cpRollBack();
                    $response->success = false;
                    $response->message = "Error executing operation(4).".mysqli_error($this->dbInstance->cpGetConInstance());
                }
            }
        }
        else{
            $response->success = false;
            $response->message = "Error executing operation(5).".mysqli_error($this->dbInstance->cpGetConInstance());
        }
        echo(json_encode($response));
    }

    function cpRemoveComponentPart($pPartID, $pCompID, $pTrnsQty, $pItemWeight, $pItemCost, $pIsAllQty){
        $response = new stdClass();
        $sql = "SELECT trans_id FROM part_component WHERE  `part_id`='$pPartID' AND `component_id`='$pCompID'";
        $results = $this->dbInstance->cpGetResultAsObject($sql);
        $mTransID = "";
        $userId = $_SESSION['userdetails']['user_id'];
        if(sizeof($results)>0){
            foreach($results as $k => $val)
            {
                $mTransID = $val->trans_id;
                break;
            }
            if($pIsAllQty==="true"){
                $sql = "DELETE FROM part_component WHERE `trans_id`= '$mTransID'";
                if($this->dbInstance->cpDBQuery($sql)){
                    $sql = "DELETE FROM part_transaction WHERE `transaction_id`= '$mTransID'";
                }
                else{
                    $response->success = false;
                    $response->message = "Error executing operation(4).".mysqli_error($this->dbInstance->cpGetConInstance());
                }
            }
            else{
                $sql = "UPDATE part_transaction SET `qty`=`qty`- $pTrnsQty, `user_id`='$userId', `date`= NOW() ".
                       "WHERE `transaction_id`='$mTransID'";
            }
            if($this->dbInstance->cpDBQuery($sql)){
                $sql = "UPDATE component SET `weight`=`weight`- ($pItemWeight*$pTrnsQty),`cost`= `cost`- ($pItemCost*$pTrnsQty) WHERE `component_id`='$pCompID'";
                if($this->dbInstance->cpDBQuery($sql)){
                    $sql = "UPDATE `part_master` SET `available_qty`= `available_qty` + $pTrnsQty WHERE `part_id`='$pPartID'";
                    if($this->dbInstance->cpDBQuery($sql)){
                        $response->success = true;
                        $response->message = "Records updated successfully.";
                        $response->obj = $mAResults;
                        $response->request = $pCompID;
                    }
                    else{
                        $response->success = false;
                        $response->message = "Error executing operation(3).".mysqli_error($this->dbInstance->cpGetConInstance());
                    }
                }
                else{
                    $response->success = false;
                    $response->message = "Error executing operation(2).".mysqli_error($this->dbInstance->cpGetConInstance());
                }
            }
            else{
                // $this->dbInstance->cpRollBack();
                $response->success = false;
                $response->message = "Error executing operation(1).".mysqli_error($this->dbInstance->cpGetConInstance());
            }
        }
        else{
            $response->success = false;
            $response->message = "Error executing operation(0).".mysqli_error($this->dbInstance->cpGetConInstance());
        }
        echo(json_encode($response));
    }

    function cpRemoveAllComponentParts($pCompID){
        $response = new stdClass();
        $sql = "SELECT * FROM part_component WHERE `component_id`='$pCompID'";
        $results = $this->dbInstance->cpGetResultAsObject($sql);
        $userId = $_SESSION['userdetails']['user_id'];
        if(sizeof($results)>0){
            foreach($results as $k => $val)
            {
                $sql = "DELETE FROM part_component WHERE `trans_id`= '$val->trans_id'";
                if($this->dbInstance->cpDBQuery($sql)){
                    $sql = "SELECT qty FROM part_transaction WHERE `transaction_id`= '$val->trans_id'";
                    $results = $this->dbInstance->cpGetResultAsObject($sql);
                    $mTransQty = 0;
                    foreach($results as $key => $value)
                    {
                        $transQty = $value->qty;
                        break;
                    }
                    $sql = "DELETE FROM part_transaction WHERE `transaction_id`= '$val->trans_id'";
                    if($this->dbInstance->cpDBQuery($sql)){
                        $sql = "UPDATE `part_master` SET `available_qty`= `available_qty` + $mTransQty WHERE `part_id`='$val->part_id'";
                        if($this->dbInstance->cpDBQuery($sql)){
                            $response->success = true;
                            $response->message = "Records updated successfully.";
                            $response->obj = $mAResults;
                            $response->request = $pCompID;
                        }
                        else{
                            $response->success = false;
                            $response->message = "Error executing operation(3).".mysqli_error($this->dbInstance->cpGetConInstance());
                        }
                    }
                    else{
                        // $this->dbInstance->cpRollBack();
                        $response->success = false;
                        $response->message = "Error executing operation(1).".mysqli_error($this->dbInstance->cpGetConInstance());
                    }
                }
                else{
                    $response->success = false;
                    $response->message = "Error executing operation(4).".mysqli_error($this->dbInstance->cpGetConInstance());
                }
            }
        }
        else{
            $response->success = true;
            $response->message = "Component parts deleted successfully.";
        }
        echo(json_encode($response));
    }

    function cpADDComponentNotes($pCompID,$pNote){
        $userId = $_SESSION['userdetails']['user_id'];
        $mNoteID = createUniqueId($this->dbInstance->cpGetConInstance(), 'component_notes');
        $sql = "INSERT INTO `component_notes` (`note_id`, `component_id`, `user_id`, `condition_status`, `remarks`, `date_of_entry`) ".
               "VALUES ('$mNoteID','$pCompID','$userId','$pNote','',NOW())";
        $response = new stdClass();
        if($this->dbInstance->cpDBQuery($sql)){
            $sql = "SELECT * FROM `component_notes` WHERE `note_id`='$mNoteID'";
            $mAResults = $this->dbInstance->cpGetResultAsObject($sql);
            $response->success = true;
            $response->message = "Records updated successfully.";
            $response->obj = $mAResults;
        }
        else{
            $response->success = false;
            $response->message = "Error executing operation(4).".mysqli_error($this->dbInstance->cpGetConInstance());
            $response->obj = null;
        }
        echo(json_encode($response));
    }

    function cpGetComponentNotes($pCompID){
        $sql = "SELECT * FROM `component_notes` WHERE `component_id`='$pCompID'";
        $results = $this->dbInstance->cpGetResultAsObject($sql);
        $response = new stdClass();
        if($results != null){
            $response->success = true;
            $response->message = "Records retrieved successfully.";
            $response->obj = $results;
        } else{
            $response->success = false;
            $response->message = "Error executing operation(0).".mysqli_error($this->dbInstance->cpGetConInstance());
            $response->obj = null;
        }
        echo(json_encode($response));
    }
}
?>