<?php
	include_once(dirname(__FILE__, 2)."/onload.php");
	$sql  = "select  st.id, p.prod_name, pt.prodty_name as type, s.size_name as size, FORMAT(st.amount, 0) as count from stock st LEFT JOIN product p on st.prod_code = p.prod_code LEFT JOIN size s ON s.size_id = st.size_id LEFT JOIN product_type pt ON pt.prodty_id = p.prodty_id"; 

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>