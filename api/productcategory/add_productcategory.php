<?php
    include_once(dirname(__FILE__, 2)."/onload.php");
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT id FROM product_category WHERE prod_id = '".$_POST["prod_id"]."' and ctgy_id = '".$_POST["ctgy_id"]."' and subctgy_id = '".$_POST["subctgy_id"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        echo json_encode(array('status' => '0','message'=> 'Data duplicate!'));
    }else{
    $strSQL = "INSERT INTO product_category (`prod_id`,`ctgy_id`,`subctgy_id`,`c_by`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('".$_POST["prod_id"]."','".$_POST["ctgy_id"]."','".$_POST["subctgy_id"]."','".$action_by."' ";
    $strSQL .= ")";	
    //echo $strSQL;
	$stmt = $conn->prepare($strSQL);    
    
        if ($stmt->execute()) {
            http_response_code(200);
            //echo json_encode(array("data"=> array("name" => $_POST["Addcategoryname"])));
            echo json_encode(array('status' => '1','message'=> ""));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    }
?>