<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

    $size = $_POST['size'];
    $prod = $_POST['prod'];

	$sql = "SELECT amount FROM `stock` ";
	$sql .= " where prod_code = '".$prod."' and size_id = '".$size."'";
    
	$stmt = $conn->prepare($sql);
	$stmt->execute();
    if($stmt->rowCount() > 0){
	    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    }else{
        $nestedObject = new stdClass();
		$nestedObject->amount = 0;
        $data = $nestedObject;
    }
    

	$apiResponse = array(
		"status" => "1",
		"message" => "Get Amount E-commerce",
		"data" => $data,
	);

	http_response_code(200);
	echo json_encode($apiResponse);
		

?>