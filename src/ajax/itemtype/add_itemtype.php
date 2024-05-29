<?php
    // 
	session_start();
	include('../conn.php');	
    date_default_timezone_set("Asia/Bangkok");
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

    $strSQL = "INSERT INTO `type` (`typename`, `status`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('".$_POST["Addtypename"]."','Y' ";
    $strSQL .= ")";	
    
	$query = mysqli_query($conn,$strSQL);   
    

        if($query) {
            echo json_encode(array('status' => '1','message'=> $_POST["Addtypename"]));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    
		

?>