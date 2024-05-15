<?php
include_once(dirname(__FILE__, 2)."/onload.php");

$sql = "SELECT CONCAT('SO',DATE_FORMAT(NOW(), '%y'),'/',DATE_FORMAT(NOW(), '%m'),LPAD(COUNT(id) + 1, 4, '0')) AS so_no FROM so where so_no LIKE  CONCAT('SO',DATE_FORMAT(NOW(), '%y'),'/',DATE_FORMAT(NOW(), '%m%'))  ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);