<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT p.po_code,p.supcode,s.supname,CONCAT(idno,' ',road,' ',subdistrict,' ',district,' ',province,' ',zipcode) as assdress,p.po_date,p.del_date,p.payment,p.vat,p.remark,p.status FROM `po` p LEFT JOIN supplier s on p.supcode = s.supcode ";
	$sql .= " where p.po_code = '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();


	$dataArray = array();
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$dataArray[] = $row;
	}

	$sql2 = "SELECT *,pd.status as statusItem FROM `po_detail` pd LEFT JOIN product p on pd.prod_code = p.prod_code LEFT JOIN size s on pd.size_id = s.size_id LEFT JOIN unit u on pd.unit_id = u.unitcode ";
	$sql2 .= " where po_code = '".$_GET['id']."'";
	$stmt2 = $conn->prepare($sql2);
	$stmt2->execute();

	$dataDetail = array();
	while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
		$dataDetail[] = $row2;
	}

	header('Content-Type: application/json');

	$apiResponse = array(
		"status" => "1",
		"message" => "Get PO & Detail",
		"data" => $dataArray,
		"dataDetail" => $dataDetail,
	);

	http_response_code(200);
	echo json_encode($apiResponse);
		

?>