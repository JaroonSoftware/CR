<?php
    include_once(dirname(__FILE__, 2)."/onload.php");
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT subctgy_name FROM subcategory WHERE subctgy_name = '".$_POST["Addsubcategory"]."' and ctgy_id = '".$_POST["category_id"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        echo json_encode(array('status' => '0','message'=> 'Data duplicate!'));
   
    }else{

    $strSQL = "INSERT INTO subcategory (`subctgy_name`, `ctgy_id`, `status`, `c_by`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('".$_POST["Addsubcategory"]."','".$_POST["category_id"]."','Y','".$action_by."' ";
    $strSQL .= ")";	
    //echo $strSQL;
	$stmt = $conn->prepare($strSQL);  
    
        if ($stmt->execute()) {
            http_response_code(200);
            //echo json_encode(array("data"=> array("name" => $_POST["Addcategoryname"])));
            echo json_encode(array('status' => '1','message'=> $_POST["Addsubcategory"]));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    }
?>