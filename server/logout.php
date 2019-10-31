<?php

   if(!isset($_SESSION))
	   {
		   session_start();
	   }
       if(session_destroy())
       {
        echo "1";
       }
       else
       {
        echo "0";
       }
	 
	   
?>