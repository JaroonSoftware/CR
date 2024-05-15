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
    $password = password_hash($_POST['Addpassword'], PASSWORD_DEFAULT);
    $strSQL = "INSERT INTO user (`username`, `password`,`firstname`,`lastname`, `type`, `tel`, `status`,`date`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('".$_POST["Addusername"]."','".$password."','".$_POST["Addfirstname"]."','".$_POST["Addlastname"]."','".$_POST["Addtype"]."','".$_POST["AddTel"]."','Y','".date("Y-m-d H:i:s")."' ";
    $strSQL .= ")";	
    
	$query = mysqli_query($conn,$strSQL);    
    
    
    

        if($query) {
            echo json_encode(array('status' => '1','message'=> $_POST["Addfirstname"]));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Username ซ้ำ!'));
        }
    
		

?>