<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

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