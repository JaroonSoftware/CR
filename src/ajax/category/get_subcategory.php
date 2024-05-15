<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "select 
    s.*,
    concat(u.firstname, ' ', u.lastname) as e_by,
    concat(c.firstname, ' ', c.lastname) as c_by
    from subcategory s
    left join `user` u on s.e_by = u.code
    left join `user` c on s.c_by = c.code
    where s.ctgy_id =  '".$_GET['id']."'";
	$query = mysqli_query($conn,$sql);

		$json_result= array();
		
        while($row = $query->fetch_assoc()) {
			
            array_push($json_result,array("subctgy_id" => $row["subctgy_id"],"subctgy_name" => $row["subctgy_name"],"status"=>$row["status"],"ctgy_id" => $row["ctgy_id"],"e_by" => $row["e_by"],"c_by" => $row["c_by"],"c_date" => $row["c_date"],"e_date" => $row["e_date"]));
        }
        echo json_encode($json_result);
?>