<?php
    /*------------ DB CONFIGURATIONS -----------*/
     define('DBUSER','root');
     define('DBPWD','root123');
     define('DBHOST','127.0.0.1');
     define('DBNAME','sql12291931');

//    define('DBUSER','sql12291931');
//    define('DBPWD','uw6XYp3L8W');
//    define('DBHOST','sql12.freesqldatabase.com');
//    define('DBNAME','sql12291931');

    
    class DBManager {

        // single instance of self shared among all instances
        private static $cInstance = null;
        private $dbCon = null;

        // db connection config vars
        private $cStrUser = DBUSER;
        private $cStrPass = DBPWD;
        private $cStrDbName = DBNAME;
        private $cStrDbHost = DBHOST;

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
    }
    
?>