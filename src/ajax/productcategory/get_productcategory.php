<?php
	session_start();
	include('../conn.php');
	// 
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT pc.id, p.prod_name, c.ctgy_name, sc.subctgy_name FROM product_category pc 
	LEFT JOIN product p ON pc.prod_id = p.prod_id
	LEFT JOIN category c ON pc.ctgy_id = c.ctgy_id
	LEFT JOIN subcategory sc ON pc.subctgy_id = sc.subctgy_id  
	GROUP by pc.id";
	$query = mysqli_query($conn,$sql);

		$json_result= array();
		
        while($row = $query->fetch_assoc()) {
			
            array_push($json_result,array("id" => $row["id"],"prod_name" => $row["prod_name"],"ctgy_name"=>$row["ctgy_name"],"subctgy_name"=>$row["subctgy_name"]));
        }
        echo json_encode($json_result);
?>