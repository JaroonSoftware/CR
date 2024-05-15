<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql  = "select p.prod_id,p.prod_code,p.prod_name,pt.prodty_name as prod_type,p.price,u.unit,p.status ";
	$sql .= "from product p LEFT JOIN product_type pt on p.prodty_id = pt.prodty_id ";  
	$sql .= "LEFT JOIN unit u on p.unit = u.unitcode";  

	$query = mysqli_query($conn,$sql);
	$json_result=array();
	
		
        while($row = $query->fetch_assoc()) {
			array_push($json_result,array("prod_id" => $row["prod_id"],"prod_code" => $row["prod_code"],"prod_name" => $row["prod_name"],"prod_type" => $row["prod_type"],"price" => $row["price"],"unit" => $row["unit"],"status"=>$row["status"]));
        }
        echo json_encode($json_result);



?>