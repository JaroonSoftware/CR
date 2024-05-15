<?php
    include_once(dirname(__FILE__, 2)."/onload.php");
    $action_by = $token->userid;

    $StrSql_CheckDup = mysqli_query($conn,"SELECT subctgy_name FROM subcategory WHERE subctgy_name = '".$_POST["Addsubcategory"]."' and ctgy_id = '".$_POST["category_id"]."'");
    $check = mysqli_num_rows($StrSql_CheckDup);
    if ($check == 0) {

    $strSQL = "INSERT INTO subcategory (`subctgy_name`, `ctgy_id`, `status`, `c_by`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('".$_POST["Addsubcategory"]."','".$_POST["category_id"]."','Y','".$action_by."' ";
    $strSQL .= ")";	
    //echo $strSQL;
	$query = mysqli_query($conn,$strSQL);    
    
        if($query) {
            http_response_code(200);
            //echo json_encode(array("data"=> array("name" => $_POST["Addcategoryname"])));
            echo json_encode(array('status' => '1','message'=> $_POST["Addsubcategory"]));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    }
    else{
        //http_response_code(400);
        echo json_encode(array('status' => '0','message'=> 'Data duplicate!'));
    }
?>