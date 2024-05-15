<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT number as supcode FROM `supcode` ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$res = $stmt->fetch(PDO::FETCH_ASSOC);
extract($res, EXTR_OVERWRITE, "_");

$code = sprintf("%05s", ($supcode + 1));

http_response_code(200);
echo json_encode($code);


