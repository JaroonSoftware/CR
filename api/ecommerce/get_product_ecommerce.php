<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

    $id = $_POST['ctgy_id'];
    $subid = $_POST['subctgy_id'];
    $type = $_POST['type'];

	$sql = "SELECT p.prod_id ,p.prod_code,p.prod_name,p.prodty_id,p.price,p.unit,p.status FROM `product` p INNER Join product_category pc on p.prod_id =pc.prod_id LEFT join product_type pt on pt.prodty_id = p.prodty_id";
	$sql .= " where p.status = 'Y' and pc.ctgy_id = '".$id."'";
    if($subid != ""){
        $sql .= " and pc.subctgy_id = '".$subid."'";
    }
    if($type != ""){
        $sql .= " and pt.prodty_id = '".$type."'";
    }
    
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);


	$dataArray = array();
    //$dataFile = array();
	foreach ($data as $row) {
        $nestedObject = new stdClass();
		$nestedObject->id = $row['prod_id'];
        $nestedObject->prod_code = $row['prod_code'];
        $nestedObject->prod_name = $row['prod_name'];
        $nestedObject->price = $row['price'];
        $nestedObject->unit = $row['unit'];
        //echo $row['prod_id'];
        $stmt2 = $conn->prepare("SELECT * FROM `product_img` where prod_id = '".$row['prod_id']."'");
        $stmt2->execute();
        if($stmt2->rowCount() > 0){
            $dataFile = array();
            while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
                $dataFile[] = $row2;
            }
            $nestedObject->file = $dataFile;
        }else{
            $nestedObject->file = [];
        }
        $dataArray[] = $nestedObject; 
	}

	$apiResponse = array(
		"status" => "1",
		"message" => "Get Product E-commerce",
		"data" => $dataArray,
	);

	http_response_code(200);
	echo json_encode($apiResponse);
		

?>