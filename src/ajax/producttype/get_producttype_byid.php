<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT prodty_id ,prodty_name ,status FROM `product_type` ";
	$sql .= " where prodty_id = '".$_GET['id']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"prodty_id" => array(),
		"prodty_name" => array(),
		"status" => array()
		
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['prodty_id']=$row["prodty_id"];
			$json_result['prodty_name']=$row["prodty_name"];
			$json_result['status']=$row["status"];
        
        echo json_encode($json_result);
		

?>