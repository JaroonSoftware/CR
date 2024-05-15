<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$res = null;
    $sql = "
    select * from receipt where rcpt_no = '".$_GET['id']."'";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
	http_response_code(200);
	echo json_encode($data);

?>