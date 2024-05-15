<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$strSQL = "UPDATE supplier SET ";
$strSQL .= " supname='" . $_POST["Editsupname"] . "',idno='" . $_POST["Editidno"] . "',road='" . $_POST["Editroad"] . "' ";
$strSQL .= ",subdistrict='" . $_POST["Editsubdistrict"] . "',district='" . $_POST["Editdistrict"] . "',province='" . $_POST["Editprovince"] . "' ";
$strSQL .= ",zipcode='" . $_POST["Editzipcode"] . "',tel='" . $_POST["Edittel"] . "',fax='" . $_POST["Editfax"] . "' ";
$strSQL .= ",taxnumber='" . $_POST["Edittaxnumber"] . "',email='" . $_POST["Editemail"] . "',status='" . $_POST["Editstatussup"] . "' ";
$strSQL .= ",e_date='" . date("Y-m-d") . "',e_time='" . date("H:i:s") . "',e_user='0' ";
$strSQL .= "WHERE supcode= '" . $_POST["Editsupcode"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขผู้ขาย ' . $_POST["Editsupname"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
