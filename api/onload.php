<?php
ob_clean();
error_reporting(E_ALL);
ini_set('display_errors', 1); 
date_default_timezone_set('Asia/Bangkok');   

include_once( dirname(__FILE__, 1)."/conn.php");
include_once( dirname(__FILE__, 1)."/authenticate.php"); 