<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT prodty_id ,prodty_name,status  FROM `product_type` ";

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

	http_response_code(200);
	echo json_encode($data);
?>