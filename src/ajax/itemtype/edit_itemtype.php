<?php
	session_start();
	include('../conn.php');	
    date_default_timezone_set("Asia/Bangkok");
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$strSQL = "UPDATE `type` SET ";
    $strSQL .= " typename='".$_POST["Edittypename"]."',status='".$_POST["Editstatustype"]."' ";
    $strSQL .= ",e_date='".date("Y-m-d")."',e_time='".date("H:i:s")."',e_user='0' ";
    $strSQL .= "WHERE typecode= '".$_POST["Edittypecode"]."' ";

    
	$query = mysqli_query($conn,$strSQL);    

        if($query) {
            echo json_encode(array('status' => '1','message'=> $_POST["Edittypename"]));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    
		

?>