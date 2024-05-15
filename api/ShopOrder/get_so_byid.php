<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT * FROM `so`";
	$sql .= " where so_no = '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();


	$dataArray = array();
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$dataArray[] = $row;
	}

	$sql2 = "SELECT sd.*,p.prod_code,p.prod_name,s.size_name,u.unit as statusItem FROM `so_detail` sd LEFT JOIN product p on sd.prod_code = p.prod_code LEFT JOIN size s on sd.size_id = s.size_id LEFT JOIN unit u on p.unit = u.unitcode ";
	$sql2 .= " where sd.so_no = '".$_GET['id']."'";
	$stmt2 = $conn->prepare($sql2);
	$stmt2->execute();

	$dataDetail = array();
	while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
		$dataDetail[] = $row2;
	}

	header('Content-Type: application/json');

	$apiResponse = array(
		"status" => "1",
		"message" => "Get ShopOrder & Detail",
		"data" => $dataArray,
		"dataDetail" => $dataDetail,
	);

	http_response_code(200);
	echo json_encode($apiResponse);
		

?>