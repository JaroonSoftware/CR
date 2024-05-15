<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$res = null;
                $sql = "
                select  s.size_id value, s.size_name label from size s LEFT join product_size ps on s.size_id = ps.size_id where s.status = 'Y'  and s.size_id not in (select size_id from product_size WHERE prod_id = '".$_GET['id']."' and status = 'Y') GROUP BY s.size_id;";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		        http_response_code(200);
		        echo json_encode(array("data"=>$data));	

?>