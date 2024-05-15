<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT gr.gr_code,p.po_code,s.supname,CONCAT(idno,' ',road,' ',subdistrict,' ',district,' ',province,' ',zipcode) as assdress,DATE_FORMAT(gr.gr_date, '%d/%m/%Y') AS gr_date,gr.payment,gr.status FROM `gr` gr LEFT JOIN po p on gr.po_code = p.po_code LEFT JOIN supplier s on p.supcode = s.supcode ";
	$sql .= " where gr.gr_code = '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();


	$dataArray = array();
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$dataArray[] = $row;
	}

	$sql2 = "SELECT grd.gr_no,g.gr_code ,g.po_code ,p.prod_code ,p.prod_name ,u.unit ,s.size_name ,grd.amount ,grd.amount ,grd.discount FROM `gr_detail` grd LEFT JOIN gr g on grd.gr_code = g.gr_code LEFT JOIN product p on grd.prod_code = p.prod_code LEFT JOIN size s on grd.size_id = s.size_id LEFT JOIN unit u on p.unit = u.unitcode ";
	$sql2 .= " where grd.gr_code = '".$_GET['id']."'";
	$stmt2 = $conn->prepare($sql2);
	$stmt2->execute();

	 $dataDetail = array();
	while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
		$dataDetail[] = $row2;
	}

	header('Content-Type: application/json');

	$apiResponse = array(
		"status" => "1",
		"message" => "Get GR & Detail",
		"data" => $dataArray,
		"dataDetail" => $dataDetail,
	);

	http_response_code(200);
	echo json_encode($apiResponse);
		

?>