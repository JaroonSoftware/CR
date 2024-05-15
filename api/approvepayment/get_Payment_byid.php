<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT `id`, `so_no`, `contact_name`, `tel`, `price`, DATE_FORMAT(date, '%d/%m/%Y') as date_payment, DATE_FORMAT(time, '%H:%i') AS time, `bank`, `slip`, `status`, `c_by`, `c_date`, `e_by`, `e_date` FROM `payment` ";
	$sql .= " where id = '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetch(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
		

?>