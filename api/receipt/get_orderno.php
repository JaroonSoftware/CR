<?php
include_once(dirname(__FILE__, 2)."/onload.php");

$sql = "SELECT so_no as value,so_no as label FROM so WHERE status ='รอชำระ' and (c_by is null or c_by = '')";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);

?>