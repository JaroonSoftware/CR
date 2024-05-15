<?php
	include_once(dirname(__FILE__, 2)."/onload.php");

	$sql = "SELECT * FROM `supplier` where status = 'Y'";
	$query = mysqli_query($conn,$sql);

	// echo $sql;
	

	$json_result=array(
		"id" => array(),
		"supcode" => array(),
		"supname" => array(),
		"address" => array()
		
		);
		
        while($row = $query->fetch_assoc()) {

			$address = ($row["idno"] == '' ? '': 'เลขที่ '.$row["idno"].' ').($row["road"] == '' ? '': 'ถนน'.$row["road"].' ');
			$address .= ($row["subdistrict"] == '' ? '': 'ต.'.$row["subdistrict"].'  ').($row["district"] == '' ? '': 'อ.'.$row["district"].'  ');
			$address .= ($row["province"] == '' ? '': 'จ.'.$row["province"].' ').($row["zipcode"] == '' ? '': ' '.$row["zipcode"]);
			array_push($json_result['id'],$row["id"]);
			array_push($json_result['supcode'],$row["supcode"]);
			array_push($json_result['supname'],$row["supname"]);
			array_push($json_result['address'],$address);
        }
        echo json_encode($json_result);



		mysqli_close($conn);
?>