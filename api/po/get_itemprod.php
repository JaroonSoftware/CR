<?php
include_once(dirname(__FILE__, 2)."/onload.php");

$sql = "SELECT p.prod_id,p.prod_code,p.prod_name,p.price,u.unitcode,u.unit from product p LEFT join unit u on p.unit = u.unitcode ";
$sql .= " where p.prod_id = '" . $_GET['id'] . "'";
$stmt = $conn->prepare($sql);
$stmt->execute();
//$data = $stmt->fetch(PDO::FETCH_ASSOC);

$dataArray = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	$dataArray[] = $row;
}
$sql2 = "SELECT s.size_id as value,s.size_name as label  from size s LEFT JOIN product_size p on s.size_id = p.size_id ";
$sql2 .= " where p.status = 'Y' and p.prod_id = '" . $_GET['id'] . "'";
$stmt2 = $conn->prepare($sql2);
$stmt2->execute();
$dataSize = array();
while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
	$dataSize[] = $row2;
}

header('Content-Type: application/json');

$apiResponse = array(
	"status" => "1",
	"message" => "Get Item Po",
	"data" => $dataArray,
	"size" => $dataSize,
);

http_response_code(200);
echo json_encode($apiResponse);