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

	$strSQL = "UPDATE user SET ";
    $strSQL .= " firstname='".$_POST["Editfirstname"]."',lastname='".$_POST["Editlastname"]."' ";
    $strSQL .= ",type='".$_POST["Edittype"]."',tel='".$_POST["Edittel"]."',status='".$_POST["Editstatususer"]."' ";
    $strSQL .= "WHERE username= '".$_POST["Editusername"]."' ";

    
	$query = mysqli_query($conn,$strSQL);    

        if($query) {
            echo json_encode(array('status' => '1','message'=> 'แก้ไข '.$_POST["Editusername"].' สำเร็จ'));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    
		

?>