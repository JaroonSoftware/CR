<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql  = "select r.rcpt_no, r.so_no,s.cus_name,s.tel ,FORMAT(r.amounts, 0) as amounts, r.status from receipt r left join so s on r.so_no = s.so_no ";  

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

	http_response_code(200);
	echo json_encode($data);



?>