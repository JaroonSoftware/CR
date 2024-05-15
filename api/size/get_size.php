<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT size_id ,size_name,status  FROM `size` ";

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

	http_response_code(200);
	echo json_encode($data);
?>