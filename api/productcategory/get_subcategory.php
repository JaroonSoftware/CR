<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$res = null;
                $sql = "
                select  sc.subctgy_id value, sc.subctgy_name label 
                from subcategory sc
                where sc.status = 'Y' and sc.ctgy_id = '".$_GET['id']."'"; 

                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		        http_response_code(200);
		        echo json_encode(array("data"=>$data));	

?>