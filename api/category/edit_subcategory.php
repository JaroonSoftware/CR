<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT subctgy_name FROM subcategory WHERE subctgy_name = '".$_POST["Editsubcategory"]."' and subctgy_id != '".$_POST["editsubcategory_id"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        echo json_encode(array('status' => '0','message'=> 'หมวดหมู่ย่อย '.$_POST["Editsubcategory"].' มีในระบบแล้ว!'));
    }else{
        $strSQL = "UPDATE subcategory SET ";
        $strSQL .= " subctgy_name='".$_POST["Editsubcategory"]."',status='".$_POST["Editstatussubcategory"]."' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE subctgy_id = '".$_POST["editsubcategory_id"]."' ";
        
        $stmt = $conn->prepare($strSQL);

            if($stmt->execute()) {
                echo json_encode(array('status' => '1','message'=> $_POST["Editsubcategory"]));
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