<?php
    include_once(dirname(__FILE__, 2)."/onload.php");
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT prodty_name FROM product_type WHERE prodty_name = '".$_POST["Addproducttypename"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        //http_response_code(400);
        echo json_encode(array('status' => '0','message'=> 'Data duplicate!'));
       
    }else{
    $strSQL = "INSERT INTO product_type (`prodty_name`,`preprod_code`, `status`,`c_by`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('".$_POST["Addproducttypename"]."','".$_POST["Addpreprod_code"]."','Y','".$action_by."' ";
    $strSQL .= ")";	
    //echo $strSQL;
	$stmt = $conn->prepare($strSQL); 
    
        if ($stmt->execute()) {
            http_response_code(200);
            //echo json_encode(array("data"=> array("name" => $_POST["Addcategoryname"])));
            echo json_encode(array('status' => '1','message'=> $_POST["Addproducttypename"]));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    }
?>