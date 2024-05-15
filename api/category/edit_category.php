<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT ctgy_name FROM category WHERE ctgy_name = '".$_POST["Editcategoryname"]."' and ctgy_id != '".$_POST["Editcategoryid"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        echo json_encode(array('status' => '0','message'=> 'หมวดหมู่ '.$_POST["Editcategoryname"].' มีในระบบแล้ว!'));
    }else{
        $strSQL = "UPDATE category SET ";
        $strSQL .= " ctgy_name='".$_POST["Editcategoryname"]."',status='".$_POST["Editstatuscategory"]."' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE ctgy_id = '".$_POST["Editcategoryid"]."' ";
        
        $stmt = $conn->prepare($strSQL);  

            if ($stmt->execute()) {
                echo json_encode(array('status' => '1','message'=> $_POST["Editcategoryname"]));
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