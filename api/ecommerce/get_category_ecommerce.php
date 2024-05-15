<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

	$sql = "SELECT `ctgy_id`, `ctgy_name`, `img_uid`, `img_name`, `img_filename`, `status`, `c_date`, `c_by`, `e_date`, `e_by` FROM `category` ";
	$sql .= " where status = 'Y'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);


	$dataArray = array();
    //$dataFile = array();
	foreach ($data as $row) {
        $nestedObject = new stdClass();
		$nestedObject->ctgy_id = $row['ctgy_id'];
        $nestedObject->ctgy_name = $row['ctgy_name'];
        $nestedObject->img_uid = $row['img_uid'];
        $nestedObject->img_name = $row['img_name'];
        $nestedObject->img_filename = $row['img_filename'];
        $nestedObject->status = $row['status'];

        $dataArray[] = $nestedObject; 
	}
	header('Content-Type: application/json');

	$apiResponse = array(
		"status" => "1",
		"message" => "Get Category E-commerce",
		"data" => $dataArray,
	);

	http_response_code(200);
	echo json_encode($apiResponse);
		

?>