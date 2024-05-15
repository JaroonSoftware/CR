<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "select 
    s.*,
    concat(u.firstname, ' ', u.lastname) as e_by,
    concat(c.firstname, ' ', c.lastname) as c_by
    from subcategory s
    left join `user` u on s.e_by = u.code
    left join `user` c on s.c_by = c.code
    where s.ctgy_id =  '".$_GET['id']."'";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
	http_response_code(200);
	echo json_encode($data);
?>