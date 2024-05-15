<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT code,username,firstname,lastname,type FROM `user` ";
	$query = mysqli_query($conn,$sql);

		$json_result= array();
		
        while($row = $query->fetch_assoc()) {
			
            array_push($json_result,array("code" => $row["code"],"username" => $row["username"],"firstname" => $row["firstname"],"lastname" => $row["lastname"],"type"=>$row["type"]));
        }
        echo json_encode($json_result);
?>