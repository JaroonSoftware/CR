<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT ctgy_id ,ctgy_name ,status FROM `category` ";
	$sql .= " where ctgy_id = '".$_GET['id']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"ctgy_id" => array(),
		"ctgy_name" => array(),
		"status" => array()
		
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['ctgy_id']=$row["ctgy_id"];
			$json_result['ctgy_name']=$row["ctgy_name"];
			$json_result['status']=$row["status"];
        
        echo json_encode($json_result);
		

?>