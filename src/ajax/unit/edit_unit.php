<?php
    // header('Content-Type: application/json');
    header('Content-Type: text/html; charset=utf-8');
	session_start();
	include('../conn.php');	
    date_default_timezone_set("Asia/Bangkok");
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$strSQL = "UPDATE unit SET ";
    $strSQL .= " unit='".$_POST["Editunitname"]."',status='".$_POST["Editstatusunit"]."' ";
    $strSQL .= ",e_date='".date("Y-m-d")."',e_time='".date("H:i:s")."',e_user='0' ";
    $strSQL .= "WHERE unitcode= '".$_POST["Editunitcode"]."' ";

    
	$query = mysqli_query($conn,$strSQL);    

        if($query) {
            echo json_encode(array('status' => '1','message'=> $_POST["Editunitname"]));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    
		

?>