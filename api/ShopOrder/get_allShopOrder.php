<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$nameSearch = isset($_GET['nameSearch']) && $_GET['nameSearch'] !== null && $_GET['nameSearch'] !== '' ? $_GET['nameSearch'] : '';
	$telSearch = isset($_GET['telSearch']) && $_GET['telSearch'] !== null && $_GET['telSearch'] !== '' ? $_GET['telSearch'] : '';
	$mysecrch = "";
    $mysecrch .= !empty($nameSearch) ? " and s.cus_name like '%$nameSearch%' " : " ";
    $mysecrch .= !empty($telSearch) ? " and s.tel like '%$telSearch%' " : " ";

	$sql  = "SELECT s.so_no,DATE_FORMAT(s.c_date, '%d-%m-%Y') AS so_date,s.cus_name,s.status,s.status_delivery  FROM `so` s where 1=1 ";
	$sql .= $mysecrch;
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>