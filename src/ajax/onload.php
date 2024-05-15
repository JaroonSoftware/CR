<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

ob_clean();
session_start(); 
// if (!isset($_SESSION['loggedin'])) {
//     http_response_code(400);
//     echo json_encode(array('status' => '0', 'message' => 'Session not found.'));
//     die;
// } 
date_default_timezone_set('Asia/Bangkok');
include_once( dirname(__FILE__, 1)."/conn.php");
include_once( dirname(__FILE__, 1)."/authenticate.php"); 