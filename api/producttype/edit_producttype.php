<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT prodty_name FROM product_type WHERE prodty_name = '".$_POST["Editproducttypename"]."' and prodty_id != '".$_POST["Editproducttypeid"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        echo json_encode(array('status' => '0','message'=> 'ประเภทสินค้า '.$_POST["Editproducttypename"].' มีในระบบแล้ว!'));
       
    }else{
        $strSQL = "UPDATE product_type SET ";
        $strSQL .= " prodty_name='".$_POST["Editproducttypename"]."',preprod_code='".$_POST["Editpreprod_code"]."',status='".$_POST["Editstatusproducttype"]."' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE prodty_id  = '".$_POST["Editproducttypeid"]."' ";
        $stmt = $conn->prepare($strSQL);    

            if ($stmt->execute()) {
                echo json_encode(array('status' => '1','message'=> $_POST["Editproducttypename"]));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
            }
    }

} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		

?>