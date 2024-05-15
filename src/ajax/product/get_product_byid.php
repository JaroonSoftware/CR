<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT prod_id ,prod_code,prod_name,prodty_id,price,unit,prod_img ,status FROM `product` ";
	$sql .= " where prod_id = '".$_GET['id']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"prod_id" => array(),
		"prod_code" => array(),
		"prod_name" => array(),
		"prodty_id" => array(),
		"price" => array(),
		"unit" => array(),
		"prod_img" => array(),
		"status" => array()
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['prod_id']=$row["prod_id"];
			$json_result['prod_code']=$row["prod_code"];
			$json_result['prod_name']=$row["prod_name"];
			$json_result['prodty_id']=$row["prodty_id"];
			$json_result['price']=$row["price"];
			$json_result['unit']=$row["unit"];
			$json_result['prod_img']=$row["prod_img"];
			$json_result['status']=$row["status"];
        
        echo json_encode($json_result);
		

?>