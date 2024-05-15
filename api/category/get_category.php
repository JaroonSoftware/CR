<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT ctgy_id ,ctgy_name,status  FROM `category` "; 

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>