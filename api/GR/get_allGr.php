<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql  = "SELECT g.gr_code,p.po_code,DATE_FORMAT(g.gr_date, '%d-%m-%Y') AS gr_date,s.supname FROM `gr` g LEFT JOIN po p on g.po_code = p.po_code LEFT JOIN supplier s on s.supcode = p.supcode";

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>