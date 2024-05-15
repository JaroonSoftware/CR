<?php
    include_once(dirname(__FILE__, 2)."/onload.php");
    $action_by = $token->userid;

    $StrSql_CheckDup = mysqli_query($conn,"SELECT prod_code FROM product WHERE prod_code = '".$_POST["Addprod_code"]."' ");
    $check = mysqli_num_rows($StrSql_CheckDup);
    if ($check == 0) {

    $strSQL = "INSERT INTO product (`prod_code`, `prod_name`, `prodty_id` , `unit` , `price`, `status`,`c_by`) ";
    //  ,`s_date`,`s_time`, s_user) ";
    $strSQL .= " VALUES ('".$_POST["Addprod_code"]."','".$_POST["Addprod_name"]."','".$_POST["Addprodty_id"]."','".$_POST["Addunit"]."','".$_POST["Addprice"]."','Y','".$action_by."' ";
    $strSQL .= ")";	
    //echo $strSQL;
	$query = mysqli_query($conn,$strSQL);    
    
        if($query) {
            http_response_code(200);
            //echo json_encode(array("data"=> array("name" => $_POST["Addcategoryname"])));
            echo json_encode(array('status' => '1','message'=> $_POST["Addprod_code"]));
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