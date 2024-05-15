<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT prod_id ,prod_code,prod_name,prodty_id,price,unit,prod_img ,status FROM `product` ";
	$sql .= " where prod_id = '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	//$data = $stmt->fetch(PDO::FETCH_ASSOC);


	$dataArray = array();
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$dataArray[] = $row;
	}

	$sql2 = "SELECT * FROM `product_img` ";
	$sql2 .= " where prod_id = '".$_GET['id']."'";
	$stmt2 = $conn->prepare($sql2);
	$stmt2->execute();

	$dataFile = array();
	while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
		$dataFile[] = $row2;
	}

	header('Content-Type: application/json');

	$apiResponse = array(
		"status" => "1",
		"message" => "Get Product",
		"data" => $dataArray,
		"file" => $dataFile,
	);

	http_response_code(200);
	echo json_encode($apiResponse);
		

?>