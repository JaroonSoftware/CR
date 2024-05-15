<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql  = "SELECT s.so_no,DATE_FORMAT(s.c_date, '%d-%m-%Y') AS so_date,s.cus_name,s.status FROM `so` s";

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>