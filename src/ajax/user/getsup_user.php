<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT username,firstname,lastname,`type`,tel,status as statususer FROM `user` ";
	$sql .= " where username = '".$_POST['idcode']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"username" => array(),
		"firstname" => array(),
		"lastname" => array(),
		"type" => array(),
		"tel" => array(),
		"statususer" => array()
		
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['username']=$row["username"];
			$json_result['firstname']=$row["firstname"];
			$json_result['lastname']=$row["lastname"];
			$json_result['type']=$row["type"];
			$json_result['tel']=$row["tel"];
			$json_result['statususer']=$row["statususer"];
        
        echo json_encode($json_result);
		

?>