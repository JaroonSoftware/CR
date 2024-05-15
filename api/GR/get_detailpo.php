<?php
include_once(dirname(__FILE__, 2)."/onload.php");

$sql = "SELECT s.supname,CONCAT(s.idno,' ',s.road,' ',s.subdistrict,' ',s.district,' ',s.province,' ',s.zipcode) as assdress FROM `po` p LEFT JOIN supplier s on p.supcode = s.supcode ";
$sql .= " where p.po_code = '" . $_GET['id'] . "'";
$stmt = $conn->prepare($sql);
$stmt->execute();

$dataArray = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	$dataArray[] = $row;
}

$sql2 = "SELECT pd.id,pd.po_code,pd.no,p.prod_code,p.prod_name,pd.price,pd.discount,pd.amount,pd.recamount,u.unit,s.size_id,s.size_name,pd.status as statusItem FROM `po_detail` pd LEFT JOIN product p on pd.prod_code = p.prod_code LEFT JOIN size s on pd.size_id = s.size_id LEFT JOIN unit u on pd.unit_id = u.unitcode ";
$sql2 .= " where po_code = '".$_GET['id']."' order by pd.no asc";
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