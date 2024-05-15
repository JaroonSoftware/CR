<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql  = "select rcpt_no, so_no, FORMAT(amounts, 0) as amounts, status from receipt ";  

	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

	http_response_code(200);
	echo json_encode($data);



?>