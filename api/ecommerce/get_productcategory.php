<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Access-Control-Allow-Methods: *");
	
	include '../conn.php';

	$sql = "SELECT pc.id, p.prod_name, c.ctgy_name, sc.subctgy_name FROM product_category pc 
	LEFT JOIN product p ON pc.prod_id = p.prod_id
	LEFT JOIN category c ON pc.ctgy_id = c.ctgy_id
	LEFT JOIN subcategory sc ON pc.subctgy_id = sc.subctgy_id  
	GROUP by pc.id";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>