<?php
include_once(dirname(__FILE__, 2)."/onload.php");

$sql = "SELECT select s.size_id as value,s.size_name as label  from size s LEFT JOIN product_size p on s.size_id = p.size_id ";
$sql .= " where p.prod_id = '" . $_GET['id'] . "'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);