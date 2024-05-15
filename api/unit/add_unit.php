<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';


$sql = "INSERT INTO unit (`unit`, `status`) ";
//  ,`s_date`,`s_time`, s_user) ";
$sql .= " VALUES ('" . $_POST["Addunitname"] . "','Y' ";
$sql .= ")";
$stmt = $conn->prepare($sql);

if ($stmt->execute()) {
    $response = ['status' => 1, 'message' => 'เพิ่ม Unit สำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
