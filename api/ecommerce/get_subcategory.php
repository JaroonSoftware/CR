<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

	$res = null;
                $sql = "
                select  sc.subctgy_id value, sc.subctgy_name label 
                from subcategory sc
                where sc.status = 'Y' and sc.ctgy_id = '".$_POST['id']."'"; 

                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		        http_response_code(200);
		        echo json_encode(array("data"=>$data));	

?>