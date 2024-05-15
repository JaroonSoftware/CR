<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT unitcode,unit as unitname,status as statusunit FROM `unit` ";
	$sql .= " where unitcode = '".$_POST['idcode']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"unitcode" => array(),
		"unitname" => array(),
		"statusunit" => array()
		
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['unitcode']=$row["unitcode"];
			$json_result['unitname']=$row["unitname"];
			$json_result['statusunit']=$row["statusunit"];
        
        echo json_encode($json_result);
		

?>