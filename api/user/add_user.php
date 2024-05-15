<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';


$password = password_hash($_POST['Addpassword'], PASSWORD_DEFAULT);
$strSQL = "INSERT INTO user (`username`, `password`,`firstname`,`lastname`, `type`, `tel`, `status`,`date`) ";
//  ,`s_date`,`s_time`, s_user) ";
$strSQL .= " VALUES ('".$_POST["Addusername"]."','".$password."','".$_POST["Addfirstname"]."','".$_POST["Addlastname"]."','".$_POST["Addtype"]."','".$_POST["AddTel"]."','Y','".date("Y-m-d H:i:s")."' ";
$strSQL .= ")";	
$stmt = $conn->prepare($strSQL);

if ($stmt->execute()) {
    $response = ['status' => 1, 'message' => 'เพิ่มพนักงาน '.$_POST["Addfirstname"].' '.$_POST["Addlastname"].' สำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
