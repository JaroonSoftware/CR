<?php
include_once(dirname(__FILE__, 2)."/onload.php");

$sql = "SELECT CONCAT('GR',DATE_FORMAT(NOW(), '%y'),'/',LPAD(COUNT(gr_code) + 1, 4, '0')) AS gr_code  FROM gr where gr_code  LIKE  CONCAT('GR',DATE_FORMAT(NOW(), '%y'),'/%'); ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);