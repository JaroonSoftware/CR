<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql  = "SELECT p.po_code,DATE_FORMAT(p.po_date, '%d-%m-%Y') AS po_date,s.supname, CASE WHEN p.status ='WR' THEN 'รอรับของ' WHEN p.status ='CP' THEN 'รับครบแล้ว' WHEN p.status ='NC' THEN 'รับยังไม่ครบ' WHEN p.status ='Cancel' THEN 'ยกเลิกใบสั่งซื้อ' END AS status,p.status as sts FROM `po` p LEFT JOIN supplier s on p.supcode = s.supcode;";

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>