<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT size_name FROM size WHERE size_name = '".$_POST["Editsizename"]."' and size_id != '".$_POST["Editsizeid"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        echo json_encode(array('status' => '0','message'=> 'ขนาดสินค้า '.$_POST["Editsizename"].' มีในระบบแล้ว!'));
       
    }else{
        $strSQL = "UPDATE size SET ";
        $strSQL .= " size_name ='".$_POST["Editsizename"]."',status='".$_POST["Editstatus"]."' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE size_id  = '".$_POST["Editsizeid"]."' ";
        $stmt = $conn->prepare($strSQL);    

            if ($stmt->execute()) {
                echo json_encode(array('status' => '1','message'=> $_POST["Editsizename"]));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error Update data!'));
            }
    }

} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		

?>