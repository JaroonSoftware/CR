<?php
ob_start();
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql  = "SELECT  `id`,`so_no`, `contact_name`, `tel`, `price`, CONCAT(DATE_FORMAT(date, '%d/%m/%Y'),' ',time) as date_time , `status` FROM `payment` "; 

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
	ob_end_flush();
	exit();
?>