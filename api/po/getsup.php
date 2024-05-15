<?php
include_once(dirname(__FILE__, 2)."/onload.php");

$sql = "SELECT supcode,supname,CONCAT(idno,' ',road,' ',subdistrict,' ',district,' ',province,' ',zipcode) as assdress,status  FROM `supplier` ";
$sql .= " where supcode = '" . $_GET['id'] . "'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);