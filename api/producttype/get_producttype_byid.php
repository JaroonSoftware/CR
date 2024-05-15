<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT prodty_id ,prodty_name,preprod_code,status FROM `product_type` ";
	$sql .= " where prodty_id = '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetch(PDO::FETCH_ASSOC);

	http_response_code(200);
	echo json_encode($data);

?>