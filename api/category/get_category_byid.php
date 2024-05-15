<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT ctgy_id ,ctgy_name ,status ,img_uid ,img_name ,img_filename FROM `category` ";
	$sql .= " where ctgy_id = '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetch(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
		

?>