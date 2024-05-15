<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

    $id = $_POST['id'];
    $size = $_POST['size'];
    $amount = $_POST['amount'];

	$sql = "SELECT amount from stock";
	$sql .= " where prod_code = '".$id."' and size_id = '".$size."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetch(PDO::FETCH_ASSOC);
    $status = null;
    if ($stmt->rowCount() > 0) {
        if($amount <= $data['amount']){ $status= "0"; }else{ $status= "1"; }
    }
	header('Content-Type: application/json');

	$apiResponse = array(
		"status" => $status,
		"message" => "Check Amount By Cart",
		"data" => "",
	);

	http_response_code(200);
	echo json_encode($apiResponse);
		

?>