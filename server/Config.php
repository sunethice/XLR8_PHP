<?php
/**
 * ------------ DB CONFIGURATIONS -----------
 */

define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'root123');
define('DB_HOST', '127.0.0.1');
define('DB_DATABASE', 'sql12291931');
    
class DBManager {

    // single instance of self shared among all instances
    private static $cInstance = null;
    private $dbCon = null;

    // db connection config vars
    private $cStrUser = DB_USERNAME;
    private $cStrPass = DB_PASSWORD;
    private $cStrDbName = DB_DATABASE;
    private $cStrDbHost = DB_HOST;

    //Static method that returns an instance of the object if not exist
    public static function cpGetInstance() {
        if (!self::$cInstance instanceof self) 
            self::$cInstance = new self;
        return self::$cInstance;
    }

    // The clone and wakeup methods prevents external instantiation of copies of the Singleton class,
    // thus eliminating the possibility of duplicate objects.
    public function __clone() {
        trigger_error('Clone is not allowed.', E_USER_ERROR);
    }
    public function __wakeup() {
        trigger_error('Deserializing is not allowed.', E_USER_ERROR);
    }

    private function __construct(){
        $this->dbCon = new mysqli($this->cStrDbHost, $this->cStrUser, $this->cStrPass, $this->cStrDbName);
        if (mysqli_connect_error())
            exit('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
    }
    
    public function cpDBQuery($query)
    {
        if(mysqli_query($this->dbCon,$query)){
            return true;
        }else{
            return false;
        }
    }
    
    public function cpGetResultAsArray($query) 
    {
        $result = mysqli_query($this->dbCon, $query);
        if ($result->num_rows > 0){
            $mAResults = array();
            while ($row = $result->fetch_assoc())
            {
                $mAResults[] = $row;
            }
            return $mAResults;
        } else{
            return null;
        }
    }

    public function cpGetResultAsObject($query) 
    {
        $result = mysqli_query($this->dbCon, $query);
        if ($result->num_rows > 0){
            $mObjResults = new stdClass();
            $count = 0;
            while ($row = $result->fetch_object())
            {
                $mObjResults->$count = $row;
                $count++;
            }
            return $mObjResults;
        } else{
            return null;
        }
    }

    public function cpGetConInstance(){
        return $this->dbCon;
    }

    public function cpRollBack(){
        mysqli_rollback($this->dbCon);
    }

    public function getNumOfRows($result){
        return mysqli_fetch_array($result)['num']>0;
    }

    public function getSQLError(){
        return mysql_error($this->dbCon);
    }
}
    
?>