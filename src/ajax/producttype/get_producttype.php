<?php
	session_start();
	include('../conn.php');
	// 
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT prodty_id ,prodty_name,status  FROM `product_type` ";
	$query = mysqli_query($conn,$sql);

		$json_result= array();
		
        while($row = $query->fetch_assoc()) {
			
            array_push($json_result,array("prodty_id" => $row["prodty_id"],"prodty_name" => $row["prodty_name"],"status"=>$row["status"]));
        }
        echo json_encode($json_result);
?>