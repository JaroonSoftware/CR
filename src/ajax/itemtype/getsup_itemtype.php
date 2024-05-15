<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);
	
	$sql = "SELECT typecode,typename as typename,status as statustype FROM `type` ";
	$sql .= " where typecode = '".$_POST['idcode']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"typecode" => array(),
		"typename" => array(),
		"statustype" => array()
		
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['typecode']=$row["typecode"];
			$json_result['typename']=$row["typename"];
			$json_result['statustype']=$row["statustype"];
        
        echo json_encode($json_result);
		

?>