<?php

	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT * FROM `subcategory` ";
	$sql .= " where subctgy_id = '".$_GET['id']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"subctgy_name" => array(),
		"status" => array(),
		"subctgy_id" => array()
		
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['subctgy_id']=$row["subctgy_id"];
			$json_result['subctgy_name']=$row["subctgy_name"];
			$json_result['status']=$row["status"];
        
        echo json_encode($json_result);
		

?>