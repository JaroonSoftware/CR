<?php
ob_start();
	include_once(dirname(__FILE__, 2)."/onload.php");

	$nameSearch = isset($_GET['nameSearch']) && $_GET['nameSearch'] !== null && $_GET['nameSearch'] !== '' ? $_GET['nameSearch'] : '';
	$telSearch = isset($_GET['telSearch']) && $_GET['telSearch'] !== null && $_GET['telSearch'] !== '' ? $_GET['telSearch'] : '';
	$moneySearch = isset($_GET['moneySearch']) && $_GET['moneySearch'] !== null && $_GET['moneySearch'] !== '' ? $_GET['moneySearch'] : '';
	$mysecrch = "";
    $mysecrch .= !empty($nameSearch) ? " and contact_name like '%$nameSearch%' " : " ";
    $mysecrch .= !empty($telSearch) ? " and tel like '%$telSearch%' " : " ";
	$mysecrch .= !empty($moneySearch) ? " and price = $moneySearch " : " ";

	$sql  = "SELECT  `id`,`so_no`, `contact_name`, `tel`, FORMAT(price, 0) as price, CONCAT(DATE_FORMAT(date, '%d-%m-%Y'),' ',time) as date_time , `status` FROM `payment` where 1=1  "; 
	$sql .= $mysecrch;
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
	ob_end_flush();
	exit();
?>