<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

    $size = $_POST['size'];
    $prod = $_POST['prod'];

	$sql = "SELECT amount, (SELECT price FROM product_size WHERE prod_id  = p.prod_id AND size_id = s.size_id and status = 'Y' LIMIT 1) AS price  FROM `stock` s ";
	$sql .= " left join product p on p.prod_code = s.prod_code";
	$sql .= " where s.prod_code = '".$prod."' and s.size_id = '".$size."'";
    
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