<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT * FROM `size` ";
	$sql .= " where size_id = '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetch(PDO::FETCH_ASSOC);

	http_response_code(200);
	echo json_encode($data);

?>