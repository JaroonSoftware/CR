<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT ctgy_id ,ctgy_name,status  FROM `category` ";
	$query = mysqli_query($conn,$sql);

		$json_result= array();
		
        while($row = $query->fetch_assoc()) {
			
            array_push($json_result,array("ctgy_id" => $row["ctgy_id"],"ctgy_name" => $row["ctgy_name"],"status"=>$row["status"]));
        }
        echo json_encode($json_result);
?>