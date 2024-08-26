<?php
    include_once(dirname(__FILE__, 2)."/onload.php");
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT id FROM product_size WHERE prod_id = '".$_POST["prod_id"]."' and size_id = '".$_POST["size_id"]."' and status = 'Y' ";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        echo json_encode(array('status' => '0','message'=> 'Data duplicate!'));
    }else{
    $strSQL = "INSERT INTO product_size (`prod_id`,`size_id`,`price`,`c_by`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('".$_POST["prod_id"]."','".$_POST["size_id"]."','".$_POST["price"]."','".$action_by."' ";
    $strSQL .= ")";	
    //echo $strSQL;
	$stmt = $conn->prepare($strSQL);    
    
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array('status' => '1','message'=> ""));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    }
?>