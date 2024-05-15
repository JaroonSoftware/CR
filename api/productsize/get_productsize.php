<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "select ps.id,p.prod_name,s.size_name from product_size ps  
	LEFT JOIN product p ON ps.prod_id = p.prod_id
	LEFT JOIN size s ON ps.size_id = s.size_id
	WHERE ps.status = 'Y' ";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>