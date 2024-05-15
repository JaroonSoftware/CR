<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$strSQL = "UPDATE user SET ";
$strSQL .= " firstname='" . $_POST["Editfirstname"] . "',lastname='" . $_POST["Editlastname"] . "' ";
$strSQL .= ",type='" . $_POST["Edittype"] . "',tel='" . $_POST["Edittel"] . "',status='" . $_POST["Editstatususer"] . "' ";
$strSQL .= "WHERE code= '" . $_POST["Editcode"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไข ' . $_POST["Editusername"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
