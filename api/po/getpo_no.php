<?php
include_once(dirname(__FILE__, 2)."/onload.php");

$sql = "SELECT CONCAT('PO',DATE_FORMAT(NOW(), '%y'),'/',LPAD(COUNT(id) + 1, 4, '0')) AS po_code FROM po where po_code LIKE  CONCAT('PO',DATE_FORMAT(NOW(), '%y'),'/%'); ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);