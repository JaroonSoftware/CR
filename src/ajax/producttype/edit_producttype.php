<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

    $StrSql_CheckDup = mysqli_query($conn,"SELECT prodty_name FROM product_type WHERE prodty_name = '".$_POST["Editproducttypename"]."' and prodty_id != '".$_POST["Editproducttypeid"]."' ");
    $check = mysqli_num_rows($StrSql_CheckDup);
    if ($check == 0) {
        $strSQL = "UPDATE product_type SET ";
        $strSQL .= " prodty_name='".$_POST["Editproducttypename"]."',status='".$_POST["Editstatusproducttype"]."' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE prodty_id  = '".$_POST["Editproducttypeid"]."' ";
        $query = mysqli_query($conn,$strSQL);    

            if($query) {
                echo json_encode(array('status' => '1','message'=> $_POST["Editproducttypename"]));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
            }

    }else{
        echo json_encode(array('status' => '0','message'=> 'ประเภทสินค้า '.$_POST["Editproducttypename"].' มีในระบบแล้ว!'));
    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		

?>