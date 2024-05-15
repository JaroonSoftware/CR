<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql  = "select p.prod_id,p.prod_code,p.prod_name,pt.prodty_name as prod_type,p.price,u.unit,p.status ";
	$sql .= "from product p LEFT JOIN product_type pt on p.prodty_id = pt.prodty_id ";  
	$sql .= "LEFT JOIN unit u on p.unit = u.unitcode";  

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

	http_response_code(200);
	echo json_encode($data);



?>